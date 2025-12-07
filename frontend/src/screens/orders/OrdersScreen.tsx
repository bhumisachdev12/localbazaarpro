import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, ELEVATION, GRADIENTS } from '../../theme/colors';
import { getBuyerOrders, getSellerOrders, updateOrderStatus } from '../../services/orderService';
import { ORDER_STATUS } from '../../constants/categories';

type TabType = 'buying' | 'selling';

export default function OrdersScreen() {
    const [activeTab, setActiveTab] = useState<TabType>('buying');
    const [buyerOrders, setBuyerOrders] = useState<any[]>([]);
    const [sellerOrders, setSellerOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const [buyerResponse, sellerResponse] = await Promise.all([
                getBuyerOrders(),
                getSellerOrders(),
            ]);
            const buyer = buyerResponse?.data?.orders || buyerResponse?.orders || [];
            const seller = sellerResponse?.data?.orders || sellerResponse?.orders || [];
            setBuyerOrders(buyer);
            setSellerOrders(seller);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setBuyerOrders([]);
            setSellerOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };

    const handleUpdateOrderStatus = async (orderId: string, status: string) => {
        try {
            setUpdatingOrderId(orderId);
            await updateOrderStatus(orderId, status);

            // Update local state
            setSellerOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId || order.id === orderId
                        ? { ...order, status }
                        : order
                )
            );

            Alert.alert('Success', `Order ${status}`);
        } catch (error: any) {
            console.error('Error updating order:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to update order status'
            );
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case ORDER_STATUS.ACCEPTED:
                return COLORS.success;
            case ORDER_STATUS.REJECTED:
                return COLORS.error;
            case ORDER_STATUS.COMPLETED:
                return COLORS.primary;
            case ORDER_STATUS.CANCELLED:
                return COLORS.gray400;
            default:
                return COLORS.warning;
        }
    };

    const renderBuyerOrder = ({ item }: any) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Image
                    source={{ uri: item.product?.images?.[0] || 'https://via.placeholder.com/80' }}
                    style={styles.productImage}
                />
                <View style={styles.orderInfo}>
                    <Text style={styles.productTitle} numberOfLines={2}>
                        {item.product?.title || 'Product'}
                    </Text>
                    <Text style={styles.productPrice}>₹{item.product?.price || 0}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Seller:</Text>
                    <Text style={styles.detailValue}>{item.seller?.name || 'Unknown'}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Campus:</Text>
                    <Text style={styles.detailValue}>{item.seller?.campus || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderSellerOrder = ({ item }: any) => {
        const orderId = item._id || item.id;
        const isUpdating = updatingOrderId === orderId;
        const isPending = item.status === ORDER_STATUS.PENDING;

        return (
            <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <Image
                        source={{ uri: item.product?.images?.[0] || 'https://via.placeholder.com/80' }}
                        style={styles.productImage}
                    />
                    <View style={styles.orderInfo}>
                        <Text style={styles.productTitle} numberOfLines={2}>
                            {item.product?.title || 'Product'}
                        </Text>
                        <Text style={styles.productPrice}>₹{item.product?.price || 0}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                            <Text style={styles.statusText}>{item.status}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.orderDetails}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Buyer:</Text>
                        <Text style={styles.detailValue}>{item.buyer?.name || 'Unknown'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Contact:</Text>
                        <Text style={styles.detailValue}>{item.buyer?.email || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date:</Text>
                        <Text style={styles.detailValue}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                    {item.message && (
                        <View style={styles.messageContainer}>
                            <Text style={styles.messageLabel}>Message:</Text>
                            <Text style={styles.messageText}>{item.message}</Text>
                        </View>
                    )}
                </View>

                {isPending && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.rejectButton]}
                            onPress={() => handleUpdateOrderStatus(orderId, ORDER_STATUS.REJECTED)}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <ActivityIndicator size="small" color={COLORS.white} />
                            ) : (
                                <Text style={styles.actionButtonText}>Reject</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.acceptButton]}
                            onPress={() => handleUpdateOrderStatus(orderId, ORDER_STATUS.ACCEPTED)}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <ActivityIndicator size="small" color={COLORS.white} />
                            ) : (
                                <Text style={styles.actionButtonText}>Accept</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    const currentOrders = activeTab === 'buying' ? buyerOrders : sellerOrders;

    return (
        <View style={styles.container}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={GRADIENTS.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>My Orders</Text>
                    <Text style={styles.headerSubtitle}>
                        📦 Track your buying and selling activity
                    </Text>
                </View>
                
                {/* Tabs inside gradient */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'buying' && styles.activeTab]}
                        onPress={() => setActiveTab('buying')}
                    >
                        <Text style={[styles.tabText, activeTab === 'buying' && styles.activeTabText]}>
                            🛒 Buying
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'selling' && styles.activeTab]}
                        onPress={() => setActiveTab('selling')}
                    >
                        <Text style={[styles.tabText, activeTab === 'selling' && styles.activeTabText]}>
                            💼 Selling
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Orders List */}
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={currentOrders}
                    renderItem={activeTab === 'buying' ? renderBuyerOrder : renderSellerOrder}
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
                            <Text style={styles.emptyIcon}>
                                {activeTab === 'buying' ? '🛒' : '💼'}
                            </Text>
                            <Text style={styles.emptyTitle}>No orders yet</Text>
                            <Text style={styles.emptyText}>
                                {activeTab === 'buying'
                                    ? 'Start browsing products to make your first inquiry'
                                    : 'Orders from buyers will appear here'}
                            </Text>
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
        backgroundColor: COLORS.background,
    },
    headerGradient: {
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xxxl,
        paddingBottom: SPACING.md,
        borderBottomLeftRadius: BORDER_RADIUS.xxxl,
        borderBottomRightRadius: BORDER_RADIUS.xxxl,
        ...ELEVATION.level4,
    },
    headerContent: {
        marginBottom: SPACING.lg,
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
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xs,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.lg,
    },
    activeTab: {
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    tabText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.white,
        fontWeight: '600',
        opacity: 0.7,
    },
    activeTabText: {
        opacity: 1,
        fontWeight: '800',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: SPACING.md,
        paddingTop: SPACING.lg,
    },
    orderCard: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        ...ELEVATION.level2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    orderHeader: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.gray200,
        marginRight: SPACING.md,
    },
    orderInfo: {
        flex: 1,
    },
    productTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    productPrice: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.sm,
    },
    statusText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.xs,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    orderDetails: {
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: SPACING.sm,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xs,
    },
    detailLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    detailValue: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    messageContainer: {
        marginTop: SPACING.sm,
        padding: SPACING.sm,
        backgroundColor: COLORS.backgroundTertiary,
        borderRadius: BORDER_RADIUS.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    messageLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    messageText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: SPACING.md,
        gap: SPACING.sm,
    },
    actionButton: {
        flex: 1,
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    rejectButton: {
        backgroundColor: COLORS.error,
    },
    acceptButton: {
        backgroundColor: COLORS.success,
    },
    actionButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
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
    },
});
