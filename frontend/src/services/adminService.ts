import api from './api';

/**
 * Admin Statistics
 */
export const getAdminStats = async () => {
    try {
        const response = await api.get('/admin/stats');
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Reports Management
 */
export const getReports = async (status?: string) => {
    try {
        const params = status ? { status } : {};
        const response = await api.get('/reports', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateReportStatus = async (
    id: string,
    status: string,
    reviewNotes: string,
    actionTaken: string
) => {
    try {
        const response = await api.put(`/reports/${id}/status`, {
            status,
            reviewNotes,
            actionTaken
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Users Management
 */
export const getAllUsers = async (filters?: any) => {
    try {
        const response = await api.get('/admin/users', { params: filters });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserById = async (id: string) => {
    try {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserStatus = async (id: string, isActive: boolean) => {
    try {
        const response = await api.put(`/admin/users/${id}/status`, { isActive });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Products Management
 */
export const getAllProductsAdmin = async (filters?: any) => {
    try {
        const response = await api.get('/admin/products', { params: filters });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteProductAdmin = async (id: string) => {
    try {
        const response = await api.delete(`/admin/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
