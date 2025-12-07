import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as favoriteService from '../../services/favoriteService';

interface FavoriteState {
    favorites: string[];
    isLoading: boolean;
}

const initialState: FavoriteState = {
    favorites: [],
    isLoading: false,
};

// Async thunks
export const loadFavorites = createAsyncThunk(
    'favorites/load',
    async () => {
        const favorites = await favoriteService.getFavorites();
        return favorites;
    }
);

export const addFavorite = createAsyncThunk(
    'favorites/add',
    async (productId: string) => {
        await favoriteService.addToFavorites(productId);
        return productId;
    }
);

export const removeFavorite = createAsyncThunk(
    'favorites/remove',
    async (productId: string) => {
        await favoriteService.removeFromFavorites(productId);
        return productId;
    }
);

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        toggleFavorite: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            if (state.favorites.includes(productId)) {
                state.favorites = state.favorites.filter(id => id !== productId);
            } else {
                state.favorites.push(productId);
            }
        },
    },
    extraReducers: (builder) => {
        // Load favorites
        builder.addCase(loadFavorites.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(loadFavorites.fulfilled, (state, action) => {
            state.favorites = action.payload;
            state.isLoading = false;
        });

        // Add favorite
        builder.addCase(addFavorite.fulfilled, (state, action) => {
            if (!state.favorites.includes(action.payload)) {
                state.favorites.push(action.payload);
            }
        });

        // Remove favorite
        builder.addCase(removeFavorite.fulfilled, (state, action) => {
            state.favorites = state.favorites.filter(id => id !== action.payload);
        });
    },
});

export const { toggleFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
