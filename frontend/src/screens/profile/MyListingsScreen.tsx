import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../theme/colors';
import { getMyListings, deleteProduct } from '../../services/productService';
import { PRODUCT_STATUS } from '../../constants/categories';
import ProductCard from '../../components/ProductCard';
import { showConfirmation } from '../../utils/confirmation';

export default function MyListingsScreen({ navigation }: any) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<string>('all');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchListings();
    }, [filter]);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const statusFilter = filter === 'all' ? undefined : filter;
            const response = await getMyListings(statusFilter);
            console.log('My listings response:', response);
            setProducts(response.data?.products || []);
        } catch (error) {
            console.error('Error fetching listings:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchListings();
        setRefreshing(false);
    };

    const handleDelete = async (productId: string, productTitle: string) => {
        if (!productId) {
            console.error('❌ No product ID provided');
            Alert.alert('Error', 'Invalid product ID');
            return;
        }

        console.log('🗑️ Delete initiated for product:', productId);
        
        const confirmed = await showConfirmation({
            title: 'Delete Listing',
            message: `Are you sure you want to delete "${productTitle}"?\n\nThis action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            destructive: true,
        });

        if (!confirmed) {
            console.log('Delete cancelled');
            return;
        }

                        try {
                            console.log('🔵 Starting delete for:', productId);
                            setDeletingId(productId);
                            
                            const response = await deleteProduct(productId);
                            console.log('✅ Delete response:', response);
                            
                            // Remove from local state immediately
                            setProducts((prev) => {
                                const filtered = prev.filter((p) => {
                                    const id = p._id || p.id;
                                    return id !== productId;
                                });
                                console.log('📋 Products after delete:', filtered.length);
                                return filtered;
                            });
                            
                            Alert.alert(
                                'Success', 
                                'Listing deleted successfully',
                                [{ text: 'OK' }]
                            );
                        } catch (error: any) {
                            console.error('❌ Error deleting product:', error);
                            console.error('❌ Error type:', typeof error);
                            console.error('❌ Error keys:', Object.keys(error));
                            
                            let errorMessage = 'Failed to delete listing. Please try again.';

                            if (error.message) {
                                errorMessage = error.message;
                            } else if (error.response?.data?.message) {
                                errorMessage = error.response.data.message;
                            } else if (error.data?.message) {
                                errorMessage = error.data.message;
                            } else if (typeof error === 'string') {
                                errorMessage = error;
                            }

                            console.error('❌ Final error message:', errorMessage);
                            Alert.alert(
                                'Delete Failed', 
                                errorMessage,
                                [{ text: 'OK' }]
                            );
                        } finally {
                            setDeletingId(null);
                            console.log('🔵 Delete operation completed');
                        }
    };

    const renderProductItem = ({ item }: any) => {
        const productId = item._id || item.id;
        const isDeleting = deletingId === productId;

        return (
            <View style={styles.productContainer}>
                <ProductCard
                    id={productId}
                    title={item.title}
                    price={item.price}
                    image={item.images?.[0]}
                    campus={item.seller?.campus || item.campus}
                    condition={item.condition}
                    status={item.status}
                    showStatus={true}
                    onPress={() =>
                        navigation.navigate('ProductDetail', { productId })
                    }
                />
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => {
                            console.log('Edit button pressed for:', productId);
                            navigation.navigate('EditProduct', { 
                                productId,
                                product: item 
                            });
                        }}
                    >
                        <Text style={styles.actionButtonText}>✏️ Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                            styles.actionButton,
                            styles.deleteButton,
                            isDeleting && styles.actionButtonDisabled,
                        ]}
                        onPress={() => {
                            console.log('Delete button pressed for:', productId);
                            handleDelete(productId, item.title);
                        }}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <Text style={styles.actionButtonText}>🗑️ Delete</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const filters = [
        { id: 'all', label: 'All' },
        { id: PRODUCT_STATUS.AVAILABLE, label: 'Available' },
        { id: PRODUCT_STATUS.SOLD, label: 'Sold' },
        { id: PRODUCT_STATUS.RESERVED, label: 'Reserved' },
    ];

    return (
        <View style={styles.container}>
            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                {filters.map((f) => (
                    <TouchableOpacity
                        key={f.id}
                        style={[styles.filterTab, filter === f.id && styles.filterTabActive]}
                        onPress={() => setFilter(f.id)}
                    >
                        <Text
                            style={[
                                styles.filterTabText,
                                filter === f.id && styles.filterTabTextActive,
                            ]}
                        >
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Products List */}
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    style={styles.list}
                    data={products}
                    renderItem={renderProductItem}
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
                            <Text style={styles.emptyIcon}>📦</Text>
                            <Text style={styles.emptyTitle}>No listings yet</Text>
                            <Text style={styles.emptyText}>
                                Start selling by creating your first listing
                            </Text>
                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={() => navigation.navigate('Create')}
                            >
                                <Text style={styles.createButtonText}>
                                    ➕ Create Listing
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundSecondary,
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingHorizontal: SPACING.md,
    },
    filterTab: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    filterTabActive: {
        borderBottomColor: COLORS.primary,
    },
    filterTabText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    filterTabTextActive: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: SPACING.md,
    },
    productContainer: {
        marginBottom: SPACING.md,
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: SPACING.sm,
        gap: SPACING.sm,
    },
    actionButton: {
        flex: 1,
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: COLORS.primary,
    },
    deleteButton: {
        backgroundColor: COLORS.error,
    },
    actionButtonDisabled: {
        opacity: 0.6,
    },
    actionButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
        marginTop: SPACING.xxl,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: SPACING.md,
    },
    emptyTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    createButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
    },
    createButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
    },
});
