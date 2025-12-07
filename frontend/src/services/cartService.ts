import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = '@cart';

export interface CartItem {
    productId: string;
    quantity: number;
    addedAt: string;
}

/**
 * Get all cart items
 */
export const getCartItems = async (): Promise<CartItem[]> => {
    try {
        const cartJson = await AsyncStorage.getItem(CART_KEY);
        if (cartJson) {
            return JSON.parse(cartJson);
        }
        return [];
    } catch (error) {
        console.error('Error getting cart:', error);
        return [];
    }
};

/**
 * Add product to cart
 */
export const addToCart = async (productId: string, quantity: number = 1): Promise<boolean> => {
    try {
        const cart = await getCartItems();
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            // Update quantity
            existingItem.quantity += quantity;
        } else {
            // Add new item
            cart.push({
                productId,
                quantity,
                addedAt: new Date().toISOString(),
            });
        }
        
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        console.log('✅ Added to cart:', productId);
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return false;
    }
};

/**
 * Remove product from cart
 */
export const removeFromCart = async (productId: string): Promise<boolean> => {
    try {
        const cart = await getCartItems();
        const filtered = cart.filter(item => item.productId !== productId);
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(filtered));
        console.log('✅ Removed from cart:', productId);
        return true;
    } catch (error) {
        console.error('Error removing from cart:', error);
        return false;
    }
};

/**
 * Update cart item quantity
 */
export const updateCartQuantity = async (productId: string, quantity: number): Promise<boolean> => {
    try {
        const cart = await getCartItems();
        const item = cart.find(item => item.productId === productId);
        
        if (item) {
            if (quantity <= 0) {
                return removeFromCart(productId);
            }
            item.quantity = quantity;
            await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
            console.log('✅ Updated cart quantity:', productId, quantity);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating cart:', error);
        return false;
    }
};

/**
 * Check if product is in cart
 */
export const isInCart = async (productId: string): Promise<boolean> => {
    try {
        const cart = await getCartItems();
        return cart.some(item => item.productId === productId);
    } catch (error) {
        console.error('Error checking cart:', error);
        return false;
    }
};

/**
 * Get cart item count
 */
export const getCartCount = async (): Promise<number> => {
    try {
        const cart = await getCartItems();
        return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
        console.error('Error getting cart count:', error);
        return 0;
    }
};

/**
 * Clear cart
 */
export const clearCart = async (): Promise<boolean> => {
    try {
        await AsyncStorage.removeItem(CART_KEY);
        console.log('✅ Cleared cart');
        return true;
    } catch (error) {
        console.error('Error clearing cart:', error);
        return false;
    }
};
