import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FreeDashboard = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')

  const [stats, setStats] = useState({
    totalProposals: 0,
    acceptedProposals: 0,
    pendingProposals: 0,
    averageRating: 0,
  })
  const [recentProposals, setRecentProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchDashboardData()
  }, [token, navigate])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, proposalsRes, ratingRes] = await Promise.all([
        fetch(`http://localhost:5000/api/users/${userId}/stats`, {
          headers: { 'Content-Type': 'application/json' },
        }),
        fetch(`http://localhost:5000/api/proposals/freelancer/${userId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/reviews/user/${userId}/rating`, {
          headers: { 'Content-Type': 'application/json' },
        }),
      ])

      if (statsRes.ok && proposalsRes.ok && ratingRes.ok) {
        const statsData = await statsRes.json()
        const proposalsData = await proposalsRes.json()
        const ratingData = await ratingRes.json()

        setStats({
          totalProposals: statsData.totalProposals || 0,
          acceptedProposals: statsData.acceptedProposals || 0,
          pendingProposals: statsData.pendingProposals || 0,
          averageRating: ratingData.averageRating || 0,
        })

        // Get last 5 proposals
        setRecentProposals((proposalsData || []).slice(0, 5))
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome back!</h1>
          <p className="mt-2 text-gray-600">Here's what's happening with your freelance business</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Proposals */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Proposals</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalProposals}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Accepted Proposals */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{stats.acceptedProposals}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Proposals */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.pendingProposals}</p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Rating</p>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                  <div className="mt-1">{renderStars(stats.averageRating)}</div>
                </div>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <svg className="h-6 w-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => navigate('/freelancer/view-projects')}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white hover:shadow-lg transition-shadow"
          >
            <svg className="h-6 w-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="font-semibold">Browse Projects</p>
            <p className="text-sm text-blue-100">Find new opportunities</p>
          </button>

          <button
            onClick={() => navigate('/freelancer/my-activity')}
            className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 p-6 text-white hover:shadow-lg transition-shadow"
          >
            <svg className="h-6 w-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 8a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold">My Proposals</p>
            <p className="text-sm text-green-100">Check your submissions</p>
          </button>

          <button
            onClick={() => navigate('/freelancer/reviews')}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white hover:shadow-lg transition-shadow"
          >
            <svg className="h-6 w-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <p className="font-semibold">Reviews</p>
            <p className="text-sm text-purple-100">View your feedback</p>
          </button>
        </div>

        {/* Recent Proposals */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Proposals</h2>
          </div>

          {recentProposals.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600 mb-4">No proposals yet</p>
              <button
                onClick={() => navigate('/freelancer/view-projects')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse projects →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentProposals.map((proposal) => (
                <div key={proposal._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{proposal.project?.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Bid: <span className="font-medium text-gray-900">${proposal.bidAmount}</span>
                        {' '}• {proposal.deliveryDays} {proposal.deliveryDays === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        proposal.status
                      )}`}
                    >
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FreeDashboard
