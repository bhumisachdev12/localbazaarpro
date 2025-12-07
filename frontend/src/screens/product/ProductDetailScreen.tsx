import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addFavorite, removeFavorite } from '../../store/slices/favoriteSlice';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, ELEVATION, GRADIENTS } from '../../theme/colors';
import { getProductById } from '../../services/productService';
import { createOrder } from '../../services/orderService';
import ImageCarousel from '../../components/ImageCarousel';

export default function ProductDetailScreen({ route, navigation }: any) {
    const { productId } = route.params;
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { favorites } = useSelector((state: RootState) => state.favorites);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [contactingLoading, setContactingLoading] = useState(false);
    
    const isFavorited = favorites.includes(productId);

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            console.log('🔍 Fetching product:', productId);
            setLoading(true);
            const response = await getProductById(productId);
            console.log('📦 Product response:', response);

            // Handle nested data structure
            const productData = response.data?.product || response.data || response.product || response;
            console.log('✅ Product data:', productData);

            if (!productData) {
                throw new Error('Product data not found');
            }

            setProduct(productData);
        } catch (error: any) {
            console.error('❌ Error fetching product:', error);
            Alert.alert('Error', error.message || 'Failed to load product details', [
                {
                    text: 'Go Back',
                    onPress: () => navigation.goBack(),
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async () => {
        try {
            if (isFavorited) {
                await dispatch(removeFavorite(productId)).unwrap();
                Alert.alert('Removed', 'Removed from wishlist');
            } else {
                await dispatch(addFavorite(productId)).unwrap();
                Alert.alert('Added', 'Added to wishlist ❤️');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleAddToCart = async () => {
        if (!product) {
            Alert.alert('Error', 'Product details not loaded yet');
            return;
        }

        try {
            const orderData = {
                productId: product._id || product.id || productId,
                message: `Order from product page - ${product.title}`,
            };

            const response = await createOrder(orderData);
            console.log('✅ Order created from Add to Cart:', response);

            Alert.alert(
                'Order Created',
                'This product has been added to your orders.',
                [
                    { text: 'View Orders', onPress: () => navigation.navigate('Orders') },
                    { text: 'OK', style: 'cancel' },
                ]
            );
        } catch (error: any) {
            console.error('❌ Error creating order from Add to Cart:', error);
            Alert.alert(
                'Error',
                error?.response?.data?.message ||
                    error?.message ||
                    'Failed to create order. Please try again.'
            );
        }
    };

    const handleContactSeller = async () => {
        console.log('📞 Contact Seller button pressed');
        console.log('Product:', product?._id || product?.id);
        console.log('User:', user?.id);
        console.log('Seller:', product?.seller?._id || product?.seller?.id);

        if (!product) {
            console.log('❌ No product data');
            return;
        }

        // Check if user is trying to contact themselves
        if (product.seller?._id === user?.id || product.seller?.id === user?.id) {
            console.log('⚠️ User trying to contact own listing');
            Alert.alert('Info', 'This is your own listing');
            return;
        }

        Alert.alert(
            'Contact Seller',
            `Send an inquiry to ${product.seller?.name || 'the seller'}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => console.log('Contact cancelled')
                },
                {
                    text: 'Send',
                    onPress: async () => {
                        try {
                            console.log('📤 Sending inquiry...');
                            setContactingLoading(true);
                            const orderData = {
                                productId: product._id || product.id,
                                message: `I'm interested in ${product.title}`,
                            };
                            console.log('Order data:', orderData);

                            const response = await createOrder(orderData);
                            console.log('✅ Order created:', response);

                            Alert.alert(
                                'Success',
                                'Your inquiry has been sent to the seller!',
                                [
                                    {
                                        text: 'View Orders',
                                        onPress: () => navigation.navigate('Orders'),
                                    },
                                    {
                                        text: 'OK',
                                        style: 'cancel',
                                    },
                                ]
                            );
                        } catch (error: any) {
                            console.error('❌ Order creation error:', error);
                            console.error('Error response:', error.response?.data);
                            Alert.alert(
                                'Error',
                                error.response?.data?.message ||
                                error.message ||
                                'Failed to send inquiry. Please try again.'
                            );
                        } finally {
                            setContactingLoading(false);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Product not found</Text>
            </View>
        );
    }

    const isOwnListing = product.seller?._id === user?.id || product.seller?.id === user?.id;

    return (
        <View style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                bounces={true}
            >
                {/* Image Carousel */}
                <ImageCarousel images={product.images || []} />

                {/* Product Info */}
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.titleRow}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{product.title}</Text>
                                <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={handleToggleFavorite}
                                activeOpacity={0.7}
                            >
                                <LinearGradient
                                    colors={isFavorited ? GRADIENTS.accent : ['#F1F5F9', '#E2E8F0']}
                                    style={styles.favoriteButtonGradient}
                                >
                                    <Text style={styles.favoriteIcon}>
                                        {isFavorited ? '❤️' : '🤍'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        {product.status && (
                            <View
                                style={[
                                    styles.statusBadge,
                                    product.status === 'sold' && styles.statusBadgeSold,
                                ]}
                            >
                                <Text style={styles.statusText}>{product.status}</Text>
                            </View>
                        )}
                    </View>

                    {/* Product Details */}
                    <View style={styles.detailsCard}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Condition</Text>
                            <Text style={styles.detailValue}>{product.condition}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Category</Text>
                            <Text style={styles.detailValue}>{product.category}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Campus</Text>
                            <Text style={styles.detailValue}>
                                {product.seller?.campus || product.campus || 'Not specified'}
                            </Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Posted</Text>
                            <Text style={styles.detailValue}>
                                {new Date(product.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>

                    {/* Seller Info */}
                    <View style={styles.sellerCard}>
                        <Text style={styles.sectionTitle}>Seller Information</Text>
                        <View style={styles.sellerInfo}>
                            <View style={styles.sellerAvatar}>
                                <Text style={styles.sellerAvatarText}>
                                    {product.seller?.name?.charAt(0).toUpperCase() || 'S'}
                                </Text>
                            </View>
                            <View style={styles.sellerDetails}>
                                <Text style={styles.sellerName}>
                                    {product.seller?.name || 'Seller'}
                                </Text>
                                <Text style={styles.sellerCampus}>
                                    📍 {product.seller?.campus || 'Campus not specified'}
                                </Text>
                                
                                {/* Contact Information */}
                                {product.seller?.email && (
                                    <TouchableOpacity 
                                        style={styles.contactRow}
                                        onPress={() => Linking.openURL(`mailto:${product.seller.email}`)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.contactIcon}>📧</Text>
                                        <Text style={styles.contactText}>{product.seller.email}</Text>
                                        <Text style={styles.contactArrow}>›</Text>
                                    </TouchableOpacity>
                                )}
                                {product.seller?.phone && (
                                    <TouchableOpacity 
                                        style={styles.contactRow}
                                        onPress={() => Linking.openURL(`tel:${product.seller.phone}`)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.contactIcon}>📱</Text>
                                        <Text style={styles.contactText}>{product.seller.phone}</Text>
                                        <Text style={styles.contactArrow}>›</Text>
                                    </TouchableOpacity>
                                )}
                                
                                {/* Seller Stats */}
                                <View style={styles.sellerStats}>
                                    <View style={styles.statBadge}>
                                        <Text style={styles.statBadgeText}>
                                            {product.seller?.totalListings || 0} Listings
                                        </Text>
                                    </View>
                                    <View style={styles.statBadge}>
                                        <Text style={styles.statBadgeText}>
                                            {product.seller?.totalSales || 0} Sales
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            {!isOwnListing && product.status !== 'sold' && (
                <View style={styles.footer}>
                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.addToCartButton}
                            onPress={handleAddToCart}
                        >
                            <LinearGradient
                                colors={GRADIENTS.accent}
                                style={styles.addToCartGradient}
                            >
                                <Text style={styles.addToCartIcon}>🛒</Text>
                                <Text style={styles.addToCartText}>Add to Cart</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.contactButton,
                                contactingLoading && styles.contactButtonDisabled,
                            ]}
                            onPress={() => {
                                console.log('🔵 Contact button tapped');
                                handleContactSeller();
                            }}
                            disabled={contactingLoading}
                        >
                            <LinearGradient
                                colors={GRADIENTS.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.contactButtonGradient}
                            >
                                {contactingLoading ? (
                                    <ActivityIndicator color={COLORS.white} />
                                ) : (
                                    <>
                                        <Text style={styles.contactButtonIcon}>💬</Text>
                                        <Text style={styles.contactButtonText}>Contact</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {isOwnListing && (
                <View style={styles.footer}>
                    <View style={styles.ownListingBanner}>
                        <Text style={styles.ownListingText}>This is your listing</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundSecondary,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 120, // Space for fixed footer
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textSecondary,
    },
    content: {
        padding: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.lg,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.sm,
    },
    titleContainer: {
        flex: 1,
        marginRight: SPACING.md,
    },
    favoriteButton: {
        borderRadius: BORDER_RADIUS.full,
        overflow: 'hidden',
        ...ELEVATION.level3,
    },
    favoriteButtonGradient: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteIcon: {
        fontSize: 28,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    price: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.success,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
    },
    statusBadgeSold: {
        backgroundColor: COLORS.error,
    },
    statusText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    detailsCard: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.lg,
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray100,
    },
    detailLabel: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
    detailValue: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    description: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        lineHeight: 24,
    },
    sellerCard: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        ...SHADOWS.md,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sellerInfo: {
        flexDirection: 'row',
        marginTop: SPACING.md,
    },
    sellerAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
        ...SHADOWS.sm,
    },
    sellerAvatarText: {
        fontSize: FONT_SIZES.xxl,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    sellerDetails: {
        flex: 1,
    },
    sellerName: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    sellerCampus: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
        fontWeight: '500',
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray50,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginTop: SPACING.xs,
    },
    contactIcon: {
        fontSize: FONT_SIZES.md,
        marginRight: SPACING.sm,
    },
    contactText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
        fontWeight: '600',
        flex: 1,
    },
    contactArrow: {
        fontSize: FONT_SIZES.xl,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    sellerStats: {
        flexDirection: 'row',
        marginTop: SPACING.md,
        gap: SPACING.sm,
    },
    statBadge: {
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
    },
    statBadgeText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.white,
        fontWeight: '700',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.xl,
        backgroundColor: COLORS.backgroundTertiary,
        ...ELEVATION.level5,
        borderTopLeftRadius: BORDER_RADIUS.xxl,
        borderTopRightRadius: BORDER_RADIUS.xxl,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    addToCartButton: {
        flex: 1,
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        ...ELEVATION.level3,
    },
    addToCartGradient: {
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
    },
    addToCartIcon: {
        fontSize: 22,
    },
    addToCartText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    contactButton: {
        flex: 1,
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        ...ELEVATION.level3,
    },
    contactButtonGradient: {
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
    },
    contactButtonDisabled: {
        opacity: 0.6,
    },
    contactButtonIcon: {
        fontSize: 22,
    },
    contactButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    ownListingBanner: {
        backgroundColor: COLORS.backgroundTertiary,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    ownListingText: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
});
