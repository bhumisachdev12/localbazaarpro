import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as productService from '../../services/productService';

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    images: string[];
    seller: any;
    status: string;
    views: number;
    campus: string;
    createdAt: string;
    updatedAt: string;
}

interface ProductFilters {
    search?: string;
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    campus?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
}

interface ProductState {
    products: Product[];
    myListings: Product[];
    selectedProduct: Product | null;
    filters: ProductFilters;
    pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
    isLoading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    myListings: [],
    selectedProduct: null,
    filters: {},
    pagination: {
        total: 0,
        page: 1,
        pages: 1,
        limit: 20,
    },
    isLoading: false,
    error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (filters: productService.ProductFilters = {}, { rejectWithValue }) => {
        try {
            const response = await productService.getProducts(filters);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch products');
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await productService.getProductById(id);
            return response.data.product;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch product');
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (data: productService.CreateProductData, { rejectWithValue }) => {
        try {
            const response = await productService.createProduct(data);
            return response.data.product;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create product');
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, data }: { id: string; data: Partial<productService.CreateProductData> }, { rejectWithValue }) => {
        try {
            const response = await productService.updateProduct(id, data);
            return response.data.product;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update product');
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id: string, { rejectWithValue }) => {
        try {
            await productService.deleteProduct(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete product');
        }
    }
);

export const fetchMyListings = createAsyncThunk(
    'products/fetchMyListings',
    async (status: string | undefined, { rejectWithValue }) => {
        try {
            const response = await productService.getMyListings(status);
            return response.data.products;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch listings');
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<ProductFilters>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {};
        },
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch products
        builder.addCase(fetchProducts.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.products = action.payload.products;
            state.pagination = action.payload.pagination;
        });
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Fetch product by ID
        builder.addCase(fetchProductById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchProductById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.selectedProduct = action.payload;
        });
        builder.addCase(fetchProductById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Create product
        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.products.unshift(action.payload);
            state.myListings.unshift(action.payload);
        });

        // Update product
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            const index = state.products.findIndex(p => p._id === action.payload._id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
            const myIndex = state.myListings.findIndex(p => p._id === action.payload._id);
            if (myIndex !== -1) {
                state.myListings[myIndex] = action.payload;
            }
            if (state.selectedProduct?._id === action.payload._id) {
                state.selectedProduct = action.payload;
            }
        });

        // Delete product
        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            state.products = state.products.filter(p => p._id !== action.payload);
            state.myListings = state.myListings.filter(p => p._id !== action.payload);
        });

        // Fetch my listings
        builder.addCase(fetchMyListings.fulfilled, (state, action) => {
            state.myListings = action.payload;
        });
    },
});

export const { setFilters, clearFilters, clearError, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
