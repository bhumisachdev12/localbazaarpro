const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const {
    getAdminStats,
    getAllUsers,
    getUserById,
    updateUserStatus,
    getAllProducts,
    deleteProductAdmin
} = require('../controllers/adminController');

// All routes require authentication and admin privileges
router.use(authMiddleware, adminMiddleware);

// Statistics
router.get('/stats', getAdminStats);

// Users management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/status', updateUserStatus);

// Products management
router.get('/products', getAllProducts);
router.delete('/products/:id', deleteProductAdmin);

module.exports = router;
