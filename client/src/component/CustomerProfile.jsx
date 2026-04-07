import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CustomerProfile = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [editData, setEditData] = useState({ firstName: '', lastName: '', company: '', title: '', bio: '', phone: '' })

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchProfile(); fetchStats()
  }, [token, navigate])

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/me', { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } })
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      const user = data.data
      setProfile(user)
      setEditData({ firstName: user.firstName || '', lastName: user.lastName || '', company: user.company || '', title: user.title || '', bio: user.bio || '', phone: user.phone || '' })
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/stats`, { headers: { 'Content-Type': 'application/json' } })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setStats(data.data?.stats || {})
    } catch { }
  }

  const handleInputChange = e => setEditData(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSaveProfile = async () => {
    try {
      setError(''); setSuccessMessage('')
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed to update profile') }
      const updated = await res.json()
      setProfile(updated.data); setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) { setError(err.message) }
  }

  if (loading) return <div className="t-spinner"><div className="t-spin" /><span>Loading profile…</span></div>
  if (!profile) return <div className="t-alert t-alert-error">Profile not found</div>

  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="t-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div><h1 className="t-page-title">My Profile</h1><p className="t-page-subtitle">Manage your client profile</p></div>
        <button onClick={() => {
          if (isEditing) { setEditData({ firstName: profile.firstName || '', lastName: profile.lastName || '', company: profile.company || '', title: profile.title || '', bio: profile.bio || '', phone: profile.phone || '' }); setError('') }
          setIsEditing(!isEditing)
        }} className={`t-btn ${isEditing ? 't-btn-outline' : 't-btn-primary'}`}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {error && <div className="t-alert t-alert-error">{error}</div>}
      {successMessage && <div className="t-alert t-alert-success">{successMessage}</div>}

      <div className="t-card">
        <div className="t-banner" />
        <div className="t-profile-avatar">{initials}</div>
        <div style={{ padding: '10px 22px 20px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{profile.firstName} {profile.lastName}</h2>
          {profile.title && <p style={{ fontSize: 14, color: 'var(--green-dark)', fontWeight: 600, marginTop: 2 }}>{profile.title}</p>}
          {profile.company && <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{profile.company}</p>}
        </div>

        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            {[['Total Projects', stats.totalProjects || 0], ['Open', stats.openProjects || 0], ['Completed', stats.completedProjects || 0]].map(([l, v]) => (
              <div key={l} style={{ padding: '14px 22px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--green-dark)' }}>{v}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        )}

        {!isEditing ? (
          <div style={{ padding: 22 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
              {[['Email', profile.email], ['Phone', profile.phone || 'Not provided']].map(([l, v]) => (
                <div key={l}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{l}</p>
                  <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>
            {profile.bio && <div style={{ marginBottom: 16 }}><p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Bio</p><p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{profile.bio}</p></div>}
            <div className="t-divider" />
            <button onClick={() => navigate('/customer/view-freelancers')} className="t-btn t-btn-primary t-btn-full">Browse Freelancers</button>
          </div>
        ) : (
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['firstName', 'First Name'], ['lastName', 'Last Name']].map(([n, l]) => (
                <div key={n}><label className="t-label">{l}</label><input name={n} value={editData[n]} onChange={handleInputChange} className="t-input" /></div>
              ))}
            </div>
            <div><label className="t-label">Company</label><input name="company" value={editData.company} onChange={handleInputChange} placeholder="Your company name" className="t-input" /></div>
            <div><label className="t-label">Job Title</label><input name="title" value={editData.title} onChange={handleInputChange} placeholder="e.g., Project Manager" className="t-input" /></div>
            <div><label className="t-label">Phone</label><input type="tel" name="phone" value={editData.phone} onChange={handleInputChange} placeholder="+1 (555) 123-4567" className="t-input" /></div>
            <div><label className="t-label">Bio</label><textarea name="bio" value={editData.bio} onChange={handleInputChange} rows="4" placeholder="Tell about your company/organization" className="t-textarea" /></div>
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button onClick={handleSaveProfile} className="t-btn t-btn-primary t-btn-full">Save Changes</button>
              <button onClick={() => { setIsEditing(false); setError('') }} className="t-btn t-btn-outline t-btn-full">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerProfile
