import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Layouts
import MainLayout from './components/layouts/MainLayout.jsx';
import AdminLayout from './components/layouts/AdminLayout.jsx';
import RiderLayout from './components/layouts/RiderLayout.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

// Customer Pages
import Home from './pages/customer/Home.jsx';
import Products from './pages/customer/Products.jsx';
import ProductDetail from './pages/customer/ProductDetail.jsx';
import Cart from './pages/customer/Cart.jsx';
import Checkout from './pages/customer/Checkout.jsx';
import Orders from './pages/customer/Orders.jsx';
import OrderDetail from './pages/customer/OrderDetail.jsx';
import Profile from './pages/customer/Profile.jsx';

// Rider Pages
import RiderDashboard from './pages/rider/RiderDashboard.jsx';
import RiderDeliveries from './pages/rider/RiderDeliveries.jsx';
import RiderEarnings from './pages/rider/RiderEarnings.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageProducts from './pages/admin/ManageProducts.jsx';
import ManageOrders from './pages/admin/ManageOrders.jsx';
import ManageDispatches from './pages/admin/ManageDispatches.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';

// Shared
import NotFound from './pages/NotFound.jsx';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route 
          path="checkout" 
          element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="orders" 
          element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}>
              <Orders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="orders/:id" 
          element={
            <ProtectedRoute allowedRoles={['customer', 'admin', 'rider']}>
              <OrderDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Rider Routes */}
      <Route 
        path="/rider" 
        element={
          <ProtectedRoute allowedRoles={['rider']}>
            <RiderLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RiderDashboard />} />
        <Route path="deliveries" element={<RiderDeliveries />} />
        <Route path="earnings" element={<RiderEarnings />} />
      </Route>

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="dispatches" element={<ManageDispatches />} />
        <Route path="users" element={<ManageUsers />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;