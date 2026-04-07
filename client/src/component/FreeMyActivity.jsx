import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function FreeMyActivity() {
  const navigate = useNavigate()
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => { fetchProposals() }, [activeFilter])

  const fetchProposals = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      if (!token) { navigate('/login'); return }
      let query = `http://localhost:5000/api/proposals/freelancer/${userId}`
      if (activeFilter !== 'all') query += `?status=${activeFilter}`
      const res = await fetch(query, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to fetch proposals'); return }
      setProposals(data.data || []); setError('')
    } catch { setError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  const formatDate = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const statusBadge = s => ({ pending: 't-badge-yellow', accepted: 't-badge-green', rejected: 't-badge-red' }[s] || 't-badge-gray')

  return (
    <div>
      <div className="t-page-header">
        <h1 className="t-page-title">My Activity</h1>
        <p className="t-page-subtitle">Track all your proposals and their status</p>
      </div>

      <div className="t-tabs">
        {[{ value: 'all', label: 'All Proposals' }, { value: 'pending', label: 'Pending' }, { value: 'accepted', label: 'Accepted' }, { value: 'rejected', label: 'Rejected' }].map(f => (
          <button key={f.value} onClick={() => setActiveFilter(f.value)} className={`t-tab${activeFilter === f.value ? ' active' : ''}`}>{f.label}</button>
        ))}
      </div>

      {error && <div className="t-alert t-alert-error">{error}</div>}

      {loading ? (
        <div className="t-spinner"><div className="t-spin" /><span>Loading proposals…</span></div>
      ) : proposals.length === 0 ? (
        <div className="t-card"><div className="t-empty">
          <p className="t-empty-title">No proposals found</p>
          <p className="t-empty-text">{activeFilter === 'all' ? 'You have not submitted any proposals yet.' : `No ${activeFilter} proposals.`}</p>
        </div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {proposals.map(proposal => (
            <div key={proposal._id} className="t-card">
              <div style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <h3 onClick={() => navigate(`/project/${proposal.project._id}`)}
                      style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', cursor: 'pointer', marginBottom: 5 }}
                      onMouseEnter={e => e.target.style.color = 'var(--green-dark)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text)'}>
                      {proposal.project.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`t-badge ${statusBadge(proposal.status)}`}>{proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}</span>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>Submitted {formatDate(proposal.createdAt)}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/project/${proposal.project._id}`)} className="t-btn t-btn-outline t-btn-sm">View Project</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, padding: '14px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
                  <div><p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3 }}>Your Bid</p><p style={{ fontSize: 18, fontWeight: 800, color: 'var(--green-dark)' }}>${proposal.bidAmount?.toLocaleString()}</p></div>
                  <div><p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3 }}>Delivery</p><p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{proposal.deliveryDays} days</p></div>
                  <div><p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3 }}>Project Budget</p><p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>${proposal.project?.budget?.toLocaleString()}</p></div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Cover Letter</p>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{proposal.message}</p>
                {proposal.clientFeedback && (
                  <div style={{ background: 'var(--black-4)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginTop: 12, border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 3 }}>Client Feedback</p>
                    <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{proposal.clientFeedback}</p>
                  </div>
                )}
                {proposal.status === 'accepted' && <div className="t-alert t-alert-success" style={{ margin: '12px 0 0' }}>🎉 Congratulations! Your proposal was accepted.</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FreeMyActivity
