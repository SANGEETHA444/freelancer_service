import User from '../models/User.js'
import Proposal from '../models/Proposal.js'

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile',
    })
  }
}

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Get my profile error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching profile',
    })
  }
}

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (user can only update their own profile)
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params

    // Check authorization - user can only update their own profile
    if (id !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this profile',
      })
    }

    const {
      firstName,
      lastName,
      bio,
      profilePicture,
      title,
      company,
      phone,
      skills,
      experience,
      hourlyRate,
      portfolio,
      availability,
    } = req.body

    // Build update object
    const updateData = {}

    if (firstName) updateData.firstName = firstName
    if (lastName) updateData.lastName = lastName
    if (bio) updateData.bio = bio
    if (profilePicture) updateData.profilePicture = profilePicture
    if (title) updateData.title = title
    if (company) updateData.company = company
    if (phone) updateData.phone = phone
    if (skills) updateData.skills = skills
    if (experience) updateData.experience = experience
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate
    if (portfolio) updateData.portfolio = portfolio
    if (availability) updateData.availability = availability

    // Update user
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    })
  } catch (error) {
    console.error('Update user profile error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
    })
  }
}

// @desc    Get all freelancers with filters
// @route   GET /api/users/freelancers
// @access  Public
export const getFreelancers = async (req, res) => {
  try {
    const { skill, experience, rating, page = 1, limit = 10, search } = req.query

    // Build filter
    const filter = { role: 'freelancer' }

    if (experience) {
      filter.experience = experience
    }

    if (skill) {
      filter.skills = { $in: [skill] }
    }

    if (rating) {
      filter.rating = { $gte: parseFloat(rating) }
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ]
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 10
    const skip = (pageNum - 1) * limitNum

    // Get freelancers
    const freelancers = await User.find(filter)
      .select('-password')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limitNum)

    // Get total count
    const total = await User.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: freelancers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error('Get freelancers error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching freelancers',
    })
  }
}

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
export const searchUsers = async (req, res) => {
  try {
    const { q, role } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      })
    }

    // Build filter
    const filter = {
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } },
      ],
    }

    if (role) {
      filter.role = role
    }

    // Search users
    const users = await User.find(filter)
      .select('-password')
      .limit(20)

    res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error('Search users error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error searching users',
    })
  }
}

// @desc    Get user stats (proposals sent, accepted, etc.)
// @route   GET /api/users/:id/stats
// @access  Public
export const getUserStats = async (req, res) => {
  try {
    const { id } = req.params

    // Verify user exists
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    let stats = {}

    if (user.role === 'freelancer') {
      // Freelancer stats
      const totalProposals = await Proposal.countDocuments({ freelancer: id })
      const acceptedProposals = await Proposal.countDocuments({
        freelancer: id,
        status: 'accepted',
      })
      const rejectedProposals = await Proposal.countDocuments({
        freelancer: id,
        status: 'rejected',
      })
      const pendingProposals = await Proposal.countDocuments({
        freelancer: id,
        status: 'pending',
      })

      stats = {
        totalProposals,
        acceptedProposals,
        rejectedProposals,
        pendingProposals,
        completionRate: totalProposals > 0 ? ((acceptedProposals / totalProposals) * 100).toFixed(2) : 0,
      }
    } else {
      // Client stats
      const { Project } = await import('../models/Project.js')
      const totalProjects = await Project.countDocuments({ client: id })
      const openProjects = await Project.countDocuments({ client: id, status: 'open' })
      const completedProjects = await Project.countDocuments({
        client: id,
        status: 'completed',
      })

      stats = {
        totalProjects,
        openProjects,
        completedProjects,
      }
    }

    res.status(200).json({
      success: true,
      data: {
        userId: id,
        role: user.role,
        stats,
      },
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user stats',
    })
  }
}
