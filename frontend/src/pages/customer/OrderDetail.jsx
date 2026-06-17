import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api.js';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Star,
  Truck,
  Package,
  Clock,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const response = await api.put(`/orders/${id}/status`, {
        status: 'cancelled',
        note: 'Cancelled by customer'
      });
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    setSubmittingReview(true);
    try {
      const response = await api.post(`/orders/${id}/rate`, {
        rating,
        comment: review,
        riderRating: rating
      });
      if (response.data.success) {
        setOrder(response.data.order);
        alert('Thank you for your feedback!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Package },
    { key: 'confirmed', label: 'Confirmed', icon: Check },
    { key: 'preparing', label: 'Preparing', icon: Clock },
    { key: 'ready', label: 'Ready', icon: Package },
    { key: 'dispatched', label: 'Dispatched', icon: Truck },
    { key: 'picked_up', label: 'Picked Up', icon: Truck },
    { key: 'in_transit', label: 'In Transit', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Check }
  ];

  const getStatusIndex = (status) => {
    return statusSteps.findIndex(s => s.key === status);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="h-32 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
        <Link to="/orders" className="btn-primary mt-4">Back to Orders</Link>
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex(order.status);
  const canCancel = ['pending', 'confirmed'].includes(order.status);
  const canReview = order.status === 'delivered' && !order.rating?.value;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {order.status?.replace('_', ' ')?.toUpperCase()}
          </span>
          {canCancel && user?.role === 'customer' && (
            <button
              onClick={handleCancelOrder}
              className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      {!['cancelled', 'refunded'].includes(order.status) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 overflow-x-auto">
          <div className="flex items-start min-w-max">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              
              return (
                <div key={step.key} className="flex items-start">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-primary-600 text-white' :
                      isCurrent ? 'bg-primary-100 text-primary-600 border-2 border-primary-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs mt-2 text-center w-20 ${
                      isCompleted ? 'text-primary-600 font-medium' :
                      isCurrent ? 'text-primary-600 font-medium' :
                      'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                    {isCurrent && order.timeline?.find(t => t.status === step.key) && (
                      <span className="text-xs text-gray-500 mt-0.5">
                        {formatDate(order.timeline.find(t => t.status === step.key).timestamp)}
                      </span>
                    )}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`w-12 h-0.5 mt-5 ${
                      index < currentStatusIndex ? 'bg-primary-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order Items */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex gap-4">
                <img
                  src={item.image || '/placeholder-product.png'}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm font-medium">₹{item.price} x {item.quantity} = ₹{item.total}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            {order.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>₹{order.tax}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery & Rider Info */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold">Delivery Address</h2>
            </div>
            <div className="space-y-1">
              <p className="text-gray-900">{order.deliveryAddress?.street}</p>
              <p className="text-gray-600">
                {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
              </p>
              <p className="text-gray-600">{order.deliveryAddress?.zipCode}</p>
              <p className="text-gray-600">{order.deliveryAddress?.country}</p>
            </div>
            {order.deliveryInstructions && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Instructions: </span>
                  {order.deliveryInstructions}
                </p>
              </div>
            )}
          </div>

          {/* Rider Info */}
          {order.rider && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold">Delivery Partner</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.rider?.name}</p>
                  <p className="text-sm text-gray-500">{order.rider?.vehicleType?.toUpperCase()} - {order.rider?.vehicleNumber}</p>
                  {order.rider?.phone && (
                    <p className="text-sm text-primary-600">{order.rider?.phone}</p>
                  )}
                </div>
              </div>
              {order.rider?.rating && (
                <div className="mt-3 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">{order.rider?.rating}</span>
                  <span className="text-sm text-gray-400">({order.rider?.totalDeliveries} deliveries)</span>
                </div>
              )}
            </div>
          )}

          {/* Review Section */}
          {canReview && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Rate Your Experience</h2>
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience (optional)"
                className="input h-24 resize-none mb-4"
              />
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview || rating === 0}
                className="btn-primary w-full"
              >
                {submittingReview ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          )}

          {order.rating?.value && (
            <div className="bg-green-50 rounded-xl border border-green-200 p-6">
              <h2 className="text-lg font-semibold text-green-800 mb-2">Thank you for rating!</h2>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < order.rating.value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium text-green-800">{order.rating.value}/5</span>
              </div>
              {order.rating?.comment && (
                <p className="mt-2 text-sm text-green-700">{order.rating.comment}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;