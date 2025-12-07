import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { loadFavorites } from '../../store/slices/favoriteSlice';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, ELEVATION, GRADIENTS } from '../../theme/colors';
import { getProductById } from '../../services/productService';
import ProductCard from '../../components/ProductCard';

export default function FavoritesScreen({ navigation }: any) {
    const dispatch = useDispatch<AppDispatch>();
    const { favorites } = useSelector((state: RootState) => state.favorites);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Load favorites when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            console.log('🔍 FavoritesScreen focused');
            const loadData = async () => {
                try {
                    await dispatch(loadFavorites()).unwrap();
                    console.log('✅ Favorites loaded:', favorites.length);
                } catch (error) {
                    console.error('❌ Error loading favorites:', error);
                }
            };
            loadData();
        }, [])
    );

    useEffect(() => {
        // Load product details when favorites change
        console.log('📦 Favorites changed, count:', favorites.length);
        if (favorites.length > 0) {
            loadFavoriteProducts();
        } else {
            setProducts([]);
            setLoading(false);
        }
    }, [favorites.length]);

    const loadFavoriteProducts = async () => {
        try {
            setLoading(true);
            console.log('📦 Loading favorite products:', favorites);
            
            if (favorites.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }
            
            // Fetch product details for each favorite
            const productPromises = favorites.map(id => 
                getProductById(id).catch(err => {
                    console.error('Error loading product:', id, err);
                    return null;
                })
            );
            
            const productResults = await Promise.all(productPromises);
            const validProducts = productResults
                .filter(result => result !== null)
                .map(result => result.data?.product || result.data || result);
            
            console.log('✅ Loaded products:', validProducts.length);
            setProducts(validProducts);
        } catch (error) {
            console.error('❌ Error loading favorites:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(loadFavorites());
            await loadFavoriteProducts();
        } catch (error) {
            console.error('Error refreshing:', error);
        } finally {
            setRefreshing(false);
        }
    };

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
                        <Text style={styles.headerTitle}>My Wishlist</Text>
                        <Text style={styles.headerSubtitle}>
                            ❤️ {favorites.length} saved {favorites.length === 1 ? 'item' : 'items'}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💝</Text>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
                Start adding products to your wishlist by tapping the heart icon
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

    if (loading && !refreshing && favorites.length > 0) {
        return (
            <View style={styles.container}>
                {renderHeader()}
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading favorites...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={renderHeader}
                data={products}
                renderItem={({ item }) => {
                    if (!item) return null;
                    return (
                        <View style={styles.cardWrapper}>
                            <ProductCard
                                id={item._id || item.id}
                                title={item.title}
                                price={item.price}
                                image={item.images?.[0]}
                                campus={item.seller?.campus || item.campus}
                                condition={item.condition}
                                status={item.status}
                                onPress={() =>
                                    navigation.navigate('ProductDetail', {
                                        productId: item._id || item.id,
                                    })
                                }
                            />
                        </View>
                    );
                }}
                keyExtractor={(item, index) => item?._id || item?.id || `favorite-${index}`}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                ListEmptyComponent={renderEmptyState}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundSecondary,
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
    listContent: {
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    cardWrapper: {
        marginBottom: SPACING.md,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: SPACING.xxxl,
        paddingHorizontal: SPACING.xl,
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.xxl,
        marginHorizontal: SPACING.md,
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
        lineHeight: 22,
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
});
