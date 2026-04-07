import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CustomerDashboard = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')

  const [stats, setStats] = useState({
    totalProjects: 0,
    openProjects: 0,
    completedProjects: 0,
  })
  const [recentProjects, setRecentProjects] = useState([])
  const [totalBudget, setTotalBudget] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchDashboardData()
  }, [token, navigate])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, projectsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/users/${userId}/stats`, {
          headers: { 'Content-Type': 'application/json' },
        }),
        fetch(`http://localhost:5000/api/projects/client/${userId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ])

      if (statsRes.ok && projectsRes.ok) {
        const statsData = await statsRes.json()
        const projectsData = await projectsRes.json()

        const s = statsData.data?.stats || {}
        setStats({
          totalProjects: s.totalProjects || 0,
          openProjects: s.openProjects || 0,
          completedProjects: s.completedProjects || 0,
        })

        // Calculate total budget and get recent projects
        const projects = projectsData.data || []
        let budget = 0
        projects.forEach((p) => {
          budget += p.budget || 0
        })
        setTotalBudget(budget)
        setRecentProjects(projects.slice(0, 5))
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome back!</h1>
          <p className="mt-2 text-gray-600">Manage your projects and track freelancer proposals</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Projects */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Projects */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.openProjects}</p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed Projects */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{stats.completedProjects}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Budget */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  ${(totalBudget / 1000).toFixed(1)}k
                </p>
                <p className="text-xs text-gray-500 mt-1">{recentProjects.length} projects</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => navigate('/customer/new-project')}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white hover:shadow-lg transition-shadow"
          >
            <svg className="h-6 w-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <p className="font-semibold">Create Project</p>
            <p className="text-sm text-blue-100">Post a new project</p>
          </button>

          <button
            onClick={() => navigate('/customer/view-freelancers')}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white hover:shadow-lg transition-shadow"
          >
            <svg className="h-6 w-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20h12v-2a9 9 0 00-18 0v2z" />
            </svg>
            <p className="font-semibold">Find Freelancers</p>
            <p className="text-sm text-purple-100">Browse top talent</p>
          </button>

          <button
            onClick={() => navigate('/customer/my-activity')}
            className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 p-6 text-white hover:shadow-lg transition-shadow"
          >
            <svg className="h-6 w-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold">My Activity</p>
            <p className="text-sm text-green-100">Track proposals</p>
          </button>
        </div>

        {/* Recent Projects */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
          </div>

          {recentProjects.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600 mb-4">No projects yet</p>
              <button
                onClick={() => navigate('/customer/new-project')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first project →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentProjects.map((project) => (
                <div key={project._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">${project.budget}</span> • 
                        Due {formatDate(project.deadline)} • 
                        {project.proposalCount || 0} proposals
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {project.requiredSkills?.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                            {skill}
                          </span>
                        ))}
                        {(project.requiredSkills?.length || 0) > 3 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            +{(project.requiredSkills?.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ml-4 whitespace-nowrap ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard
