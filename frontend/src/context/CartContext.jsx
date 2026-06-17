import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import api from '../api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/cart');
      if (response.data.success) {
        setCart(response.data.cart);
        const count = response.data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(count);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await api.post('/cart/items', { productId, quantity });
      if (response.data.success) {
        setCart(response.data.cart);
        const count = response.data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(count);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to cart'
      };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const response = await api.put(`/cart/items/${productId}`, { quantity });
      if (response.data.success) {
        setCart(response.data.cart);
        const count = response.data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(count);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update quantity'
      };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const response = await api.delete(`/cart/items/${productId}`);
      if (response.data.success) {
        setCart(response.data.cart);
        const count = response.data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(count);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove item'
      };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      const response = await api.delete('/cart');
      if (response.data.success) {
        setCart({ items: [], totalAmount: 0, finalAmount: 0 });
        setCartCount(0);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clear cart'
      };
    }
  };

  const applyCoupon = async (couponCode) => {
    try {
      const response = await api.post('/cart/coupon', { couponCode });
      if (response.data.success) {
        setCart(response.data.cart);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid coupon code'
      };
    }
  };

  const removeCoupon = async () => {
    try {
      const response = await api.delete('/cart/coupon');
      if (response.data.success) {
        setCart(response.data.cart);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove coupon'
      };
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
