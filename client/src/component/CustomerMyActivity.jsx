import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReviewModal from './ReviewModal'

function CustomerMyActivity() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [proposals, setProposals] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedProject, setExpandedProject] = useState(null)
  const [actioningProposal, setActioningProposal] = useState(null)
  const [feedbackForm, setFeedbackForm] = useState('')
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState(null)
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    fetchProjectsAndProposals()
  }, [])

  const fetchProjectsAndProposals = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')

      if (!token) {
        navigate('/login')
        return
      }

      // Fetch client's projects
      const projectsResponse = await fetch(
        `http://localhost:5000/api/projects/client/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const projectsData = await projectsResponse.json()

      if (!projectsResponse.ok) {
        setError(projectsData.message || 'Failed to fetch projects')
        setLoading(false)
        return
      }

      const projectsList = projectsData.data || []
      setProjects(projectsList)

      // Fetch proposals for each project
      const proposalsMap = {}
      for (const project of projectsList) {
        try {
          const proposalsResponse = await fetch(
            `http://localhost:5000/api/proposals/project/${project._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          const proposalsData = await proposalsResponse.json()

          if (proposalsResponse.ok) {
            proposalsMap[project._id] = proposalsData.data || []
          }
        } catch (err) {
          console.error(`Failed to fetch proposals for project ${project._id}:`, err)
        }
      }

      setProposals(proposalsMap)
      setError('')
    } catch (err) {
      console.error('Error:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptProposal = async (proposalId, projectId) => {
    setActioningProposal(proposalId)
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:5000/api/proposals/${proposalId}/accept`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            feedback: feedbackForm,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to accept proposal')
        return
      }

      // Update the proposals list
      setProposals((prev) => ({
        ...prev,
        [projectId]: prev[projectId].map((p) =>
          p._id === proposalId ? data.data : p
        ),
      }))

      setFeedbackForm('')
      alert('Proposal accepted successfully!')
    } catch (err) {
      console.error('Accept proposal error:', err)
      alert('Network error. Please try again.')
    } finally {
      setActioningProposal(null)
    }
  }

  const handleRejectProposal = async (proposalId, projectId) => {
    if (!window.confirm('Are you sure you want to reject this proposal?')) {
      return
    }

    setActioningProposal(proposalId)
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:5000/api/proposals/${proposalId}/reject`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            feedback: feedbackForm,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to reject proposal')
        return
      }

      // Update the proposals list
      setProposals((prev) => ({
        ...prev,
        [projectId]: prev[projectId].map((p) =>
          p._id === proposalId ? data.data : p
        ),
      }))

      setFeedbackForm('')
      alert('Proposal rejected successfully!')
    } catch (err) {
      console.error('Reject proposal error:', err)
      alert('Network error. Please try again.')
    } finally {
      setActioningProposal(null)
    }
  }

  const handleOpenReviewModal = (proposal, project) => {
    setSelectedProposal({ ...proposal, project })
    setReviewModalOpen(true)
  }

  const handleSubmitReview = async (reviewData) => {
    setReviewLoading(true)
    try {
      const token = localStorage.getItem('token')

      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit review')
      }

      alert('Review submitted successfully!')
      setReviewModalOpen(false)
      setSelectedProposal(null)
    } catch (err) {
      console.error('Submit review error:', err)
      throw err
    } finally {
      setReviewLoading(false)
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
          <p className="mt-4 text-slate-600">Loading activity...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-950">My Activity</h1>
          <p className="mt-2 text-slate-600">
            Track proposals and manage freelancer requests for your projects
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Projects and Proposals */}
        {projects.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <p className="text-slate-600">
              You haven't posted any projects yet.{' '}
              <button
                onClick={() => navigate('/customer/new-project')}
                className="font-semibold text-sky-600 hover:text-sky-700"
              >
                Create a project
              </button>{' '}
              to receive proposals from freelancers.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => {
              const projectProposals = proposals[project._id] || []
              const pendingCount = projectProposals.filter(
                (p) => p.status === 'pending'
              ).length
              const acceptedCount = projectProposals.filter(
                (p) => p.status === 'accepted'
              ).length

              return (
                <div
                  key={project._id}
                  className="rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  {/* Project Header */}
                  <button
                    onClick={() =>
                      setExpandedProject(
                        expandedProject === project._id ? null : project._id
                      )
                    }
                    className="w-full p-6 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">
                          {project.title}
                        </h3>
                        <div className="mt-2 flex gap-4 text-sm">
                          <span className="text-slate-600">
                            Status:{' '}
                            <span className="font-medium text-slate-900">
                              {project.status.charAt(0).toUpperCase() +
                                project.status.slice(1)}
                            </span>
                          </span>
                          <span className="text-slate-600">
                            Proposals:{' '}
                            <span className="font-medium text-slate-900">
                              {projectProposals.length}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {pendingCount > 0 && (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                            {pendingCount} New
                          </span>
                        )}
                        {acceptedCount > 0 && (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                            {acceptedCount} Accepted
                          </span>
                        )}
                        <span className="text-slate-400">
                          {expandedProject === project._id ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Proposals List */}
                  {expandedProject === project._id && (
                    <div className="border-t border-slate-200">
                      {projectProposals.length === 0 ? (
                        <div className="p-6 text-center text-slate-600">
                          No proposals received yet for this project.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-200">
                          {projectProposals.map((proposal) => (
                            <div key={proposal._id} className="p-6">
                              <div className="flex items-start justify-between">
                                {/* Freelancer Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-4">
                                    <div className="min-h-12 min-w-12 rounded-full bg-sky-200"></div>
                                    <div>
                                      <h4 className="font-semibold text-slate-950">
                                        {proposal.freelancer?.firstName}{' '}
                                        {proposal.freelancer?.lastName}
                                      </h4>
                                      <p className="text-xs text-slate-500">
                                        {proposal.freelancer?.experience || 'Professional'}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Proposal Details */}
                                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                    <div>
                                      <p className="text-xs text-slate-600">Bid Amount</p>
                                      <p className="mt-1 font-bold text-sky-600">
                                        ${proposal.bidAmount?.toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-600">Delivery</p>
                                      <p className="mt-1 font-semibold text-slate-900">
                                        {proposal.deliveryDays} days
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-600">Status</p>
                                      <span
                                        className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                          proposal.status
                                        )}`}
                                      >
                                        {proposal.status.charAt(0).toUpperCase() +
                                          proposal.status.slice(1)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Cover Letter */}
                                  <div className="mt-4">
                                    <p className="text-xs font-medium text-slate-600">
                                      Cover Letter
                                    </p>
                                    <p className="mt-2 text-sm text-slate-700">
                                      {proposal.message}
                                    </p>
                                  </div>

                                  {/* Submitted Date */}
                                  <p className="mt-3 text-xs text-slate-500">
                                    Submitted {formatDate(proposal.createdAt)}
                                  </p>
                                </div>

                                {/* Actions */}
                                {proposal.status === 'pending' && (
                                  <div className="ml-4 flex flex-col gap-2 sm:w-32">
                                    <button
                                      onClick={() =>
                                        handleAcceptProposal(
                                          proposal._id,
                                          project._id
                                        )
                                      }
                                      disabled={actioningProposal === proposal._id}
                                      className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleRejectProposal(
                                          proposal._id,
                                          project._id
                                        )
                                      }
                                      disabled={actioningProposal === proposal._id}
                                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-50"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                                {proposal.status === 'accepted' && (
                                  <div className="ml-4">
                                    <button
                                      onClick={() => handleOpenReviewModal(proposal, project)}
                                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                      Leave Review
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedProposal && (
        <ReviewModal
          isOpen={reviewModalOpen}
          freelancer={selectedProposal.freelancer}
          project={selectedProposal.project}
          onClose={() => {
            setReviewModalOpen(false)
            setSelectedProposal(null)
          }}
          onSubmit={handleSubmitReview}
          isLoading={reviewLoading}
        />
      )}
    </div>
  )
}

export default CustomerMyActivity
