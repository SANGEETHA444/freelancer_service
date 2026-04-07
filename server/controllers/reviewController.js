import Review from '../models/Review.js'
import User from '../models/User.js'
import Project from '../models/Project.js'

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { projectId, revieweeId, rating, comment, reviewType } = req.body
    const reviewerId = req.user._id

    // Validation
    if (!projectId || !revieweeId || !rating || !reviewType) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }

    if (reviewType !== 'freelancer' && reviewType !== 'client') {
      return res.status(400).json({ message: 'Invalid review type' })
    }

    if (reviewerId.toString() === revieweeId) {
      return res.status(400).json({ message: 'Cannot review yourself' })
    }

    // Check if project exists
    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    // Check if reviewee exists
    const reviewee = await User.findById(revieweeId)
    if (!reviewee) {
      return res.status(404).json({ message: 'Reviewee not found' })
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      project: projectId,
      reviewer: reviewerId,
      reviewee: revieweeId,
    })

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this user for this project' })
    }

    // Create review
    const review = new Review({
      project: projectId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating,
      comment,
      reviewType,
    })

    await review.save()

    // Update user's average rating
    await updateUserRating(revieweeId)

    // Populate and return
    const populatedReview = await review.populate([
      { path: 'reviewer', select: 'firstName lastName' },
      { path: 'reviewee', select: 'firstName lastName' },
    ])

    res.status(201).json(populatedReview)
  } catch (error) {
    console.error('Error creating review:', error)
    res.status(500).json({ message: 'Error creating review', error: error.message })
  }
}

// Get reviews for a user (by reviewee ID)
export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 10 } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'firstName lastName title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Review.countDocuments({ reviewee: userId })

    res.json({
      reviews,
      total,
      pages: Math.ceil(total / parseInt(limit)),
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    res.status(500).json({ message: 'Error fetching reviews', error: error.message })
  }
}

// Get single review by ID
export const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params

    const review = await Review.findById(reviewId)
      .populate('reviewer', 'firstName lastName title')
      .populate('reviewee', 'firstName lastName')
      .populate('project', 'title')

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    res.json(review)
  } catch (error) {
    console.error('Error fetching review:', error)
    res.status(500).json({ message: 'Error fetching review', error: error.message })
  }
}

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { rating, comment } = req.body
    const userId = req.user._id

    // Validation
    if (!rating && !comment) {
      return res.status(400).json({ message: 'No fields to update' })
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }

    // Find review
    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Check authorization (only reviewer can update)
    if (review.reviewer.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' })
    }

    // Update fields
    if (rating) review.rating = rating
    if (comment) review.comment = comment

    await review.save()

    // Recalculate user rating if rating changed
    if (rating) {
      await updateUserRating(review.reviewee)
    }

    const updatedReview = await review.populate([
      { path: 'reviewer', select: 'firstName lastName' },
      { path: 'reviewee', select: 'firstName lastName' },
    ])

    res.json(updatedReview)
  } catch (error) {
    console.error('Error updating review:', error)
    res.status(500).json({ message: 'Error updating review', error: error.message })
  }
}

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const userId = req.user._id

    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Check authorization
    if (review.reviewer.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' })
    }

    const revieweeId = review.reviewee

    await Review.findByIdAndDelete(reviewId)

    // Recalculate user rating
    await updateUserRating(revieweeId)

    res.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Error deleting review:', error)
    res.status(500).json({ message: 'Error deleting review', error: error.message })
  }
}

// Get user's average rating
export const getUserAverageRating = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const reviews = await Review.find({ reviewee: userId })
    const averageRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
      : 0

    res.json({
      userId,
      averageRating: parseFloat(averageRating),
      totalReviews: reviews.length,
    })
  } catch (error) {
    console.error('Error calculating rating:', error)
    res.status(500).json({ message: 'Error calculating rating', error: error.message })
  }
}

// Helper function to update user's average rating
const updateUserRating = async (userId) => {
  try {
    const reviews = await Review.find({ reviewee: userId })
    let averageRating = 0

    if (reviews.length > 0) {
      averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    }

    await User.findByIdAndUpdate(
      userId,
      { rating: parseFloat(averageRating.toFixed(2)) },
      { new: true }
    )
  } catch (error) {
    console.error('Error updating user rating:', error)
  }
}
