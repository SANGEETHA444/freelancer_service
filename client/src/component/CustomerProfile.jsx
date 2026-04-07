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

  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    title: '',
    bio: '',
    phone: '',
  })

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchProfile()
    fetchStats()
  }, [token, navigate])

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      const user = data.data
      setProfile(user)
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        company: user.company || '',
        title: user.title || '',
        bio: user.bio || '',
        phone: user.phone || '',
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      setStats(data.data?.stats || {})
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setError('')
      setSuccessMessage('')

      const updatePayload = {
        firstName: editData.firstName,
        lastName: editData.lastName,
        company: editData.company,
        title: editData.title,
        bio: editData.bio,
        phone: editData.phone,
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile.data)
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: Profile not found
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={() => {
              if (isEditing) {
                setEditData({
                  firstName: profile.firstName || '',
                  lastName: profile.lastName || '',
                  company: profile.company || '',
                  title: profile.title || '',
                  bio: profile.bio || '',
                  phone: profile.phone || '',
                })
                setError('')
              }
              setIsEditing(!isEditing)
            }}
            className={`px-4 py-2 rounded font-medium ${
              isEditing
                ? 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Name and Title */}
          {!isEditing ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                {profile.title && <p className="text-lg text-blue-600 mt-1">{profile.title}</p>}
                {profile.company && <p className="text-sm text-gray-600 mt-1">{profile.company}</p>}
              </div>

              {/* Stats */}
              {stats && (
                <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalProjects || 0}</div>
                    <div className="text-sm text-gray-600">Total Projects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.openProjects || 0}</div>
                    <div className="text-sm text-gray-600">Open Projects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.completedProjects || 0}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900 text-lg">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900 text-lg">{profile.phone || 'Not provided'}</p>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-600">Bio</label>
                  <p className="text-gray-900 mt-2">{profile.bio}</p>
                </div>
              )}

              {/* Browse Freelancers Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate('/customer/view-freelancers')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition duration-200"
                >
                  Browse Freelancers
                </button>
              </div>
            </>
          ) : (
            /* Edit Mode */
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={editData.company}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Project Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={editData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell about your company/organization"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setError('')
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerProfile
