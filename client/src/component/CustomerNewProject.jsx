import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CustomerNewProject() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [form, setForm] = useState({ title: '', description: '', category: 'Web Development', budget: '', deadline: '', requiredSkills: '', experience: 'Intermediate' })
  const [errors, setErrors] = useState({})

  const categories = ['Web Development','Mobile App','UI/UX Design','Data Science','Machine Learning','Blockchain','DevOps','QA Testing','Content Writing','Graphic Design','Other']

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Project title is required'
    else if (form.title.length < 5) e.title = 'Title must be at least 5 characters'
    if (!form.description.trim()) e.description = 'Description is required'
    else if (form.description.length < 20) e.description = 'Description must be at least 20 characters'
    if (!form.category) e.category = 'Please select a category'
    if (!form.budget) e.budget = 'Budget is required'
    else if (isNaN(form.budget) || parseFloat(form.budget) <= 0) e.budget = 'Budget must be a positive number'
    if (!form.deadline) e.deadline = 'Deadline is required'
    else if (new Date(form.deadline) <= new Date()) e.deadline = 'Deadline must be in the future'
    return e
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: undefined }))
    setApiError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const fe = validate(); setErrors(fe)
    if (Object.keys(fe).length) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) { setApiError('You must be logged in to create a project'); return }
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: form.title, description: form.description, category: form.category, budget: parseFloat(form.budget), deadline: new Date(form.deadline).toISOString(), requiredSkills: form.requiredSkills ? form.requiredSkills.split(',').map(s => s.trim()) : [], experience: form.experience }),
      })
      const data = await res.json()
      if (!res.ok) { setApiError(data.message || 'Failed to create project'); return }
      navigate('/customer/dashboard')
    } catch { setApiError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="t-page-header">
        <h1 className="t-page-title">Post a New Project</h1>
        <p className="t-page-subtitle">Fill in the details below to connect with freelancers.</p>
      </div>

      <div className="t-card" style={{ maxWidth: 680 }}>
        <div className="t-card-body">
          {apiError && <div className="t-alert t-alert-error">{apiError}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="t-label">Project Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g., Build a React Dashboard" className={`t-input${errors.title ? ' err' : ''}`} />
              {errors.title && <p className="t-field-err">{errors.title}</p>}
            </div>
            <div>
              <label className="t-label">Project Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="5" placeholder="Provide detailed information about your project..." className="t-textarea" />
              {errors.description && <p className="t-field-err">{errors.description}</p>}
            </div>
            <div>
              <label className="t-label">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="t-select">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="t-field-err">{errors.category}</p>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="t-label">Budget (USD)</label>
                <input type="number" name="budget" value={form.budget} onChange={handleChange} placeholder="e.g., 5000" step="0.01" className={`t-input${errors.budget ? ' err' : ''}`} />
                {errors.budget && <p className="t-field-err">{errors.budget}</p>}
              </div>
              <div>
                <label className="t-label">Deadline</label>
                <input type="datetime-local" name="deadline" value={form.deadline} onChange={handleChange} className={`t-input${errors.deadline ? ' err' : ''}`} />
                {errors.deadline && <p className="t-field-err">{errors.deadline}</p>}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="t-label">Experience Level Required</label>
                <select name="experience" value={form.experience} onChange={handleChange} className="t-select">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="t-label">Required Skills (comma separated)</label>
                <input type="text" name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="e.g., React, Node.js" className="t-input" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
              <button type="submit" disabled={loading} className="t-btn t-btn-primary t-btn-lg t-btn-full">{loading ? 'Creating Project…' : 'Create Project'}</button>
              <button type="button" onClick={() => navigate('/customer/dashboard')} className="t-btn t-btn-outline t-btn-lg t-btn-full">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CustomerNewProject
