import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FreeDashboard = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')

  const [stats, setStats] = useState({ totalProposals: 0, acceptedProposals: 0, pendingProposals: 0, averageRating: 0 })
  const [recentProposals, setRecentProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchDashboardData()
  }, [token, navigate])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, proposalsRes, ratingRes] = await Promise.all([
        fetch(`http://localhost:5000/api/users/${userId}/stats`, { headers: { 'Content-Type': 'application/json' } }),
        fetch(`http://localhost:5000/api/proposals/freelancer/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:5000/api/reviews/user/${userId}/rating`, { headers: { 'Content-Type': 'application/json' } }),
      ])
      if (statsRes.ok && proposalsRes.ok && ratingRes.ok) {
        const statsData = await statsRes.json()
        const proposalsData = await proposalsRes.json()
        const ratingData = await ratingRes.json()
        const s = statsData.data?.stats || {}
        setStats({ totalProposals: s.totalProposals || 0, acceptedProposals: s.acceptedProposals || 0, pendingProposals: s.pendingProposals || 0, averageRating: ratingData.averageRating || 0 })
        setRecentProposals((proposalsData.data || []).slice(0, 5))
      }
    } catch { setError('Failed to load dashboard data') }
    finally { setLoading(false) }
  }

  const statusBadge = s => ({ pending: 't-badge-yellow', accepted: 't-badge-green', rejected: 't-badge-red' }[s] || 't-badge-gray')

  const renderStars = r => (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= Math.round(r) ? '#fbbf24' : '#2a2a2a', fontSize: 14 }}>★</span>)}
    </div>
  )

  if (loading) return <div className="t-spinner"><div className="t-spin" /><span>Loading dashboard…</span></div>

  return (
    <div>
      <div className="t-page-header">
        <h1 className="t-page-title">Welcome back!</h1>
        <p className="t-page-subtitle">Here's what's happening with your freelance business</p>
      </div>

      {error && <div className="t-alert t-alert-error">{error}</div>}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Proposals', value: stats.totalProposals },
          { label: 'Accepted', value: stats.acceptedProposals },
          { label: 'Pending', value: stats.pendingProposals },
        ].map(({ label, value }) => (
          <div key={label} className="t-stat">
            <p className="t-stat-label">{label}</p>
            <p className="t-stat-value">{value}</p>
          </div>
        ))}
        <div className="t-stat">
          <p className="t-stat-label">Your Rating</p>
          <p className="t-stat-value">{stats.averageRating.toFixed(1)}</p>
          <div style={{ marginTop: 6 }}>{renderStars(stats.averageRating)}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 22 }}>
        {[
          { label: 'Browse Projects', sub: 'Find new opportunities', path: '/freelancer/view-projects', bg: 'linear-gradient(135deg,#0a0a0a,#1a2a1a)' },
          { label: 'My Proposals', sub: 'Check your submissions', path: '/freelancer/my-activity', bg: 'linear-gradient(135deg,#16a34a,#22c55e)' },
          { label: 'Reviews', sub: 'View your feedback', path: '/freelancer/reviews', bg: 'linear-gradient(135deg,#111,#1c2a1c)' },
        ].map(({ label, sub, path, bg }) => (
          <button key={label} onClick={() => navigate(path)} className="t-action" style={{ background: bg, border: '1px solid rgba(34,197,94,0.2)' }}>
            <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: 12, opacity: 0.65 }}>{sub}</p>
          </button>
        ))}
      </div>

      {/* Recent Proposals */}
      <div className="t-card">
        <div className="t-card-header">
          <h2 className="t-card-title">Recent Proposals</h2>
        </div>
        {recentProposals.length === 0 ? (
          <div className="t-empty">
            <p className="t-empty-title">No proposals yet</p>
            <p className="t-empty-text">Browse projects to submit your first proposal</p>
            <button onClick={() => navigate('/freelancer/view-projects')} className="t-btn t-btn-primary" style={{ marginTop: 14 }}>Browse Projects</button>
          </div>
        ) : (
          recentProposals.map((p, i) => (
            <div key={p._id} style={{ padding: '14px 22px', borderBottom: i < recentProposals.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 3 }}>{p.project?.title}</p>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>Bid: <span style={{ fontWeight: 600, color: 'var(--green-dark)' }}>${p.bidAmount}</span> · {p.deliveryDays} {p.deliveryDays === 1 ? 'day' : 'days'}</p>
              </div>
              <span className={`t-badge ${statusBadge(p.status)}`}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FreeDashboard
