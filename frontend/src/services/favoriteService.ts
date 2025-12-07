import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

export interface Favorite {
    productId: string;
    addedAt: string;
}

/**
 * Get all favorites
 */
export const getFavorites = async (): Promise<string[]> => {
    try {
        const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
        if (favoritesJson) {
            const favorites: Favorite[] = JSON.parse(favoritesJson);
            return favorites.map(f => f.productId);
        }
        return [];
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
};

/**
 * Add product to favorites
 */
export const addToFavorites = async (productId: string): Promise<boolean> => {
    try {
        const favorites = await getFavorites();
        if (!favorites.includes(productId)) {
            const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
            const favoritesList: Favorite[] = favoritesJson ? JSON.parse(favoritesJson) : [];
            favoritesList.push({
                productId,
                addedAt: new Date().toISOString(),
            });
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesList));
            console.log('✅ Added to favorites:', productId);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error adding to favorites:', error);
        return false;
    }
};

/**
 * Remove product from favorites
 */
export const removeFromFavorites = async (productId: string): Promise<boolean> => {
    try {
        const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
        if (favoritesJson) {
            const favorites: Favorite[] = JSON.parse(favoritesJson);
            const filtered = favorites.filter(f => f.productId !== productId);
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
            console.log('✅ Removed from favorites:', productId);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error removing from favorites:', error);
        return false;
    }
};

/**
 * Check if product is in favorites
 */
export const isFavorite = async (productId: string): Promise<boolean> => {
    try {
        const favorites = await getFavorites();
        return favorites.includes(productId);
    } catch (error) {
        console.error('Error checking favorite:', error);
        return false;
    }
};

/**
 * Clear all favorites
 */
export const clearFavorites = async (): Promise<boolean> => {
    try {
        await AsyncStorage.removeItem(FAVORITES_KEY);
        console.log('✅ Cleared all favorites');
        return true;
    } catch (error) {
        console.error('Error clearing favorites:', error);
        return false;
    }
};
