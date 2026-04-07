import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
    reviewType: {
      type: String,
      enum: ['freelancer', 'client'],
      required: true,
    },
  },
  { timestamps: true }
)

// Compound index to prevent duplicate reviews
reviewSchema.index({ project: 1, reviewer: 1, reviewee: 1 }, { unique: true })
// Index for finding reviews by reviewee (for rating calculation)
reviewSchema.index({ reviewee: 1, reviewType: 1 })
// Index for finding reviews by reviewer
reviewSchema.index({ reviewer: 1 })

const Review = mongoose.model('Review', reviewSchema)

export default Review
