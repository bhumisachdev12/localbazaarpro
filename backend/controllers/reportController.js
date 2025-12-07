const Report = require('../models/Report');
const Product = require('../models/Product');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

/**
 * Create new report
 * POST /api/reports
 */
const createReport = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { productId, reason, description } = req.body;
        const { uid } = req.user;

        // Find reporter
        const reporter = await User.findOne({ firebaseUid: uid });
        if (!reporter) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Find product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Create report
        const report = new Report({
            product: productId,
            reporter: reporter._id,
            reason,
            description
        });

        await report.save();

        res.status(201).json({
            success: true,
            message: 'Report submitted successfully. Our team will review it.',
            data: { report }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all reports (admin only)
 * GET /api/reports
 */
const getReports = async (req, res, next) => {
    try {
        const { status = 'pending' } = req.query;

        const query = {};
        if (status !== 'all') {
            query.status = status;
        }

        const reports = await Report.find(query)
            .populate('product', 'title price images seller')
            .populate('reporter', 'name email campus')
            .populate('reviewedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { reports }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update report status (admin only)
 * PUT /api/reports/:id/status
 */
const updateReportStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, reviewNotes, actionTaken } = req.body;
        const { uid } = req.user;

        const reviewer = await User.findOne({ firebaseUid: uid });
        if (!reviewer) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        report.status = status;
        report.reviewNotes = reviewNotes;
        report.actionTaken = actionTaken || 'none';
        report.reviewedBy = reviewer._id;
        report.reviewedAt = new Date();

        // Take action based on actionTaken
        if (actionTaken === 'listing_removed') {
            const product = await Product.findById(report.product);
            if (product) {
                product.status = 'deleted';
                await product.save();
            }
        }

        await report.save();

        res.json({
            success: true,
            message: 'Report updated successfully',
            data: { report }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get my reports
 * GET /api/reports/my
 */
const getMyReports = async (req, res, next) => {
    try {
        const { uid } = req.user;

        const reporter = await User.findOne({ firebaseUid: uid });
        if (!reporter) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const reports = await Report.find({ reporter: reporter._id })
            .populate('product', 'title price images')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { reports }
        });
    } catch (error) {
        next(error);
    }
};

// Validation rules
const createReportValidation = [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('reason').isIn([
        'Spam',
        'Inappropriate Content',
        'Misleading Information',
        'Scam/Fraud',
        'Duplicate Listing',
        'Sold Item Still Listed',
        'Other'
    ]).withMessage('Invalid reason'),
    body('description').trim().notEmpty().withMessage('Description is required')
        .isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
];

module.exports = {
    createReport,
    getReports,
    updateReportStatus,
    getMyReports,
    createReportValidation
};
