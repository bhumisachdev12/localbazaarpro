import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { COLORS } from '../theme/colors';

// Import screens (we'll create these)
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/search/SearchScreen';
import CreateProductScreen from '../screens/product/CreateProductScreen';
import EditProductScreen from '../screens/product/EditProductScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import CartScreen from '../screens/cart/CartScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import MyListingsScreen from '../screens/profile/MyListingsScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
function AuthStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

// Main Tab Navigator
function MainTabs() {
    const { user } = useSelector((state: RootState) => state.auth);
    const isAdmin = user?.isAdmin || false;

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray400,
                tabBarStyle: {
                    backgroundColor: COLORS.background,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    paddingBottom: 10,
                    paddingTop: 10,
                    height: 70,
                    elevation: 24,
                    shadowColor: COLORS.primary,
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '700',
                    marginTop: 4,
                    letterSpacing: 0.3,
                },
                tabBarIconStyle: {
                    marginTop: 4,
                },
                headerShown: false, // Remove header completely for clean dark look
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'LocalBazaar Pro',
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🔍</Text>,
                }}
            />
            <Tab.Screen
                name="Create"
                component={CreateProductScreen}
                options={{
                    tabBarLabel: 'Sell',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>➕</Text>,
                }}
            />
            <Tab.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{
                    title: 'Wishlist',
                    tabBarLabel: 'Wishlist',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>❤️</Text>,
                }}
            />
            <Tab.Screen
                name="Orders"
                component={OrdersScreen}
                options={{
                    tabBarLabel: 'Orders',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📋</Text>,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
                }}
            />
            {isAdmin && (
                <Tab.Screen
                    name="Admin"
                    component={AdminDashboardScreen}
                    options={{
                        title: 'Admin Dashboard',
                        tabBarLabel: 'Admin',
                        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚙️</Text>,
                    }}
                />
            )}
        </Tab.Navigator>
    );
}

// Main App Navigator
export default function AppNavigator() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Debug: Log authentication state changes
    React.useEffect(() => {
        console.log('🔍 AppNavigator - isAuthenticated:', isAuthenticated);
    }, [isAuthenticated]);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: COLORS.white,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            {!isAuthenticated ? (
                <Stack.Screen
                    name="Auth"
                    component={AuthStack}
                    options={{ headerShown: false }}
                />
            ) : (
                <>
                    <Stack.Screen
                        name="MainTabs"
                        component={MainTabs}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ProductDetail"
                        component={ProductDetailScreen}
                        options={{
                            title: 'Product Details',
                            headerBackTitleVisible: false,
                        }}
                    />
                    <Stack.Screen
                        name="EditProduct"
                        component={EditProductScreen}
                        options={{
                            title: 'Edit Product',
                            headerBackTitleVisible: false,
                        }}
                    />
                    <Stack.Screen
                        name="Cart"
                        component={CartScreen}
                        options={{
                            title: 'Shopping Cart',
                            headerBackTitleVisible: false,
                        }}
                    />
                    <Stack.Screen
                        name="MyListings"
                        component={MyListingsScreen}
                        options={{
                            title: 'My Listings',
                            headerBackTitleVisible: false,
                        }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}
