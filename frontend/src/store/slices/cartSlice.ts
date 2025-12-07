import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as cartService from '../../services/cartService';

interface CartItem {
    productId: string;
    quantity: number;
    addedAt: string;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    isLoading: boolean;
}

const initialState: CartState = {
    items: [],
    totalItems: 0,
    isLoading: false,
};

// Async thunks
export const loadCart = createAsyncThunk(
    'cart/load',
    async () => {
        const items = await cartService.getCartItems();
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        return { items, totalItems };
    }
);

export const addToCart = createAsyncThunk(
    'cart/add',
    async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
        await cartService.addToCart(productId, quantity);
        const items = await cartService.getCartItems();
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        return { items, totalItems };
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/remove',
    async (productId: string) => {
        await cartService.removeFromCart(productId);
        const items = await cartService.getCartItems();
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        return { items, totalItems };
    }
);

export const updateQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ productId, quantity }: { productId: string; quantity: number }) => {
        await cartService.updateCartQuantity(productId, quantity);
        const items = await cartService.getCartItems();
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        return { items, totalItems };
    }
);

export const clearCart = createAsyncThunk(
    'cart/clear',
    async () => {
        await cartService.clearCart();
        return { items: [], totalItems: 0 };
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Load cart
        builder.addCase(loadCart.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(loadCart.fulfilled, (state, action) => {
            state.items = action.payload.items;
            state.totalItems = action.payload.totalItems;
            state.isLoading = false;
        });

        // Add to cart
        builder.addCase(addToCart.fulfilled, (state, action) => {
            state.items = action.payload.items;
            state.totalItems = action.payload.totalItems;
        });

        // Remove from cart
        builder.addCase(removeFromCart.fulfilled, (state, action) => {
            state.items = action.payload.items;
            state.totalItems = action.payload.totalItems;
        });

        // Update quantity
        builder.addCase(updateQuantity.fulfilled, (state, action) => {
            state.items = action.payload.items;
            state.totalItems = action.payload.totalItems;
        });

        // Clear cart
        builder.addCase(clearCart.fulfilled, (state, action) => {
            state.items = action.payload.items;
            state.totalItems = action.payload.totalItems;
        });
    },
});

export default cartSlice.reducer;
