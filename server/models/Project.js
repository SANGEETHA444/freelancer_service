import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Web Development',
          'Mobile App',
          'UI/UX Design',
          'Data Science',
          'Machine Learning',
          'Blockchain',
          'DevOps',
          'QA Testing',
          'Content Writing',
          'Graphic Design',
          'Other',
        ],
        message: 'Please select a valid category',
      },
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget must be a positive number'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
      validate: {
        validator: function (v) {
          return v > new Date()
        },
        message: 'Deadline must be in the future',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in-progress', 'completed', 'cancelled'],
        message: 'Status must be open, in-progress, completed, or cancelled',
      },
      default: 'open',
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: {
      type: String,
      enum: {
        values: ['Beginner', 'Intermediate', 'Expert'],
        message: 'Experience level must be Beginner, Intermediate, or Expert',
      },
      default: 'Intermediate',
    },
    // Reference to client (who posted the project)
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client reference is required'],
    },
    // Reference to freelancer assigned to the project
    assignedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Array of proposals for this project
    proposals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
      },
    ],
    // Attachments or additional files
    attachments: [
      {
        url: String,
        fileName: String,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    proposalCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Index for searching projects
projectSchema.index({ title: 'text', description: 'text' })
projectSchema.index({ client: 1 })
projectSchema.index({ status: 1 })
projectSchema.index({ createdAt: -1 })

const Project = mongoose.model('Project', projectSchema)

export default Project
