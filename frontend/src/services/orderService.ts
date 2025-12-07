import api from './api';

export interface CreateOrderData {
    productId: string;
    message?: string;
    buyerContact?: {
        phone?: string;
        email?: string;
    };
}

/**
 * Create new order/inquiry
 */
export const createOrder = async (data: CreateOrderData) => {
    try {
        const response = await api.post('/orders', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get orders as buyer
 */
export const getBuyerOrders = async () => {
    try {
        const response = await api.get('/orders/buyer');
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get orders as seller
 */
export const getSellerOrders = async () => {
    try {
        const response = await api.get('/orders/seller');
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get order by ID
 */
export const getOrderById = async (id: string) => {
    try {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
    id: string,
    status: string,
    sellerNotes?: string
) => {
    try {
        const response = await api.put(`/orders/${id}/status`, {
            status,
            sellerNotes,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
