const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendPushNotification, NotificationTemplates } = require('../utils/notifications');
const { body, validationResult } = require('express-validator');

/**
 * Create new order/inquiry
 * POST /api/orders
 */
const createOrder = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { productId, message, buyerContact } = req.body;
        const { uid } = req.user;

        // Find buyer
        const buyer = await User.findOne({ firebaseUid: uid });
        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Find product
        const product = await Product.findById(productId).populate('seller');
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.status !== 'available') {
            return res.status(400).json({
                success: false,
                message: 'Product is not available'
            });
        }

        // Check if buyer is not the seller
        if (product.seller._id.toString() === buyer._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot create an inquiry for your own product'
            });
        }

        // Create order
        const order = new Order({
            product: productId,
            buyer: buyer._id,
            seller: product.seller._id,
            message,
            buyerContact,
            amount: product.price
        });

        await order.save();

        // Populate references
        await order.populate([
            { path: 'product', select: 'title price images' },
            { path: 'buyer', select: 'name email campus profileImage' },
            { path: 'seller', select: 'name email campus profileImage' }
        ]);

        // TODO: Send push notification to seller
        // if (product.seller.pushToken) {
        //   const notification = NotificationTemplates.newInquiry(product.title, buyer.name);
        //   await sendPushNotification(product.seller.pushToken, notification);
        // }

        res.status(201).json({
            success: true,
            message: 'Inquiry sent successfully',
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get orders as buyer
 * GET /api/orders/buyer
 */
const getBuyerOrders = async (req, res, next) => {
    try {
        const { uid } = req.user;

        const buyer = await User.findOne({ firebaseUid: uid });
        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const orders = await Order.find({ buyer: buyer._id })
            .populate('product', 'title price images status')
            .populate('seller', 'name email campus phone profileImage')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { orders }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get orders as seller
 * GET /api/orders/seller
 */
const getSellerOrders = async (req, res, next) => {
    try {
        const { uid } = req.user;

        const seller = await User.findOne({ firebaseUid: uid });
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const orders = await Order.find({ seller: seller._id })
            .populate('product', 'title price images status')
            .populate('buyer', 'name email campus phone profileImage')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { orders }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update order status
 * PUT /api/orders/:id/status
 */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, sellerNotes } = req.body;
        const { uid } = req.user;

        const user = await User.findOne({ firebaseUid: uid });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const order = await Order.findById(id)
            .populate('product')
            .populate('buyer')
            .populate('seller');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user is the seller
        if (order.seller._id.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this order'
            });
        }

        order.status = status;
        if (sellerNotes) order.sellerNotes = sellerNotes;

        // If order is completed, update product status and seller stats
        if (status === 'completed') {
            const product = await Product.findById(order.product._id);
            if (product) {
                product.status = 'sold';
                await product.save();
            }

            const seller = await User.findById(order.seller._id);
            if (seller) {
                seller.totalSales += 1;
                await seller.save();
            }
        }

        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get order by ID
 * GET /api/orders/:id
 */
const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        const user = await User.findOne({ firebaseUid: uid });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const order = await Order.findById(id)
            .populate('product')
            .populate('buyer', 'name email campus phone profileImage')
            .populate('seller', 'name email campus phone profileImage');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user is buyer or seller
        if (
            order.buyer._id.toString() !== user._id.toString() &&
            order.seller._id.toString() !== user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this order'
            });
        }

        res.json({
            success: true,
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

// Validation rules
const createOrderValidation = [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('message').optional().trim().isLength({ max: 500 })
        .withMessage('Message must be less than 500 characters')
];

module.exports = {
    createOrder,
    getBuyerOrders,
    getSellerOrders,
    updateOrderStatus,
    getOrderById,
    createOrderValidation
};
