export const commonStyles = {
  container: 'min-h-screen bg-slate-50',
  card: 'bg-white rounded-xl card-shadow p-6 transition-all duration-300 hover:card-shadow-lg',
  cardHover: 'hover:-translate-y-1 hover:shadow-xl transition-all duration-300',
  input: 'w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 bg-white',
  button: {
    primary: 'px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-primary-500/25',
    secondary: 'px-6 py-3 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transform hover:-translate-y-0.5 transition-all duration-200',
    danger: 'px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-red-500/25',
    outline: 'px-6 py-3 border-2 border-slate-200 text-slate-700 font-medium rounded-lg hover:border-primary-500 hover:text-primary-600 transition-all duration-200',
  },
  heading: {
    h1: 'text-4xl md:text-5xl font-bold text-navy-900 leading-tight',
    h2: 'text-2xl md:text-3xl font-bold text-navy-900 leading-tight',
    h3: 'text-xl md:text-2xl font-semibold text-navy-800',
    h4: 'text-lg font-semibold text-navy-800',
  },
  text: {
    body: 'text-slate-600 leading-relaxed',
    small: 'text-sm text-slate-500',
    muted: 'text-slate-400',
  },
  badge: {
    success: 'px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium',
    warning: 'px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium',
    danger: 'px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium',
    info: 'px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium',
    primary: 'px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium',
  },
  sidebar: {
    container: 'w-72 bg-gradient-to-b from-navy-800 to-navy-900 text-white min-h-screen flex flex-col',
    link: 'flex items-center gap-3 px-6 py-3.5 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg mx-3',
    linkActive: 'flex items-center gap-3 px-6 py-3.5 text-white bg-primary-500/20 border-r-2 border-primary-500 transition-all duration-200 rounded-lg mx-3',
  },
  table: {
    container: 'bg-white rounded-xl card-shadow overflow-hidden',
    header: 'bg-slate-50 px-6 py-4 border-b border-slate-200',
    row: 'px-6 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors',
    cell: 'text-slate-600',
  },
}

export const API_URL = 'http://localhost:5000/api'

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

export const getAuthToken = () => {
  return localStorage.getItem('token')
}

export const removeAuthToken = () => {
  localStorage.removeItem('token')
}
