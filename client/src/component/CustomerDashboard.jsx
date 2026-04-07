import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CustomerDashboard = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')

  const [stats, setStats] = useState({ totalProjects: 0, openProjects: 0, completedProjects: 0 })
  const [recentProjects, setRecentProjects] = useState([])
  const [totalBudget, setTotalBudget] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchDashboardData()
  }, [token, navigate])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, projectsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/users/${userId}/stats`, { headers: { 'Content-Type': 'application/json' } }),
        fetch(`http://localhost:5000/api/projects/client/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ])
      if (statsRes.ok && projectsRes.ok) {
        const statsData = await statsRes.json()
        const projectsData = await projectsRes.json()
        const s = statsData.data?.stats || {}
        setStats({ totalProjects: s.totalProjects || 0, openProjects: s.openProjects || 0, completedProjects: s.completedProjects || 0 })
        const projects = projectsData.data || []
        setTotalBudget(projects.reduce((sum, p) => sum + (p.budget || 0), 0))
        setRecentProjects(projects.slice(0, 5))
      }
    } catch { setError('Failed to load dashboard data') }
    finally { setLoading(false) }
  }

  const statusBadge = s => ({ open: 't-badge-green', 'in-progress': 't-badge-yellow', completed: 't-badge-black', cancelled: 't-badge-red' }[s] || 't-badge-gray')
  const formatDate = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  if (loading) return <div className="t-spinner"><div className="t-spin" /><span>Loading dashboard…</span></div>

  return (
    <div>
      <div className="t-page-header">
        <h1 className="t-page-title">Welcome back!</h1>
        <p className="t-page-subtitle">Manage your projects and track freelancer proposals</p>
      </div>

      {error && <div className="t-alert t-alert-error">{error}</div>}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Projects', value: stats.totalProjects },
          { label: 'Active', value: stats.openProjects },
          { label: 'Completed', value: stats.completedProjects },
        ].map(({ label, value }) => (
          <div key={label} className="t-stat">
            <p className="t-stat-label">{label}</p>
            <p className="t-stat-value">{value}</p>
          </div>
        ))}
        <div className="t-stat">
          <p className="t-stat-label">Total Budget</p>
          <p className="t-stat-value">${(totalBudget / 1000).toFixed(1)}k</p>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{recentProjects.length} projects</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 22 }}>
        {[
          { label: 'Create Project', sub: 'Post a new project', path: '/customer/new-project', bg: 'linear-gradient(135deg,#16a34a,#22c55e)' },
          { label: 'Find Freelancers', sub: 'Browse top talent', path: '/customer/view-freelancers', bg: 'linear-gradient(135deg,#0a0a0a,#1a2a1a)' },
          { label: 'My Activity', sub: 'Track proposals', path: '/customer/my-activity', bg: 'linear-gradient(135deg,#111,#1c2a1c)' },
        ].map(({ label, sub, path, bg }) => (
          <button key={label} onClick={() => navigate(path)} className="t-action" style={{ background: bg, border: '1px solid rgba(34,197,94,0.2)' }}>
            <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: 12, opacity: 0.65 }}>{sub}</p>
          </button>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="t-card">
        <div className="t-card-header">
          <h2 className="t-card-title">Recent Projects</h2>
          <button onClick={() => navigate('/customer/new-project')} className="t-btn t-btn-primary t-btn-sm">+ New Project</button>
        </div>
        {recentProjects.length === 0 ? (
          <div className="t-empty">
            <p className="t-empty-title">No projects yet</p>
            <p className="t-empty-text">Create your first project to get started</p>
            <button onClick={() => navigate('/customer/new-project')} className="t-btn t-btn-primary" style={{ marginTop: 14 }}>Create Project</button>
          </div>
        ) : (
          recentProjects.map((project, i) => (
            <div key={project._id} style={{ padding: '14px 22px', borderBottom: i < recentProjects.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 3 }}>{project.title}</p>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: 'var(--green-dark)' }}>${project.budget}</span>
                    {' · '}Due {formatDate(project.deadline)}{' · '}{project.proposalCount || 0} proposals
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {project.requiredSkills?.slice(0, 3).map((s, idx) => <span key={idx} className="t-tag">{s}</span>)}
                    {(project.requiredSkills?.length || 0) > 3 && <span className="t-tag">+{project.requiredSkills.length - 3}</span>}
                  </div>
                </div>
                <span className={`t-badge ${statusBadge(project.status)}`} style={{ flexShrink: 0 }}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CustomerDashboard
