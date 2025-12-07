import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, GRADIENTS, ELEVATION } from '../../theme/colors';
import ProductCard from '../../components/ProductCard';
import { useFocusEffect } from '@react-navigation/native';
import { getProducts } from '../../services/productService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

export default function HomeScreen({ navigation }: any) {
    const [products, setProducts] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            // Initial load when screen gains focus
            fetchProducts();

            // Lightweight polling to keep listings fresh while user is on Home
            const intervalId = setInterval(() => {
                fetchProducts();
            }, 15000); // 15s

            return () => clearInterval(intervalId);
        }, [])
    );

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getProducts();
            const productData = response.data?.products || response.data || response || [];
            setProducts(productData);
        } catch (error: any) {
            console.error('Error fetching products:', error);
            setError(error.message || 'Failed to load products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProducts();
        setRefreshing(false);
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
                        <Text style={styles.headerGreeting}>Welcome to</Text>
                        <Text style={styles.headerTitle}>LocalBazaar Pro</Text>
                        <Text style={styles.headerSubtitle}>
                            🎯 Discover amazing deals on campus
                        </Text>
                    </View>
                    <View style={styles.headerBadge}>
                        <LinearGradient
                            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                            style={styles.headerBadgeGradient}
                        >
                            <Text style={styles.headerBadgeText}>✨</Text>
                        </LinearGradient>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );

    const renderProductItem = ({ item }: any) => (
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

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyTitle}>No Products Yet</Text>
            <Text style={styles.emptyText}>
                Be the first to list an item!
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading products...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={renderHeader}
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item._id || item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
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
        marginBottom: SPACING.xl,
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
        alignItems: 'flex-start',
    },
    headerGreeting: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.white,
        opacity: 0.85,
        marginBottom: SPACING.sm,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    headerTitle: {
        fontSize: 42,
        fontWeight: '900',
        color: COLORS.white,
        marginBottom: SPACING.md,
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
    headerBadge: {
        width: 72,
        height: 72,
        borderRadius: BORDER_RADIUS.full,
        overflow: 'hidden',
        ...ELEVATION.level3,
    },
    headerBadgeGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    headerBadgeText: {
        fontSize: 36,
    },
    listContent: {
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    cardWrapper: {
        width: CARD_WIDTH,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundSecondary,
        padding: SPACING.xl,
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
    errorIcon: {
        fontSize: 64,
        marginBottom: SPACING.md,
    },
    errorText: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.error,
        textAlign: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: SPACING.xxxl,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: SPACING.lg,
    },
    emptyTitle: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});
