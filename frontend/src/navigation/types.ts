export type RootStackParamList = {
    // Auth Stack
    Login: undefined;
    Register: undefined;

    // Main App
    MainTabs: undefined;

    // Product Stack
    ProductDetail: { productId: string };
    CreateProduct: { productId?: string };

    // Order Stack
    OrderDetail: { orderId: string };

    // Profile Stack
    MyListings: undefined;
    EditProfile: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Search: undefined;
    Create: undefined;
    Orders: undefined;
    Profile: undefined;
};
