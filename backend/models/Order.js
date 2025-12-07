const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    message: {
        type: String,
        trim: true,
        maxlength: 500
    },
    // Contact information shared
    buyerContact: {
        phone: String,
        email: String
    },
    // Transaction details (for wallet feature)
    amount: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    // Meeting details
    meetingLocation: {
        type: String,
        trim: true
    },
    meetingTime: {
        type: Date
    },
    // Notes
    sellerNotes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });
// Note: product index is already created by index: true on field definition
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
