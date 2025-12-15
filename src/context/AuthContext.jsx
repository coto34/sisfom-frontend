import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Token ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/profile/')
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    const response = await api.post('/auth/login/', { username, password })
    const { token, user } = response.data
    
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Token ${token}`
    setUser(user)
    
    return user
  }

  const register = async (userData) => {
    const response = await api.post('/auth/register/', userData)
    const { token, user } = response.data
    
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Token ${token}`
    setUser(user)
    
    return user
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout/')
    } catch (error) {
      // Ignore errors on logout
    }
    
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const updateProfile = async (data) => {
    const response = await api.patch('/auth/profile/', data)
    setUser(response.data)
    return response.data
  }

  const completeOnboarding = async () => {
    try {
      await api.post('/auth/profile/complete_onboarding/')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      // Continue anyway - don't block the user
    }
    setUser(prev => prev ? { ...prev, onboarding_completado: true } : null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    completeOnboarding,
    isAuthenticated: !!user,
    isExperto: user?.role === 'experto' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
