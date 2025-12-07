import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, ELEVATION } from '../theme/colors';

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    image?: string;
    campus?: string;
    condition?: string;
    status?: string;
    onPress: () => void;
    showStatus?: boolean;
}

export default function ProductCard({
    id,
    title,
    price,
    image,
    campus,
    condition,
    status,
    onPress,
    showStatus = false,
}: ProductCardProps) {
    const getStatusColor = (status?: string): readonly [string, string] => {
        switch (status?.toLowerCase()) {
            case 'available':
                return [COLORS.success, COLORS.successLight];
            case 'sold':
                return [COLORS.error, COLORS.errorLight];
            case 'reserved':
                return [COLORS.warning, COLORS.warningLight];
            default:
                return [COLORS.gray400, COLORS.gray500];
        }
    };

    const getConditionColor = (condition?: string) => {
        switch (condition?.toLowerCase()) {
            case 'new':
            case 'like new':
                return COLORS.success;
            case 'good':
                return COLORS.info;
            case 'fair':
                return COLORS.warning;
            default:
                return COLORS.gray500;
        }
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
            onPress={onPress}
        >
            {/* Image with gradient overlay */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: image || 'https://via.placeholder.com/300' }}
                    style={styles.image}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.imageGradient}
                />

                {/* Status badge */}
                {showStatus && status && (
                    <View style={styles.statusContainer}>
                        <LinearGradient
                            colors={getStatusColor(status)}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.statusBadge}
                        >
                            <Text style={styles.statusText}>{status}</Text>
                        </LinearGradient>
                    </View>
                )}

                {/* Condition badge */}
                {condition && (
                    <View style={styles.conditionContainer}>
                        <View
                            style={[
                                styles.conditionBadge,
                                { backgroundColor: getConditionColor(condition) },
                            ]}
                        >
                            <Text style={styles.conditionText}>{condition}</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>

                <View style={styles.priceRow}>
                    <LinearGradient
                        colors={[COLORS.primary, COLORS.primaryLight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.priceGradient}
                    >
                        <Text style={styles.priceSymbol}>₹</Text>
                        <Text style={styles.price}>{price.toLocaleString()}</Text>
                    </LinearGradient>
                </View>

                {campus && (
                    <View style={styles.locationRow}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.campus} numberOfLines={1}>
                            {campus}
                        </Text>
                    </View>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        ...ELEVATION.level3,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardPressed: {
        transform: [{ scale: 0.98 }],
        ...ELEVATION.level2,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: COLORS.gray200,
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    statusContainer: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
    },
    statusBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
        ...ELEVATION.level2,
    },
    statusText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.white,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    conditionContainer: {
        position: 'absolute',
        top: SPACING.sm,
        left: SPACING.sm,
    },
    conditionBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.sm,
        ...ELEVATION.level1,
    },
    conditionText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.white,
        fontWeight: '600',
    },
    content: {
        padding: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
        minHeight: 40,
        lineHeight: 20,
    },
    priceRow: {
        marginBottom: SPACING.sm,
    },
    priceGradient: {
        flexDirection: 'row',
        alignItems: 'baseline',
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.sm,
    },
    priceSymbol: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.white,
        marginRight: 2,
    },
    price: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '800',
        color: COLORS.white,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        fontSize: FONT_SIZES.sm,
        marginRight: 4,
    },
    campus: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        flex: 1,
    },
});
