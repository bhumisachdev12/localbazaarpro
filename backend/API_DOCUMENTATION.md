# LocalBazaar Pro - API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user after Firebase authentication.

**Headers:**
```json
{
  "Authorization": "Bearer <firebase_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "campus": "Main Campus"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "john@example.com",
      "name": "John Doe",
      "campus": "Main Campus",
      "phone": "1234567890",
      "profileImage": null
    }
  }
}
```

### Login User
**POST** `/auth/login`

Login and get user profile.

**Headers:**
```json
{
  "Authorization": "Bearer <firebase_token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "john@example.com",
      "name": "John Doe",
      "campus": "Main Campus",
      "totalListings": 5,
      "totalSales": 2,
      "walletBalance": 0
    }
  }
}
```

### Get Current User
**GET** `/auth/me`

Get current authenticated user profile.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "john@example.com",
      "name": "John Doe",
      "campus": "Main Campus",
      "phone": "1234567890",
      "profileImage": "https://...",
      "totalListings": 5,
      "totalSales": 2,
      "walletBalance": 0,
      "isVerified": false
    }
  }
}
```

### Update Profile
**PUT** `/auth/profile`

Update user profile information.

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "9876543210",
  "profileImage": "https://cloudinary.com/..."
}
```

---

## Product Endpoints

### Get All Products
**GET** `/products`

Get all products with optional filters.

**Query Parameters:**
- `search` (string) - Search keyword
- `category` (string) - Filter by category
- `condition` (string) - Filter by condition
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `campus` (string) - Filter by campus
- `sortBy` (string) - Sort field (default: createdAt)
- `order` (string) - Sort order: asc/desc (default: desc)
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)

**Example Request:**
```
GET /products?category=Electronics&minPrice=100&maxPrice=1000&page=1&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "product_id",
        "title": "iPhone 12",
        "description": "Excellent condition",
        "price": 500,
        "category": "Electronics",
        "condition": "Like New",
        "images": ["url1", "url2"],
        "seller": {
          "_id": "seller_id",
          "name": "John Doe",
          "email": "john@example.com",
          "campus": "Main Campus",
          "profileImage": "url"
        },
        "status": "available",
        "views": 45,
        "campus": "Main Campus",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 3,
      "limit": 20
    }
  }
}
```

### Get Product by ID
**GET** `/products/:id`

Get single product details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "product_id",
      "title": "iPhone 12",
      "description": "Excellent condition, barely used",
      "price": 500,
      "category": "Electronics",
      "condition": "Like New",
      "images": ["url1", "url2", "url3"],
      "seller": {
        "_id": "seller_id",
        "name": "John Doe",
        "email": "john@example.com",
        "campus": "Main Campus",
        "phone": "1234567890",
        "profileImage": "url",
        "totalListings": 5,
        "totalSales": 2
      },
      "status": "available",
      "views": 46,
      "campus": "Main Campus",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Create Product
**POST** `/products`

Create a new product listing.

**Request Body:**
```json
{
  "title": "iPhone 12",
  "description": "Excellent condition, barely used",
  "price": 500,
  "category": "Electronics",
  "condition": "Like New",
  "images": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ]
}
```

**Validation Rules:**
- `title`: Required, max 100 characters
- `description`: Required, max 1000 characters
- `price`: Required, must be positive number
- `category`: Required, must be valid category
- `condition`: Required, must be: New, Like New, Good, Fair
- `images`: Required, array with at least 1 image

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": { /* product object */ }
  }
}
```

### Update Product
**PUT** `/products/:id`

Update an existing product (seller only).

**Request Body:**
```json
{
  "title": "iPhone 12 Pro",
  "price": 550,
  "status": "available"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product": { /* updated product */ }
  }
}
```

### Delete Product
**DELETE** `/products/:id`

Delete a product (soft delete - marks as deleted).

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Get My Listings
**GET** `/products/my/listings`

Get current user's product listings.

**Query Parameters:**
- `status` (string) - Filter by status (default: excludes deleted)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [ /* array of products */ ]
  }
}
```

### Get User's Products
**GET** `/products/user/:userId`

Get products by specific user.

**Query Parameters:**
- `status` (string) - Filter by status

---

## Order Endpoints

### Create Order/Inquiry
**POST** `/orders`

Create a new order or inquiry for a product.

**Request Body:**
```json
{
  "productId": "product_id",
  "message": "I'm interested in this product",
  "buyerContact": {
    "phone": "1234567890",
    "email": "buyer@example.com"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Inquiry sent successfully",
  "data": {
    "order": {
      "_id": "order_id",
      "product": { /* product details */ },
      "buyer": { /* buyer details */ },
      "seller": { /* seller details */ },
      "status": "pending",
      "message": "I'm interested in this product",
      "amount": 500,
      "createdAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

### Get Buyer Orders
**GET** `/orders/buyer`

Get all orders where current user is the buyer.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [ /* array of orders */ ]
  }
}
```

### Get Seller Orders
**GET** `/orders/seller`

Get all orders where current user is the seller.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [ /* array of orders */ ]
  }
}
```

### Get Order by ID
**GET** `/orders/:id`

Get single order details (buyer or seller only).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "order": { /* order details */ }
  }
}
```

### Update Order Status
**PUT** `/orders/:id/status`

Update order status (seller only).

**Request Body:**
```json
{
  "status": "accepted",
  "sellerNotes": "Available for pickup tomorrow"
}
```

**Status Options:**
- `pending` - Initial status
- `accepted` - Seller accepted
- `rejected` - Seller rejected
- `completed` - Transaction completed
- `cancelled` - Cancelled

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": { /* updated order */ }
  }
}
```

---

## Report Endpoints

### Create Report
**POST** `/reports`

Report a product listing.

**Request Body:**
```json
{
  "productId": "product_id",
  "reason": "Spam",
  "description": "This listing is spam"
}
```

**Reason Options:**
- Spam
- Inappropriate Content
- Misleading Information
- Scam/Fraud
- Duplicate Listing
- Sold Item Still Listed
- Other

**Response (201):**
```json
{
  "success": true,
  "message": "Report submitted successfully. Our team will review it.",
  "data": {
    "report": { /* report details */ }
  }
}
```

### Get All Reports (Admin)
**GET** `/reports`

Get all reports (admin only).

**Query Parameters:**
- `status` (string) - Filter by status (default: pending)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reports": [ /* array of reports */ ]
  }
}
```

### Update Report Status (Admin)
**PUT** `/reports/:id/status`

Update report status and take action (admin only).

**Request Body:**
```json
{
  "status": "resolved",
  "reviewNotes": "Listing removed",
  "actionTaken": "listing_removed"
}
```

**Action Options:**
- `none`
- `warning`
- `listing_removed`
- `user_suspended`

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Title is required", "Price must be positive"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You are not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding rate limiting middleware.

## Pagination

All list endpoints support pagination with the following query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 8,
    "limit": 20
  }
}
```

## Categories

Valid product categories:
- Electronics
- Books
- Furniture
- Clothing
- Sports
- Stationery
- Accessories
- Other

## Conditions

Valid product conditions:
- New
- Like New
- Good
- Fair
