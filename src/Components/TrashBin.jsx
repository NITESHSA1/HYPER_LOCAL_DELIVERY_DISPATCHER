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
  Trash2,
  RotateCcw,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
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
          <img src="/assets/LOGO.jpeg" alt="DispatchPro" className="w-10 h-10 rounded-lg object-cover" />
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
          <img src={user?.avatar || '/assets/reactcg/profile.png'} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-primary-500" onError={(e) => { e.target.src = '/assets/reactcg/profile.png' }} />
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

function TrashBin() {
  const navigate = useNavigate()
  const [trashedItems, setTrashedItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [reasonFilter, setReasonFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const itemsPerPage = 8

  useEffect(() => {
    loadTrashData()
  }, [])

  useEffect(() => {
    let filtered = trashedItems
    if (searchQuery) {
      filtered = filtered.filter((d) =>
        d.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.customer?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (reasonFilter !== 'all') {
      filtered = filtered.filter((d) => d.cancelReason === reasonFilter)
    }
    setFilteredItems(filtered)
    setCurrentPage(1)
  }, [searchQuery, reasonFilter, trashedItems])

  const loadTrashData = async () => {
    try {
      const response = await api.get('/resume/trash')
      if (response.data?.items) {
        setTrashedItems(response.data.items)
      } else {
        setTrashedItems(getMockTrashData())
      }
    } catch {
      setTrashedItems(getMockTrashData())
    }
  }

  const getMockTrashData = () => [
    { id: 'DLV-8916', customer: 'David Lee', phone: '+1 (555) 106-2025', address: '987 Cedar Lane, Northside, CA 90215', cancelledAt: '2025-01-15T08:10:00', cancelledBy: 'Customer', cancelReason: 'customer_request', amount: '$21.00', items: 2, zone: 'Northside', notes: 'Customer changed their mind', originalStatus: 'pending' },
    { id: 'DLV-8910', customer: 'William White', phone: '+1 (555) 112-2031', address: '963 Hickory Hill, Northside, CA 90215', cancelledAt: '2025-01-15T07:00:00', cancelledBy: 'System', cancelReason: 'address_issue', amount: '$8.50', items: 1, zone: 'Northside', notes: 'Delivery address not found', originalStatus: 'pending' },
    { id: 'DLV-8905', customer: 'Jennifer Brown', phone: '+1 (555) 113-2032', address: '159 Redwood Rd, Westside, CA 90213', cancelledAt: '2025-01-14T16:30:00', cancelledBy: 'Admin', cancelReason: 'item_unavailable', amount: '$42.00', items: 4, zone: 'Westside', notes: 'Items out of stock', originalStatus: 'pending' },
    { id: 'DLV-8901', customer: 'Michael Davis', phone: '+1 (555) 114-2033', address: '357 Cypress Ct, Eastside, CA 90214', cancelledAt: '2025-01-14T12:15:00', cancelledBy: 'Customer', cancelReason: 'customer_request', amount: '$15.75', items: 1, zone: 'Eastside', notes: 'Ordered by mistake', originalStatus: 'pending' },
    { id: 'DLV-8898', customer: 'Sarah Miller', phone: '+1 (555) 115-2034', address: '753 Palm Pl, Downtown, CA 90210', cancelledAt: '2025-01-14T09:45:00', cancelledBy: 'System', cancelReason: 'delivery_failed', amount: '$33.25', items: 3, zone: 'Downtown', notes: 'Driver could not reach customer', originalStatus: 'in_transit' },
    { id: 'DLV-8892', customer: 'Chris Wilson', phone: '+1 (555) 116-2035', address: '951 Magnolia Ave, Midtown, CA 90211', cancelledAt: '2025-01-13T18:20:00', cancelledBy: 'Admin', cancelReason: 'weather_delay', amount: '$28.00', items: 2, zone: 'Midtown', notes: 'Severe weather conditions', originalStatus: 'pending' },
    { id: 'DLV-8887', customer: 'Amanda Taylor', phone: '+1 (555) 117-2036', address: '456 Oak Avenue, Midtown, CA 90211', cancelledAt: '2025-01-13T14:00:00', cancelledBy: 'Customer', cancelReason: 'customer_request', amount: '$19.50', items: 2, zone: 'Midtown', notes: 'Found alternative supplier', originalStatus: 'pending' },
    { id: 'DLV-8881', customer: 'Kevin Martinez', phone: '+1 (555) 118-2037', address: '789 Pine Road, Uptown, CA 90212', cancelledAt: '2025-01-12T11:30:00', cancelledBy: 'System', cancelReason: 'address_issue', amount: '$56.00', items: 6, zone: 'Uptown', notes: 'Incomplete address provided', originalStatus: 'pending' },
  ]

  const handleRestore = (item) => {
    setSelectedItem(item)
    setConfirmAction('restore')
    setShowConfirm(true)
  }

  const handlePermanentDelete = (item) => {
    setSelectedItem(item)
    setConfirmAction('delete')
    setShowConfirm(true)
  }

  const confirmActionHandler = async () => {
    if (confirmAction === 'restore') {
      try {
        await api.put(`/resume/restore/${selectedItem.id}`)
        setTrashedItems(trashedItems.filter((i) => i.id !== selectedItem.id))
      } catch {
        setTrashedItems(trashedItems.filter((i) => i.id !== selectedItem.id))
      }
    } else if (confirmAction === 'delete') {
      try {
        await api.delete(`/resume/permanent/${selectedItem.id}`)
        setTrashedItems(trashedItems.filter((i) => i.id !== selectedItem.id))
      } catch {
        setTrashedItems(trashedItems.filter((i) => i.id !== selectedItem.id))
      }
    }
    setShowConfirm(false)
    setSelectedItem(null)
  }

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginated = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getReasonLabel = (reason) => {
    const labels = { customer_request: 'Customer Request', address_issue: 'Address Issue', item_unavailable: 'Unavailable', delivery_failed: 'Failed', weather_delay: 'Weather', other: 'Other' }
    return labels[reason] || reason
  }

  const getReasonBadge = (reason) => {
    const styles = {
      customer_request: 'bg-slate-100 text-slate-600',
      address_issue: 'bg-amber-100 text-amber-700',
      item_unavailable: 'bg-red-100 text-red-700',
      delivery_failed: 'bg-red-100 text-red-700',
      weather_delay: 'bg-sky-100 text-sky-700',
      other: 'bg-slate-100 text-slate-500',
    }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[reason] || styles.other}`}>{getReasonLabel(reason)}</span>
  }

  const reasonCounts = {
    all: trashedItems.length,
    customer_request: trashedItems.filter((d) => d.cancelReason === 'customer_request').length,
    address_issue: trashedItems.filter((d) => d.cancelReason === 'address_issue').length,
    item_unavailable: trashedItems.filter((d) => d.cancelReason === 'item_unavailable').length,
    delivery_failed: trashedItems.filter((d) => d.cancelReason === 'delivery_failed').length,
    weather_delay: trashedItems.filter((d) => d.cancelReason === 'weather_delay').length,
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage="/trash" />
      <div className="flex-1 ml-72">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-navy-900">Trash Bin</h1>
              <p className="text-sm text-slate-500">View and manage cancelled or deleted deliveries</p>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Info Banner */}
          <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Items in trash are permanently deleted after 30 days. You can restore items before then.</p>
          </div>

          {/* Reason Filter Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {[
              { key: 'all', label: 'All Items', count: reasonCounts.all },
              { key: 'customer_request', label: 'Customer', count: reasonCounts.customer_request },
              { key: 'address_issue', label: 'Address', count: reasonCounts.address_issue },
              { key: 'item_unavailable', label: 'Unavailable', count: reasonCounts.item_unavailable },
              { key: 'delivery_failed', label: 'Failed', count: reasonCounts.delivery_failed },
              { key: 'weather_delay', label: 'Weather', count: reasonCounts.weather_delay },
            ].map((r) => (
              <button key={r.key} onClick={() => setReasonFilter(r.key)} className={`p-3 rounded-xl text-left transition-all duration-200 ${reasonFilter === r.key ? 'bg-red-500 text-white shadow-lg' : 'bg-white card-shadow hover:shadow-md'}`}>
                <p className={`text-xl font-bold ${reasonFilter === r.key ? 'text-white' : 'text-navy-900'}`}>{r.count}</p>
                <p className={`text-xs ${reasonFilter === r.key ? 'text-white/80' : 'text-slate-500'}`}>{r.label}</p>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search cancelled deliveries..." className={commonStyles.input + ' pl-12'} />
            </div>
          </div>

          {/* Trash Table */}
          <div className={commonStyles.table.container}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Delivery ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cancelled By</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-semibold text-navy-900">#{item.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-navy-800">{item.customer}</div>
                        <div className="text-xs text-slate-500">{item.address}</div>
                      </td>
                      <td className="px-6 py-4">{getReasonBadge(item.cancelReason)}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{item.cancelledBy}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">{new Date(item.cancelledAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-navy-900">{item.amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleRestore(item)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Restore">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button onClick={() => handlePermanentDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Permanently">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {paginated.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Trash bin is empty</p>
                <p className="text-sm text-slate-400">No cancelled deliveries to show</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-slate-500">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} items</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${currentPage === page ? 'bg-red-500 text-white' : 'border border-slate-200 hover:bg-slate-50 text-slate-600'}`}>{page}</button>
                ))}
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${confirmAction === 'restore' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                {confirmAction === 'restore' ? <RotateCcw className="w-6 h-6 text-emerald-600" /> : <AlertTriangle className="w-6 h-6 text-red-600" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900">{confirmAction === 'restore' ? 'Restore Delivery' : 'Delete Permanently'}</h3>
                <p className="text-sm text-slate-500">#{selectedItem?.id}</p>
              </div>
            </div>
            <p className="text-slate-600 mb-6">
              {confirmAction === 'restore'
                ? `Are you sure you want to restore delivery #${selectedItem?.id} for ${selectedItem?.customer}? This will move it back to active deliveries.`
                : `Are you sure you want to permanently delete delivery #${selectedItem?.id}? This action cannot be undone.`}
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)} className={commonStyles.button.outline}>Cancel</button>
              <button onClick={confirmActionHandler} className={confirmAction === 'restore' ? commonStyles.button.primary : commonStyles.button.danger}>
                {confirmAction === 'restore' ? 'Restore Delivery' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrashBin
