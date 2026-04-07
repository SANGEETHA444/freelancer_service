import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [proposalForm, setProposalForm] = useState({
    bidAmount: '',
    deliveryDays: '',
    message: '',
  })
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [submittingProposal, setSubmittingProposal] = useState(false)

  useEffect(() => {
    fetchProjectDetails()
  }, [id])

  const fetchProjectDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch project')
        return
      }

      setProject(data.data)
      setError('')
    } catch (err) {
      console.error('Fetch project error:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleProposalChange = (e) => {
    const { name, value } = e.target
    setProposalForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitProposal = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    setSubmittingProposal(true)
    try {
      const response = await fetch('http://localhost:5000/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: id,
          bidAmount: parseFloat(proposalForm.bidAmount),
          deliveryDays: parseInt(proposalForm.deliveryDays, 10),
          message: proposalForm.message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to submit proposal')
        return
      }

      alert('Proposal submitted successfully!')
      setShowProposalForm(false)
      setProposalForm({ bidAmount: '', deliveryDays: '', message: '' })
    } catch (err) {
      console.error('Submit proposal error:', err)
      alert('Network error. Please try again.')
    } finally {
      setSubmittingProposal(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getDaysRemaining = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 'Expired'
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
          <p className="mt-4 text-slate-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-sky-600 hover:text-sky-700"
          >
            ← Back
          </button>
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-sky-600 hover:text-sky-700"
          >
            ← Back
          </button>
          <div className="rounded-lg bg-yellow-50 p-4 text-yellow-600">
            Project not found
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sky-600 hover:text-sky-700"
        >
          ← Back
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="mb-4 inline-block rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-700">
                {project.category}
              </div>

              <h1 className="mt-4 text-3xl font-bold text-slate-950">
                {project.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-4 border-b border-slate-200 pb-6">
                <div>
                  <p className="text-sm text-slate-600">Budget</p>
                  <p className="text-2xl font-bold text-sky-600">
                    ${project.budget?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Deadline</p>
                  <p className="font-semibold text-slate-900">
                    {formatDate(project.deadline)}
                  </p>
                  <p className="text-sm text-slate-600">
                    {getDaysRemaining(project.deadline)} days remaining
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Experience Level</p>
                  <p className="font-semibold text-slate-900">
                    {project.experience}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-slate-950">
                  Project Description
                </h2>
                <p className="mt-4 whitespace-pre-wrap text-slate-700">
                  {project.description}
                </p>
              </div>

              {/* Required Skills */}
              {project.requiredSkills && project.requiredSkills.length > 0 && (
                <div className="mt-8 border-t border-slate-200 pt-6">
                  <h2 className="text-lg font-semibold text-slate-950">
                    Required Skills
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.requiredSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-slate-100 px-4 py-2 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Client Info */}
            <div className="mt-8 rounded-lg bg-white p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">
                About the Employer
              </h2>
              <div className="mt-4 flex items-start gap-4">
                <div className="min-h-12 min-w-12 rounded-full bg-sky-200"></div>
                <div>
                  <h3 className="font-semibold text-slate-950">
                    {project.client?.firstName} {project.client?.lastName}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {project.client?.company || 'Project Poster'}
                  </p>
                  {project.client?.rating && (
                    <p className="mt-2 text-sm font-medium text-yellow-600">
                      ⭐ {project.client.rating.toFixed(1)} Rating
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Submit Proposal Button */}
            <button
              onClick={() => setShowProposalForm(!showProposalForm)}
              className="w-full rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
            >
              Send Proposal
            </button>

            {/* Proposal Form */}
            {showProposalForm && (
              <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-950">Submit Your Proposal</h3>

                <form onSubmit={handleSubmitProposal} className="mt-4 space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Bid Amount ($)
                    </span>
                    <input
                      type="number"
                      name="bidAmount"
                      value={proposalForm.bidAmount}
                      onChange={handleProposalChange}
                      placeholder="Your bid amount"
                      step="0.01"
                      required
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Delivery Days
                    </span>
                    <input
                      type="number"
                      name="deliveryDays"
                      value={proposalForm.deliveryDays}
                      onChange={handleProposalChange}
                      placeholder="Days to complete"
                      required
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Cover Letter
                    </span>
                    <textarea
                      name="message"
                      value={proposalForm.message}
                      onChange={handleProposalChange}
                      placeholder="Why you're the right fit..."
                      rows="4"
                      required
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={submittingProposal}
                    className="w-full rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
                  >
                    {submittingProposal ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                </form>
              </div>
            )}

            {/* Project Stats */}
            <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-950">Project Info</h3>
              <div className="mt-4 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Status</span>
                  <span className="font-semibold text-slate-900">
                    {project.status?.charAt(0).toUpperCase() +
                      project.status?.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Proposals</span>
                  <span className="font-semibold text-slate-900">
                    {project.proposalCount || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Views</span>
                  <span className="font-semibold text-slate-900">
                    {project.views || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Posted On</span>
                  <span className="font-semibold text-slate-900">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails
