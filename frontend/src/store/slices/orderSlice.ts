import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderService from '../../services/orderService';

interface Order {
    _id: string;
    product: any;
    buyer: any;
    seller: any;
    status: string;
    message?: string;
    buyerContact?: any;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

interface OrderState {
    buyerOrders: Order[];
    sellerOrders: Order[];
    selectedOrder: Order | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    buyerOrders: [],
    sellerOrders: [],
    selectedOrder: null,
    isLoading: false,
    error: null,
};

// Async thunks
export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (data: orderService.CreateOrderData, { rejectWithValue }) => {
        try {
            const response = await orderService.createOrder(data);
            return response.data.order;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create order');
        }
    }
);

export const fetchBuyerOrders = createAsyncThunk(
    'orders/fetchBuyerOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderService.getBuyerOrders();
            return response.data.orders;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch buyer orders');
        }
    }
);

export const fetchSellerOrders = createAsyncThunk(
    'orders/fetchSellerOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderService.getSellerOrders();
            return response.data.orders;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch seller orders');
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ id, status, sellerNotes }: { id: string; status: string; sellerNotes?: string }, { rejectWithValue }) => {
        try {
            const response = await orderService.updateOrderStatus(id, status, sellerNotes);
            return response.data.order;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update order status');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        },
    },
    extraReducers: (builder) => {
        // Create order
        builder.addCase(createOrder.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createOrder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.buyerOrders.unshift(action.payload);
        });
        builder.addCase(createOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Fetch buyer orders
        builder.addCase(fetchBuyerOrders.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchBuyerOrders.fulfilled, (state, action) => {
            state.isLoading = false;
            state.buyerOrders = action.payload;
        });
        builder.addCase(fetchBuyerOrders.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Fetch seller orders
        builder.addCase(fetchSellerOrders.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchSellerOrders.fulfilled, (state, action) => {
            state.isLoading = false;
            state.sellerOrders = action.payload;
        });
        builder.addCase(fetchSellerOrders.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Update order status
        builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
            const index = state.sellerOrders.findIndex(o => o._id === action.payload._id);
            if (index !== -1) {
                state.sellerOrders[index] = action.payload;
            }
        });
    },
});

export const { clearError, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
