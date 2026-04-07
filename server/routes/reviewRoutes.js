import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import {
  createReview,
  getReviewsByUser,
  getReviewById,
  updateReview,
  deleteReview,
  getUserAverageRating,
} from '../controllers/reviewController.js'

const router = express.Router()

// POST /api/reviews - Create new review (requires auth)
router.post('/', authMiddleware, createReview)

// GET /api/reviews/:id - Get review by ID
router.get('/:reviewId', getReviewById)

// PUT /api/reviews/:id - Update review (requires auth)
router.put('/:reviewId', authMiddleware, updateReview)

// DELETE /api/reviews/:id - Delete review (requires auth)
router.delete('/:reviewId', authMiddleware, deleteReview)

// GET /api/reviews/user/:userId - Get reviews for a user
router.get('/user/:userId', getReviewsByUser)

// GET /api/reviews/user/:userId/rating - Get user average rating
router.get('/user/:userId/rating', getUserAverageRating)

export default router
