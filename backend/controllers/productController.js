const Product = require('../models/Product');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

/**
 * Get all products with filters and search
 * GET /api/products
 */
const getProducts = async (req, res, next) => {
    try {
        const {
            search,
            category,
            condition,
            minPrice,
            maxPrice,
            campus,
            sortBy = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 20
        } = req.query;

        // Build query
        const query = { status: 'available' };

        // Search by keyword
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Filter by condition
        if (condition) {
            query.condition = condition;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filter by campus
        if (campus) {
            query.campus = campus;
        }

        // Sorting
        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Execute query
        const products = await Product.find(query)
            .populate('seller', 'name email campus profileImage')
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        // Get total count for pagination
        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / Number(limit)),
                    limit: Number(limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 */
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
            .populate('seller', 'name email campus phone profileImage totalListings totalSales');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Increment views
        await product.incrementViews();

        res.json({
            success: true,
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new product listing
 * POST /api/products
 */
const createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { title, description, price, category, condition, images } = req.body;
        const { uid } = req.user;

        // Find user
        const user = await User.findOne({ firebaseUid: uid });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Create product
        const product = new Product({
            title,
            description,
            price,
            category,
            condition,
            images,
            seller: user._id,
            campus: user.campus
        });

        await product.save();

        // Update user's total listings count
        user.totalListings += 1;
        await user.save();

        // Populate seller info
        await product.populate('seller', 'name email campus profileImage');

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update product
 * PUT /api/products/:id
 */
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, price, category, condition, images, status } = req.body;
        const { uid } = req.user;

        // Find product
        const product = await Product.findById(id).populate('seller');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user is the seller
        if (product.seller.firebaseUid !== uid) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this product'
            });
        }

        // Update fields
        if (title) product.title = title;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (condition) product.condition = condition;
        if (images) product.images = images;
        if (status) product.status = status;

        await product.save();

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete product
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        // Find product
        const product = await Product.findById(id).populate('seller');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user is the seller
        if (product.seller.firebaseUid !== uid) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this product'
            });
        }

        // Soft delete - mark as deleted
        product.status = 'deleted';
        await product.save();

        // Update user's total listings count
        const user = await User.findById(product.seller._id);
        if (user && user.totalListings > 0) {
            user.totalListings -= 1;
            await user.save();
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get products by user
 * GET /api/products/user/:userId
 */
const getProductsByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { status = 'available' } = req.query;

        const query = { seller: userId };
        if (status !== 'all') {
            query.status = status;
        }

        const products = await Product.find(query)
            .populate('seller', 'name email campus profileImage')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { products }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get my listings
 * GET /api/products/my/listings
 */
const getMyListings = async (req, res, next) => {
    try {
        const { uid } = req.user;
        const { status } = req.query;

        const user = await User.findOne({ firebaseUid: uid });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const query = { seller: user._id };
        if (status && status !== 'all') {
            query.status = status;
        } else {
            // By default, exclude deleted items
            query.status = { $ne: 'deleted' };
        }

        const products = await Product.find(query)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { products }
        });
    } catch (error) {
        next(error);
    }
};

// Validation rules
const createProductValidation = [
    body('title').trim().notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
    body('description').trim().notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('price').isNumeric().withMessage('Price must be a number')
        .isFloat({ min: 0 }).withMessage('Price must be positive'),
    body('category').isIn(['Electronics', 'Books', 'Furniture', 'Clothing', 'Sports', 'Stationery', 'Accessories', 'Other'])
        .withMessage('Invalid category'),
    body('condition').isIn(['New', 'Like New', 'Good', 'Fair'])
        .withMessage('Invalid condition'),
    body('images').isArray({ min: 1 }).withMessage('At least one image is required')
];

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByUser,
    getMyListings,
    createProductValidation
};
