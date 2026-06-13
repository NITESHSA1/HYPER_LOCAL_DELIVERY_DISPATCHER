import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { commonStyles } from '../styles/common'
import api from '../store/authStore'
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  MapPin,
  ArrowRight,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import { Chart as ChartJS, ArcElement, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Doughnut, Line, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

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
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={activePage === item.path ? commonStyles.sidebar.linkActive : commonStyles.sidebar.link}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-navy-700/50">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={user?.avatar || '/src/assets/reactcg/profile.png'}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
            onError={(e) => { e.target.src = '/src/assets/reactcg/profile.png' }}
          />
          <div className="overflow-hidden">
            <p className="text-white font-medium text-sm truncate">{user?.fullName || 'Admin User'}</p>
            <p className="text-slate-400 text-xs">{user?.role || 'Dispatcher'}</p>
          </div>
        </div>
        <button onClick={logout} className="w-full px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-200 text-sm font-medium">
          Sign Out
        </button>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, changeType, icon, color }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    sky: 'bg-sky-50 text-sky-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className={commonStyles.card + ' animate-fade-in'}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${changeType === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
            {changeType === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {change}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-navy-900 mb-1">{value}</h3>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalDeliveries: 12847,
    activeDeliveries: 234,
    completedToday: 856,
    cancelledToday: 12,
    pendingDeliveries: 89,
    totalDrivers: 156,
    avgDeliveryTime: '28 min',
    onTimeRate: '96.8%',
  })
  const [recentDeliveries, setRecentDeliveries] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/stats')
      if (response.data) {
        setStats(response.data)
      }
    } catch (error) {
      console.log('Using default stats')
    }
    try {
      const res = await api.get('/resume/recent')
      if (res.data?.deliveries) {
        setRecentDeliveries(res.data.deliveries)
      }
    } catch (error) {
      setRecentDeliveries(getMockDeliveries())
    }
    setLoading(false)
  }

  const getMockDeliveries = () => [
    { id: '#DLV-8921', customer: 'Sarah Johnson', address: '123 Main St, Downtown', status: 'delivered', driver: 'Mike R.', time: '5 min ago', amount: '$24.50' },
    { id: '#DLV-8920', customer: 'Robert Chen', address: '456 Oak Ave, Midtown', status: 'in_transit', driver: 'Lisa K.', time: '12 min ago', amount: '$18.75' },
    { id: '#DLV-8919', customer: 'Emily Davis', address: '789 Pine Rd, Uptown', status: 'pending', driver: 'Unassigned', time: '18 min ago', amount: '$32.00' },
    { id: '#DLV-8918', customer: 'James Wilson', address: '321 Elm St, Westside', status: 'delivered', driver: 'Tom H.', time: '22 min ago', amount: '$15.25' },
    { id: '#DLV-8917', customer: 'Maria Garcia', address: '654 Maple Dr, Eastside', status: 'in_transit', driver: 'Anna B.', time: '31 min ago', amount: '$28.50' },
    { id: '#DLV-8916', customer: 'David Lee', address: '987 Cedar Ln, Northside', status: 'cancelled', driver: '-', time: '45 min ago', amount: '$21.00' },
  ]

  const doughnutData = {
    labels: ['Delivered', 'In Transit', 'Pending', 'Cancelled'],
    datasets: [{
      data: [stats.completedToday, stats.activeDeliveries, stats.pendingDeliveries, stats.cancelledToday],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
      borderWidth: 0,
    }],
  }

  const lineData = {
    labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'],
    datasets: [
      {
        label: 'Deliveries',
        data: [45, 120, 280, 420, 380, 290, 180, 95],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#f97316',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'Yesterday',
        data: [38, 105, 250, 390, 350, 270, 160, 85],
        borderColor: '#94a3b8',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  }

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Completed',
      data: [720, 680, 850, 790, 920, 650, 480],
      backgroundColor: '#f97316',
      borderRadius: 6,
    }],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, usePointStyle: true, font: { size: 12 } },
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 }, color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#94a3b8' } },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true, font: { size: 12 } } },
    },
  }

  const getStatusBadge = (status) => {
    const styles = {
      delivered: commonStyles.badge.success,
      in_transit: commonStyles.badge.info,
      pending: commonStyles.badge.warning,
      cancelled: commonStyles.badge.danger,
    }
    const labels = { delivered: 'Delivered', in_transit: 'In Transit', pending: 'Pending', cancelled: 'Cancelled' }
    return <span className={styles[status] || styles.pending}>{labels[status] || status}</span>
  }

  const getStatusIcon = (status) => {
    const icons = {
      delivered: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      in_transit: <Truck className="w-5 h-5 text-sky-500" />,
      pending: <Clock className="w-5 h-5 text-amber-500" />,
      cancelled: <XCircle className="w-5 h-5 text-red-500" />,
    }
    return icons[status] || icons.pending
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage="/dashboard" />
      <div className="flex-1 ml-72">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
            <p className="text-sm text-slate-500">Welcome back, {user?.fullName || 'Admin'}! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchDashboardData} className="p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Deliveries" value={stats.totalDeliveries.toLocaleString()} change="+12.5%" changeType="up" icon={<Package className="w-6 h-6" />} color="primary" />
            <StatCard title="Active Now" value={stats.activeDeliveries.toString()} change="+8.2%" changeType="up" icon={<Truck className="w-6 h-6" />} color="sky" />
            <StatCard title="Completed Today" value={stats.completedToday.toString()} change="+5.3%" changeType="up" icon={<CheckCircle2 className="w-6 h-6" />} color="emerald" />
            <StatCard title="Avg. Delivery Time" value={stats.avgDeliveryTime} change="-2.1 min" changeType="up" icon={<Clock className="w-6 h-6" />} color="amber" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className={commonStyles.card + ' lg:col-span-2'}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={commonStyles.heading.h4}>Delivery Volume</h3>
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 bg-white">
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>
              <div className="h-72">
                <Line data={lineData} options={chartOptions} />
              </div>
            </div>
            <div className={commonStyles.card}>
              <h3 className={commonStyles.heading.h4 + ' mb-6'}>Status Distribution</h3>
              <div className="h-56">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-600">On-Time Rate</span><span className="font-semibold text-emerald-600">{stats.onTimeRate}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">Total Drivers</span><span className="font-semibold text-navy-900">{stats.totalDrivers}</span></div>
              </div>
            </div>
          </div>

          {/* Weekly Performance & Recent Deliveries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={commonStyles.card}>
              <h3 className={commonStyles.heading.h4 + ' mb-6'}>Weekly Performance</h3>
              <div className="h-64">
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>

            <div className={commonStyles.card}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={commonStyles.heading.h4}>Recent Deliveries</h3>
                <button onClick={() => navigate('/resume')} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {recentDeliveries.slice(0, 5).map((delivery) => (
                  <div key={delivery.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    {getStatusIcon(delivery.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-navy-900">{delivery.id}</p>
                        {getStatusBadge(delivery.status)}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{delivery.customer} • {delivery.address}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span>{delivery.driver}</span>
                        <span>{delivery.time}</span>
                        <span className="font-medium text-navy-700">{delivery.amount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
