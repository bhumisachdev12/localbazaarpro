const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const {
    createReport,
    getReports,
    updateReportStatus,
    getMyReports,
    createReportValidation
} = require('../controllers/reportController');

// Create new report
router.post('/', authMiddleware, createReportValidation, createReport);

// Get my reports
router.get('/my', authMiddleware, getMyReports);

// Get all reports (admin only)
router.get('/', authMiddleware, adminMiddleware, getReports);

// Update report status (admin only)
router.put('/:id/status', authMiddleware, adminMiddleware, updateReportStatus);

module.exports = router;
