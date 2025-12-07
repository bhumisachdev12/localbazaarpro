import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, ELEVATION, GRADIENTS } from '../../theme/colors';
import { getProducts } from '../../services/productService';
import ProductCard from '../../components/ProductCard';
import FilterModal from '../../components/FilterModal';

export default function SearchScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState<any>({});

    useEffect(() => {
        // Load all products on initial mount
        fetchProducts();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            // Refresh results when returning to the screen
            fetchProducts();
        }, [searchQuery, filters])
    );

    useEffect(() => {
        // Debounce search when user types or changes filters
        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const queryFilters: any = {};

            // Add search query if present
            if (searchQuery.trim()) {
                queryFilters.search = searchQuery.trim();
            }

            // Add filters
            if (filters.categories && filters.categories.length > 0) {
                queryFilters.category = filters.categories[0];
            }
            if (filters.conditions && filters.conditions.length > 0) {
                queryFilters.condition = filters.conditions[0];
            }
            if (filters.minPrice) {
                queryFilters.minPrice = filters.minPrice;
            }
            if (filters.maxPrice) {
                queryFilters.maxPrice = filters.maxPrice;
            }
            if (filters.campus) {
                queryFilters.campus = filters.campus;
            }

            console.log('🔍 Search filters:', queryFilters);
            const response = await getProducts(queryFilters);
            console.log('✅ Search response:', response);
            
            // Extract products from response
            const productData = response.data?.products || response.data || [];
            console.log('📦 Products found:', productData.length);
            setProducts(productData);
        } catch (error) {
            console.error('❌ Error fetching products:', error);
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

    const handleApplyFilters = (newFilters: any) => {
        setFilters(newFilters);
    };

    const clearFilters = () => {
        setFilters({});
        setSearchQuery('');
    };

    const activeFilterCount = Object.keys(filters).length;

    return (
        <View style={styles.container}>
            {/* Modern Search Header with Gradient */}
            <LinearGradient
                colors={GRADIENTS.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.searchHeader}>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchIconContainer}>
                            <Text style={styles.searchIcon}>🔍</Text>
                        </View>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={COLORS.gray400}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity 
                                onPress={() => setSearchQuery('')}
                                style={styles.clearButton}
                                activeOpacity={0.7}
                            >
                                <View style={styles.clearIconContainer}>
                                    <Text style={styles.clearIcon}>✕</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setFilterModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                            style={styles.filterButtonGradient}
                        >
                            <Text style={styles.filterIcon}>⚙️</Text>
                            {activeFilterCount > 0 && (
                                <View style={styles.filterBadge}>
                                    <LinearGradient
                                        colors={GRADIENTS.accent}
                                        style={styles.filterBadgeGradient}
                                    >
                                        <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                                    </LinearGradient>
                                </View>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Results Count & Active Filters */}
            {(searchQuery || activeFilterCount > 0) && !loading && (
                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsCount}>
                        {products.length} result{products.length !== 1 ? 's' : ''} found
                    </Text>
                    {activeFilterCount > 0 && (
                        <TouchableOpacity onPress={clearFilters}>
                            <Text style={styles.clearFiltersText}>Clear All</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Results */}
            {loading && !refreshing ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={({ item }) => (
                        <ProductCard
                            id={item._id || item.id}
                            title={item.title}
                            price={item.price}
                            image={item.images?.[0]}
                            campus={item.seller?.campus || item.campus}
                            condition={item.condition}
                            onPress={() =>
                                navigation.navigate('ProductDetail', {
                                    productId: item._id || item.id,
                                })
                            }
                        />
                    )}
                    keyExtractor={(item) => item._id || item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.primary]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>🔍</Text>
                            <Text style={styles.emptyTitle}>No products found</Text>
                            <Text style={styles.emptyText}>
                                {searchQuery || activeFilterCount > 0
                                    ? 'Try adjusting your search or filters'
                                    : 'Start searching for products'}
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Filter Modal */}
            <FilterModal
                visible={filterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                onApply={handleApplyFilters}
                initialFilters={filters}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundSecondary,
    },
    headerGradient: {
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.xl,
        ...ELEVATION.level4,
    },
    searchHeader: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.xl,
        gap: SPACING.md,
        alignItems: 'center',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.xl,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        ...ELEVATION.level2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchIconContainer: {
        width: 36,
        height: 36,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.gray50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    searchIcon: {
        fontSize: FONT_SIZES.lg,
    },
    searchInput: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        paddingVertical: SPACING.sm,
        fontWeight: '500',
    },
    clearButton: {
        padding: SPACING.xs,
    },
    clearIconContainer: {
        width: 24,
        height: 24,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.gray100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearIcon: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontWeight: 'bold',
    },
    filterButton: {
        width: 52,
        height: 52,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        ...ELEVATION.level2,
    },
    filterButtonGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterIcon: {
        fontSize: FONT_SIZES.xl,
    },
    filterBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        borderRadius: BORDER_RADIUS.full,
        overflow: 'hidden',
        ...ELEVATION.level3,
    },
    filterBadgeGradient: {
        minWidth: 20,
        height: 20,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    filterBadgeText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.xs,
        fontWeight: '800',
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.card,
        marginHorizontal: SPACING.md,
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
        borderRadius: BORDER_RADIUS.lg,
        ...ELEVATION.level1,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    resultsCount: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
        fontWeight: '700',
    },
    clearFiltersText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: '700',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    listContent: {
        padding: SPACING.md,
        paddingTop: SPACING.sm,
    },
    emptyContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
        marginTop: SPACING.xxl,
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.xxl,
        marginHorizontal: SPACING.md,
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
    },
});
