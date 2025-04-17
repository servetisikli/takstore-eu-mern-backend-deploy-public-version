# TakStore EU MERN Backend (Public Version)

## 📋 Project Overview

This is the backend API for TakStore EU, an e-commerce platform developed using the MERN stack (MongoDB, Express, React, Node.js). This backend handles user authentication, product management, order processing, and payment integration for the [takstore.eu](https://takstore.eu) online shopping website.

## 🚀 Features

- **User Management**
  - Registration with email verification
  - Authentication using JWT tokens
  - Password reset functionality
  - User profile management

- **Product Management**
  - Product listing and details
  - Category and tag filtering
  - Search functionality
  - Product reviews and ratings

- **Order System**
  - Shopping cart functionality
  - Checkout process
  - Order history and tracking
  - Payment processing with Stripe

- **Security**
  - CORS protection with allowed origin verification
  - Helmet for HTTP header security
  - JWT-based authentication
  - Password encryption

## 🛠️ Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database (with Mongoose ODM)
- **JWT**: JSON Web Tokens for authentication
- **Nodemailer**: Email sending functionality
- **Stripe**: Payment processing
- **Brevo API**: Marketing and transactional emails
- **Helmet**: Security middleware
- **CORS**: Cross-Origin Resource Sharing support

## 📦 Dependencies

```json
{
  "@getbrevo/brevo": "^1.0.1",
  "bcryptjs": "^2.4.3",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "express-async-handler": "^1.2.0",
  "helmet": "^8.0.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.9.6",
  "nodemailer": "^6.10.0",
  "stripe": "^17.6.0"
}
```

## 🗂️ Project Structure

```
takstore-eu-mern-backend-deploy-public-version/
├── config/
│   └── db.js           # Database connection configuration
├── controllers/        # Route controllers
│   ├── productController.js
│   ├── orderController.js
│   └── userController.js
├── middleware/
│   └── authMiddleware.js # Authentication middleware
├── routes/             # API routes
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── userRoutes.js
├── models/             # Database schema models
│   ├── productModel.js
│   ├── orderModel.js
│   └── userModel.js
├── .env                # Environment variables (not included in repo)
├── package.json        # Project metadata and dependencies
└── server.js          # Main application file
```

## 🔧 Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/servetisikli/takstore-eu-mern-backend-deploy-public-version.git
cd takstore-eu-mern-backend-deploy-public-version
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
NODE_ENV=production
CORS_ORIGIN_BASE=takstore.eu
EMAIL_SERVICE=your_email_service
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_email_password
BREVO_API_KEY=your_brevo_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Start the server
```bash
npm start
```

## 🌐 API Endpoints

### User Routes
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login user
- `POST /api/user/logout` - Logout user
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)
- `POST /api/user/forgot-password` - Request password reset
- `POST /api/user/reset-password` - Reset password

### Product Routes
- `GET /api/product` - Get all products
- `GET /api/product/:id` - Get single product
- `POST /api/product` - Create a product (admin)
- `PUT /api/product/:id` - Update product (admin)
- `DELETE /api/product/:id` - Delete product (admin)
- `POST /api/product/:id/reviews` - Create product review (protected)

### Order Routes
- `POST /api/order` - Create new order (protected)
- `GET /api/order/myorders` - Get logged in user orders (protected)
- `GET /api/order/:id` - Get order by ID (protected)
- `PUT /api/order/:id/pay` - Update order to paid (protected)
- `GET /api/order` - Get all orders (admin)
- `PUT /api/order/:id/deliver` - Update order to delivered (admin)

## 👨‍💻 Author

- **Servet Isikli** - [GitHub Profile](https://github.com/servetisikli)

## 📅 Last Updated

- Date: 2025-04-17
- By: servetisikli

## 🔗 Links

- [TakStore EU Website](https://takstore.eu)
- [Repository](https://github.com/servetisikli/takstore-eu-mern-backend-deploy-public-version)
