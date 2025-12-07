# LocalBazaar Pro - Campus Marketplace

A complete React Native mobile application for campus marketplace with Node.js backend.

## 🎯 Project Overview

LocalBazaar Pro is a campus-only marketplace platform that enables students to buy and sell items within their campus community. Built with React Native (Expo) for the frontend and Node.js/Express/MongoDB for the backend.

## 📱 Features

### Core Features (Implemented)
- ✅ User authentication with Firebase
- ✅ Create, edit, delete product listings
- ✅ Image upload for listings (Cloudinary)
- ✅ Product detail page with seller info
- ✅ Advanced search with filters (category, price, condition)
- ✅ User profile with past listings
- ✅ Order/Inquiry system
- ✅ Push notifications (infrastructure ready)
- ✅ Content moderation and reporting

### Stretch Goals (Implemented)
- ✅ Wallet summary (mock data ready)
- ✅ Order history and receipts
- ✅ Advanced sorting options
- ✅ Listing moderation dashboard
- ✅ Analytics-ready architecture

## 🏗️ Project Structure

```
localbazaar_pro/
├── backend/                    # Node.js Express API
│   ├── controllers/           # Request handlers
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Auth & error handling
│   ├── utils/                # Helpers (Cloudinary, notifications)
│   ├── server.js             # Express server
│   └── package.json
│
├── frontend/                  # React Native Expo app
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── screens/          # App screens
│   │   ├── navigation/       # Navigation setup
│   │   ├── services/         # API services
│   │   ├── store/            # Redux store & slices
│   │   ├── theme/            # Colors & styles
│   │   ├── config/           # App configuration
│   │   ├── constants/        # Constants & enums
│   │   └── utils/            # Utility functions
│   ├── App.tsx               # Root component
│   ├── app.json              # Expo configuration
│   └── package.json
│
└── docs/                      # Documentation
    ├── API_DOCUMENTATION.md
    ├── DATABASE_SCHEMA.md
    ├── SETUP_GUIDE.md
    └── FEATURE_MAPPING.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Firebase account
- Cloudinary account
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
# Edit src/config/firebase.ts with your Firebase config
# Edit src/config/constants.ts with your API URL
npm start
```

## 🔑 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/localbazaar_pro
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
JWT_SECRET=your-jwt-secret
```

### Frontend
Update `src/config/firebase.ts` and `src/config/constants.ts` with your credentials.

## 📚 Tech Stack

### Frontend
- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Navigation:** React Navigation
- **HTTP Client:** Axios
- **Authentication:** Firebase Auth
- **Image Picker:** Expo Image Picker
- **Notifications:** Expo Notifications

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Firebase Admin SDK
- **Image Storage:** Cloudinary
- **Validation:** Express Validator
- **Notifications:** Expo Server SDK

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/my/listings` - Get my listings

### Orders
- `POST /api/orders` - Create order/inquiry
- `GET /api/orders/buyer` - Get buyer orders
- `GET /api/orders/seller` - Get seller orders
- `PUT /api/orders/:id/status` - Update order status

### Reports
- `POST /api/reports` - Create report
- `GET /api/reports` - Get all reports (admin)
- `PUT /api/reports/:id/status` - Update report status

## 🎨 Screens

### Authentication
- **LoginScreen** - Email/password login
- **RegisterScreen** - User registration with campus selection

### Main App
- **HomeScreen** - Product feed with pull-to-refresh
- **SearchScreen** - Search with filters
- **ProductDetailScreen** - Product details with seller info
- **CreateProductScreen** - Create/edit listing with image upload
- **OrdersScreen** - Buyer and seller inquiries
- **ProfileScreen** - User profile and settings
- **MyListingsScreen** - User's own listings

### Stretch Features
- **WalletScreen** - Wallet summary (mock)
- **FavoritesScreen** - Saved items

## 🧩 Key Components

- **ProductCard** - Reusable product card
- **FilterBar** - Category and filter selection
- **ImagePicker** - Multi-image picker
- **LoadingSpinner** - Loading indicator
- **ErrorMessage** - Error display
- **Button** - Reusable button with variants
- **Input** - Form input with validation

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend
- Deploy to Heroku, Railway, or AWS
- Set environment variables
- Connect to MongoDB Atlas

### Frontend
- Build with Expo EAS Build
- Submit to App Store / Play Store
- Or use Expo Go for testing

## 🔐 Security Features

- Firebase authentication with token verification
- Input validation on all endpoints
- Protected API routes with middleware
- Secure password handling
- CORS configuration
- Error handling without exposing internals

## 📊 Performance Optimizations

- Database indexing for fast queries
- Image optimization with Cloudinary
- Pagination for large datasets
- Lazy loading of images
- Redux state caching
- Axios request/response interceptors

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Bhumi Sachdev**
- Roll No: 240410700055
- Year & Section: 2nd year Batch A
- Project: LocalBazaar Pro - Campus Marketplace with Wallet

## 🙏 Acknowledgments

- Firebase for authentication
- Cloudinary for image storage
- Expo for React Native development
- MongoDB for database

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ for campus communities**
