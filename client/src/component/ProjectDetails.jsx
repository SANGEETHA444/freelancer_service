import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [proposalForm, setProposalForm] = useState({ bidAmount: '', deliveryDays: '', message: '' })
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [submittingProposal, setSubmittingProposal] = useState(false)

  useEffect(() => { fetchProjectDetails() }, [id])

  const fetchProjectDetails = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`)
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to fetch project'); return }
      setProject(data.data); setError('')
    } catch { setError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  const handleProposalChange = e => {
    const { name, value } = e.target
    setProposalForm(p => ({ ...p, [name]: value }))
  }

  const handleSubmitProposal = async e => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    setSubmittingProposal(true)
    try {
      const res = await fetch('http://localhost:5000/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ projectId: id, bidAmount: parseFloat(proposalForm.bidAmount), deliveryDays: parseInt(proposalForm.deliveryDays, 10), message: proposalForm.message }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.message || 'Failed to submit proposal'); return }
      alert('Proposal submitted successfully!')
      setShowProposalForm(false)
      setProposalForm({ bidAmount: '', deliveryDays: '', message: '' })
    } catch { alert('Network error. Please try again.') }
    finally { setSubmittingProposal(false) }
  }

  const formatDate = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const getDaysRemaining = d => { const days = Math.ceil((new Date(d) - new Date()) / 86400000); return days > 0 ? days : 'Expired' }

  if (loading) return (
    <div className="t-spinner" style={{ minHeight: '100vh' }}>
      <div className="t-spin" /><span>Loading project…</span>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} className="t-btn t-btn-outline t-btn-sm" style={{ marginBottom: 20 }}>← Back</button>
        <div className="t-alert t-alert-error">{error}</div>
      </div>
    </div>
  )

  if (!project) return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} className="t-btn t-btn-outline t-btn-sm" style={{ marginBottom: 20 }}>← Back</button>
        <div className="t-alert t-alert-info">Project not found</div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        <button onClick={() => navigate(-1)} className="t-btn t-btn-outline t-btn-sm" style={{ marginBottom: 24 }}>← Back</button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

          {/* ── Main content ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Header card */}
            <div className="t-card" style={{ padding: '28px 28px 24px' }}>
              <span className="t-badge t-badge-green" style={{ marginBottom: 14, display: 'inline-block' }}>{project.category}</span>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 20, lineHeight: 1.3 }}>{project.title}</h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Budget</p>
                  <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--green-dark)' }}>${project.budget?.toLocaleString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Deadline</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{formatDate(project.deadline)}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)' }}>{getDaysRemaining(project.deadline)} days remaining</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Experience Level</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{project.experience}</p>
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 12 }}>Project Description</h2>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{project.description}</p>
              </div>

              {project.requiredSkills?.length > 0 && (
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 12 }}>Required Skills</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {project.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="t-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Client card */}
            <div className="t-card" style={{ padding: '22px 28px' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 16 }}>About the Employer</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="t-avatar" style={{ width: 48, height: 48, fontSize: 18, flexShrink: 0 }}>
                  {`${project.client?.firstName?.[0] || ''}${project.client?.lastName?.[0] || ''}`.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{project.client?.firstName} {project.client?.lastName}</p>
                  <p style={{ fontSize: 13, color: 'var(--muted)' }}>{project.client?.company || 'Project Poster'}</p>
                  {project.client?.rating > 0 && (
                    <p style={{ fontSize: 13, color: '#fbbf24', marginTop: 4 }}>★ {project.client.rating.toFixed(1)} Rating</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Send proposal button */}
            <button onClick={() => setShowProposalForm(!showProposalForm)} className="t-btn t-btn-primary t-btn-full t-btn-lg">
              {showProposalForm ? 'Cancel Proposal' : 'Send Proposal'}
            </button>

            {/* Proposal form */}
            {showProposalForm && (
              <div className="t-card" style={{ padding: '20px 22px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 16 }}>Submit Your Proposal</h3>
                <form onSubmit={handleSubmitProposal} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label className="t-label">Bid Amount ($)</label>
                    <input type="number" name="bidAmount" value={proposalForm.bidAmount} onChange={handleProposalChange}
                      placeholder="Your bid amount" step="0.01" required className="t-input" />
                  </div>
                  <div>
                    <label className="t-label">Delivery Days</label>
                    <input type="number" name="deliveryDays" value={proposalForm.deliveryDays} onChange={handleProposalChange}
                      placeholder="Days to complete" required className="t-input" />
                  </div>
                  <div>
                    <label className="t-label">Cover Letter</label>
                    <textarea name="message" value={proposalForm.message} onChange={handleProposalChange}
                      placeholder="Why you're the right fit…" rows="4" required className="t-textarea" />
                  </div>
                  <button type="submit" disabled={submittingProposal} className="t-btn t-btn-primary t-btn-full">
                    {submittingProposal ? 'Submitting…' : 'Submit Proposal'}
                  </button>
                </form>
              </div>
            )}

            {/* Project info */}
            <div className="t-card" style={{ padding: '20px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 16 }}>Project Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['Status', project.status?.charAt(0).toUpperCase() + project.status?.slice(1)],
                  ['Proposals', project.proposalCount || 0],
                  ['Views', project.views || 0],
                  ['Posted On', formatDate(project.createdAt)],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)' }}>{label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails