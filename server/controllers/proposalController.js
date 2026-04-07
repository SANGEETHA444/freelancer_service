import Proposal from '../models/Proposal.js'
import Project from '../models/Project.js'
import User from '../models/User.js'

// @desc    Create a new proposal
// @route   POST /api/proposals
// @access  Private (freelancer only)
export const createProposal = async (req, res) => {
  try {
    const { projectId, bidAmount, deliveryDays, message } = req.body

    // Validate input
    if (!projectId || !bidAmount || !deliveryDays || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      })
    }

    // Check if project exists
    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }

    // Check if project is still open
    if (project.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This project is no longer accepting proposals',
      })
    }

    // Check if proposal from this freelancer already exists
    const existingProposal = await Proposal.findOne({
      project: projectId,
      freelancer: req.user._id,
    })

    if (existingProposal) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a proposal for this project',
      })
    }

    // Create proposal
    const proposal = await Proposal.create({
      project: projectId,
      freelancer: req.user._id,
      bidAmount,
      deliveryDays,
      message,
    })

    // Increment proposal count on project
    await Project.findByIdAndUpdate(projectId, { $inc: { proposalCount: 1 } })

    // Populate references for response
    await proposal.populate('project', 'title budget')
    await proposal.populate('freelancer', 'firstName lastName email profilePicture')

    res.status(201).json({
      success: true,
      message: 'Proposal submitted successfully',
      data: proposal,
    })
  } catch (error) {
    console.error('Create proposal error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating proposal',
    })
  }
}

// @desc    Get proposals by freelancer
// @route   GET /api/proposals/freelancer/:freelancerId
// @access  Private
export const getProposalsByFreelancer = async (req, res) => {
  try {
    const { freelancerId } = req.params
    const { status, page = 1, limit = 10 } = req.query

    // Build filter
    const filter = { freelancer: freelancerId }
    if (status) {
      filter.status = status
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 10
    const skip = (pageNum - 1) * limitNum

    // Get proposals
    const proposals = await Proposal.find(filter)
      .populate('project', 'title budget category status deadline')
      .populate('freelancer', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)

    // Get total count
    const total = await Proposal.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: proposals,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error('Get proposals by freelancer error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching proposals',
    })
  }
}

// @desc    Get proposals for a project (client view)
// @route   GET /api/proposals/project/:projectId
// @access  Private
export const getProposalsByProject = async (req, res) => {
  try {
    const { projectId } = req.params
    const { status, page = 1, limit = 10 } = req.query

    // Check if project exists and user is the client
    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }

    // Check authorization - only project client can view proposals
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view proposals for this project',
      })
    }

    // Build filter
    const filter = { project: projectId }
    if (status) {
      filter.status = status
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 10
    const skip = (pageNum - 1) * limitNum

    // Get proposals
    const proposals = await Proposal.find(filter)
      .populate(
        'freelancer',
        'firstName lastName email profilePicture rating experience hourlyRate'
      )
      .populate('project', 'title budget')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)

    // Get total count
    const total = await Proposal.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: proposals,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error('Get proposals by project error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching proposals',
    })
  }
}

// @desc    Accept proposal
// @route   PUT /api/proposals/:id/accept
// @access  Private (client who posted project)
export const acceptProposal = async (req, res) => {
  try {
    const { id } = req.params
    const { feedback } = req.body

    // Find proposal
    const proposal = await Proposal.findById(id)
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found',
      })
    }

    // Get project
    const project = await Project.findById(proposal.project)
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }

    // Check authorization
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to accept proposals for this project',
      })
    }

    // Check if already accepted/rejected
    if (proposal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Proposal is already ${proposal.status}`,
      })
    }

    // Update proposal
    proposal.status = 'accepted'
    proposal.acceptedAt = new Date()
    proposal.clientFeedback = feedback || ''
    await proposal.save()

    // Update project - assign freelancer and change status
    await Project.findByIdAndUpdate(id, {
      assignedFreelancer: proposal.freelancer,
      status: 'in-progress',
    })

    // Rejected all other proposals for this project
    await Proposal.updateMany(
      { project: proposal.project, _id: { $ne: id } },
      { status: 'rejected', rejectedAt: new Date() }
    )

    // Populate for response
    await proposal.populate('freelancer', 'firstName lastName email')
    await proposal.populate('project', 'title budget')

    res.status(200).json({
      success: true,
      message: 'Proposal accepted successfully',
      data: proposal,
    })
  } catch (error) {
    console.error('Accept proposal error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error accepting proposal',
    })
  }
}

// @desc    Reject proposal
// @route   PUT /api/proposals/:id/reject
// @access  Private (client who posted project)
export const rejectProposal = async (req, res) => {
  try {
    const { id } = req.params
    const { feedback } = req.body

    // Find proposal
    const proposal = await Proposal.findById(id)
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found',
      })
    }

    // Get project
    const project = await Project.findById(proposal.project)
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }

    // Check authorization
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to reject proposals for this project',
      })
    }

    // Check if already accepted/rejected
    if (proposal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Proposal is already ${proposal.status}`,
      })
    }

    // Update proposal
    proposal.status = 'rejected'
    proposal.rejectedAt = new Date()
    proposal.clientFeedback = feedback || ''
    await proposal.save()

    // Populate for response
    await proposal.populate('freelancer', 'firstName lastName email')
    await proposal.populate('project', 'title budget')

    res.status(200).json({
      success: true,
      message: 'Proposal rejected successfully',
      data: proposal,
    })
  } catch (error) {
    console.error('Reject proposal error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error rejecting proposal',
    })
  }
}

// @desc    Get single proposal
// @route   GET /api/proposals/:id
// @access  Private
export const getProposalById = async (req, res) => {
  try {
    const { id } = req.params

    const proposal = await Proposal.findById(id)
      .populate('project', 'title budget category deadline')
      .populate('freelancer', 'firstName lastName email profilePicture rating')

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found',
      })
    }

    // Check authorization - user should be freelancer or project client
    const project = await Project.findById(proposal.project._id)
    const isFreelancer = proposal.freelancer._id.toString() === req.user._id.toString()
    const isClient = project.client.toString() === req.user._id.toString()

    if (!isFreelancer && !isClient) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this proposal',
      })
    }

    res.status(200).json({
      success: true,
      data: proposal,
    })
  } catch (error) {
    console.error('Get proposal by ID error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching proposal',
    })
  }
}
