import express from 'express'
import {
  createProposal,
  getProposalsByProject,
  getProposalsByFreelancer,
  acceptProposal,
  rejectProposal,
  getProposalById,
} from '../controllers/proposalController.js'
import { authMiddleware, authorizeRole } from '../middleware/auth.js'

const router = express.Router()

// POST /api/proposals - Create new proposal (requires auth, freelancer only)
router.post('/', authMiddleware, authorizeRole(['freelancer']), createProposal)

// GET /api/proposals/:id - Get proposal by ID
router.get('/:id', authMiddleware, getProposalById)

// GET /api/proposals/freelancer/:freelancerId - Get proposals by freelancer
router.get('/freelancer/:freelancerId', authMiddleware, getProposalsByFreelancer)

// GET /api/proposals/project/:projectId - Get proposals for a project (client only)
router.get('/project/:projectId', authMiddleware, authorizeRole(['client']), getProposalsByProject)

// PUT /api/proposals/:id/accept - Accept proposal (requires auth, client only)
router.put('/:id/accept', authMiddleware, authorizeRole(['client']), acceptProposal)

// PUT /api/proposals/:id/reject - Reject proposal (requires auth, client only)
router.put('/:id/reject', authMiddleware, authorizeRole(['client']), rejectProposal)

export default router
