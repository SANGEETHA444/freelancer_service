import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CustomerViewFreelancers = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

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

  const allSkills = [
    'React', 'Node.js', 'MongoDB', 'Python', 'JavaScript', 'TypeScript',
    'Vue.js', 'Angular', 'Express', 'Django', 'PostgreSQL', 'MySQL',
    'AWS', 'Docker', 'GraphQL', 'REST API', 'HTML/CSS', 'Web Design'
  ]

  useEffect(() => {
    fetchFreelancers()
  }, [page, selectedSkill, selectedExperience, minRating])

  const fetchFreelancers = async () => {
    try {
      setLoading(true)
      setError('')

      let url = `http://localhost:5000/api/users/freelancers?page=${page}&limit=12`

      if (selectedSkill) {
        url += `&skills=${encodeURIComponent(selectedSkill)}`
      }
      if (selectedExperience) {
        url += `&experience=${selectedExperience}`
      }
      if (minRating) {
        url += `&minRating=${minRating}`
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch freelancers')
      }

      const data = await response.json()
      setFreelancers(data.freelancers || [])
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      setError(err.message)
      setFreelancers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `http://localhost:5000/api/users/search?q=${encodeURIComponent(searchQuery)}&role=freelancer`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setFreelancers(data || [])
      setPage(1)
      setSelectedSkill('')
      setSelectedExperience('')
      setMinRating('')
    } catch (err) {
      setError(err.message)
      setFreelancers([])
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${(firstName || 'F')[0]}${(lastName || 'L')[0]}`.toUpperCase()
  }

  const handleViewProfile = (freelancer) => {
    setSelectedFreelancer(freelancer)
  }

  if (selectedFreelancer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedFreelancer(null)}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Freelancers
        </button>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(selectedFreelancer.firstName, selectedFreelancer.lastName)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedFreelancer.firstName} {selectedFreelancer.lastName}
                </h1>
                <p className="text-xl text-blue-600 mt-1">{selectedFreelancer.title || 'Freelancer'}</p>
                <div className="flex items-center gap-4 mt-3">
                  {selectedFreelancer.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-medium">{selectedFreelancer.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-600">
                    ${selectedFreelancer.hourlyRate}/hr
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
            <div>
              <label className="text-sm font-medium text-gray-600">Experience Level</label>
              <p className="text-lg text-gray-900 mt-1 capitalize">{selectedFreelancer.experience}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Availability</label>
              <p className="text-lg text-gray-900 mt-1 capitalize">{selectedFreelancer.availability}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg text-gray-900 mt-1">{selectedFreelancer.email}</p>
            </div>
          </div>

          {/* Bio */}
          {selectedFreelancer.bio && (
            <div className="mb-8">
              <label className="text-sm font-medium text-gray-600">About</label>
              <p className="text-gray-900 mt-2">{selectedFreelancer.bio}</p>
            </div>
          )}

          {/* Skills */}
          {selectedFreelancer.skills && selectedFreelancer.skills.length > 0 && (
            <div className="mb-8">
              <label className="text-sm font-medium text-gray-600 block mb-3">Skills</label>
              <div className="flex flex-wrap gap-2">
                {selectedFreelancer.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          {selectedFreelancer.portfolio && (
            <div className="mb-8">
              <a
                href={selectedFreelancer.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View Portfolio →
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Freelancers</h1>
        <p className="text-gray-600">Find the perfect freelancer for your project</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, title, email..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skill</label>
          <select
            value={selectedSkill}
            onChange={(e) => {
              setSelectedSkill(e.target.value)
              setPage(1)
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Skills</option>
            {allSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
          <select
            value={selectedExperience}
            onChange={(e) => {
              setSelectedExperience(e.target.value)
              setPage(1)
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
          <select
            value={minRating}
            onChange={(e) => {
              setMinRating(e.target.value)
              setPage(1)
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Rating</option>
            <option value="3">3+ Stars</option>
            <option value="3.5">3.5+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>

        <div>
          <button
            onClick={() => {
              setSelectedSkill('')
              setSelectedExperience('')
              setMinRating('')
              setSearchQuery('')
              setPage(1)
              fetchFreelancers()
            }}
            className="w-full h-10 mt-6 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading freelancers...</p>
        </div>
      ) : freelancers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No freelancers found matching your criteria.</p>
        </div>
      ) : (
        <>
          {/* Freelancers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {freelancers.map((freelancer) => (
              <div key={freelancer._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                {/* Avatar */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {getInitials(freelancer.firstName, freelancer.lastName)}
                  </div>
                  {freelancer.rating && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium text-yellow-700">{freelancer.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Name and Title */}
                <h3 className="text-lg font-bold text-gray-900">
                  {freelancer.firstName} {freelancer.lastName}
                </h3>
                {freelancer.title && (
                  <p className="text-sm text-blue-600 font-medium">{freelancer.title}</p>
                )}

                {/* Experience and Rate */}
                <div className="flex items-center justify-between my-3 text-sm text-gray-600">
                  <span className="capitalize">{freelancer.experience}</span>
                  <span className="font-semibold text-gray-900">${freelancer.hourlyRate}/hr</span>
                </div>

                {/* Skills */}
                {freelancer.skills && freelancer.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {freelancer.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {freelancer.skills.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{freelancer.skills.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Bio snippet */}
                {freelancer.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {freelancer.bio}
                  </p>
                )}

                {/* View Profile Button */}
                <button
                  onClick={() => handleViewProfile(freelancer)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, index, arr) => (
                    <React.Fragment key={p}>
                      {index > 0 && arr[index - 1] !== p - 1 && <span className="px-2">...</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={`px-3 py-2 rounded-lg ${
                          page === p
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CustomerViewFreelancers
