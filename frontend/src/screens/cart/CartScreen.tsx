import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { loadCart, removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import { createOrder as createOrderThunk } from '../../store/slices/orderSlice';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, ELEVATION, GRADIENTS } from '../../theme/colors';
import { getProductById } from '../../services/productService';

export default function CartScreen({ navigation }: any) {
    const dispatch = useDispatch<AppDispatch>();
    const { items, totalItems } = useSelector((state: RootState) => state.cart);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadCartData();
        }, [])
    );

    useEffect(() => {
        if (items.length > 0) {
            loadProducts();
        } else {
            setProducts([]);
            setLoading(false);
        }
    }, [items.length]);

    const loadCartData = async () => {
        try {
            await dispatch(loadCart()).unwrap();
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const loadProducts = async () => {
        try {
            setLoading(true);
            const productPromises = items.map(item =>
                getProductById(item.productId).catch(err => null)
            );
            const results = await Promise.all(productPromises);
            const validProducts = results
                .filter(r => r !== null)
                .map((r, index) => ({
                    ...(r.data?.product || r.data || r),
                    cartQuantity: items[index].quantity,
                }));
            setProducts(validProducts);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = (productId: string, title: string) => {
        Alert.alert(
            'Remove Item',
            `Remove "${title}" from cart?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => dispatch(removeFromCart(productId)),
                },
            ]
        );
    };

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            return;
        }
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
    };

    const handleClearCart = () => {
        Alert.alert(
            'Clear Cart',
            'Remove all items from cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => dispatch(clearCart()),
                },
            ]
        );
    };

    const calculateTotal = () => {
        return products.reduce((sum, product) => sum + (product.price * product.cartQuantity), 0);
    };

    const renderCartItem = ({ item }: any) => (
        <View style={styles.cartItem}>
            <Image
                source={{ uri: item.images?.[0] || 'https://via.placeholder.com/100' }}
                style={styles.productImage}
            />
            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item._id || item.id, item.cartQuantity - 1)}
                    >
                        <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.cartQuantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item._id || item.id, item.cartQuantity + 1)}
                    >
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(item._id || item.id, item.title)}
            >
                <Text style={styles.removeButtonText}>🗑️</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <LinearGradient
                colors={GRADIENTS.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.headerTitle}>Shopping Cart</Text>
                        <Text style={styles.headerSubtitle}>
                            🛒 {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </Text>
                    </View>
                    {items.length > 0 && (
                        <TouchableOpacity onPress={handleClearCart}>
                            <Text style={styles.clearButton}>Clear All</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptyText}>
                Add products to your cart to see them here
            </Text>
            <TouchableOpacity
                style={styles.browseButton}
                onPress={() => navigation.navigate('Home')}
            >
                <LinearGradient
                    colors={GRADIENTS.primary}
                    style={styles.browseButtonGradient}
                >
                    <Text style={styles.browseButtonText}>Browse Products</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const handleCheckout = async () => {
        if (products.length === 0 || checkingOut) return;

        try {
            setCheckingOut(true);

            // Create an order for each product in the cart
            for (const product of products) {
                const productId = product._id || product.id;
                if (!productId) continue;

                await dispatch(
                    createOrderThunk({
                        productId,
                        message: `Order from cart - Qty ${product.cartQuantity} - ${product.title}`,
                    })
                ).unwrap();
            }

            await dispatch(clearCart()).unwrap();

            Alert.alert(
                'Order Placed',
                'Your order request has been sent to the sellers. You can track status in Orders.',
                [
                    { text: 'View Orders', onPress: () => navigation.navigate('Orders') },
                    { text: 'OK', style: 'cancel' },
                ]
            );
        } catch (error: any) {
            console.error('Error during checkout:', error);
            Alert.alert(
                'Checkout Failed',
                error?.message || 'Unable to place order. Please try again.'
            );
        } finally {
            setCheckingOut(false);
        }
    };

    const renderFooter = () => {
        if (products.length === 0) return null;
        
        return (
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalAmount}>₹{calculateTotal().toLocaleString()}</Text>
                </View>
                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={handleCheckout}
                    disabled={checkingOut}
                >
                    <LinearGradient
                        colors={GRADIENTS.primary}
                        style={styles.checkoutButtonGradient}
                    >
                        {checkingOut ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                {renderHeader()}
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={renderHeader}
                data={products}
                renderItem={renderCartItem}
                keyExtractor={(item) => item._id || item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmpty}
            />
            {renderFooter()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundSecondary,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        marginBottom: SPACING.lg,
    },
    headerGradient: {
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xxxl,
        paddingBottom: SPACING.xxl,
        borderBottomLeftRadius: BORDER_RADIUS.xxxl,
        borderBottomRightRadius: BORDER_RADIUS.xxxl,
        ...ELEVATION.level4,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 42,
        fontWeight: '900',
        color: COLORS.white,
        marginBottom: SPACING.sm,
        letterSpacing: -1.5,
        lineHeight: 48,
    },
    headerSubtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.white,
        opacity: 0.95,
        fontWeight: '500',
        lineHeight: 22,
    },
    clearButton: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    listContent: {
        paddingHorizontal: SPACING.md,
        paddingBottom: 120,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        ...ELEVATION.level2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.gray100,
    },
    productInfo: {
        flex: 1,
        marginLeft: SPACING.md,
        justifyContent: 'space-between',
    },
    productTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    productPrice: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '800',
        color: COLORS.primary,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.xs,
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: BORDER_RADIUS.sm,
        backgroundColor: COLORS.gray100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    quantityText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginHorizontal: SPACING.md,
        minWidth: 30,
        textAlign: 'center',
    },
    removeButton: {
        padding: SPACING.sm,
    },
    removeButtonText: {
        fontSize: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: SPACING.xxxl,
        paddingHorizontal: SPACING.xl,
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.xxl,
        marginTop: SPACING.xl,
        ...ELEVATION.level2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: SPACING.lg,
    },
    emptyTitle: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    browseButton: {
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        ...ELEVATION.level2,
    },
    browseButtonGradient: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
    },
    browseButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.backgroundTertiary,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.xxl,
        ...ELEVATION.level5,
        borderTopLeftRadius: BORDER_RADIUS.xxl,
        borderTopRightRadius: BORDER_RADIUS.xxl,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        paddingBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray100,
    },
    totalLabel: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textSecondary,
        letterSpacing: 0.5,
    },
    totalAmount: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: '900',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    checkoutButton: {
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        ...ELEVATION.level3,
    },
    checkoutButtonGradient: {
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xl,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.lg,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
});
