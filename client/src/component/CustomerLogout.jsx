import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CustomerLogout() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call logout endpoint to clear server-side session
        if (token) {
          await fetch('http://localhost:5000/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear local storage
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')

        // Redirect to login
        navigate('/login', { replace: true })
      }
    }

    performLogout()
  }, [navigate, token])

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Logging you out...</p>
        <p className="text-gray-500 text-sm mt-2">You will be redirected shortly</p>
      </div>
    </div>
  )
}

export default CustomerLogout
