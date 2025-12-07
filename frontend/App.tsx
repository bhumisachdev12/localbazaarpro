import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { useDispatch } from 'react-redux';
import { loadUser } from './src/store/slices/authSlice';
import { loadFavorites } from './src/store/slices/favoriteSlice';
import { loadCart } from './src/store/slices/cartSlice';

function AppContent() {
    const dispatch = useDispatch();

    useEffect(() => {
        // Load user, favorites, and cart from storage on app start
        dispatch(loadUser() as any);
        dispatch(loadFavorites() as any);
        dispatch(loadCart() as any);
    }, [dispatch]);

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <AppNavigator />
                <StatusBar style="auto" />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}
