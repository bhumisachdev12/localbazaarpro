const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Report = require('../models/Report');

/**
 * Get admin dashboard statistics
 * GET /api/admin/stats
 */
const getAdminStats = async (req, res, next) => {
    try {
        // Get counts
        const totalUsers = await User.countDocuments({ isActive: true });
        const totalProducts = await Product.countDocuments({ status: { $ne: 'deleted' } });
        const totalOrders = await Order.countDocuments();
        const pendingReports = await Report.countDocuments({ status: 'pending' });

        // Get recent counts (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newUsers = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        const newProducts = await Product.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        const newOrders = await Order.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    pendingReports,
                    newUsers,
                    newProducts,
                    newOrders
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all users (admin)
 * GET /api/admin/users
 */
const getAllUsers = async (req, res, next) => {
    try {
        const { search, campus, isActive, page = 1, limit = 20 } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (campus) {
            query.campus = campus;
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await User.find(query)
            .select('-firebaseUid')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user by ID (admin)
 * GET /api/admin/users/:id
 */
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-firebaseUid');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's products
        const products = await Product.find({ seller: id })
            .select('title price status images createdAt')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get user's orders as buyer
        const buyerOrders = await Order.find({ buyer: id })
            .select('product amount status createdAt')
            .populate('product', 'title price')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get user's orders as seller
        const sellerOrders = await Order.find({ seller: id })
            .select('product amount status createdAt')
            .populate('product', 'title price')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            data: {
                user,
                products,
                buyerOrders,
                sellerOrders
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user status (admin)
 * PUT /api/admin/users/:id/status
 */
const updateUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isActive = isActive;
        await user.save();

        res.json({
            success: true,
            message: `User ${isActive ? 'activated' : 'suspended'} successfully`,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all products (admin)
 * GET /api/admin/products
 */
const getAllProducts = async (req, res, next) => {
    try {
        const { search, status, category, page = 1, limit = 20 } = req.query;

        const query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        if (status) {
            query.status = status;
        }

        if (category && category !== 'all') {
            query.category = category;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(query)
            .populate('seller', 'name email campus')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete product (admin)
 * DELETE /api/admin/products/:id
 */
const deleteProductAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        product.status = 'deleted';
        await product.save();

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    getUserById,
    updateUserStatus,
    getAllProducts,
    deleteProductAdmin
};
