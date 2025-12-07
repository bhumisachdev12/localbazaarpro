const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
    register,
    login,
    getMe,
    updateProfile,
    registerValidation
} = require('../controllers/authController');

// Register new user
router.post('/register', authMiddleware, registerValidation, register);

// Login / Get user by Firebase token
router.post('/login', authMiddleware, login);

// Get current user profile
router.get('/me', authMiddleware, getMe);

// Update user profile
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
