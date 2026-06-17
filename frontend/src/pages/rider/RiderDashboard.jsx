import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api.js';
import {
  Package,
  Clock,
  MapPin,
  Navigation,
  Check,
  Truck,
  Star,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

const RiderDashboard = () => {
  const { user, updateAvailability } = useAuth();
  const [stats, setStats] = useState({
    todayDeliveries: 0,
    totalEarnings: 0,
    rating: 0,
    activeDispatch: null
  });
  const [recentDispatches, setRecentDispatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch active dispatch
      const activeRes = await api.get('/dispatch/active');
      const activeDispatch = activeRes.data.hasActiveDispatch ? activeRes.data.dispatch : null;

      // Fetch recent dispatches
      const recentRes = await api.get('/dispatch/my-dispatches?limit=5');
      
      // Calculate stats from recent dispatches
      const dispatches = recentRes.data.dispatches || [];
      const today = new Date().toDateString();
      const todayDeliveries = dispatches.filter(d => 
        d.status === 'delivered' && new Date(d.deliveredAt).toDateString() === today
      ).length;

      const totalEarnings = dispatches.reduce((sum, d) => sum + (d.riderEarning || 0), 0);

      setStats({
        todayDeliveries,
        totalEarnings,
        rating: user?.rating || 5,
        activeDispatch
      });
      setRecentDispatches(dispatches.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (dispatchId, status) => {
    try {
      const response = await api.put(`/dispatch/${dispatchId}/status`, { status });
      if (response.data.success) {
        fetchDashboardData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const statusActions = {
    'assigned': { next: 'accepted', label: 'Accept Delivery', color: 'btn-primary' },
    'accepted': { next: 'picked_up', label: 'Picked Up', color: 'btn-success' },
    'picked_up': { next: 'in_transit', label: 'Start Delivery', color: 'btn-primary' },
    'in_transit': { next: 'delivered', label: 'Mark Delivered', color: 'btn-success' }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rider Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            user?.isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full ${user?.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {user?.isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-sm text-gray-500">Today's Deliveries</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.todayDeliveries}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Total Earnings</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Rating</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total Deliveries</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{user?.totalDeliveries || 0}</p>
        </div>
      </div>

      {/* Active Delivery */}
      {stats.activeDispatch ? (
        <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
            <h2 className="text-lg font-bold text-primary-900">Active Delivery</h2>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div>
                <p className="font-semibold text-gray-900">Order #{stats.activeDispatch.order?.orderNumber}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.activeDispatch.order?.items?.length} items • ₹{stats.activeDispatch.order?.totalAmount}
                </p>
              </div>
              <span className={`self-start px-3 py-1 rounded-full text-xs font-medium ${
                stats.activeDispatch.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                stats.activeDispatch.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                stats.activeDispatch.status === 'picked_up' ? 'bg-purple-100 text-purple-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {stats.activeDispatch.status?.replace('_', ' ')?.toUpperCase()}
              </span>
            </div>

            {/* Delivery Addresses */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Pickup</p>
                  <p className="text-sm text-gray-900">{stats.activeDispatch.pickupAddress?.street}</p>
                  <p className="text-sm text-gray-600">{stats.activeDispatch.pickupAddress?.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Navigation className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Delivery</p>
                  <p className="text-sm text-gray-900">{stats.activeDispatch.deliveryAddress?.street}</p>
                  <p className="text-sm text-gray-600">{stats.activeDispatch.deliveryAddress?.city}</p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            {stats.activeDispatch.order?.user && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{stats.activeDispatch.order.user.name}</p>
                  <p className="text-sm text-primary-600">{stats.activeDispatch.order.user.phone}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {statusActions[stats.activeDispatch.status] && (
              <button
                onClick={() => handleStatusUpdate(
                  stats.activeDispatch._id, 
                  statusActions[stats.activeDispatch.status].next
                )}
                className={`w-full ${statusActions[stats.activeDispatch.status].color} py-3`}
              >
                <Check className="w-5 h-5 mr-2" />
                {statusActions[stats.activeDispatch.status].label}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-yellow-900">No Active Delivery</h2>
              <p className="text-yellow-700 mt-1">
                You don't have any active deliveries right now. Make sure you're available to receive new assignments.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Deliveries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Deliveries</h2>
          <Link to="/rider/deliveries" className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:text-primary-700">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentDispatches.length === 0 ? (
          <div className="card p-8 text-center">
            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No delivery history yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentDispatches.map((dispatch) => (
              <div key={dispatch._id} className="card p-4 flex items-center justify-between hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    dispatch.status === 'delivered' ? 'bg-green-100' :
                    dispatch.status === 'cancelled' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    <Package className={`w-5 h-5 ${
                      dispatch.status === 'delivered' ? 'text-green-600' :
                      dispatch.status === 'cancelled' ? 'text-red-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order #{dispatch.order?.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      {dispatch.deliveryAddress?.city} • {new Date(dispatch.assignedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    dispatch.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    dispatch.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {dispatch.status?.toUpperCase()}
                  </span>
                  <p className="text-sm font-medium mt-1">₹{dispatch.riderEarning || 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;