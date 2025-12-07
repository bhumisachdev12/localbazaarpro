import api from './api';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone?: string;
    campus: string;
}

export interface LoginData {
    email: string;
    password: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData) => {
    try {
        console.log('🔵 Starting registration for:', data.email);

        // Create Firebase user
        console.log('🔵 Creating Firebase user...');
        const userCredential = await auth.createUserWithEmailAndPassword(
            data.email,
            data.password
        );
        console.log('✅ Firebase user created:', userCredential.user?.uid);

        // Get Firebase ID token
        const idToken = await userCredential.user?.getIdToken();

        if (!idToken) throw new Error('Failed to get ID token');
        console.log('✅ Got ID token, length:', idToken.length);
        console.log('🔵 Token preview:', idToken.substring(0, 50) + '...');

        // Store token
        await AsyncStorage.setItem('authToken', idToken);

        // Register user in backend
        console.log('🔵 Registering user in backend...');
        const response = await api.post('/auth/register', {
            name: data.name,
            phone: data.phone,
            campus: data.campus,
        });
        console.log('✅ Backend registration successful');

        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));

        return response.data;
    } catch (error: any) {
        console.error('❌ Registration error:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        throw error;
    }
};

/**
 * Login user
 */
export const login = async (data: LoginData) => {
    try {
        // Sign in with Firebase
        const userCredential = await auth.signInWithEmailAndPassword(
            data.email,
            data.password
        );

        // Get Firebase ID token
        const idToken = await userCredential.user?.getIdToken();

        if (!idToken) throw new Error('Failed to get ID token');

        // Store token
        await AsyncStorage.setItem('authToken', idToken);

        // Get user from backend
        const response = await api.post('/auth/login');

        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));

        return response.data;
    } catch (error: any) {
        if (error.response?.data?.needsRegistration) {
            throw new Error('NEEDS_REGISTRATION');
        }
        throw error;
    }
};

/**
 * Logout user
 */
export const logout = async () => {
    try {
        await auth.signOut();
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
    } catch (error) {
        throw error;
    }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/me');
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (data: any) => {
    try {
        const response = await api.put('/auth/profile', data);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Refresh Firebase token
 */
export const refreshToken = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            const idToken = await user.getIdToken(true);
            await AsyncStorage.setItem('authToken', idToken);
            return idToken;
        }
        return null;
    } catch (error) {
        throw error;
    }
};
