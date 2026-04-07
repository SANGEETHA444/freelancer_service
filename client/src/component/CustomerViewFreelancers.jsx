import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CustomerViewFreelancers = () => {
  const navigate = useNavigate()
  const [freelancers, setFreelancers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')
  const [minRating, setMinRating] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedFreelancer, setSelectedFreelancer] = useState(null)

  const allSkills = ['React','Node.js','MongoDB','Python','JavaScript','TypeScript','Vue.js','Angular','Express','Django','PostgreSQL','MySQL','AWS','Docker','GraphQL','REST API','HTML/CSS','Web Design']

  useEffect(() => { fetchFreelancers() }, [page, selectedSkill, selectedExperience, minRating])

  const fetchFreelancers = async () => {
    try {
      setLoading(true); setError('')
      let url = `http://localhost:5000/api/users/freelancers?page=${page}&limit=12`
      if (selectedSkill) url += `&skills=${encodeURIComponent(selectedSkill)}`
      if (selectedExperience) url += `&experience=${selectedExperience}`
      if (minRating) url += `&minRating=${minRating}`
      const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } })
      if (!res.ok) throw new Error('Failed to fetch freelancers')
      const data = await res.json()
      setFreelancers(data.data || []); setTotalPages(data.pagination?.pages || 1)
    } catch (err) { setError(err.message); setFreelancers([]) }
    finally { setLoading(false) }
  }

  const handleSearch = async e => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    try {
      setLoading(true); setError('')
      const res = await fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(searchQuery)}&role=freelancer`, { headers: { 'Content-Type': 'application/json' } })
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setFreelancers(data.data || []); setPage(1); setSelectedSkill(''); setSelectedExperience(''); setMinRating('')
    } catch (err) { setError(err.message); setFreelancers([]) }
    finally { setLoading(false) }
  }

  const getInitials = (f, l) => `${(f || 'F')[0]}${(l || 'L')[0]}`.toUpperCase()

  if (selectedFreelancer) {
    const f = selectedFreelancer
    return (
      <div>
        <button onClick={() => setSelectedFreelancer(null)} className="t-btn t-btn-outline t-btn-sm" style={{ marginBottom: 20 }}>← Back to Freelancers</button>
        <div className="t-card" style={{ maxWidth: 720 }}>
          <div className="t-banner" />
          <div className="t-profile-avatar">{getInitials(f.firstName, f.lastName)}</div>
          <div style={{ padding: '10px 22px 22px' }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>{f.firstName} {f.lastName}</h1>
            <p style={{ fontSize: 15, color: 'var(--green-dark)', fontWeight: 600 }}>{f.title || 'Freelancer'}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
              {f.rating > 0 && <span style={{ color: '#fbbf24', fontWeight: 700 }}>★ {f.rating.toFixed(1)}</span>}
              <span style={{ fontSize: 14, color: 'var(--muted)' }}>${f.hourlyRate}/hr</span>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', padding: 22 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
              {[['Experience', f.experience], ['Availability', f.availability], ['Email', f.email]].map(([l, v]) => (
                <div key={l}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{l}</p>
                  <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>
            {f.bio && <div style={{ marginBottom: 18 }}><p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>About</p><p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{f.bio}</p></div>}
            {f.skills?.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 7 }}>Skills</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{f.skills.map((s, i) => <span key={i} className="t-tag">{s}</span>)}</div>
              </div>
            )}
            {f.portfolio && <a href={f.portfolio} target="_blank" rel="noopener noreferrer" className="t-btn t-btn-outline t-btn-sm">View Portfolio →</a>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="t-page-header">
        <h1 className="t-page-title">Browse Freelancers</h1>
        <p className="t-page-subtitle">Find the perfect freelancer for your project</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, title, email…" className="t-input" style={{ flex: 1 }} />
        <button type="submit" className="t-btn t-btn-primary">Search</button>
      </form>

      {/* Filters */}
      <div className="t-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
          <div>
            <label className="t-label">Skill</label>
            <select value={selectedSkill} onChange={e => { setSelectedSkill(e.target.value); setPage(1) }} className="t-select">
              <option value="">All Skills</option>
              {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="t-label">Experience</label>
            <select value={selectedExperience} onChange={e => { setSelectedExperience(e.target.value); setPage(1) }} className="t-select">
              <option value="">All Levels</option>
              <option value="Beginner">Entry Level</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div>
            <label className="t-label">Min Rating</label>
            <select value={minRating} onChange={e => { setMinRating(e.target.value); setPage(1) }} className="t-select">
              <option value="">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={() => { setSelectedSkill(''); setSelectedExperience(''); setMinRating(''); setSearchQuery(''); setPage(1) }} className="t-btn t-btn-outline t-btn-full">Clear</button>
          </div>
        </div>
      </div>

      {error && <div className="t-alert t-alert-error">{error}</div>}

      {loading ? (
        <div className="t-spinner"><div className="t-spin" /><span>Loading freelancers…</span></div>
      ) : freelancers.length === 0 ? (
        <div className="t-card"><div className="t-empty"><p className="t-empty-title">No freelancers found</p><p className="t-empty-text">Try adjusting your filters.</p></div></div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16, marginBottom: 20 }}>
            {freelancers.map(f => (
              <div key={f._id} className="t-card" style={{ padding: 20, transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.15)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                    {getInitials(f.firstName, f.lastName)}
                  </div>
                  {f.rating > 0 && <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>★ {f.rating.toFixed(1)}</span>}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{f.firstName} {f.lastName}</h3>
                {f.title && <p style={{ fontSize: 13, color: 'var(--green-dark)', fontWeight: 600, marginBottom: 8 }}>{f.title}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
                  <span>{f.experience}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>${f.hourlyRate}/hr</span>
                </div>
                {f.skills?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                    {f.skills.slice(0, 4).map((s, i) => <span key={i} className="t-tag">{s}</span>)}
                    {f.skills.length > 4 && <span className="t-tag">+{f.skills.length - 4}</span>}
                  </div>
                )}
                {f.bio && <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{f.bio}</p>}
                <button onClick={() => setSelectedFreelancer(f)} className="t-btn t-btn-primary t-btn-full">View Profile</button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="t-pages">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="t-page-btn">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <React.Fragment key={p}>
                    {i > 0 && arr[i - 1] !== p - 1 && <span style={{ color: 'var(--muted)' }}>…</span>}
                    <button onClick={() => setPage(p)} className={`t-page-btn${page === p ? ' active' : ''}`}>{p}</button>
                  </React.Fragment>
                ))}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="t-page-btn">›</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CustomerViewFreelancers
