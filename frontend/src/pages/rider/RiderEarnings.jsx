import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Package,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from 'lucide-react';

const RiderEarnings = () => {
  const [earnings, setEarnings] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
    deliveriesCount: 0,
    avgPerDelivery: 0
  });
  const [recentEarnings, setRecentEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dispatch/my-dispatches?status=delivered&limit=50');
      
      if (response.data.success) {
        const dispatches = response.data.dispatches || [];
        
        const now = new Date();
        const today = now.toDateString();
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        let todayEarnings = 0;
        let weekEarnings = 0;
        let monthEarnings = 0;
        let totalEarnings = 0;

        dispatches.forEach(d => {
          const earning = d.riderEarning || 0;
          const date = new Date(d.deliveredAt);
          
          totalEarnings += earning;
          
          if (date.toDateString() === today) todayEarnings += earning;
          if (date >= weekAgo) weekEarnings += earning;
          if (date >= monthAgo) monthEarnings += earning;
        });

        setEarnings({
          today: todayEarnings,
          thisWeek: weekEarnings,
          thisMonth: monthEarnings,
          total: totalEarnings,
          deliveriesCount: dispatches.length,
          avgPerDelivery: dispatches.length > 0 ? Math.round(totalEarnings / dispatches.length) : 0
        });

        setRecentEarnings(dispatches.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-500 mt-1">Track your delivery earnings</p>
      </div>

      {/* Earnings Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Today's Earnings</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{earnings.today}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">This Week</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{earnings.thisWeek}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">This Month</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{earnings.thisMonth}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Total Earnings</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{earnings.total}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{earnings.deliveriesCount}</p>
            <p className="text-sm text-gray-500">Total Deliveries</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">₹{earnings.avgPerDelivery}</p>
            <p className="text-sm text-gray-500">Avg per Delivery</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-sm text-gray-500">Avg Rating</p>
          </div>
        </div>
      </div>

      {/* Recent Earnings Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Earnings</h2>
        </div>
        
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                <div className="flex-1 h-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : recentEarnings.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No earnings yet. Complete deliveries to start earning!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Order</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Earning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentEarnings.map((dispatch) => (
                  <tr key={dispatch._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{dispatch.order?.orderNumber}</p>
                      <p className="text-sm text-gray-500">{dispatch.deliveryAddress?.city}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{formatDate(dispatch.deliveredAt || dispatch.assignedAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        dispatch.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        dispatch.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {dispatch.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-gray-900">₹{dispatch.riderEarning || 0}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderEarnings;