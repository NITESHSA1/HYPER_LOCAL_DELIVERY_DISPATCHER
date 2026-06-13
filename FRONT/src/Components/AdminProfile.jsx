import { useState, useRef, useEffect } from 'react'
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
  Camera,
  Mail,
  Phone,
  Building2,
  Shield,
  Edit3,
  Save,
  X,
  CheckCircle2,
  MapPin,
  Calendar,
  Award,
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

function AdminProfile() {
  const navigate = useNavigate()
  const { user, updateProfile, isLoading } = useAuthStore()
  const fileInputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [previewImage, setPreviewImage] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    bio: '',
    location: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        role: user.role || 'dispatcher',
        bio: user.bio || '',
        location: user.location || 'San Francisco, CA',
      })
      if (user.avatar) setPreviewImage(user.avatar)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPreviewImage(URL.createObjectURL(file))
      setFormData({ ...formData, avatarFile: file })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key])
    })
    const result = await updateProfile(data)
    if (result.success) {
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  const activityLog = [
    { action: 'Updated delivery route #DLV-8921', time: '5 minutes ago', icon: <Package className="w-4 h-4" /> },
    { action: 'Added new driver Mike Richardson', time: '2 hours ago', icon: <Users className="w-4 h-4" /> },
    { action: 'Completed batch dispatch for Zone B', time: '4 hours ago', icon: <CheckCircle2 className="w-4 h-4" /> },
    { action: 'Updated profile information', time: '1 day ago', icon: <Edit3 className="w-4 h-4" /> },
    { action: 'Generated weekly performance report', time: '2 days ago', icon: <TrendingUp className="w-4 h-4" /> },
  ]

  const achievements = [
    { title: 'Top Dispatcher', desc: '1000+ deliveries managed', icon: <Award className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600' },
    { title: 'Speed Demon', desc: 'Avg. under 25 min delivery', icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Team Leader', desc: 'Managing 50+ drivers', icon: <Users className="w-5 h-5" />, color: 'bg-sky-50 text-sky-600' },
    { title: 'Reliable', desc: '99.5% on-time rate', icon: <Shield className="w-5 h-5" />, color: 'bg-primary-50 text-primary-600' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage="/profile" />
      <div className="flex-1 ml-72">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-navy-900">My Profile</h1>
              <p className="text-sm text-slate-500">Manage your account settings and preferences</p>
            </div>
          </div>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className={commonStyles.button.primary + ' flex items-center gap-2'}>
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <button onClick={() => setIsEditing(false)} className={commonStyles.button.outline + ' flex items-center gap-2'}>
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
        </header>

        <div className="p-8">
          {successMessage && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 animate-fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className={commonStyles.card + ' text-center'}>
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-200 mx-auto">
                    <img src={previewImage || '/src/assets/reactcg/profile.png'} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.src = '/src/assets/reactcg/profile.png' }} />
                  </div>
                  {isEditing && (
                    <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all">
                      <Camera className="w-5 h-5" />
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
                <h2 className="text-xl font-bold text-navy-900 mb-1">{formData.fullName || 'Admin User'}</h2>
                <p className="text-primary-600 font-medium mb-1 capitalize">{formData.role}</p>
                <p className="text-sm text-slate-500 flex items-center justify-center gap-1 mb-4">
                  <MapPin className="w-3.5 h-3.5" /> {formData.location}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) || 'Jan 2025'}</span>
                </div>
              </div>

              {/* Achievements */}
              <div className={commonStyles.card + ' mt-6'}>
                <h3 className="text-lg font-bold text-navy-900 mb-4">Achievements</h3>
                <div className="space-y-3">
                  {achievements.map((ach, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className={`w-10 h-10 ${ach.color} rounded-lg flex items-center justify-center`}>{ach.icon}</div>
                      <div>
                        <p className="text-sm font-semibold text-navy-900">{ach.title}</p>
                        <p className="text-xs text-slate-500">{ach.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Edit Form / Info */}
            <div className="lg:col-span-2">
              <div className={commonStyles.card}>
                <h3 className="text-lg font-bold text-navy-900 mb-6">{isEditing ? 'Edit Profile' : 'Account Information'}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-navy-800 mb-2">Full Name</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} disabled={!isEditing} className={commonStyles.input + ' pl-12 disabled:bg-slate-50 disabled:text-slate-500'} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-800 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} className={commonStyles.input + ' pl-12 disabled:bg-slate-50 disabled:text-slate-500'} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-800 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} className={commonStyles.input + ' pl-12 disabled:bg-slate-50 disabled:text-slate-500'} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-800 mb-2">Company</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" name="company" value={formData.company} onChange={handleChange} disabled={!isEditing} className={commonStyles.input + ' pl-12 disabled:bg-slate-50 disabled:text-slate-500'} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-800 mb-2">Role</label>
                      <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select name="role" value={formData.role} onChange={handleChange} disabled={!isEditing} className={commonStyles.input + ' pl-12 disabled:bg-slate-50 disabled:text-slate-500'}>
                          <option value="dispatcher">Dispatcher</option>
                          <option value="admin">Administrator</option>
                          <option value="manager">Operations Manager</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-800 mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" name="location" value={formData.location} onChange={handleChange} disabled={!isEditing} className={commonStyles.input + ' pl-12 disabled:bg-slate-50 disabled:text-slate-500'} />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-navy-800 mb-2">Bio</label>
                      <textarea name="bio" value={formData.bio} onChange={handleChange} disabled={!isEditing} rows={3} placeholder="Tell us about yourself..." className={commonStyles.input + ' disabled:bg-slate-50 disabled:text-slate-500 resize-none'} />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-6 flex justify-end gap-3">
                      <button type="button" onClick={() => setIsEditing(false)} className={commonStyles.button.outline}>Cancel</button>
                      <button type="submit" disabled={isLoading} className={commonStyles.button.primary + ' flex items-center gap-2'}>
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Activity Log */}
              <div className={commonStyles.card + ' mt-6'}>
                <h3 className="text-lg font-bold text-navy-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {activityLog.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm text-navy-800">{activity.action}</p>
                        <p className="text-xs text-slate-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
