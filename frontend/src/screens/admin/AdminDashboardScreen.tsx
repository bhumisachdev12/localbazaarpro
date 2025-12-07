import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../theme/colors';
import { getAdminStats, getReports, updateReportStatus } from '../../services/adminService';

export default function AdminDashboardScreen({ navigation }: any) {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [recentReports, setRecentReports] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'reports'>('overview');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsResponse, reportsResponse] = await Promise.all([
                getAdminStats(),
                getReports('pending')
            ]);

            if (statsResponse.success) {
                setStats(statsResponse.data.stats);
            }

            if (reportsResponse.success) {
                setRecentReports(reportsResponse.data.reports.slice(0, 5));
            }
        } catch (error: any) {
            console.error('Error fetching admin data:', error);
            Alert.alert('Error', error.message || 'Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const handleReportAction = async (reportId: string, action: 'resolved' | 'dismissed') => {
        try {
            const actionTaken = action === 'resolved' ? 'listing_removed' : 'none';
            await updateReportStatus(reportId, action, `Report ${action} by admin`, actionTaken);
            Alert.alert('Success', `Report ${action} successfully`);
            fetchData();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update report');
        }
    };

    const renderStatCard = (title: string, value: number, icon: string, color: string) => (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <Text style={styles.statIcon}>{icon}</Text>
            <View style={styles.statContent}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statTitle}>{title}</Text>
            </View>
        </View>
    );

    const renderReportItem = (report: any) => (
        <View key={report._id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
                <Text style={styles.reportReason}>{report.reason}</Text>
                <View style={[styles.statusBadge, styles.pendingBadge]}>
                    <Text style={styles.statusText}>Pending</Text>
                </View>
            </View>

            <Text style={styles.reportProduct} numberOfLines={1}>
                Product: {report.product?.title || 'Unknown'}
            </Text>

            <Text style={styles.reportDescription} numberOfLines={2}>
                {report.description}
            </Text>

            <View style={styles.reportFooter}>
                <Text style={styles.reportDate}>
                    {new Date(report.createdAt).toLocaleDateString()}
                </Text>
                <View style={styles.reportActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.dismissButton]}
                        onPress={() => handleReportAction(report._id, 'dismissed')}
                    >
                        <Text style={styles.dismissText}>Dismiss</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.resolveButton]}
                        onPress={() => handleReportAction(report._id, 'resolved')}
                    >
                        <Text style={styles.resolveText}>Remove Listing</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
            </View>

            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
                    onPress={() => setActiveTab('overview')}
                >
                    <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
                        Overview
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
                    onPress={() => setActiveTab('reports')}
                >
                    <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
                        Reports ({recentReports.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {activeTab === 'overview' && stats && (
                    <View style={styles.overviewTab}>
                        <Text style={styles.sectionTitle}>Platform Statistics</Text>

                        <View style={styles.statsGrid}>
                            {renderStatCard('Total Users', stats.totalUsers, '👥', COLORS.primary)}
                            {renderStatCard('Total Products', stats.totalProducts, '📦', COLORS.success)}
                            {renderStatCard('Total Orders', stats.totalOrders, '🛒', COLORS.warning)}
                            {renderStatCard('Pending Reports', stats.pendingReports, '⚠️', COLORS.error)}
                        </View>

                        <Text style={styles.sectionTitle}>Recent Activity (30 days)</Text>

                        <View style={styles.activityCard}>
                            <View style={styles.activityRow}>
                                <Text style={styles.activityLabel}>New Users</Text>
                                <Text style={styles.activityValue}>+{stats.newUsers}</Text>
                            </View>
                            <View style={styles.activityRow}>
                                <Text style={styles.activityLabel}>New Products</Text>
                                <Text style={styles.activityValue}>+{stats.newProducts}</Text>
                            </View>
                            <View style={styles.activityRow}>
                                <Text style={styles.activityLabel}>New Orders</Text>
                                <Text style={styles.activityValue}>+{stats.newOrders}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {activeTab === 'reports' && (
                    <View style={styles.reportsTab}>
                        <Text style={styles.sectionTitle}>Pending Reports</Text>

                        {recentReports.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyIcon}>✅</Text>
                                <Text style={styles.emptyText}>No pending reports</Text>
                            </View>
                        ) : (
                            recentReports.map(renderReportItem)
                        )}
                    </View>
                )}
            </ScrollView>
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
    header: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    activeTabText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    overviewTab: {
        padding: SPACING.lg,
    },
    reportsTab: {
        padding: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
        marginTop: SPACING.md,
    },
    statsGrid: {
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    statCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 4,
        ...SHADOWS.sm,
    },
    statIcon: {
        fontSize: 40,
        marginRight: SPACING.md,
    },
    statContent: {
        flex: 1,
    },
    statValue: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    statTitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    activityCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        ...SHADOWS.sm,
    },
    activityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray100,
    },
    activityLabel: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
    },
    activityValue: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.success,
    },
    reportCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
    },
    reportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    reportReason: {
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
    },
    pendingBadge: {
        backgroundColor: COLORS.warning + '20',
    },
    statusText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.warning,
    },
    reportProduct: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    reportDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    reportFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.sm,
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray100,
    },
    reportDate: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
    },
    reportActions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    actionButton: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
    },
    dismissButton: {
        backgroundColor: COLORS.gray200,
    },
    resolveButton: {
        backgroundColor: COLORS.error,
    },
    dismissText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    resolveText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.white,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: SPACING.md,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
});
