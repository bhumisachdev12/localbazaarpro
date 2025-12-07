import api from './api';

export interface ProductFilters {
    search?: string;
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    campus?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface CreateProductData {
    title: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    images: string[];
}

/**
 * Get all products with filters
 */
export const getProducts = async (filters: ProductFilters = {}) => {
    try {
        const response = await api.get('/products', { params: filters });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get product by ID
 */
export const getProductById = async (id: string) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Create new product
 */
export const createProduct = async (data: CreateProductData) => {
    try {
        const response = await api.post('/products', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Update product
 */
export const updateProduct = async (id: string, data: Partial<CreateProductData>) => {
    try {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete product
 */
export const deleteProduct = async (id: string) => {
    try {
        console.log('🔵 Deleting product with ID:', id);
        const response = await api.delete(`/products/${id}`);
        console.log('✅ Delete API response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Delete API error:', error);
        if (error.response) {
            console.error('❌ Response status:', error.response.status);
            console.error('❌ Response data:', error.response.data);
        }
        throw error;
    }
};

/**
 * Get my listings
 */
export const getMyListings = async (status?: string) => {
    try {
        const params = status ? { status } : {};
        const response = await api.get('/products/my/listings', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get products by user
 */
export const getProductsByUser = async (userId: string, status?: string) => {
    try {
        const params = status ? { status } : {};
        const response = await api.get(`/products/user/${userId}`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};
