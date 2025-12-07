import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme/colors';

interface ImageCarouselProps {
    images: string[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ImageCarousel({ images }: ImageCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / SCREEN_WIDTH);
        setActiveIndex(index);
    };

    if (!images || images.length === 0) {
        return (
            <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>No images available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {images.map((image, index) => (
                    <Image
                        key={index}
                        source={{ uri: image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ))}
            </ScrollView>
            {images.length > 1 && (
                <View style={styles.pagination}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === activeIndex && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: 300,
        backgroundColor: COLORS.gray100,
    },
    image: {
        width: SCREEN_WIDTH,
        height: 300,
    },
    placeholderContainer: {
        width: SCREEN_WIDTH,
        height: 300,
        backgroundColor: COLORS.gray100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: SPACING.md,
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.white,
        opacity: 0.5,
        marginHorizontal: 4,
    },
    activeDot: {
        opacity: 1,
        backgroundColor: COLORS.primary,
    },
});
