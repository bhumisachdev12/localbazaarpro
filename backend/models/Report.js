const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    reason: {
        type: String,
        required: true,
        enum: [
            'Spam',
            'Inappropriate Content',
            'Misleading Information',
            'Scam/Fraud',
            'Duplicate Listing',
            'Sold Item Still Listed',
            'Other'
        ]
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
        default: 'pending'
    },
    // Admin actions
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewNotes: {
        type: String,
        trim: true
    },
    actionTaken: {
        type: String,
        enum: ['none', 'warning', 'listing_removed', 'user_suspended'],
        default: 'none'
    },
    reviewedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes
reportSchema.index({ status: 1, createdAt: -1 });
// Note: product and reporter indexes are already created by index: true on field definitions

module.exports = mongoose.model('Report', reportSchema);
