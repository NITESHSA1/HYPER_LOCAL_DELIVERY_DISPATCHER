import { useNavigate } from 'react-router-dom'
import { commonStyles } from '../styles/common'
import {
  Truck,
  Zap,
  Shield,
  Clock,
  MapPin,
  BarChart3,
  ChevronRight,
  Package,
  Users,
  Star,
  ArrowRight,
  Phone,
  Mail,
  LocationPin,
} from 'lucide-react'

function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-primary-500" />,
      title: 'Instant Dispatch',
      description: 'Route deliveries in seconds with our AI-powered dispatch engine that optimizes for speed and efficiency.',
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary-500" />,
      title: 'Live Tracking',
      description: 'Track every delivery in real-time with GPS precision. Know exactly where your packages are at all times.',
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-500" />,
      title: 'Secure Deliveries',
      description: 'End-to-end encrypted tracking, verified delivery confirmations, and insurance coverage for all packages.',
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary-500" />,
      title: 'Smart Analytics',
      description: 'Deep insights into delivery performance, driver efficiency, and customer satisfaction metrics.',
    },
    {
      icon: <Clock className="w-8 h-8 text-primary-500" />,
      title: '24/7 Operations',
      description: 'Round-the-clock dispatch service ensures your deliveries keep moving even after business hours.',
    },
    {
      icon: <Package className="w-8 h-8 text-primary-500" />,
      title: 'Multi-Stop Routes',
      description: 'Optimize complex multi-drop deliveries with our intelligent route planning algorithm.',
    },
  ]

  const stats = [
    { value: '50K+', label: 'Deliveries Daily', icon: <Package className="w-6 h-6" /> },
    { value: '2,500+', label: 'Active Drivers', icon: <Users className="w-6 h-6" /> },
    { value: '99.2%', label: 'On-Time Rate', icon: <Clock className="w-6 h-6" /> },
    { value: '4.9/5', label: 'Customer Rating', icon: <Star className="w-6 h-6" /> },
  ]

  const steps = [
    { step: '01', title: 'Create Account', desc: 'Sign up in under 2 minutes with your business details' },
    { step: '02', title: 'Add Deliveries', desc: 'Upload delivery lists or integrate with your system' },
    { step: '03', title: 'Auto Dispatch', desc: 'Our AI assigns the best driver for each route' },
    { step: '04', title: 'Track & Confirm', desc: 'Monitor live and get instant delivery confirmations' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img src="/src/assets/LOGO.jpeg" alt="DispatchPro" className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-xl font-bold text-navy-900">Dispatch<span className="text-primary-500">Pro</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-primary-500 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-primary-500 transition-colors font-medium">How It Works</a>
              <a href="#stats" className="text-slate-600 hover:text-primary-500 transition-colors font-medium">Stats</a>
              <a href="#contact" className="text-slate-600 hover:text-primary-500 transition-colors font-medium">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/signin')} className={commonStyles.button.outline + ' !py-2 !px-4'}>
                Sign In
              </button>
              <button onClick={() => navigate('/signup')} className={commonStyles.button.primary + ' !py-2 !px-4'}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-white to-navy-50/50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-navy-200/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Hyper-Local Delivery Intelligence
              </div>
              <h1 className={commonStyles.heading.h1 + ' mb-6'}>
                Deliver Faster with <span className="text-gradient">Smart Dispatch</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                The most intelligent hyper-local delivery dispatch platform. Route orders, track drivers, and delight customers — all from one powerful dashboard.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('/signup')} className={commonStyles.button.primary + ' flex items-center gap-2'}>
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => navigate('/signin')} className={commonStyles.button.secondary}>
                  Sign In to Dashboard
                </button>
              </div>
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-900">2,500+ businesses</p>
                  <p className="text-sm text-slate-500">trust DispatchPro daily</p>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <img
                src="/src/assets/hero.png"
                alt="Delivery Dispatch Platform"
                className="rounded-2xl shadow-2xl shadow-navy-900/20 w-full object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 card-shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy-900">12,847</p>
                    <p className="text-sm text-slate-500">Deliveries Today</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 card-shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-navy-900">Live Tracking Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 to-navy-800" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-500/20 rounded-xl mb-4 text-primary-400">
                  {stat.icon}
                </div>
                <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary-600 font-semibold mb-2">FEATURES</p>
            <h2 className={commonStyles.heading.h2 + ' mb-4'}>
              Everything You Need to <span className="text-gradient">Dispatch Smarter</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Powerful tools designed specifically for hyper-local delivery operations. From route optimization to real-time tracking.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={commonStyles.card + ' ' + commonStyles.cardHover + ' animate-fade-in'} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">{feature.title}</h3>
                <p className={commonStyles.text.body}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary-600 font-semibold mb-2">HOW IT WORKS</p>
            <h2 className={commonStyles.heading.h2 + ' mb-4'}>
              Get Started in <span className="text-gradient">4 Simple Steps</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative text-center animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-300 to-primary-500" />
                )}
                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl text-white text-2xl font-bold mb-5 shadow-lg shadow-primary-500/30">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-500 to-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMC02di00aC00djRoNHptLTYgNmgtNHYyaDR2LTJ6bTAtNnYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Delivery Operations?
          </h2>
          <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
            Join 2,500+ businesses already using DispatchPro to optimize their hyper-local deliveries. Start your free trial today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/signup')} className="px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-xl">
              Start Free Trial
            </button>
            <button onClick={() => navigate('/signin')} className="px-8 py-4 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 transition-all duration-200 border border-primary-400">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-navy-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <img src="/src/assets/LOGO.jpeg" alt="DispatchPro" className="w-10 h-10 rounded-lg object-cover" />
                <span className="text-xl font-bold text-white">Dispatch<span className="text-primary-500">Pro</span></span>
              </div>
              <p className="text-sm leading-relaxed">
                The intelligent hyper-local delivery dispatch platform for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary-500" />
                  support@dispatchpro.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary-500" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  San Francisco, CA
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-navy-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm"> 2025 DispatchPro. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
