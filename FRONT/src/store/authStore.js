import { create } from 'zustand'
import axios from 'axios'
import { API_URL, setAuthToken, getAuthToken, removeAuthToken } from '../styles/common'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: getAuthToken(),

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  register: async (formData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/common/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const { token, user } = response.data
      setAuthToken(token)
      set({ user, isAuthenticated: true, token, isLoading: false })
      return { success: true }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
      })
      return { success: false, error: error.response?.data?.message }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/common/login', { email, password })
      const { token, user } = response.data
      setAuthToken(token)
      set({ user, isAuthenticated: true, token, isLoading: false })
      return { success: true }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      })
      return { success: false, error: error.response?.data?.message }
    }
  },

  logout: () => {
    removeAuthToken()
    set({ user: null, isAuthenticated: false, token: null, error: null })
  },

  fetchProfile: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get('/admin/profile')
      set({ user: response.data.user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      if (error.response?.status === 401) {
        get().logout()
      }
      set({ isLoading: false })
    }
  },

  updateProfile: async (formData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.put('/admin/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      set({ user: response.data.user, isLoading: false })
      return { success: true }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Update failed',
        isLoading: false,
      })
      return { success: false }
    }
  },

  fetchStats: async () => {
    try {
      const response = await api.get('/admin/stats')
      return response.data
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      return null
    }
  },
}))

export default api
