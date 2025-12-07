const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Electronics',
            'Books',
            'Furniture',
            'Clothing',
            'Sports',
            'Stationery',
            'Accessories',
            'Other'
        ]
    },
    condition: {
        type: String,
        required: true,
        enum: ['New', 'Like New', 'Good', 'Fair']
    },
    images: [{
        type: String,
        required: true
    }],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'reserved', 'deleted'],
        default: 'available'
    },
    views: {
        type: Number,
        default: 0
    },
    // For search optimization
    searchKeywords: [{
        type: String,
        lowercase: true
    }],
    // Location/Campus info
    campus: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Indexes for search and filtering
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ campus: 1, status: 1 });
productSchema.index({ seller: 1, status: 1 });
productSchema.index({ createdAt: -1 });

// Pre-save middleware to generate search keywords
productSchema.pre('save', function (next) {
    if (this.isModified('title') || this.isModified('description')) {
        const keywords = [
            ...this.title.toLowerCase().split(' '),
            ...this.description.toLowerCase().split(' ')
        ];
        this.searchKeywords = [...new Set(keywords)];
    }
    next();
});

// Method to increment views
productSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

module.exports = mongoose.model('Product', productSchema);
