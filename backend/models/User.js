const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    campus: {
        type: String,
        required: true,
        trim: true
    },
    profileImage: {
        type: String,
        default: null
    },
    // Statistics
    totalListings: {
        type: Number,
        default: 0
    },
    totalSales: {
        type: Number,
        default: 0
    },
    // Wallet (for stretch goal)
    walletBalance: {
        type: Number,
        default: 0
    },
    // Account status
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    // Admin role
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for better query performance
userSchema.index({ campus: 1 });
// Note: email index is automatically created by unique: true constraint

// Virtual for user's full profile
userSchema.virtual('profile').get(function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        campus: this.campus,
        profileImage: this.profileImage,
        totalListings: this.totalListings,
        totalSales: this.totalSales
    };
});

module.exports = mongoose.model('User', userSchema);
