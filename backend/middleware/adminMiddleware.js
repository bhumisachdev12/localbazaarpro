const User = require('../models/User');

/**
 * Admin middleware - Verify user has admin privileges
 */
const adminMiddleware = async (req, res, next) => {
    try {
        const { uid } = req.user;

        // Find user by Firebase UID
        const user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is admin
        if (!user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        // Attach user to request for use in controllers
        req.adminUser = user;
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = { adminMiddleware };
