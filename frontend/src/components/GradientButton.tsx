import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, BORDER_RADIUS, FONT_SIZES, SPACING } from '../theme/colors';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    gradient?: readonly [string, string, ...string[]];
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export default function GradientButton({
    title,
    onPress,
    gradient = GRADIENTS.primary,
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
}: GradientButtonProps) {
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    paddingVertical: SPACING.sm,
                    paddingHorizontal: SPACING.md,
                    fontSize: FONT_SIZES.sm,
                };
            case 'large':
                return {
                    paddingVertical: SPACING.lg,
                    paddingHorizontal: SPACING.xl,
                    fontSize: FONT_SIZES.lg,
                };
            default: // medium
                return {
                    paddingVertical: SPACING.md,
                    paddingHorizontal: SPACING.lg,
                    fontSize: FONT_SIZES.md,
                };
        }
    };

    const sizeStyles = getSizeStyles();

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
                (disabled || loading) && styles.disabled,
                style,
            ]}
        >
            <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                    styles.gradient,
                    {
                        paddingVertical: sizeStyles.paddingVertical,
                        paddingHorizontal: sizeStyles.paddingHorizontal,
                    },
                ]}
            >
                {loading ? (
                    <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                    <>
                        {icon}
                        <Text
                            style={[
                                styles.text,
                                { fontSize: sizeStyles.fontSize },
                                textStyle,
                            ]}
                        >
                            {title}
                        </Text>
                    </>
                )}
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
    },
    text: {
        color: COLORS.white,
        fontWeight: '600',
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    disabled: {
        opacity: 0.5,
    },
});
