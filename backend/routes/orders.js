const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
    createOrder,
    getBuyerOrders,
    getSellerOrders,
    updateOrderStatus,
    getOrderById,
    createOrderValidation
} = require('../controllers/orderController');

// Create new order/inquiry
router.post('/', authMiddleware, createOrderValidation, createOrder);

// Get orders as buyer
router.get('/buyer', authMiddleware, getBuyerOrders);

// Get orders as seller
router.get('/seller', authMiddleware, getSellerOrders);

// Get single order
router.get('/:id', authMiddleware, getOrderById);

// Update order status
router.put('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
