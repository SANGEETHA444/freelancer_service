import express from 'express'

// TODO: Import review controller functions
// import { createReview, getReviewsByUser, getReviewById, updateReview, deleteReview, getUserAverageRating } from '../controllers/reviewController.js'
// Import middleware
// import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// TODO: Routes
// POST /api/reviews - Create new review (requires auth)
// router.post('/', authMiddleware, createReview)

// GET /api/reviews/user/:userId - Get reviews for a user
// router.get('/user/:userId', getReviewsByUser)

// GET /api/reviews/:id - Get review by ID
// router.get('/:id', getReviewById)

// PUT /api/reviews/:id - Update review (requires auth)
// router.put('/:id', authMiddleware, updateReview)

// DELETE /api/reviews/:id - Delete review (requires auth)
// router.delete('/:id', authMiddleware, deleteReview)

// GET /api/reviews/user/:userId/rating - Get user average rating
// router.get('/user/:userId/rating', getUserAverageRating)

export default router
