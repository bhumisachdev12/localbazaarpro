import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../theme/colors';

export default function RegisterScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [campus, setCampus] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const handleRegister = async () => {
        if (!name || !email || !password || !campus) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            await dispatch(registerUser({
                name,
                email,
                password,
                phone,
                campus
            })).unwrap();
            // Navigation to MainTabs is handled by AppNavigator based on isAuthenticated state
        } catch (err: any) {
            // Handle specific Firebase errors
            const errorCode = err.code;
            const errorMessage = err.message || 'An error occurred';

            if (errorCode === 'auth/email-already-in-use' || errorMessage?.includes('email-already-in-use')) {
                Alert.alert(
                    'Account Already Exists',
                    'An account with this email already exists. Would you like to login instead?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        },
                        {
                            text: 'Go to Login',
                            onPress: () => navigation.navigate('Login')
                        }
                    ]
                );
            } else if (errorCode === 'auth/weak-password') {
                Alert.alert('Weak Password', 'Password should be at least 6 characters long.');
            } else if (errorCode === 'auth/invalid-email') {
                Alert.alert('Invalid Email', 'Please enter a valid email address.');
            } else {
                Alert.alert('Registration Failed', errorMessage);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join LocalBazaar Pro</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Full Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        placeholderTextColor={COLORS.textTertiary}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />

                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor={COLORS.textTertiary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Text style={styles.label}>Password *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Create a password"
                        placeholderTextColor={COLORS.textTertiary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your phone number"
                        placeholderTextColor={COLORS.textTertiary}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    <Text style={styles.label}>Campus *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., North Campus, Main Block"
                        placeholderTextColor={COLORS.textTertiary}
                        value={campus}
                        onChangeText={setCampus}
                    />

                    {error && <Text style={styles.error}>{error}</Text>}

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Creating Account...' : 'Register'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.linkText}>
                            Already have an account? <Text style={styles.linkTextBold}>Login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
        marginTop: SPACING.md,
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
    error: {
        color: COLORS.error,
        fontSize: FONT_SIZES.sm,
        marginTop: SPACING.sm,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: SPACING.lg,
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    linkText: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZES.md,
    },
    linkTextBold: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});
