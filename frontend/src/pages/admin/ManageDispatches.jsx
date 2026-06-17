import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import {
  Truck,
  MapPin,
  User,
  Clock,
  ChevronDown,
  Filter,
  X,
  Package,
  Navigation,
  AlertCircle,
  Check
} from 'lucide-react';

const ManageDispatches = () => {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All' },
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

      const response = await api.get(`/dispatch?${params.toString()}`);
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

  const handleCancelDispatch = async (dispatchId) => {
    if (!confirm('Cancel this dispatch?')) return;
    try {
      await api.put(`/dispatch/${dispatchId}/cancel`, { reason: 'Cancelled by admin' });
      fetchDispatches();
      if (showDetailModal) setShowDetailModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel dispatch');
    }
  };

  const openDetailModal = async (dispatch) => {
    try {
      const response = await api.get(`/dispatch/${dispatch._id}`);
      if (response.data.success) {
        setSelectedDispatch(response.data.dispatch);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('Error fetching dispatch details:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Dispatches</h1>
          <p className="text-gray-500 mt-1">Manage delivery dispatches</p>
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

      {/* Dispatches Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse h-12 bg-gray-200 rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Order</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Rider</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Assigned</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dispatches.map((dispatch) => (
                  <tr key={dispatch._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{dispatch.order?.orderNumber}</p>
                      <p className="text-sm text-gray-500">₹{dispatch.order?.totalAmount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{dispatch.rider?.name}</p>
                      <p className="text-xs text-gray-500">{dispatch.rider?.vehicleType?.toUpperCase()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[dispatch.status]}`}>
                        {dispatch.status?.replace('_', ' ')?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{formatDate(dispatch.assignedAt)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {dispatch.status !== 'delivered' && dispatch.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelDispatch(dispatch._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Cancel Dispatch"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openDetailModal(dispatch)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
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
      </div>

      {/* Dispatch Detail Modal */}
      {showDetailModal && selectedDispatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Dispatch Details</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Number</p>
                  <p className="font-bold">{selectedDispatch.order?.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedDispatch.status]}`}>
                    {selectedDispatch.status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Rider Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">{selectedDispatch.rider?.name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedDispatch.rider?.vehicleType?.toUpperCase()} • {selectedDispatch.rider?.phone}
                  </p>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Pickup</p>
                    <p className="text-sm text-gray-900">{selectedDispatch.pickupAddress?.street}</p>
                    <p className="text-sm text-gray-600">{selectedDispatch.pickupAddress?.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Navigation className="w-5 h-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Delivery</p>
                    <p className="text-sm text-gray-900">{selectedDispatch.deliveryAddress?.street}</p>
                    <p className="text-sm text-gray-600">{selectedDispatch.deliveryAddress?.city}</p>
                  </div>
                </div>
              </div>

              {/* Tracking History */}
              {selectedDispatch.trackingHistory?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Tracking History</h3>
                  <div className="space-y-2">
                    {selectedDispatch.trackingHistory.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Check className="w-4 h-4 text-primary-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{event.status?.replace('_', ' ')?.toUpperCase()}</p>
                          <p className="text-xs text-gray-500">{formatDate(event.timestamp)}</p>
                          {event.note && <p className="text-xs text-gray-600 mt-1">{event.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedDispatch.status !== 'delivered' && selectedDispatch.status !== 'cancelled' && (
                <button
                  onClick={() => handleCancelDispatch(selectedDispatch._id)}
                  className="w-full btn-danger py-2.5"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel Dispatch
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDispatches;