import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import {
  Package,
  MapPin,
  Clock,
  Check,
  X,
  Filter,
  ChevronDown,
  Truck,
  Star,
  Navigation
} from 'lucide-react';

const RiderDeliveries = () => {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const statusOptions = [
    { value: 'all', label: 'All Deliveries' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const statusColors = {
    assigned: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    picked_up: 'bg-purple-100 text-purple-800',
    in_transit: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    failed: 'bg-red-100 text-red-800'
  };

  const statusActions = {
    assigned: { next: 'accepted', label: 'Accept', color: 'btn-primary' },
    accepted: { next: 'picked_up', label: 'Picked Up', color: 'btn-success' },
    picked_up: { next: 'in_transit', label: 'Start Delivery', color: 'btn-primary' },
    in_transit: { next: 'delivered', label: 'Delivered', color: 'btn-success' }
  };

  useEffect(() => {
    fetchDispatches();
  }, [statusFilter, page]);

  const fetchDispatches = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('page', page.toString());
      params.append('limit', '10');

      const response = await api.get(`/dispatch/my-dispatches?${params.toString()}`);
      if (response.data.success) {
        setDispatches(response.data.dispatches);
        setPagination({
          page: response.data.page,
          pages: response.data.pages,
          total: response.data.total
        });
      }
    } catch (error) {
      console.error('Error fetching dispatches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (dispatchId, status) => {
    try {
      const response = await api.put(`/dispatch/${dispatchId}/status`, { status });
      if (response.data.success) {
        fetchDispatches();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Deliveries</h1>
          <p className="text-gray-500 mt-1">Manage and track your deliveries</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="input w-44"
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
      ) : dispatches.length === 0 ? (
        <div className="card p-12 text-center">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No deliveries found</h2>
          <p className="text-gray-500">
            {statusFilter !== 'all' ? `No ${statusFilter} deliveries.` : 'You don\'t have any deliveries yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {dispatches.map((dispatch) => (
              <div key={dispatch._id} className="card p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">Order #{dispatch.order?.orderNumber}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[dispatch.status]}`}>
                        {dispatch.status?.replace('_', ' ')?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Assigned: {formatDate(dispatch.assignedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">₹{dispatch.riderEarning || 0}</p>
                    <p className="text-xs text-gray-500">Your earning</p>
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Pickup</p>
                      <p className="text-sm text-gray-900">{dispatch.pickupAddress?.street}</p>
                      <p className="text-sm text-gray-600">{dispatch.pickupAddress?.city}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Navigation className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Delivery</p>
                      <p className="text-sm text-gray-900">{dispatch.deliveryAddress?.street}</p>
                      <p className="text-sm text-gray-600">{dispatch.deliveryAddress?.city}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                {dispatch.order?.user && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{dispatch.order.user.name}</p>
                      <p className="text-sm text-gray-500">{dispatch.order.user.phone}</p>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  {dispatch.acceptedAt && (
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4" /> Accepted: {formatDate(dispatch.acceptedAt)}
                    </span>
                  )}
                  {dispatch.pickedUpAt && (
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" /> Picked Up: {formatDate(dispatch.pickedUpAt)}
                    </span>
                  )}
                  {dispatch.deliveredAt && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" /> Delivered: {formatDate(dispatch.deliveredAt)}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                {statusActions[dispatch.status] && (
                  <button
                    onClick={() => handleStatusUpdate(dispatch._id, statusActions[dispatch.status].next)}
                    className={`w-full ${statusActions[dispatch.status].color} py-2.5`}
                  >
                    <Check className="w-5 h-5 mr-2" />
                    {statusActions[dispatch.status].label}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium ${
                    page === i + 1 ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RiderDeliveries;