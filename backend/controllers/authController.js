const User = require('../models/User');
const { body, validationResult } = require('express-validator');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, phone, campus } = req.body;
        const { uid, email } = req.user;

        // Check if user already exists
        let user = await User.findOne({ firebaseUid: uid });

        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already registered'
            });
        }

        // Create new user
        user = new User({
            firebaseUid: uid,
            email,
            name,
            phone,
            campus
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    campus: user.campus,
                    phone: user.phone,
                    profileImage: user.profileImage
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login / Get user profile
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
    try {
        const { uid, email } = req.user;

        // Find user by Firebase UID
        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please register first.',
                needsRegistration: true
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    campus: user.campus,
                    phone: user.phone,
                    profileImage: user.profileImage,
                    totalListings: user.totalListings,
                    totalSales: user.totalSales,
                    walletBalance: user.walletBalance
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
    try {
        const { uid } = req.user;

        const user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    campus: user.campus,
                    phone: user.phone,
                    profileImage: user.profileImage,
                    totalListings: user.totalListings,
                    totalSales: user.totalSales,
                    walletBalance: user.walletBalance,
                    isVerified: user.isVerified
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res, next) => {
    try {
        const { uid } = req.user;
        const { name, phone, profileImage } = req.body;

        const user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    campus: user.campus,
                    phone: user.phone,
                    profileImage: user.profileImage
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Validation rules
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('campus').trim().notEmpty().withMessage('Campus is required'),
    body('phone').optional().trim().isMobilePhone().withMessage('Invalid phone number')
];

module.exports = {
    register,
    login,
    getMe,
    updateProfile,
    registerValidation
};
