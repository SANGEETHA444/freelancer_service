import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function FreeViewProjects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    status: 'open',
    category: '',
    page: 1,
  })

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

  // Fetch projects
  useEffect(() => {
    fetchProjects()
  }, [filters])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      let query = `http://localhost:5000/api/projects?status=${filters.status}&page=${filters.page}`

      if (filters.category) {
        query += `&category=${filters.category}`
      }

      const response = await fetch(query)
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to fetch projects')
        return
      }

      setProjects(data.data || [])
      setError('')
    } catch (err) {
      console.error('Fetch projects error:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (status) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }))
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getDaysRemaining = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 'Expired'
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-950">Available Projects</h1>
          <p className="mt-2 text-slate-600">Browse and find projects that match your skills</p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: 'open', category: '', page: 1 })}
                className="w-full rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
              <p className="mt-4 text-slate-600">Loading projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <p className="text-slate-600">No projects found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="inline-block rounded full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    {project.category}
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 line-clamp-2 text-lg font-semibold text-slate-950">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {project.description}
                  </p>

                  {/* Budget & Deadline */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                    <div>
                      <p className="text-2xl font-bold text-sky-600">${project.budget}</p>
                      <p className="text-xs text-slate-500">Project Budget</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {getDaysRemaining(project.deadline)} days
                      </p>
                      <p className="text-xs text-slate-500">
                        Due {formatDate(project.deadline)}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  {project.requiredSkills && project.requiredSkills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-slate-700">Required Skills:</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.requiredSkills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                        {project.requiredSkills.length > 3 && (
                          <span className="text-xs text-slate-500">
                            +{project.requiredSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Client Info */}
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <div className="flex items-center">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {project.client?.firstName} {project.client?.lastName}
                        </p>
                        <p className="text-xs text-slate-500">Project Posted</p>
                      </div>
                    </div>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/project/${project._id}`)}
                    className="mt-4 w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FreeViewProjects
