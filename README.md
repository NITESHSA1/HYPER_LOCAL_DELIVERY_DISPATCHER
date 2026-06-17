# HyperLocal Delivery Dispatcher

A complete fullstack web application for hyper-local delivery dispatch management. Built with **Node.js + Express + MongoDB** backend and **React + Vite + Tailwind CSS** frontend.

## Features

### Authentication & Authorization
- JWT-based authentication with bcrypt password hashing
- Role-based access control (Customer, Rider, Admin)
- Secure password handling with salt rounds

### Customer Features
- Browse products by category
- Search and filter products
- Add to cart with quantity management
- Apply coupon codes (WELCOME50, FREEDEL, SAVE20)
- Checkout with multiple payment methods
- Order tracking with real-time status updates
- Order history and details
- Product rating and reviews
- Profile management

### Rider Features
- Availability toggle (online/offline)
- Active delivery tracking
- Delivery status updates (Accept → Pickup → In Transit → Delivered)
- Delivery history
- Earnings tracking
- Profile with vehicle details

### Admin Features
- Dashboard with analytics
- Product management (CRUD)
- Order management with status updates
- Rider assignment to orders
- Dispatch management
- User management (activate/deactivate)
- Order status distribution

## Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **Express Rate Limit** for API protection
- **CORS** enabled

### Frontend
- **React 18** with JSX
- **Vite** build tool
- **React Router DOM** for routing
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls
- Context API for state management

## Project Structure

```
hyperlocal-delivery-app/
├── backend/                    # Node.js + Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Auth: register, login, profile
│   │   ├── productController.js # Product CRUD + reviews
│   │   ├── cartController.js   # Cart operations
│   │   ├── orderController.js  # Order management
│   │   └── dispatchController.js # Dispatch system
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification + role auth
│   │   └── errorHandler.js     # Global error handling
│   ├── models/
│   │   ├── User.js             # User schema (customer/rider/admin)
│   │   ├── Product.js          # Product schema
│   │   ├── Cart.js             # Cart schema
│   │   ├── Order.js            # Order schema
│   │   └── Dispatch.js         # Dispatch schema
│   ├── routes/
│   │   ├── auth.js             # Auth routes
│   │   ├── products.js         # Product routes
│   │   ├── cart.js             # Cart routes
│   │   ├── orders.js           # Order routes
│   │   └── dispatch.js         # Dispatch routes
│   ├── .env                    # Environment variables
│   ├── package.json            # Backend dependencies
│   ├── server.js               # Express server entry
│   └── seeder.js               # Database seeder
│
├── frontend/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api.js              # Axios config
│   │   ├── App.jsx             # Router setup
│   │   ├── main.jsx            # Entry point
│   │   ├── index.css           # Tailwind styles
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Auth state
│   │   │   └── CartContext.jsx # Cart state
│   │   ├── components/
│   │   │   └── layouts/
│   │   │       ├── MainLayout.jsx   # Customer layout
│   │   │       ├── RiderLayout.jsx  # Rider layout
│   │   │       └── AdminLayout.jsx  # Admin layout
│   │   └── pages/
│   │       ├── auth/
│   │       │   ├── Login.jsx
│   │       │   └── Register.jsx
│   │       ├── customer/
│   │       │   ├── Home.jsx
│   │       │   ├── Products.jsx
│   │       │   ├── ProductDetail.jsx
│   │       │   ├── Cart.jsx
│   │       │   ├── Checkout.jsx
│   │       │   ├── Orders.jsx
│   │       │   ├── OrderDetail.jsx
│   │       │   └── Profile.jsx
│   │       ├── rider/
│   │       │   ├── RiderDashboard.jsx
│   │       │   ├── RiderDeliveries.jsx
│   │       │   └── RiderEarnings.jsx
│   │       ├── admin/
│   │       │   ├── AdminDashboard.jsx
│   │       │   ├── ManageProducts.jsx
│   │       │   ├── ManageOrders.jsx
│   │       │   ├── ManageDispatches.jsx
│   │       │   └── ManageUsers.jsx
│   │       └── NotFound.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── package.json              # Root package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone and Install Dependencies

```bash
# Install all dependencies (backend + frontend + root)
npm run install:all

# Or install individually:
cd backend && npm install
cd ../frontend && npm install
```

### 2. Setup Environment Variables

Backend `.env` is already configured with defaults. Update if needed:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hyperlocal_delivery
JWT_SECRET=your_hyperlocal_delivery_secret_key_2024
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database (Optional - creates demo data)

```bash
cd backend
npm run seed

# Or from root:
npm run seed
```

This creates:
- **Admin**: admin@hyperlocal.com / admin123
- **Customer**: customer@hyperlocal.com / customer123
- **Rider 1**: rider1@hyperlocal.com / rider123
- **Rider 2**: rider2@hyperlocal.com / rider123
- **Rider 3**: rider3@hyperlocal.com / rider123

Plus 12 sample products across food, grocery, medicine, electronics, and clothing categories.

### 4. Start Development Servers

```bash
# Start both backend and frontend concurrently
npm run dev

# Or start individually:
npm run dev:backend   # Backend at http://localhost:5000
npm run dev:frontend  # Frontend at http://localhost:5173
```

### 5. Build for Production

```bash
# Build frontend
cd frontend && npm run build

# Or from root:
npm run build
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get profile |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/password` | Update password |
| GET | `/api/auth/riders` | Get all riders |
| GET | `/api/auth/users` | Get all users (admin) |
| PUT | `/api/auth/users/:id/status` | Toggle user status (admin) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (filter, sort, paginate) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| POST | `/api/products/:id/reviews` | Add review |
| GET | `/api/products/categories/list` | Get categories |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart/items` | Add to cart |
| PUT | `/api/cart/items/:id` | Update quantity |
| DELETE | `/api/cart/items/:id` | Remove item |
| DELETE | `/api/cart` | Clear cart |
| POST | `/api/cart/coupon` | Apply coupon |
| DELETE | `/api/cart/coupon` | Remove coupon |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get my orders |
| GET | `/api/orders/:id` | Get order details |
| PUT | `/api/orders/:id/status` | Update order status |
| POST | `/api/orders/:id/rate` | Rate order |
| GET | `/api/orders/admin/all` | Get all orders (admin) |
| PUT | `/api/orders/:id/assign` | Assign rider (admin) |

### Dispatch
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dispatch` | Get all dispatches (admin) |
| GET | `/api/dispatch/my-dispatches` | Get rider's dispatches |
| GET | `/api/dispatch/active` | Get active dispatch (rider) |
| POST | `/api/dispatch` | Create dispatch (admin) |
| PUT | `/api/dispatch/:id/status` | Update dispatch status (rider) |
| PUT | `/api/dispatch/:id/location` | Update location (rider) |
| GET | `/api/dispatch/available-riders` | Get available riders (admin) |
| PUT | `/api/dispatch/rider/availability` | Toggle availability (rider) |
| PUT | `/api/dispatch/:id/cancel` | Cancel dispatch (admin) |

## Frontend Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Home | Public |
| `/products` | Products | Public |
| `/products/:id` | Product Detail | Public |
| `/cart` | Cart | Customer |
| `/checkout` | Checkout | Customer |
| `/orders` | Orders | Customer |
| `/orders/:id` | Order Detail | Customer/Rider |
| `/profile` | Profile | All logged in |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/rider` | Rider Dashboard | Rider |
| `/rider/deliveries` | My Deliveries | Rider |
| `/rider/earnings` | Earnings | Rider |
| `/admin` | Admin Dashboard | Admin |
| `/admin/products` | Manage Products | Admin |
| `/admin/orders` | Manage Orders | Admin |
| `/admin/dispatches` | Manage Dispatches | Admin |
| `/admin/users` | Manage Users | Admin |

## Key Features Implemented

### Security
- ✅ JWT token-based authentication
- ✅ bcryptjs password hashing (12 salt rounds)
- ✅ Protected routes with role-based authorization
- ✅ Helmet security headers
- ✅ Rate limiting on API endpoints
- ✅ Input validation and error handling

### Backend Architecture
- ✅ MVC pattern (Models, Views via API, Controllers)
- ✅ Middleware for auth and error handling
- ✅ MongoDB with Mongoose ODM
- ✅ Proper HTTP status codes and error messages
- ✅ Database seeding script

### Frontend Architecture
- ✅ Responsive design (mobile-first)
- ✅ Role-based routing and navigation
- ✅ Context API for global state (Auth, Cart)
- ✅ Axios interceptors for token management
- ✅ Form validation and error handling
- ✅ Loading states and skeleton screens
- ✅ Toast notifications (using native alert for simplicity)

### Delivery Flow
1. Customer places order
2. Admin views ready orders
3. Admin assigns available rider
4. Rider gets notification (active delivery)
5. Rider updates status: Accept → Pickup → In Transit → Delivered
6. Customer tracks in real-time
7. Customer rates after delivery

## Development

```bash
# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Seed database
cd backend && node seeder.js
```

## Deployment

### Backend
- Set `MONGODB_URI` to production MongoDB
- Set `JWT_SECRET` to strong random string
- Set `NODE_ENV=production`
- Set `CLIENT_URL` to frontend URL

### Frontend
- Update `vite.config.js` proxy target if needed
- Build with `npm run build`
- Serve `dist/` folder

## License

ISC
