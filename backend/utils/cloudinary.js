const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {string} base64Image - Base64 encoded image
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<string>} - Cloudinary URL
 */
const uploadImage = async (base64Image, folder = 'localbazaar') => {
    try {
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: folder,
            resource_type: 'auto',
            transformation: [
                { width: 1000, height: 1000, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });

        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image');
    }
};

/**
 * Delete image from Cloudinary
 * @param {string} imageUrl - Cloudinary image URL
 */
const deleteImage = async (imageUrl) => {
    try {
        // Extract public_id from URL
        const parts = imageUrl.split('/');
        const filename = parts[parts.length - 1];
        const publicId = `localbazaar/${filename.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        // Don't throw error, just log it
    }
};

/**
 * Upload multiple images
 * @param {Array<string>} images - Array of base64 images
 * @param {string} folder - Folder name
 * @returns {Promise<Array<string>>} - Array of Cloudinary URLs
 */
const uploadMultipleImages = async (images, folder = 'localbazaar') => {
    try {
        const uploadPromises = images.map(image => uploadImage(image, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Multiple upload error:', error);
        throw new Error('Failed to upload images');
    }
};

module.exports = {
    uploadImage,
    deleteImage,
    uploadMultipleImages,
    cloudinary
};
