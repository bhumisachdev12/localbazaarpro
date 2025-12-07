import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config/constants';

/**
 * Generate mock image URL for development
 */
const generateMockImageUrl = (imageUri: string): string => {
    // Use a placeholder image service with a unique identifier
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/${timestamp}${random}/800/600`;
};

/**
 * Upload image to Cloudinary (or return mock URL in development)
 */
export const uploadImage = async (imageUri: string): Promise<string> => {
    try {
        console.log('📤 Uploading image to Cloudinary...');
        console.log('📍 Image URI:', imageUri);

        const formData = new FormData();

        // Get file extension and determine MIME type
        const fileExtension = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
        const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';

        // Create file object for React Native
        // React Native requires a specific format for file uploads
        const file: any = {
            uri: imageUri,
            type: mimeType,
            name: `upload_${Date.now()}.${fileExtension}`,
        };

        console.log('📦 File object:', file);

        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        console.log('🌐 Uploading to:', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        console.log('📡 Response status:', response.status);
        const data = await response.json();
        console.log('📥 Response data:', data);

        if (data.secure_url) {
            console.log('✅ Image uploaded successfully:', data.secure_url);
            return data.secure_url;
        } else {
            // Provide detailed error message
            const errorMessage = data.error?.message || 'Upload failed';
            console.error('❌ Cloudinary upload error:', data);

            if (errorMessage.includes('preset')) {
                throw new Error(
                    `Upload preset "${CLOUDINARY_UPLOAD_PRESET}" not found. Please create an unsigned upload preset in your Cloudinary dashboard.`
                );
            }

            throw new Error(`Cloudinary upload failed: ${errorMessage}`);
        }
    } catch (error: any) {
        console.error('❌ Image upload error:', error);

        // Re-throw with more context if it's a network error
        if (error.message?.includes('Network request failed')) {
            throw new Error('Network error. Please check your internet connection or try again.');
        }

        throw error;
    }
};

/**
 * Upload multiple images
 */
export const uploadMultipleImages = async (imageUris: string[]): Promise<string[]> => {
    try {
        const uploadPromises = imageUris.map(uri => uploadImage(uri));
        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        console.error('Multiple image upload error:', error);
        throw error;
    }
};
