import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CustomerNewProject() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    budget: '',
    deadline: '',
    requiredSkills: '',
    experience: 'Intermediate',
  })
  const [errors, setErrors] = useState({})

  const categories = [
    'Web Development',
    'Mobile App',
    'UI/UX Design',
    'Data Science',
    'Machine Learning',
    'Blockchain',
    'DevOps',
    'QA Testing',
    'Content Writing',
    'Graphic Design',
    'Other',
  ]

  const validate = () => {
    const fieldErrors = {}

    if (!form.title.trim()) {
      fieldErrors.title = 'Project title is required'
    } else if (form.title.length < 5) {
      fieldErrors.title = 'Title must be at least 5 characters'
    }

    if (!form.description.trim()) {
      fieldErrors.description = 'Description is required'
    } else if (form.description.length < 20) {
      fieldErrors.description = 'Description must be at least 20 characters'
    }

    if (!form.category) fieldErrors.category = 'Please select a category'

    if (!form.budget) {
      fieldErrors.budget = 'Budget is required'
    } else if (isNaN(form.budget) || parseFloat(form.budget) <= 0) {
      fieldErrors.budget = 'Budget must be a positive number'
    }

    if (!form.deadline) {
      fieldErrors.deadline = 'Deadline is required'
    } else if (new Date(form.deadline) <= new Date()) {
      fieldErrors.deadline = 'Deadline must be in the future'
    }

    return fieldErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const fieldErrors = validate()
    setErrors(fieldErrors)

    if (Object.keys(fieldErrors).length === 0) {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          setApiError('You must be logged in to create a project')
          return
        }

        const response = await fetch('http://localhost:5000/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            category: form.category,
            budget: parseFloat(form.budget),
            deadline: new Date(form.deadline).toISOString(),
            requiredSkills: form.requiredSkills ? form.requiredSkills.split(',').map((s) => s.trim()) : [],
            experience: form.experience,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setApiError(data.message || 'Failed to create project')
          return
        }

        // Success - redirect to customer dashboard or project view
        navigate('/customer/dashboard')
      } catch (error) {
        console.error('Create project error:', error)
        setApiError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <div className="af-page-header">
        <p style={{fontSize:11, fontWeight:700, color:'var(--orange)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6}}>New Project</p>
        <h1 className="af-page-title">Post a New Project</h1>
        <p className="af-page-subtitle">Fill in the details below to post your project and connect with freelancers.</p>
      </div>

      <div className="af-card" style={{maxWidth:680}}>
        <div className="af-card-body">

        {apiError && <div className="af-alert af-alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:18}}>
          <div>
            <label className="af-label">Project Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g., Build a React Dashboard" className={`af-input${errors.title?' error':''}`} />
            {errors.title && <p className="af-field-error">{errors.title}</p>}
          </div>

          <div>
            <label className="af-label">Project Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="5" placeholder="Provide detailed information about your project..." className={`af-textarea${errors.description?' error':''}`} />
            {errors.description && <p className="af-field-error">{errors.description}</p>}
          </div>

          <div>
            <label className="af-label">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="af-select">
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="af-field-error">{errors.category}</p>}
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div>
              <label className="af-label">Budget (USD)</label>
              <input type="number" name="budget" value={form.budget} onChange={handleChange} placeholder="e.g., 5000" step="0.01" className={`af-input${errors.budget?' error':''}`} />
              {errors.budget && <p className="af-field-error">{errors.budget}</p>}
            </div>
            <div>
              <label className="af-label">Deadline</label>
              <input type="datetime-local" name="deadline" value={form.deadline} onChange={handleChange} className={`af-input${errors.deadline?' error':''}`} />
              {errors.deadline && <p className="af-field-error">{errors.deadline}</p>}
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div>
              <label className="af-label">Experience Level Required</label>
              <select name="experience" value={form.experience} onChange={handleChange} className="af-select">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="af-label">Required Skills (comma separated)</label>
              <input type="text" name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="e.g., React, Node.js" className="af-input" />
            </div>
          </div>

          <div style={{display:'flex', gap:12, paddingTop:4}}>
            <button type="submit" disabled={loading} className="af-btn af-btn-primary af-btn-lg af-btn-full">{loading ? 'Creating Project…' : 'Create Project'}</button>
            <button type="button" onClick={() => navigate('/customer/dashboard')} className="af-btn af-btn-outline af-btn-lg af-btn-full">Cancel</button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default CustomerNewProject
