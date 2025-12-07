import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { COLORS, BORDER_RADIUS, SHADOWS, ELEVATION } from '../theme/colors';

interface CardProps {
    children: ReactNode;
    elevation?: 'level0' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'level6';
    padding?: number;
    margin?: number;
    borderRadius?: number;
    backgroundColor?: string;
    onPress?: () => void;
    style?: ViewStyle;
}

export default function Card({
    children,
    elevation = 'level2',
    padding = 16,
    margin = 0,
    borderRadius = BORDER_RADIUS.md,
    backgroundColor = COLORS.card,
    onPress,
    style,
}: CardProps) {
    const cardStyle: ViewStyle = {
        backgroundColor,
        borderRadius,
        padding,
        margin,
        ...ELEVATION[elevation],
        ...style,
    };

    if (onPress) {
        return (
            <Pressable
                style={({ pressed }) => [
                    cardStyle,
                    pressed && styles.pressed,
                ]}
                onPress={onPress}
            >
                {children}
            </Pressable>
        );
    }

    return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
});
