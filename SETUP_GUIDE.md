# LocalBazaar Pro - Setup Guide

Complete step-by-step guide to set up and run the LocalBazaar Pro application.

---

## Prerequisites

### Required Software
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Expo CLI** - Install globally: `npm install -g expo-cli`

### Required Accounts
- **Firebase** - [Create Account](https://firebase.google.com/)
- **Cloudinary** - [Create Account](https://cloudinary.com/)
- **Expo** - [Create Account](https://expo.dev/)

---

## Part 1: Backend Setup

### Step 1: Clone Repository
```bash
cd ~/Desktop
git clone <repository-url>
cd localbazaar_pro/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
# Windows: Start MongoDB service from Services

# Verify MongoDB is running
mongosh
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Whitelist your IP address

### Step 4: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Email/Password**
4. Go to **Project Settings** → **Service Accounts**
5. Click **Generate New Private Key**
6. Save the JSON file

### Step 5: Cloudinary Setup

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Note your:
   - Cloud Name
   - API Key
   - API Secret
3. Create upload preset:
   - Settings → Upload → Add upload preset
   - Name: `localbazaar_preset`
   - Signing Mode: Unsigned

### Step 6: Environment Configuration

Create `.env` file in `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/localbazaar_pro
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/localbazaar_pro

# Firebase Configuration (from downloaded JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Expo Push Notification (optional for now)
EXPO_ACCESS_TOKEN=your-expo-token
```

### Step 7: Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📍 Environment: development
```

### Step 8: Test Backend

Open browser or use curl:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "environment": "development"
}
```

---

## Part 2: Frontend Setup

### Step 1: Navigate to Frontend

```bash
cd ../frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Firebase Configuration

Edit `src/config/firebase.ts`:

1. Go to Firebase Console → Project Settings → General
2. Scroll to "Your apps" → Add app → Web
3. Copy configuration

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxx"
};
```

### Step 4: API Configuration

Edit `src/config/constants.ts`:

```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api'  // For local development
  : 'https://your-production-api.com/api';

export const CLOUDINARY_CLOUD_NAME = 'your-cloud-name';
export const CLOUDINARY_UPLOAD_PRESET = 'localbazaar_preset';
```

**Important for Android Emulator:**
If using Android emulator, use `http://10.0.2.2:5000/api` instead of `localhost`

**Important for Physical Device:**
Use your computer's local IP address (e.g., `http://192.168.1.100:5000/api`)

### Step 5: Start Frontend

```bash
npm start
```

This will open Expo Dev Tools in your browser.

### Step 6: Run on Device/Emulator

**Option A: Physical Device**
1. Install Expo Go app from App Store/Play Store
2. Scan QR code from terminal
3. App will load on your device

**Option B: iOS Simulator (macOS only)**
```bash
npm run ios
```

**Option C: Android Emulator**
```bash
npm run android
```

**Option D: Web Browser**
```bash
npm run web
```

---

## Part 3: Testing the Application

### Create Test User

1. Open the app
2. Click "Register"
3. Fill in details:
   - Email: test@example.com
   - Password: test123
   - Name: Test User
   - Campus: Main Campus
4. Click Register

### Create Test Product

1. After login, go to "Sell" tab
2. Fill in product details:
   - Title: Test iPhone
   - Description: Test product
   - Price: 500
   - Category: Electronics
   - Condition: Like New
3. Add images (use camera or gallery)
4. Click "Create Listing"

### Test Search

1. Go to "Search" tab
2. Try searching for "iPhone"
3. Apply filters (category, price range)
4. View product details

### Test Orders

1. View a product (not your own)
2. Click "Contact Seller"
3. Send inquiry
4. Check "Orders" tab

---

## Part 4: Development Tools

### Backend Development

**Watch mode (auto-restart on changes):**
```bash
cd backend
npm run dev
```

**View MongoDB data:**
```bash
mongosh
use localbazaar_pro
db.users.find().pretty()
db.products.find().pretty()
```

**Test API endpoints:**
Use Postman or curl:
```bash
# Health check
curl http://localhost:5000/health

# Get products
curl http://localhost:5000/api/products
```

### Frontend Development

**Clear cache:**
```bash
expo start -c
```

**View logs:**
- Press `j` to open debugger
- Use React Native Debugger
- Check Expo Dev Tools in browser

**TypeScript checking:**
```bash
npx tsc --noEmit
```

---

## Part 5: Troubleshooting

### Backend Issues

**MongoDB connection error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Start MongoDB service
```bash
sudo systemctl start mongod
```

**Firebase authentication error:**
```
Error: Firebase Admin initialization error
```
Solution: Check `.env` file, ensure FIREBASE_PRIVATE_KEY is properly formatted with `\n`

**Port already in use:**
```
Error: listen EADDRINUSE: address already in use :::5000
```
Solution: Kill process or change PORT in `.env`
```bash
lsof -ti:5000 | xargs kill -9
```

### Frontend Issues

**Cannot connect to backend:**
- Check backend is running
- Verify API_BASE_URL in constants.ts
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For physical device, use computer's local IP

**Expo Go not loading:**
- Ensure phone and computer are on same WiFi
- Try tunnel mode: `expo start --tunnel`
- Clear Expo cache: `expo start -c`

**Firebase auth not working:**
- Check firebase.ts configuration
- Verify Firebase project has Email/Password enabled
- Check Firebase API key restrictions

**Image upload failing:**
- Verify Cloudinary credentials
- Check upload preset is unsigned
- Ensure network connection

---

## Part 6: Production Deployment

### Backend Deployment (Heroku Example)

```bash
cd backend

# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create localbazaar-api

# Set environment variables
heroku config:set MONGODB_URI=<your-atlas-uri>
heroku config:set FIREBASE_PROJECT_ID=<your-project-id>
# ... set all other env vars

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Frontend Deployment (Expo EAS)

```bash
cd frontend

# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## Part 7: Maintenance

### Database Backup

```bash
# Backup
mongodump --db localbazaar_pro --out ./backup

# Restore
mongorestore --db localbazaar_pro ./backup/localbazaar_pro
```

### Update Dependencies

```bash
# Backend
cd backend
npm update
npm audit fix

# Frontend
cd frontend
npm update
expo upgrade
```

### Monitor Logs

```bash
# Backend logs
tail -f logs/app.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

---

## Part 8: Next Steps

1. **Add More Features:**
   - Implement favorites/saved items
   - Add user ratings and reviews
   - Implement chat functionality
   - Add analytics dashboard

2. **Improve Performance:**
   - Add Redis caching
   - Implement CDN for images
   - Optimize database queries
   - Add rate limiting

3. **Enhance Security:**
   - Add input sanitization
   - Implement CSRF protection
   - Add API rate limiting
   - Enable HTTPS

4. **Testing:**
   - Write unit tests
   - Add integration tests
   - Perform load testing
   - Security audit

---

## Support

For issues and questions:
- Check documentation in `docs/` folder
- Review API documentation
- Check GitHub issues
- Contact: bhumi.sachdev@example.com

---

**Happy Coding! 🚀**
