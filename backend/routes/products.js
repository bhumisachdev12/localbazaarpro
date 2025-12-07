const express = require('express');
const router = express.Router();
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByUser,
    getMyListings,
    createProductValidation
} = require('../controllers/productController');

// Get all products (with filters and search) - public or authenticated
router.get('/', optionalAuth, getProducts);

// Get my listings
router.get('/my/listings', authMiddleware, getMyListings);

// Get products by specific user
router.get('/user/:userId', getProductsByUser);

// Get single product by ID
router.get('/:id', optionalAuth, getProductById);

// Create new product
router.post('/', authMiddleware, createProductValidation, createProduct);

// Update product
router.put('/:id', authMiddleware, updateProduct);

// Delete product
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
