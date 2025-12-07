// @ts-ignore - EXPO_PUBLIC_API_URL is injected at build time
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const API_BASE_URL = API_URL
    ? API_URL
    : (__DEV__
        ? 'http://10.110.155.27:5000/api' // Development - use your local IP
        : 'https://localbazaarpro.onrender.com/api'); // Production - Render backend
// Cloudinary Configuration
export const CLOUDINARY_CLOUD_NAME = 'du2d0ackl';
export const CLOUDINARY_UPLOAD_PRESET = 'localbazaar_preset';

// Pagination
export const ITEMS_PER_PAGE = 20;

// Image Upload
export const MAX_IMAGES = 5;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Validation
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 1000;
