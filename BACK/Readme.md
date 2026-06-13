# Hyper Local Delivery Dispatcher - Backend

A Node.js + Express + MongoDB backend for the Hyper Local Delivery Dispatcher application.

## Features

- **Authentication**: JWT-based auth with register/login
- **User Management**: Profile management with avatar uploads
- **Delivery Management**: Full CRUD for deliveries with soft delete
- **Driver Assignment**: Assign drivers to deliveries
- **Trash Bin**: Soft delete with restore functionality
- **Analytics**: Dashboard statistics and performance metrics
- **File Uploads**: Multer for local uploads + Cloudinary support

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- Cloudinary (cloud storage)
- CORS enabled

## Project Structure

```
Backend/
├── API/
│   ├── adminAPI.js       # Admin & profile routes
│   ├── commonAPI.js      # Auth routes (register/login)
│   └── resumeAPI.js      # Delivery CRUD routes
├── Models/
│   ├── ResumeSchema.js   # Delivery model
│   └── UserSchema.js     # User model
├── config/
│   ├── cloudinary.js     # Cloudinary configuration
│   └── multer.js         # File upload configuration
├── httpfiles/            # REST Client test files
│   ├── admin.http
│   ├── common.http
│   └── resume.http
├── middlewares/
│   └── verifyToken.js    # JWT auth middleware
├── uploads/              # Local upload directory
├── server.js             # Entry point
├── package.json
├── .env
└── Readme.md
```

## Quick Start

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Configure Environment

Create a `.env` file (copy from `.env.example`) and update the values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hyperlocal_delivery
JWT_SECRET=your_secret_key
```

### 3. Start MongoDB

Make sure MongoDB is running locally, or update `MONGODB_URI` to your MongoDB Atlas connection string.

### 4. Run the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`.

## API Endpoints

### Common (Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/common/register` | Register new user |
| POST | `/api/common/login` | Login user |
| GET | `/api/common/verify` | Verify JWT token |
| POST | `/api/common/forgot-password` | Request password reset |

### Admin (Profile & Users)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/profile` | Get profile |
| PUT | `/api/admin/profile` | Update profile |
| PUT | `/api/admin/change-password` | Change password |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/users/:id/status` | Toggle user status |

### Resume (Deliveries)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/create` | Create delivery |
| GET | `/api/resume/all` | List deliveries |
| GET | `/api/resume/recent` | Recent deliveries |
| GET | `/api/resume/:id` | Get single delivery |
| PUT | `/api/resume/:id` | Update delivery |
| PUT | `/api/resume/:id/assign-driver` | Assign driver |
| PUT | `/api/resume/:id/update-status` | Update status |
| PUT | `/api/resume/:id/cancel` | Cancel delivery |
| GET | `/api/resume/trash` | List trash items |
| PUT | `/api/resume/restore/:id` | Restore from trash |
| DELETE | `/api/resume/permanent/:id` | Permanent delete |
| GET | `/api/resume/stats/overview` | Stats overview |

## Testing with HTTP Files

The `httpfiles/` directory contains REST Client files for VS Code. Install the "REST Client" extension and open the `.http` files to test endpoints directly.

Don't forget to replace `YOUR_TOKEN_HERE` with an actual JWT token after logging in.
