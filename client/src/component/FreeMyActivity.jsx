import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function FreeMyActivity() {
  const navigate = useNavigate()
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    fetchProposals()
  }, [activeFilter])

  const fetchProposals = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')

      if (!token) {
        navigate('/login')
        return
      }

      let query = `http://localhost:5000/api/proposals/freelancer/${userId}`
      if (activeFilter !== 'all') {
        query += `?status=${activeFilter}`
      }

      const response = await fetch(query, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch proposals')
        return
      }

      setProposals(data.data || [])
      setError('')
    } catch (err) {
      console.error('Fetch proposals error:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'accepted':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-950">My Activity</h1>
          <p className="mt-2 text-slate-600">Track all your proposals and their status</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex gap-4 border-b border-slate-200">
          {[
            { value: 'all', label: 'All Proposals' },
            { value: 'pending', label: 'Pending' },
            { value: 'accepted', label: 'Accepted' },
            { value: 'rejected', label: 'Rejected' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-3 font-medium transition ${
                activeFilter === filter.value
                  ? 'border-b-2 border-sky-600 text-sky-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
              <p className="mt-4 text-slate-600">Loading proposals...</p>
            </div>
          </div>
        ) : proposals.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <p className="text-slate-600">
              {activeFilter === 'all'
                ? 'You have not submitted any proposals yet.'
                : `You have no ${activeFilter} proposals.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div
                key={proposal._id}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left Section */}
                  <div className="flex-1">
                    {/* Project Title and Status */}
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3
                          onClick={() => navigate(`/project/${proposal.project._id}`)}
                          className="cursor-pointer text-lg font-semibold text-slate-950 hover:text-sky-600"
                        >
                          {proposal.project.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(
                              proposal.status
                            )}`}
                          >
                            {proposal.status.charAt(0).toUpperCase() +
                              proposal.status.slice(1)}
                          </span>
                          <span className="text-xs text-slate-500">
                            Submitted {formatDate(proposal.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Proposal Details */}
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-slate-600">Your Bid</p>
                        <p className="mt-1 text-lg font-bold text-sky-600">
                          ${proposal.bidAmount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Delivery Time</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {proposal.deliveryDays} days
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Project Budget</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          ${proposal.project?.budget?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Message Preview */}
                    <div className="mt-4">
                      <p className="text-xs text-slate-600">Cover Letter</p>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-700">
                        {proposal.message}
                      </p>
                    </div>

                    {/* Feedback if any */}
                    {proposal.clientFeedback && (
                      <div className="mt-4 rounded-lg bg-slate-50 p-3">
                        <p className="text-xs font-medium text-slate-600">
                          Feedback from Client
                        </p>
                        <p className="mt-2 text-sm text-slate-700">
                          {proposal.clientFeedback}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Action */}
                  <div className="flex flex-col gap-2 sm:w-40">
                    <button
                      onClick={() => navigate(`/project/${proposal.project._id}`)}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                    >
                      View Project
                    </button>
                    {proposal.status === 'accepted' && (
                      <div className="rounded-lg bg-green-50 p-3 text-center">
                        <p className="text-sm font-semibold text-green-700">
                          Congratulations!
                        </p>
                        <p className="mt-1 text-xs text-green-600">
                          Your proposal was accepted
                        </p>
                      </div>
                    )}
                    {proposal.status === 'rejected' && (
                      <div className="rounded-lg bg-red-50 p-3 text-center">
                        <p className="text-sm font-semibold text-red-700">
                          Not Selected
                        </p>
                        <p className="mt-1 text-xs text-red-600">
                          Better luck next time!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FreeMyActivity
