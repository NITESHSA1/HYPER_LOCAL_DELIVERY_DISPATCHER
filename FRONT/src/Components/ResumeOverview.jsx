import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { commonStyles } from '../styles/common'
import api from '../store/authStore'
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  AlertTriangle,
  Users,
  ArrowLeft,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Download,
} from 'lucide-react'

function Sidebar({ activePage }) {
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/resume', label: 'Deliveries', icon: <Package className="w-5 h-5" /> },
    { path: '/scores', label: 'Performance', icon: <TrendingUp className="w-5 h-5" /> },
    { path: '/trash', label: 'Trash Bin', icon: <AlertTriangle className="w-5 h-5" /> },
    { path: '/profile', label: 'Profile', icon: <Users className="w-5 h-5" /> },
  ]
  return (
    <div className={commonStyles.sidebar.container}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <img src="/src/assets/LOGO.jpeg" alt="DispatchPro" className="w-10 h-10 rounded-lg object-cover" />
          <span className="text-xl font-bold text-white">Dispatch<span className="text-primary-400">Pro</span></span>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)} className={activePage === item.path ? commonStyles.sidebar.linkActive : commonStyles.sidebar.link}>
              {item.icon}<span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-navy-700/50">
        <div className="flex items-center gap-3 mb-4">
          <img src={user?.avatar || '/src/assets/reactcg/profile.png'} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-primary-500" onError={(e) => { e.target.src = '/src/assets/reactcg/profile.png' }} />
          <div className="overflow-hidden">
            <p className="text-white font-medium text-sm truncate">{user?.fullName || 'Admin User'}</p>
            <p className="text-slate-400 text-xs">{user?.role || 'Dispatcher'}</p>
          </div>
        </div>
        <button onClick={logout} className="w-full px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-200 text-sm font-medium">Sign Out</button>
      </div>
    </div>
  )
}

function ResumeOverview() {
  const navigate = useNavigate()
  const [deliveries, setDeliveries] = useState([])
  const [filteredDeliveries, setFilteredDeliveries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const itemsPerPage = 8

  useEffect(() => {
    fetchDeliveries()
  }, [])

  useEffect(() => {
    let filtered = deliveries
    if (searchQuery) {
      filtered = filtered.filter((d) =>
        d.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.address?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((d) => d.status === statusFilter)
    }
    setFilteredDeliveries(filtered)
    setCurrentPage(1)
  }, [searchQuery, statusFilter, deliveries])

  const fetchDeliveries = async () => {
    try {
      const response = await api.get('/resume/all')
      if (response.data?.deliveries) {
        setDeliveries(response.data.deliveries)
      } else {
        setDeliveries(getMockDeliveries())
      }
    } catch {
      setDeliveries(getMockDeliveries())
    }
  }

  const getMockDeliveries = () => [
    { id: 'DLV-8921', customer: 'Sarah Johnson', phone: '+1 (555) 101-2020', address: '123 Main Street, Downtown, CA 90210', status: 'delivered', driver: 'Mike Richardson', driverPhone: '+1 (555) 303-4040', time: '5 min ago', createdAt: '2025-01-15T08:30:00', deliveredAt: '2025-01-15T08:55:00', amount: '$24.50', items: 3, zone: 'Downtown', notes: 'Leave at front door' },
    { id: 'DLV-8920', customer: 'Robert Chen', phone: '+1 (555) 102-2021', address: '456 Oak Avenue, Midtown, CA 90211', status: 'in_transit', driver: 'Lisa Kim', driverPhone: '+1 (555) 304-4041', time: '12 min ago', createdAt: '2025-01-15T08:45:00', amount: '$18.75', items: 2, zone: 'Midtown', notes: 'Call upon arrival' },
    { id: 'DLV-8919', customer: 'Emily Davis', phone: '+1 (555) 103-2022', address: '789 Pine Road, Uptown, CA 90212', status: 'pending', driver: 'Unassigned', driverPhone: '-', time: '18 min ago', createdAt: '2025-01-15T09:00:00', amount: '$32.00', items: 5, zone: 'Uptown', notes: 'Fragile items' },
    { id: 'DLV-8918', customer: 'James Wilson', phone: '+1 (555) 104-2023', address: '321 Elm Street, Westside, CA 90213', status: 'delivered', driver: 'Tom Harris', driverPhone: '+1 (555) 305-4042', time: '22 min ago', createdAt: '2025-01-15T08:15:00', deliveredAt: '2025-01-15T08:42:00', amount: '$15.25', items: 1, zone: 'Westside', notes: '' },
    { id: 'DLV-8917', customer: 'Maria Garcia', phone: '+1 (555) 105-2024', address: '654 Maple Drive, Eastside, CA 90214', status: 'in_transit', driver: 'Anna Brown', driverPhone: '+1 (555) 306-4043', time: '31 min ago', createdAt: '2025-01-15T08:50:00', amount: '$28.50', items: 4, zone: 'Eastside', notes: 'Ring doorbell twice' },
    { id: 'DLV-8916', customer: 'David Lee', phone: '+1 (555) 106-2025', address: '987 Cedar Lane, Northside, CA 90215', status: 'cancelled', driver: '-', driverPhone: '-', time: '45 min ago', createdAt: '2025-01-15T08:00:00', cancelledAt: '2025-01-15T08:10:00', amount: '$21.00', items: 2, zone: 'Northside', notes: 'Customer cancelled' },
    { id: 'DLV-8915', customer: 'Jessica Taylor', phone: '+1 (555) 107-2026', address: '147 Birch Blvd, Downtown, CA 90210', status: 'delivered', driver: 'Mike Richardson', driverPhone: '+1 (555) 303-4040', time: '52 min ago', createdAt: '2025-01-15T07:45:00', deliveredAt: '2025-01-15T08:20:00', amount: '$45.00', items: 7, zone: 'Downtown', notes: 'Office delivery' },
    { id: 'DLV-8914', customer: 'Andrew Martinez', phone: '+1 (555) 108-2027', address: '258 Spruce Street, Midtown, CA 90211', status: 'pending', driver: 'Unassigned', driverPhone: '-', time: '1 hour ago', createdAt: '2025-01-15T09:15:00', amount: '$12.50', items: 1, zone: 'Midtown', notes: 'Express delivery' },
    { id: 'DLV-8913', customer: 'Olivia Anderson', phone: '+1 (555) 109-2028', address: '369 Willow Way, Uptown, CA 90212', status: 'in_transit', driver: 'Lisa Kim', driverPhone: '+1 (555) 304-4041', time: '1.2 hours ago', createdAt: '2025-01-15T08:20:00', amount: '$38.75', items: 6, zone: 'Uptown', notes: '' },
    { id: 'DLV-8912', customer: 'Daniel Thomas', phone: '+1 (555) 110-2029', address: '741 Ash Avenue, Westside, CA 90213', status: 'delivered', driver: 'Tom Harris', driverPhone: '+1 (555) 305-4042', time: '1.5 hours ago', createdAt: '2025-01-15T07:30:00', deliveredAt: '2025-01-15T08:05:00', amount: '$19.99', items: 2, zone: 'Westside', notes: 'Gate code: 1234' },
    { id: 'DLV-8911', customer: 'Sophia Jackson', phone: '+1 (555) 111-2030', address: '852 Poplar Place, Eastside, CA 90214', status: 'delivered', driver: 'Anna Brown', driverPhone: '+1 (555) 306-4043', time: '2 hours ago', createdAt: '2025-01-15T07:00:00', deliveredAt: '2025-01-15T07:35:00', amount: '$55.00', items: 8, zone: 'Eastside', notes: '' },
    { id: 'DLV-8910', customer: 'William White', phone: '+1 (555) 112-2031', address: '963 Hickory Hill, Northside, CA 90215', status: 'cancelled', driver: '-', driverPhone: '-', time: '2.5 hours ago', createdAt: '2025-01-15T06:45:00', cancelledAt: '2025-01-15T07:00:00', amount: '$8.50', items: 1, zone: 'Northside', notes: 'Address not found' },
  ]

  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage)
  const paginated = filteredDeliveries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusBadge = (status) => {
    const styles = { delivered: commonStyles.badge.success, in_transit: commonStyles.badge.info, pending: commonStyles.badge.warning, cancelled: commonStyles.badge.danger }
    const labels = { delivered: 'Delivered', in_transit: 'In Transit', pending: 'Pending', cancelled: 'Cancelled' }
    return <span className={styles[status]}>{labels[status]}</span>
  }

  const getStatusIcon = (status) => {
    const icons = { delivered: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, in_transit: <Truck className="w-5 h-5 text-sky-500" />, pending: <Clock className="w-5 h-5 text-amber-500" />, cancelled: <XCircle className="w-5 h-5 text-red-500" /> }
    return icons[status]
  }

  const statusCounts = {
    all: deliveries.length,
    delivered: deliveries.filter((d) => d.status === 'delivered').length,
    in_transit: deliveries.filter((d) => d.status === 'in_transit').length,
    pending: deliveries.filter((d) => d.status === 'pending').length,
    cancelled: deliveries.filter((d) => d.status === 'cancelled').length,
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage="/resume" />
      <div className="flex-1 ml-72">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-navy-900">Delivery Overview</h1>
              <p className="text-sm text-slate-500">Manage and track all your deliveries in one place</p>
            </div>
          </div>
          <button onClick={fetchDeliveries} className="p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
            <RefreshCw className="w-5 h-5" />
          </button>
        </header>

        <div className="p-8">
          {/* Status Filter Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { key: 'all', label: 'All Deliveries', count: statusCounts.all, color: 'bg-navy-600 text-white' },
              { key: 'delivered', label: 'Delivered', count: statusCounts.delivered, color: 'bg-emerald-500 text-white' },
              { key: 'in_transit', label: 'In Transit', count: statusCounts.in_transit, color: 'bg-sky-500 text-white' },
              { key: 'pending', label: 'Pending', count: statusCounts.pending, color: 'bg-amber-500 text-white' },
              { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled, color: 'bg-red-500 text-white' },
            ].map((s) => (
              <button key={s.key} onClick={() => setStatusFilter(s.key)} className={`p-4 rounded-xl text-left transition-all duration-200 ${statusFilter === s.key ? s.color + ' shadow-lg scale-105' : 'bg-white card-shadow hover:shadow-lg'}`}>
                <p className={`text-2xl font-bold ${statusFilter === s.key ? 'text-white' : 'text-navy-900'}`}>{s.count}</p>
                <p className={`text-sm ${statusFilter === s.key ? 'text-white/80' : 'text-slate-500'}`}>{s.label}</p>
              </button>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by ID, customer, or address..." className={commonStyles.input + ' pl-12'} />
            </div>
            <button className={commonStyles.button.outline + ' flex items-center gap-2'}>
              <Filter className="w-4 h-4" /> More Filters
            </button>
            <button className={commonStyles.button.outline + ' flex items-center gap-2'}>
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          {/* Deliveries Table */}
          <div className={commonStyles.table.container}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Delivery ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-navy-900">#{delivery.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-navy-800">{delivery.customer}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" />{delivery.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" />{delivery.address}</div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(delivery.status)}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">{delivery.driver}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-navy-900">{delivery.amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">{delivery.time}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => { setSelectedDelivery(delivery); setShowDetail(true) }} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {paginated.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No deliveries found</p>
                <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-slate-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredDeliveries.length)} of {filteredDeliveries.length} deliveries
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${currentPage === page ? 'bg-primary-500 text-white' : 'border border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedDelivery.status)}
                <div>
                  <h3 className="text-lg font-bold text-navy-900">Delivery #{selectedDelivery.id}</h3>
                  {getStatusBadge(selectedDelivery.status)}
                </div>
              </div>
              <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm text-slate-500 mb-1">Customer</p>
                <p className="font-semibold text-navy-900">{selectedDelivery.customer}</p>
                <p className="text-sm text-slate-600 flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selectedDelivery.phone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Delivery Address</p>
                <p className="text-sm text-slate-700 flex items-start gap-1"><MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />{selectedDelivery.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Driver</p>
                  <p className="text-sm font-medium text-navy-800">{selectedDelivery.driver}</p>
                  {selectedDelivery.driverPhone !== '-' && <p className="text-xs text-slate-500">{selectedDelivery.driverPhone}</p>}
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Zone</p>
                  <p className="text-sm font-medium text-navy-800">{selectedDelivery.zone}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">Items</p>
                  <p className="text-lg font-bold text-navy-900">{selectedDelivery.items}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">Amount</p>
                  <p className="text-lg font-bold text-navy-900">{selectedDelivery.amount}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">Zone</p>
                  <p className="text-lg font-bold text-navy-900">{selectedDelivery.zone?.slice(0, 4)}</p>
                </div>
              </div>
              {selectedDelivery.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-amber-800 mb-1">Notes</p>
                  <p className="text-sm text-amber-700">{selectedDelivery.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeOverview
