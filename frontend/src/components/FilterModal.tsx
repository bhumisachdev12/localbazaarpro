import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, ELEVATION, GRADIENTS } from '../theme/colors';
import { CATEGORIES, CONDITIONS, CAMPUSES } from '../constants/categories';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    initialFilters?: any;
}

export default function FilterModal({
    visible,
    onClose,
    onApply,
    initialFilters = {},
}: FilterModalProps) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialFilters.categories || []
    );
    const [selectedConditions, setSelectedConditions] = useState<string[]>(
        initialFilters.conditions || []
    );
    const [selectedCampus, setSelectedCampus] = useState<string>(
        initialFilters.campus || ''
    );
    const [minPrice, setMinPrice] = useState<string>(
        initialFilters.minPrice?.toString() || ''
    );
    const [maxPrice, setMaxPrice] = useState<string>(
        initialFilters.maxPrice?.toString() || ''
    );

    const toggleCategory = (categoryId: string) => {
        if (categoryId === 'all') {
            setSelectedCategories([]);
        } else {
            setSelectedCategories((prev) =>
                prev.includes(categoryId)
                    ? prev.filter((id) => id !== categoryId)
                    : [...prev, categoryId]
            );
        }
    };

    const toggleCondition = (conditionId: string) => {
        setSelectedConditions((prev) =>
            prev.includes(conditionId)
                ? prev.filter((id) => id !== conditionId)
                : [...prev, conditionId]
        );
    };

    const handleReset = () => {
        setSelectedCategories([]);
        setSelectedConditions([]);
        setSelectedCampus('');
        setMinPrice('');
        setMaxPrice('');
    };

    const handleApply = () => {
        const filters: any = {};
        if (selectedCategories.length > 0) {
            filters.categories = selectedCategories;
        }
        if (selectedConditions.length > 0) {
            filters.conditions = selectedConditions;
        }
        if (selectedCampus) {
            filters.campus = selectedCampus;
        }
        if (minPrice) {
            filters.minPrice = parseInt(minPrice);
        }
        if (maxPrice) {
            filters.maxPrice = parseInt(maxPrice);
        }
        onApply(filters);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <LinearGradient
                        colors={GRADIENTS.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.header}
                    >
                        <Text style={styles.title}>Filters</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButtonContainer}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                    <ScrollView style={styles.content}>
                        {/* Categories */}
                        <Text style={styles.sectionTitle}>Categories</Text>
                        <View style={styles.chipContainer}>
                            {CATEGORIES.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        styles.chip,
                                        (category.id === 'all'
                                            ? selectedCategories.length === 0
                                            : selectedCategories.includes(category.id)) &&
                                        styles.chipSelected,
                                    ]}
                                    onPress={() => toggleCategory(category.id)}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            (category.id === 'all'
                                                ? selectedCategories.length === 0
                                                : selectedCategories.includes(category.id)) &&
                                            styles.chipTextSelected,
                                        ]}
                                    >
                                        {category.icon} {category.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Conditions */}
                        <Text style={styles.sectionTitle}>Condition</Text>
                        <View style={styles.chipContainer}>
                            {CONDITIONS.map((condition) => (
                                <TouchableOpacity
                                    key={condition.id}
                                    style={[
                                        styles.chip,
                                        selectedConditions.includes(condition.id) &&
                                        styles.chipSelected,
                                    ]}
                                    onPress={() => toggleCondition(condition.id)}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            selectedConditions.includes(condition.id) &&
                                            styles.chipTextSelected,
                                        ]}
                                    >
                                        {condition.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Campus */}
                        <Text style={styles.sectionTitle}>Campus</Text>
                        <View style={styles.chipContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.chip,
                                    !selectedCampus && styles.chipSelected,
                                ]}
                                onPress={() => setSelectedCampus('')}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        !selectedCampus && styles.chipTextSelected,
                                    ]}
                                >
                                    All Campuses
                                </Text>
                            </TouchableOpacity>
                            {CAMPUSES.map((campus) => (
                                <TouchableOpacity
                                    key={campus}
                                    style={[
                                        styles.chip,
                                        selectedCampus === campus && styles.chipSelected,
                                    ]}
                                    onPress={() => setSelectedCampus(campus)}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            selectedCampus === campus &&
                                            styles.chipTextSelected,
                                        ]}
                                    >
                                        {campus}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={handleReset}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={handleApply}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={GRADIENTS.primary}
                                style={styles.applyButtonGradient}
                            >
                                <Text style={styles.applyButtonText}>Apply Filters</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: BORDER_RADIUS.xxxl,
        borderTopRightRadius: BORDER_RADIUS.xxxl,
        maxHeight: '85%',
        ...ELEVATION.level5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.lg,
        borderTopLeftRadius: BORDER_RADIUS.xxxl,
        borderTopRightRadius: BORDER_RADIUS.xxxl,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: '900',
        color: COLORS.white,
        letterSpacing: -0.5,
    },
    closeButtonContainer: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        fontSize: FONT_SIZES.xl,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    content: {
        padding: SPACING.xl,
        backgroundColor: COLORS.background,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
        letterSpacing: 0.3,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    chip: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.card,
    },
    chipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        ...ELEVATION.level2,
    },
    chipText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    chipTextSelected: {
        color: COLORS.white,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.xxl,
        gap: SPACING.md,
        backgroundColor: COLORS.backgroundTertiary,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    resetButton: {
        flex: 1,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 2,
        borderColor: COLORS.border,
        alignItems: 'center',
        backgroundColor: COLORS.card,
    },
    resetButtonText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        fontWeight: '700',
    },
    applyButton: {
        flex: 2,
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        ...ELEVATION.level3,
    },
    applyButtonGradient: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.white,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});
