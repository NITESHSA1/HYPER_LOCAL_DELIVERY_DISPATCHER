import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';
import {
  Package,
  Clock,
  ChevronRight,
  Filter,
  ShoppingBag
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const statusColors = {
    pending: 'badge-yellow',
    confirmed: 'badge-blue',
    preparing: 'badge-blue',
    ready: 'badge-blue',
    dispatched: 'badge-blue',
    picked_up: 'badge-yellow',
    in_transit: 'badge-yellow',
    delivered: 'badge-green',
    cancelled: 'badge-red',
    refunded: 'badge-gray'
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await api.get(`/orders${params}`);
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">Track and manage your orders</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-48"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6">
            {statusFilter !== 'all' ? `No ${statusFilter} orders found.` : 'You haven\'t placed any orders yet.'}
          </p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="card hover:shadow-md transition-all p-6 block"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                    <span className={`badge ${statusColors[order.status] || 'badge-gray'}`}>
                      {order.status?.replace('_', ' ')?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                  
                  {/* Items summary */}
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-600">
                      {order.items?.map(i => i.name).join(', ').substring(0, 50)}...
                    </span>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
                    <p className="text-xs text-gray-500">{order.paymentMethod?.toUpperCase()}</p>
                  </div>
                  
                  {/* Timeline preview */}
                  <div className="hidden md:flex items-center gap-1">
                    {order.timeline?.slice(-3).map((event, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          idx === order.timeline.length - 1 ? 'bg-primary-500' : 'bg-gray-300'
                        }`} />
                        {idx < 2 && <div className="w-6 h-0.5 bg-gray-200" />}
                      </div>
                    ))}
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;