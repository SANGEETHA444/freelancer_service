import Project from '../models/Project.js'
import User from '../models/User.js'

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (client only)
export const createProject = async (req, res) => {
  try {
    const { title, description, category, budget, deadline, requiredSkills, experience } =
      req.body

    // Validate input
    if (!title || !description || !category || !budget || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      })
    }

    // Create project with client ID from authenticated user
    const project = await Project.create({
      title,
      description,
      category,
      budget,
      deadline,
      requiredSkills: requiredSkills || [],
      experience: experience || 'Intermediate',
      client: req.user._id,
    })

    // Populate client info for response
    await project.populate('client', 'firstName lastName email profilePicture')

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    })
  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating project',
    })
  }
}

// @desc    Get all projects (with filters and pagination)
// @route   GET /api/projects
// @access  Public
export const getAllProjects = async (req, res) => {
  try {
    const { status = 'open', category, skill, page = 1, limit = 10, search } = req.query

    // Build filter object
    const filter = {}

    if (status) {
      filter.status = status
    }

    if (category) {
      filter.category = category
    }

    if (skill) {
      filter.requiredSkills = { $in: [skill] }
    }

    if (search) {
      filter.$text = { $search: search }
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 10
    const skip = (pageNum - 1) * limitNum

    // Query projects
    const projects = await Project.find(filter)
      .populate('client', 'firstName lastName email profilePicture rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)

    // Get total count for pagination
    const total = await Project.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error('Get all projects error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching projects',
    })
  }
}

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params

    const project = await Project.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('client', 'firstName lastName email profilePicture rating bio company')
      .populate('proposals', 'bidAmount deliveryDays message status freelancer')

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }

    res.status(200).json({
      success: true,
      data: project,
    })
  } catch (error) {
    console.error('Get project by ID error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching project',
    })
  }
}

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (client who created project only)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, category, budget, deadline, requiredSkills, experience, status } =
      req.body

    // Find project
    let project = await Project.findById(id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }

    // Check if user is the project owner
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this project',
      })
    }

    // Update fields
    if (title) project.title = title
    if (description) project.description = description
    if (category) project.category = category
    if (budget) project.budget = budget
    if (deadline) project.deadline = deadline
    if (requiredSkills) project.requiredSkills = requiredSkills
    if (experience) project.experience = experience
    if (status) project.status = status

    // Save updated project
    project = await project.save()

    // Populate client info
    await project.populate('client', 'firstName lastName email profilePicture')

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    })
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating project',
    })
  }
}

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (client who created project only)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params

    const project = await Project.findById(id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }

    // Check if user is the project owner
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this project',
      })
    }

    // Delete project
    await Project.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting project',
    })
  }
}

// @desc    Get projects by client
// @route   GET /api/projects/client/:clientId
// @access  Private
export const getProjectsByClient = async (req, res) => {
  try {
    const { clientId } = req.params
    const { status, page = 1, limit = 10 } = req.query

    // Build filter
    const filter = { client: clientId }

    if (status) {
      filter.status = status
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 10
    const skip = (pageNum - 1) * limitNum

    // Query projects
    const projects = await Project.find(filter)
      .populate('client', 'firstName lastName email')
      .populate('proposals', 'status freelancer')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)

    // Get total count
    const total = await Project.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error('Get projects by client error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching projects',
    })
  }
}
