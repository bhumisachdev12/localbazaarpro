import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../theme/colors';
import { CATEGORIES, CONDITIONS } from '../../constants/categories';
import { createProduct } from '../../services/productService';
import { uploadMultipleImages } from '../../services/uploadService';

export default function CreateProductScreen({ navigation }: any) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const pickImages = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please grant camera roll permissions to upload images.'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsMultipleSelection: true,
                quality: 0.8,
                selectionLimit: 5 - images.length,
            });

            if (!result.canceled && result.assets) {
                const newImages = result.assets.map((asset) => asset.uri);
                setImages([...images, ...newImages].slice(0, 5));
            }
        } catch (error) {
            console.error('Error picking images:', error);
            Alert.alert('Error', 'Failed to pick images');
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors: any = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        } else if (title.length > 100) {
            newErrors.title = 'Title must be less than 100 characters';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        } else if (description.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        if (!price.trim()) {
            newErrors.price = 'Price is required';
        } else if (isNaN(Number(price)) || Number(price) <= 0) {
            newErrors.price = 'Please enter a valid price';
        }

        if (!category) {
            newErrors.category = 'Please select a category';
        }

        if (!condition) {
            newErrors.condition = 'Please select a condition';
        }

        if (images.length === 0) {
            newErrors.images = 'Please add at least one image';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);

            // Upload images
            const uploadedImageUrls = await uploadMultipleImages(images);

            // Create product
            const productData = {
                title: title.trim(),
                description: description.trim(),
                price: Number(price),
                category,
                condition,
                images: uploadedImageUrls,
            };

            await createProduct(productData);

            Alert.alert('Success', 'Your product has been listed!', [
                {
                    text: 'View Listing',
                    onPress: () => {
                        // Navigate to Home tab to see the new listing
                        navigation.navigate('MainTabs', { screen: 'Home' });
                    },
                },
            ]);
        } catch (error: any) {
            console.error('Error creating product:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to create product. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                {/* Images Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        Product Images <Text style={styles.required}>*</Text>
                    </Text>
                    <Text style={styles.hint}>Add up to 5 images</Text>

                    <View style={styles.imagesContainer}>
                        {images.map((image, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri: image }} style={styles.image} />
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeImage(index)}
                                >
                                    <Text style={styles.removeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        {images.length < 5 && (
                            <TouchableOpacity
                                style={styles.addImageButton}
                                onPress={pickImages}
                            >
                                <Text style={styles.addImageIcon}>📷</Text>
                                <Text style={styles.addImageText}>Add Photo</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
                </View>

                {/* Title */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        Title <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={[styles.input, errors.title && styles.inputError]}
                        placeholder="e.g., Engineering Mathematics Textbook"
                        placeholderTextColor={COLORS.textTertiary}
                        value={title}
                        onChangeText={setTitle}
                        maxLength={100}
                    />
                    <Text style={styles.charCount}>{title.length}/100</Text>
                    {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        Description <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={[styles.textArea, errors.description && styles.inputError]}
                        placeholder="Describe your item..."
                        placeholderTextColor={COLORS.textTertiary}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        maxLength={500}
                    />
                    <Text style={styles.charCount}>{description.length}/500</Text>
                    {errors.description && (
                        <Text style={styles.errorText}>{errors.description}</Text>
                    )}
                </View>

                {/* Price */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        Price (₹) <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={[styles.input, errors.price && styles.inputError]}
                        placeholder="0"
                        placeholderTextColor={COLORS.textTertiary}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                    />
                    {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
                </View>

                {/* Category */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        Category <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.chipContainer}>
                        {CATEGORIES.filter((cat) => cat.id !== 'all').map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.chip,
                                    category === cat.id && styles.chipSelected,
                                ]}
                                onPress={() => setCategory(cat.id)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        category === cat.id && styles.chipTextSelected,
                                    ]}
                                >
                                    {cat.icon} {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
                </View>

                {/* Condition */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        Condition <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.chipContainer}>
                        {CONDITIONS.map((cond) => (
                            <TouchableOpacity
                                key={cond.id}
                                style={[
                                    styles.chip,
                                    condition === cond.id && styles.chipSelected,
                                ]}
                                onPress={() => setCondition(cond.id)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        condition === cond.id && styles.chipTextSelected,
                                    ]}
                                >
                                    {cond.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.condition && <Text style={styles.errorText}>{errors.condition}</Text>}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.submitButtonText}>Create Listing</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundSecondary,
    },
    content: {
        padding: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    required: {
        color: COLORS.error,
    },
    hint: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    input: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
    },
    textArea: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    inputError: {
        borderColor: COLORS.error,
    },
    charCount: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        textAlign: 'right',
        marginTop: 4,
    },
    errorText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.error,
        marginTop: 4,
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    imageWrapper: {
        position: 'relative',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.gray100,
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: COLORS.error,
        borderRadius: BORDER_RADIUS.full,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: 'bold',
    },
    addImageButton: {
        width: 100,
        height: 100,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.gray50,
    },
    addImageIcon: {
        fontSize: FONT_SIZES.xxl,
        marginBottom: 4,
    },
    addImageText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
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
    },
    chipText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
    },
    chipTextSelected: {
        color: COLORS.white,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        marginTop: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
    },
});
