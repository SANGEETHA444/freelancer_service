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

  useEffect(() => { fetchProjectsAndProposals() }, [])

  const fetchProjectsAndProposals = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      if (!token) { navigate('/login'); return }
      const projectsRes = await fetch(`http://localhost:5000/api/projects/client/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      const projectsData = await projectsRes.json()
      if (!projectsRes.ok) { setError(projectsData.message || 'Failed to fetch projects'); setLoading(false); return }
      const projectsList = projectsData.data || []
      setProjects(projectsList)
      const proposalsMap = {}
      for (const project of projectsList) {
        try {
          const pRes = await fetch(`http://localhost:5000/api/proposals/project/${project._id}`, { headers: { Authorization: `Bearer ${token}` } })
          const pData = await pRes.json()
          if (pRes.ok) proposalsMap[project._id] = pData.data || []
        } catch { }
      }
      setProposals(proposalsMap); setError('')
    } catch { setError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  const handleAcceptProposal = async (proposalId, projectId) => {
    setActioningProposal(proposalId)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/proposals/${proposalId}/accept`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ feedback: feedbackForm }) })
      const data = await res.json()
      if (!res.ok) { alert(data.message || 'Failed to accept proposal'); return }
      setProposals(prev => ({ ...prev, [projectId]: prev[projectId].map(p => p._id === proposalId ? data.data : p) }))
      setFeedbackForm(''); alert('Proposal accepted successfully!')
    } catch { alert('Network error. Please try again.') }
    finally { setActioningProposal(null) }
  }

  const handleRejectProposal = async (proposalId, projectId) => {
    if (!window.confirm('Are you sure you want to reject this proposal?')) return
    setActioningProposal(proposalId)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/proposals/${proposalId}/reject`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ feedback: feedbackForm }) })
      const data = await res.json()
      if (!res.ok) { alert(data.message || 'Failed to reject proposal'); return }
      setProposals(prev => ({ ...prev, [projectId]: prev[projectId].map(p => p._id === proposalId ? data.data : p) }))
      setFeedbackForm(''); alert('Proposal rejected successfully!')
    } catch { alert('Network error. Please try again.') }
    finally { setActioningProposal(null) }
  }

  const handleSubmitReview = async reviewData => {
    setReviewLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(reviewData) })
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed to submit review') }
      alert('Review submitted successfully!'); setReviewModalOpen(false); setSelectedProposal(null)
    } catch (err) { throw err }
    finally { setReviewLoading(false) }
  }

  const formatDate = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const statusBadge = s => ({ pending: 't-badge-yellow', accepted: 't-badge-green', rejected: 't-badge-red' }[s] || 't-badge-gray')

  if (loading) return <div className="t-spinner"><div className="t-spin" /><span>Loading activity…</span></div>

  return (
    <div>
      <div className="t-page-header">
        <h1 className="t-page-title">My Activity</h1>
        <p className="t-page-subtitle">Track proposals and manage freelancer requests for your projects</p>
      </div>

      {error && <div className="t-alert t-alert-error">{error}</div>}

      {projects.length === 0 ? (
        <div className="t-card"><div className="t-empty">
          <p className="t-empty-title">No projects yet</p>
          <p className="t-empty-text">Create a project to receive proposals from freelancers.</p>
          <button onClick={() => navigate('/customer/new-project')} className="t-btn t-btn-primary" style={{ marginTop: 14 }}>Create a project</button>
        </div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {projects.map(project => {
            const projectProposals = proposals[project._id] || []
            const pendingCount = projectProposals.filter(p => p.status === 'pending').length
            const acceptedCount = projectProposals.filter(p => p.status === 'accepted').length
            return (
              <div key={project._id} className="t-card">
                <button onClick={() => setExpandedProject(expandedProject === project._id ? null : project._id)}
                  style={{ width: '100%', padding: '18px 22px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{project.title}</h3>
                      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--muted)' }}>
                        <span>Status: <span style={{ fontWeight: 600, color: 'var(--green-dark)' }}>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span></span>
                        <span>Proposals: <span style={{ fontWeight: 600, color: 'var(--text)' }}>{projectProposals.length}</span></span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {pendingCount > 0 && <span className="t-badge t-badge-yellow">{pendingCount} New</span>}
                      {acceptedCount > 0 && <span className="t-badge t-badge-green">{acceptedCount} Accepted</span>}
                      <span style={{ color: 'var(--muted)', fontSize: 12 }}>{expandedProject === project._id ? '▼' : '▶'}</span>
                    </div>
                  </div>
                </button>

                {expandedProject === project._id && (
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    {projectProposals.length === 0 ? (
                      <div className="t-empty" style={{ padding: '28px 22px' }}><p className="t-empty-text">No proposals received yet.</p></div>
                    ) : (
                      projectProposals.map((proposal, i) => (
                        <div key={proposal._id} style={{ padding: '18px 22px', borderBottom: i < projectProposals.length - 1 ? '1px solid var(--border)' : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <div className="t-avatar" style={{ width: 40, height: 40, fontSize: 14, flexShrink: 0 }}>
                                  {`${proposal.freelancer?.firstName?.[0] || ''}${proposal.freelancer?.lastName?.[0] || ''}`.toUpperCase()}
                                </div>
                                <div>
                                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{proposal.freelancer?.firstName} {proposal.freelancer?.lastName}</p>
                                  <p style={{ fontSize: 12, color: 'var(--muted)' }}>{proposal.freelancer?.experience || 'Professional'}</p>
                                </div>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 12 }}>
                                <div><p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Bid Amount</p><p style={{ fontSize: 16, fontWeight: 800, color: 'var(--green-dark)' }}>${proposal.bidAmount?.toLocaleString()}</p></div>
                                <div><p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Delivery</p><p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{proposal.deliveryDays} days</p></div>
                                <div><p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Status</p><span className={`t-badge ${statusBadge(proposal.status)}`}>{proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}</span></div>
                              </div>
                              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 6 }}>{proposal.message}</p>
                              <p style={{ fontSize: 11, color: 'var(--muted)' }}>Submitted {formatDate(proposal.createdAt)}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                              {proposal.status === 'pending' && (
                                <>
                                  <button onClick={() => handleAcceptProposal(proposal._id, project._id)} disabled={actioningProposal === proposal._id} className="t-btn t-btn-success t-btn-sm">Accept</button>
                                  <button onClick={() => handleRejectProposal(proposal._id, project._id)} disabled={actioningProposal === proposal._id} className="t-btn t-btn-danger t-btn-sm">Reject</button>
                                </>
                              )}
                              {proposal.status === 'accepted' && (
                                <button onClick={() => { setSelectedProposal({ ...proposal, project }); setReviewModalOpen(true) }} className="t-btn t-btn-primary t-btn-sm">Leave Review</button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {selectedProposal && (
        <ReviewModal isOpen={reviewModalOpen} freelancer={selectedProposal.freelancer} project={selectedProposal.project}
          onClose={() => { setReviewModalOpen(false); setSelectedProposal(null) }}
          onSubmit={handleSubmitReview} isLoading={reviewLoading} />
      )}
    </div>
  )
}

export default CustomerMyActivity
