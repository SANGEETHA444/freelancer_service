import express from 'express'
import {
  getUserProfile,
  getMyProfile,
  updateUserProfile,
  getFreelancers,
  searchUsers,
  getUserStats,
} from '../controllers/userController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// GET /api/users/me - Get current user profile (requires auth)
router.get('/me', authMiddleware, getMyProfile)

// GET /api/users/freelancers - Get all freelancers (public)
router.get('/freelancers', getFreelancers)

// GET /api/users/search - Search users (public)
router.get('/search', searchUsers)

// GET /api/users/:id - Get user profile by ID (public)
router.get('/:id', getUserProfile)

// GET /api/users/:id/stats - Get user statistics (public)
router.get('/:id/stats', getUserStats)

// PUT /api/users/:id - Update user profile (requires auth)
router.put('/:id', authMiddleware, updateUserProfile)

export default router
