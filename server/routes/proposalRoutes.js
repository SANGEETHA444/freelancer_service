import express from 'express'

// TODO: Import proposal controller functions
// import { createProposal, getProposalsByProject, getProposalsByFreelancer, acceptProposal, rejectProposal } from '../controllers/proposalController.js'
// Import middleware
// import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// TODO: Routes
// POST /api/proposals - Create new proposal (requires auth)
// router.post('/', authMiddleware, createProposal)

// GET /api/proposals/project/:projectId - Get proposals for a project
// router.get('/project/:projectId', getProposalsByProject)

// GET /api/proposals/freelancer/:freelancerId - Get proposals by freelancer
// router.get('/freelancer/:freelancerId', getProposalsByFreelancer)

// PUT /api/proposals/:id/accept - Accept proposal (requires auth)
// router.put('/:id/accept', authMiddleware, acceptProposal)

// PUT /api/proposals/:id/reject - Reject proposal (requires auth)
// router.put('/:id/reject', authMiddleware, rejectProposal)

export default router
