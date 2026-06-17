import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  X,
  Package,
  Truck,
  Shield
} from 'lucide-react';

const Cart = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    applyCoupon, 
    removeCoupon,
    loading 
  } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;
    const result = await updateQuantity(productId, newQty);
    if (!result.success) {
      alert(result.message);
    }
  };

  const handleRemove = async (productId) => {
    if (confirm('Remove this item from cart?')) {
      await removeFromCart(productId);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError('');
    
    const result = await applyCoupon(couponCode);
    if (!result.success) {
      setCouponError(result.message);
    }
    setApplyingCoupon(false);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setCouponCode('');
  };

  if (loading && !cart) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {cart.items.map((item, index) => (
              <div 
                key={item.product?._id || index} 
                className={`p-4 flex gap-4 ${index !== cart.items.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={item.product?.image || '/placeholder-product.png'}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/products/${item.product?._id}`}
                    className="font-semibold text-gray-900 hover:text-primary-600 truncate block"
                  >
                    {item.product?.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">{item.product?.store?.name}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.product?._id, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-50 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product?._id, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-50 disabled:opacity-50"
                        disabled={item.quantity >= (item.product?.stock || 99)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                      <p className="text-sm text-gray-500">₹{item.price} each</p>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.product?._id)}
                  className="p-2 text-gray-400 hover:text-red-500 self-start"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Clear Cart */}
          <button
            onClick={() => {
              if (confirm('Clear all items from cart?')) clearCart();
            }}
            className="mt-4 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-4">
              {cart.couponCode ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">{cart.couponCode}</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="input text-sm"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode}
                    className="btn-primary text-sm whitespace-nowrap"
                  >
                    {applyingCoupon ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-sm text-red-600 mt-1">{couponError}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Try: WELCOME50, FREEDEL, SAVE20
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({cart.items?.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium">₹{cart.totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">₹{cart.deliveryFee}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-₹{cart.discount}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-primary-600">₹{cart.finalAmount}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary py-3"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <Truck className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Fast Delivery</p>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Secure Pay</p>
              </div>
              <div className="text-center">
                <Package className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;