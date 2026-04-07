import React, { createContext, useState, useEffect } from 'react'

export const SessionContext = createContext()

export const SessionProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')
    const userId = localStorage.getItem('userId')
    const userName = localStorage.getItem('userName')

    if (token && userRole && userId) {
      setIsAuthenticated(true)
      setUser({
        id: userId,
        role: userRole,
        name: userName,
      })
    }
    setLoading(false)
  }, [])

  const login = (token, role, userId, userName) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userRole', role)
    localStorage.setItem('userId', userId)
    localStorage.setItem('userName', userName)

    setIsAuthenticated(true)
    setUser({
      id: userId,
      role: role,
      name: userName,
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')

    setIsAuthenticated(false)
    setUser(null)
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export const useSession = () => {
  const context = React.useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}
