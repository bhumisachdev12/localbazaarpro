import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { logoutUser, setUser } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, ELEVATION, GRADIENTS } from '../../theme/colors';
import { showConfirmation } from '../../utils/confirmation';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentUser } from '../../services/authService';

export default function ProfileScreen({ navigation }: any) {
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Refresh user stats (listings, sales, etc.) whenever Profile gains focus
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            const refreshUser = async () => {
                try {
                    console.log('🔄 Refreshing user profile for stats...');
                    const response = await getCurrentUser();
                    const freshUser =
                        response?.data?.user ||
                        response?.user ||
                        null;

                    if (freshUser && isActive) {
                        dispatch(setUser(freshUser));
                        console.log('✅ User profile updated in store');
                    }
                } catch (error) {
                    console.error('❌ Failed to refresh user profile:', error);
                }
            };

            refreshUser();

            return () => {
                isActive = false;
            };
        }, [dispatch])
    );

    const handleLogout = async () => {
        console.log('🚪 Logout button pressed');
        const confirmed = await showConfirmation({
            title: 'Logout',
            message: 'Are you sure you want to logout?',
            confirmText: 'Logout',
            cancelText: 'Cancel',
            destructive: true,
        });

        if (!confirmed) {
            console.log('Logout cancelled');
            return;
        }

                        try {
                            console.log('🔵 Starting logout...');
                            await dispatch(logoutUser()).unwrap();
                            console.log('✅ Logout successful - user will be redirected');
                        } catch (error) {
                            console.error('❌ Logout error:', error);
                            Alert.alert('Logged Out', 'You have been logged out.');
                        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Modern Profile Header with Gradient */}
                <LinearGradient
                    colors={GRADIENTS.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.header}>
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                                style={styles.avatarGradient}
                            >
                                <Text style={styles.avatarText}>
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </Text>
                            </LinearGradient>
                        </View>
                        <Text style={styles.name}>{user?.name || 'User Name'}</Text>
                        <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
                        
                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{user?.totalListings || 0}</Text>
                                <Text style={styles.statLabel}>Listings</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{user?.totalSales || 0}</Text>
                                <Text style={styles.statLabel}>Sales</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Info</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Campus</Text>
                        <Text style={styles.infoValue}>{user?.campus || 'Not set'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Phone</Text>
                        <Text style={styles.infoValue}>{user?.phone || 'Not set'}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.menuItem,
                            pressed && styles.menuItemPressed,
                        ]}
                        onPress={() => navigation.navigate('MyListings')}
                    >
                        <Text style={styles.menuItemText}>My Listings</Text>
                        <Text style={styles.chevron}>›</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.menuItem,
                            pressed && styles.menuItemPressed,
                        ]}
                        onPress={() => navigation.navigate('Orders')}
                    >
                        <Text style={styles.menuItemText}>My Orders</Text>
                        <Text style={styles.chevron}>›</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.menuItem,
                            pressed && styles.menuItemPressed,
                        ]}
                    >
                        <Text style={styles.menuItemText}>Settings</Text>
                        <Text style={styles.chevron}>›</Text>
                    </Pressable>
                </View>
            </ScrollView>

            <View style={styles.logoutContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.logoutButton,
                        pressed && styles.logoutButtonPressed,
                    ]}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundSecondary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: SPACING.md,
    },
    headerGradient: {
        paddingTop: SPACING.xxxl,
        paddingBottom: SPACING.xxxl,
        borderBottomLeftRadius: BORDER_RADIUS.xxxl,
        borderBottomRightRadius: BORDER_RADIUS.xxxl,
        ...ELEVATION.level4,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    avatarContainer: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: SPACING.xl,
        ...ELEVATION.level4,
    },
    avatarGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    avatarText: {
        fontSize: 52,
        color: COLORS.white,
        fontWeight: '900',
    },
    name: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: '900',
        color: COLORS.white,
        marginBottom: SPACING.sm,
        letterSpacing: -0.5,
    },
    email: {
        fontSize: FONT_SIZES.md,
        color: COLORS.white,
        opacity: 0.9,
        marginBottom: SPACING.xl,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: BORDER_RADIUS.xl,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xxl,
        marginTop: SPACING.sm,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: SPACING.xs,
    },
    statLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.white,
        opacity: 0.9,
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    section: {
        backgroundColor: COLORS.card,
        marginTop: SPACING.lg,
        marginHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.xl,
        paddingVertical: SPACING.sm,
        ...ELEVATION.level2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginLeft: SPACING.lg,
        marginBottom: SPACING.sm,
        marginTop: SPACING.sm,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray100,
    },
    infoLabel: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
    },
    infoValue: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray100,
    },
    menuItemText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
    },
    chevron: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.gray400,
        fontWeight: 'bold',
    },
    logoutContainer: {
        padding: SPACING.lg,
        backgroundColor: COLORS.backgroundSecondary,
    },
    logoutButton: {
        backgroundColor: COLORS.card,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.error,
        ...ELEVATION.level2,
    },
    logoutText: {
        color: COLORS.error,
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
    },
    menuItemPressed: {
        backgroundColor: COLORS.gray100,
        opacity: 0.8,
    },
    logoutButtonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
});
