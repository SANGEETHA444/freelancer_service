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
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-[32px] bg-white p-8 shadow-xl shadow-slate-200/40">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">New Project</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Post a New Project</h1>
          <p className="mt-2 text-slate-600">Fill in the details below to post your project and connect with freelancers.</p>
        </div>

        {apiError && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Project Title</span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Build a React Dashboard"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
          </label>

          {/* Description */}
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Project Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="6"
              placeholder="Provide detailed information about your project, requirements, and expectations..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
          </label>

          {/* Category */}
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
          </label>

          {/* Budget and Deadline */}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Budget (USD)</span>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="e.g., 5000"
                step="0.01"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              {errors.budget && <p className="mt-2 text-sm text-red-600">{errors.budget}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Deadline</span>
              <input
                type="datetime-local"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              {errors.deadline && <p className="mt-2 text-sm text-red-600">{errors.deadline}</p>}
            </label>
          </div>

          {/* Experience Level and Skills */}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Experience Level Required</span>
              <select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Required Skills (comma separated)</span>
              <input
                type="text"
                name="requiredSkills"
                value={form.requiredSkills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
            >
              {loading ? 'Creating Project...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/customer/dashboard')}
              className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerNewProject
