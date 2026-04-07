import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useSession()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
