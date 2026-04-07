import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function FreeViewProjects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ status: 'open', category: '', page: 1 })

  const categories = ['Web Development','Mobile App','UI/UX Design','Data Science','Machine Learning','Blockchain','DevOps','QA Testing','Content Writing','Graphic Design','Other']

  useEffect(() => { fetchProjects() }, [filters])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      let query = `http://localhost:5000/api/projects?status=${filters.status}&page=${filters.page}`
      if (filters.category) query += `&category=${filters.category}`
      const res = await fetch(query)
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to fetch projects'); return }
      setProjects(data.data || []); setError('')
    } catch { setError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  const formatDate = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const getDaysRemaining = d => { const days = Math.ceil((new Date(d) - new Date()) / 86400000); return days > 0 ? days : 'Expired' }

  return (
    <div>
      <div className="t-page-header">
        <h1 className="t-page-title">Available Projects</h1>
        <p className="t-page-subtitle">Browse and find projects that match your skills</p>
      </div>

      {/* Filters */}
      <div className="t-card" style={{ padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
          <div>
            <label className="t-label">Status</label>
            <select value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))} className="t-select">
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="t-label">Category</label>
            <select value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value, page: 1 }))} className="t-select">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={() => setFilters({ status: 'open', category: '', page: 1 })} className="t-btn t-btn-outline t-btn-full">Reset Filters</button>
          </div>
        </div>
      </div>

      {error && <div className="t-alert t-alert-error">{error}</div>}

      {loading ? (
        <div className="t-spinner"><div className="t-spin" /><span>Loading projects…</span></div>
      ) : projects.length === 0 ? (
        <div className="t-card"><div className="t-empty"><p className="t-empty-title">No projects found</p><p className="t-empty-text">Try adjusting your filters.</p></div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {projects.map(project => (
            <div key={project._id} className="t-card" style={{ transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.15)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
              <div style={{ padding: 20 }}>
                <span className="t-badge t-badge-green" style={{ marginBottom: 12, display: 'inline-block' }}>{project.category}</span>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{project.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{project.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border)', marginBottom: 14 }}>
                  <div><p style={{ fontSize: 20, fontWeight: 800, color: 'var(--green-dark)' }}>${project.budget}</p><p style={{ fontSize: 11, color: 'var(--muted)' }}>Budget</p></div>
                  <div style={{ textAlign: 'right' }}><p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{getDaysRemaining(project.deadline)} days</p><p style={{ fontSize: 11, color: 'var(--muted)' }}>Due {formatDate(project.deadline)}</p></div>
                </div>
                {project.requiredSkills?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                    {project.requiredSkills.slice(0, 3).map((s, i) => <span key={i} className="t-tag">{s}</span>)}
                    {project.requiredSkills.length > 3 && <span className="t-tag">+{project.requiredSkills.length - 3}</span>}
                  </div>
                )}
                <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', marginBottom: 14 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{project.client?.firstName} {project.client?.lastName}</p>
                  <p style={{ fontSize: 11, color: 'var(--muted)' }}>Project Posted</p>
                </div>
                <button onClick={() => navigate(`/project/${project._id}`)} className="t-btn t-btn-primary t-btn-full">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FreeViewProjects
