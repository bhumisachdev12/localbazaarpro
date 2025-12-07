import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: string;
    email: string;
    name: string;
    campus: string;
    phone?: string;
    profileImage?: string;
    totalListings: number;
    totalSales: number;
    walletBalance: number;
    isAdmin: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Async thunks
export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: authService.RegisterData, { rejectWithValue }) => {
        try {
            const response = await authService.register(data);
            return response.data.user;
        } catch (error: any) {
            // Handle both Firebase errors and API errors
            const errorMessage = error.message || 'Registration failed';
            const errorCode = error.code;

            // Return error with code for specific handling in UI
            return rejectWithValue({
                code: errorCode,
                message: errorMessage
            });
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (data: authService.LoginData, { rejectWithValue }) => {
        try {
            const response = await authService.login(data);
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const userJson = await AsyncStorage.getItem('user');
            const token = await AsyncStorage.getItem('authToken');

            if (userJson && token) {
                const user = JSON.parse(userJson);
                return user;
            }
            return null;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to load user');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await authService.updateProfile(data);
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Profile update failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        // Register
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            // Extract message from error object
            const errorPayload = action.payload as any;
            state.error = errorPayload?.message || 'Registration failed';
        });

        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Logout
        builder.addCase(logoutUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;
        });
        builder.addCase(logoutUser.rejected, (state) => {
            // Even if logout fails, clear the state
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;
        });

        // Load user
        builder.addCase(loadUser.fulfilled, (state, action) => {
            if (action.payload) {
                state.user = action.payload;
                state.isAuthenticated = true;
            }
        });

        // Update profile
        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            state.user = action.payload;
        });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
