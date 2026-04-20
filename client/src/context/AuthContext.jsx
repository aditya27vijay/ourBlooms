import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await authApi.getCurrentUser()
        setUser(response.data)
      } catch (error) {
        console.error('Failed to restore session:', error)
        localStorage.removeItem('accessToken')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials)
    const { accessToken, user } = response.data
    localStorage.setItem('accessToken', accessToken)
    setUser(user)
    return response.data
  }, [])

  const register = useCallback(async (credentials) => {
    const response = await authApi.register(credentials)
    const { accessToken, user } = response.data
    localStorage.setItem('accessToken', accessToken)
    setUser(user)
    return response.data
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      setUser(null)
    }
  }, [])

  const updateUser = useCallback((userData) => {
    setUser((prev) => ({ ...prev, ...userData }))
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
