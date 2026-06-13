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
  Award,
  Zap,
  Target,
  Clock,
  Star,
  TrendingDown,
  CheckCircle2,
  Truck,
  MapPin,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

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

function ScoreMeter() {
  const navigate = useNavigate()
  const [performanceData, setPerformanceData] = useState({
    overallScore: 94,
    deliveryScore: 96,
    speedScore: 88,
    accuracyScore: 97,
    customerScore: 95,
    totalDeliveries: 12847,
    onTimeDeliveries: 12432,
    avgDeliveryTime: 28,
    customerRating: 4.8,
    activeDrivers: 156,
    topPerformers: [
      { name: 'Mike Richardson', deliveries: 342, rating: 4.9, onTime: 98.5, avatar: '/assets/reactcg/profile.png' },
      { name: 'Lisa Kim', deliveries: 318, rating: 4.8, onTime: 97.2, avatar: '/assets/reactcg/profile.png' },
      { name: 'Tom Harris', deliveries: 295, rating: 4.9, onTime: 99.1, avatar: '/assets/reactcg/profile.png' },
      { name: 'Anna Brown', deliveries: 287, rating: 4.7, onTime: 96.8, avatar: '/assets/reactcg/profile.png' },
      { name: 'John Smith', deliveries: 276, rating: 4.8, onTime: 97.5, avatar: '/assets/reactcg/profile.png' },
    ],
  })

  const overallScoreConfig = {
    datasets: [{
      data: [performanceData.overallScore, 100 - performanceData.overallScore],
      backgroundColor: ['#f97316', '#f1f5f9'],
      borderWidth: 0,
      cutout: '85%',
      circumference: 360,
    }],
  }

  const scoreBreakdown = {
    labels: ['Delivery', 'Speed', 'Accuracy', 'Customer'],
    datasets: [{
      data: [performanceData.deliveryScore, performanceData.speedScore, performanceData.accuracyScore, performanceData.customerScore],
      backgroundColor: ['#f97316', '#3b82f6', '#10b981', '#f59e0b'],
      borderRadius: 8,
      barThickness: 40,
    }],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 }, color: '#94a3b8', callback: (v) => v + '%' } },
      x: { grid: { display: false }, ticks: { font: { size: 12 }, color: '#64748b' } },
    },
  }

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-emerald-600'
    if (score >= 85) return 'text-primary-600'
    if (score >= 70) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBg = (score) => {
    if (score >= 95) return 'bg-emerald-50'
    if (score >= 85) return 'bg-primary-50'
    if (score >= 70) return 'bg-amber-50'
    return 'bg-red-50'
  }

  const metrics = [
    { label: 'On-Time Rate', value: `${((performanceData.onTimeDeliveries / performanceData.totalDeliveries) * 100).toFixed(1)}%`, icon: <Clock className="w-6 h-6" />, score: 96.8, color: 'emerald' },
    { label: 'Avg Delivery', value: `${performanceData.avgDeliveryTime} min`, icon: <Zap className="w-6 h-6" />, score: 88, color: 'primary' },
    { label: 'Customer Rating', value: `${performanceData.customerRating}/5`, icon: <Star className="w-6 h-6" />, score: 95, color: 'amber' },
    { label: 'Active Drivers', value: performanceData.activeDrivers.toString(), icon: <Truck className="w-6 h-6" />, score: 92, color: 'sky' },
  ]

  const weeklyScores = [
    { day: 'Mon', score: 92, deliveries: 720 },
    { day: 'Tue', score: 89, deliveries: 680 },
    { day: 'Wed', score: 94, deliveries: 850 },
    { day: 'Thu', score: 91, deliveries: 790 },
    { day: 'Fri', score: 96, deliveries: 920 },
    { day: 'Sat', score: 88, deliveries: 650 },
    { day: 'Sun', score: 85, deliveries: 480 },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage="/scores" />
      <div className="flex-1 ml-72">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-navy-900">Performance Score</h1>
              <p className="text-sm text-slate-500">Track your delivery performance metrics and driver rankings</p>
            </div>
          </div>
          <button className="p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
            <RefreshCw className="w-5 h-5" />
          </button>
        </header>

        <div className="p-8">
          {/* Overall Score & Key Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Overall Score Circle */}
            <div className={commonStyles.card + ' flex flex-col items-center justify-center'}>
              <h3 className="text-lg font-bold text-navy-900 mb-4">Overall Score</h3>
              <div className="relative w-40 h-40">
                <Doughnut data={overallScoreConfig} options={{ responsive: true, maintainAspectRatio: false, cutout: '85%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-navy-900">{performanceData.overallScore}</span>
                  <span className="text-sm text-slate-500">/ 100</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +3.2% from last week
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="lg:col-span-3 grid grid-cols-2 gap-4">
              {metrics.map((metric, i) => (
                <div key={i} className={commonStyles.card + ' flex items-center gap-4 animate-fade-in'} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${metric.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : metric.color === 'primary' ? 'bg-primary-50 text-primary-600' : metric.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'}`}>
                    {metric.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">{metric.label}</p>
                    <p className="text-2xl font-bold text-navy-900">{metric.value}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${metric.color === 'emerald' ? 'bg-emerald-500' : metric.color === 'primary' ? 'bg-primary-500' : metric.color === 'amber' ? 'bg-amber-500' : 'bg-sky-500'}`} style={{ width: `${metric.score}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{metric.score}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score Breakdown Chart & Weekly Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className={commonStyles.card}>
              <h3 className="text-lg font-bold text-navy-900 mb-6">Score Breakdown</h3>
              <div className="h-64">
                <Bar data={scoreBreakdown} options={chartOptions} />
              </div>
            </div>

            <div className={commonStyles.card}>
              <h3 className="text-lg font-bold text-navy-900 mb-6">Weekly Performance Trend</h3>
              <div className="space-y-4">
                {weeklyScores.map((day, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-10 text-sm font-medium text-slate-600">{day.day}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${getScoreBg(day.score).replace('50', '500').replace('bg-', 'bg-')}`} style={{ width: `${day.score}%` }} />
                    </div>
                    <span className={`w-10 text-sm font-bold text-right ${getScoreColor(day.score)}`}>{day.score}</span>
                    <span className="w-14 text-xs text-slate-400 text-right">{day.deliveries} del</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className={commonStyles.card}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-primary-500" />
                <h3 className="text-lg font-bold text-navy-900">Top Performing Drivers</h3>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All Drivers</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Driver</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Deliveries</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">On-Time %</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.topPerformers.map((driver, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                          {i + 1}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img src={driver.avatar} alt={driver.name} className="w-10 h-10 rounded-full object-cover" onError={(e) => { e.target.src = '/assets/reactcg/profile.png' }} />
                          <span className="text-sm font-semibold text-navy-800">{driver.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">{driver.deliveries}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-medium text-navy-800">{driver.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${driver.onTime}%` }} />
                          </div>
                          <span className="text-sm text-slate-600">{driver.onTime}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-bold ${getScoreColor(Math.round((driver.rating / 5) * 100))}`}>
                          {Math.round((driver.rating / 5) * 100)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScoreMeter
