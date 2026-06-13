# Hyper Local Delivery Dispatcher

A modern, full-featured hyper-local delivery dispatch platform built with React, Vite, and Tailwind CSS.

## Features

- **Landing Page**: Beautiful hero section with animated features and statistics
- **Authentication**: Sign In and Sign Up with multi-step form
- **Dashboard**: Real-time analytics with Chart.js graphs and KPI cards
- **Delivery Management**: Full delivery overview with search, filter, and pagination
- **Performance Score**: Visual score meter with driver rankings
- **Trash Bin**: Soft-deleted items with restore and permanent delete
- **Profile Management**: Edit profile with avatar upload support

## Tech Stack

- React 19
- Vite 6
- Tailwind CSS 3.4
- Zustand (state management)
- Axios (HTTP client)
- Chart.js + react-chartjs-2 (analytics)
- Lucide React (icons)
- React Router DOM (routing)

## Project Structure

```
Frontend/
├── src/
│   ├── Components/
│   │   ├── AdminProfile.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── ResumeOverview.jsx
│   │   ├── ScoreMeter.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   └── TrashBin.jsx
│   ├── assets/
│   │   ├── LOGO.jpeg
│   │   ├── hero.png
│   │   ├── reactcg/
│   │   │   └── profile.png
│   │   └── vite.svg
│   ├── store/
│   │   └── authStore.js
│   ├── styles/
│   │   └── common.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── README.md
```

## Quick Start

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 3. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with features, stats, CTA |
| `/signin` | SignIn | Login form |
| `/signup` | SignUp | Multi-step registration form |
| `/dashboard` | Dashboard | Analytics dashboard with charts |
| `/profile` | AdminProfile | User profile management |
| `/resume` | ResumeOverview | Delivery list with filters |
| `/scores` | ScoreMeter | Performance metrics |
| `/trash` | TrashBin | Deleted deliveries |

## Backend Integration

The frontend connects to the backend API at `http://localhost:5000`. Make sure the backend server is running before using authenticated features.

### Environment Variables

Create a `.env` file in the Frontend directory if you need to override the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

## Authentication

The app uses JWT tokens stored in localStorage. The `authStore.js` handles:
- User registration with avatar upload
- Login/logout
- Profile fetching and updates
- Authenticated API requests with interceptors
