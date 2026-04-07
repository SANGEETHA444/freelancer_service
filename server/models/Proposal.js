import mongoose from 'mongoose'

const proposalSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Freelancer reference is required'],
    },
    bidAmount: {
      type: Number,
      required: [true, 'Bid amount is required'],
      min: [0, 'Bid amount must be a positive number'],
    },
    deliveryDays: {
      type: Number,
      required: [true, 'Delivery days is required'],
      min: [1, 'Delivery days must be at least 1'],
    },
    message: {
      type: String,
      required: [true, 'Cover letter message is required'],
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected'],
        message: 'Status must be pending, accepted, or rejected',
      },
      default: 'pending',
    },
    // When client accepted the proposal
    acceptedAt: {
      type: Date,
      default: null,
    },
    // When client rejected the proposal
    rejectedAt: {
      type: Date,
      default: null,
    },
    // Client's feedback when accepting/rejecting
    clientFeedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

// Index for finding proposals by freelancer
proposalSchema.index({ freelancer: 1 })
// Index for finding proposals by project
proposalSchema.index({ project: 1 })
// Index for finding proposals by status
proposalSchema.index({ status: 1 })
// Compound index for finding freelancer's proposals for a project
proposalSchema.index({ freelancer: 1, project: 1 })

const Proposal = mongoose.model('Proposal', proposalSchema)

export default Proposal
