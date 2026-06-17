import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';
import {
  ShoppingCart,
  DollarSign,
  Users,
  Truck,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalUsers: 0,
    totalRiders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    activeDeliveries: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders stats
      const ordersRes = await api.get('/orders/admin/all?limit=5');
      if (ordersRes.data.success) {
        setRecentOrders(ordersRes.data.orders || []);
        setStatusCounts(ordersRes.data.statusCounts || {});
        setStats(prev => ({
          ...prev,
          totalRevenue: ordersRes.data.summary?.totalRevenue || 0,
          totalOrders: ordersRes.data.summary?.totalOrders || 0,
          avgOrderValue: Math.round(ordersRes.data.summary?.avgOrderValue || 0)
        }));
      }

      // Fetch users
      const usersRes = await api.get('/auth/users');
      if (usersRes.data.success) {
        const users = usersRes.data.users || [];
        setStats(prev => ({
          ...prev,
          totalUsers: users.length,
          totalRiders: users.filter(u => u.role === 'rider').length
        }));
      }

      // Fetch products
      const productsRes = await api.get('/products?limit=1');
      if (productsRes.data.success) {
        setStats(prev => ({
          ...prev,
          totalProducts: productsRes.data.total || 0
        }));
      }

      // Fetch dispatches
      const dispatchRes = await api.get('/dispatch?limit=1');
      if (dispatchRes.data.success) {
        setStats(prev => ({
          ...prev,
          activeDeliveries: dispatchRes.data.total || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-50 text-green-600', trend: '+12%' },
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingCart, color: 'bg-blue-50 text-blue-600', trend: '+8%' },
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'bg-purple-50 text-purple-600', trend: '+15%' },
    { label: 'Active Riders', value: stats.totalRiders.toLocaleString(), icon: Truck, color: 'bg-orange-50 text-orange-600', trend: '+5%' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-blue-100 text-blue-800',
    dispatched: 'bg-blue-100 text-blue-800',
    picked_up: 'bg-orange-100 text-orange-800',
    in_transit: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your delivery business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              <p className="text-sm text-gray-500">Products</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₹{stats.avgOrderValue}</p>
              <p className="text-sm text-gray-500">Avg Order Value</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeDeliveries}</p>
              <p className="text-sm text-gray-500">Active Deliveries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status Distribution</h2>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24 capitalize">{status.replace('_', ' ')}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      status === 'delivered' ? 'bg-green-500' :
                      status === 'cancelled' ? 'bg-red-500' :
                      status === 'pending' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${(count / stats.totalOrders) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700">
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.user?.name} • {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                  <p className="text-sm font-medium mt-1">₹{order.totalAmount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;