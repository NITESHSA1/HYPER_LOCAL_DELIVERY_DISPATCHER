import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { commonStyles } from '../styles/common'
import {
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Upload,
} from 'lucide-react'

function SignUp() {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [previewImage, setPreviewImage] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
    role: 'dispatcher',
    avatar: null,
  })

  const handleChange = (e) => {
    clearError()
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, avatar: file })
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      clearError()
      return
    }

    const data = new FormData()
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key])
      }
    })

    const result = await register(data)
    if (result.success) {
      navigate('/dashboard')
    }
  }

  const nextStep = () => {
    if (step === 1 && (!formData.fullName || !formData.email || !formData.phone)) return
    if (step === 2 && (!formData.password || formData.password !== formData.confirmPassword)) return
    setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-800 to-navy-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2NHptMC02di00aC0ydjRoMnptLTYgNmgtNHYyaDR2LTJ6bTAtNnYtNGgtNHY0aDR6bS02IDZoLTR2Mmg0di0yem0wLTZ2LTRoLTR2NGg0eiIvPjwvZz48L2c+PC9zdmc+')]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <img src="/assets/LOGO.jpeg" alt="DispatchPro" className="w-12 h-12 rounded-xl object-cover" />
            <span className="text-2xl font-bold text-white">Dispatch<span className="text-primary-400">Pro</span></span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Start Your <span className="text-primary-400">Free Trial</span> Today
          </h2>
          <p className="text-slate-400 text-lg max-w-md">
            Create your account and get full access to our delivery dispatch platform for 14 days. No credit card required.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            'Unlimited deliveries during trial',
            'Full access to all features',
            'No credit card required',
            'Cancel anytime',
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <img src="/assets/LOGO.jpeg" alt="DispatchPro" className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-xl font-bold text-navy-900">Dispatch<span className="text-primary-500">Pro</span></span>
            </div>
            <h1 className={commonStyles.heading.h2 + ' mb-2'}>Create Account</h1>
            <p className={commonStyles.text.body}>Join thousands of businesses using DispatchPro</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  s === step ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' :
                  s < step ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 ${s < step ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Smith" className={commonStyles.input + ' pl-12'} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@company.com" className={commonStyles.input + ' pl-12'} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className={commonStyles.input + ' pl-12'} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-2">Company Name <span className="text-slate-400">(Optional)</span></label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Acme Corp" className={commonStyles.input + ' pl-12'} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" className={commonStyles.input + ' pl-12 pr-12'} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className={commonStyles.input + ' pl-12 pr-12'} required />
                  </div>
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-600 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Passwords do not match</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-2">Account Type</label>
                  <select name="role" value={formData.role} onChange={handleChange} className={commonStyles.input}>
                    <option value="dispatcher">Delivery Dispatcher</option>
                    <option value="admin">Administrator</option>
                    <option value="manager">Operations Manager</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center">
                  <label className="block text-sm font-medium text-navy-800 mb-4">Profile Photo <span className="text-slate-400">(Optional)</span></label>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-28 h-28 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                      {previewImage ? (
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-slate-400" />
                      )}
                    </div>
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-medium transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 space-y-2">
                  <p className="font-medium text-navy-800">Account Summary:</p>
                  <p><span className="text-slate-400">Name:</span> {formData.fullName}</p>
                  <p><span className="text-slate-400">Email:</span> {formData.email}</p>
                  <p><span className="text-slate-400">Phone:</span> {formData.phone}</p>
                  {formData.company && <p><span className="text-slate-400">Company:</span> {formData.company}</p>}
                  <p><span className="text-slate-400">Role:</span> {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button type="button" onClick={prevStep} className={commonStyles.button.outline + ' flex-1'}>
                  Back
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={nextStep} className={commonStyles.button.primary + ' flex-1 flex items-center justify-center gap-2'}>
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button type="submit" disabled={isLoading} className={commonStyles.button.primary + ' flex-1 flex items-center justify-center gap-2'}>
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
                </button>
              )}
            </div>
          </form>

          <p className="mt-8 text-center text-slate-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
