import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: {
        values: ['freelancer', 'client'],
        message: 'Role must be either freelancer or client',
      },
      required: [true, 'Role is required'],
    },
    // Profile fields
    title: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    // Freelancer specific fields
    skills: [
      {
        type: String,
      },
    ],
    experience: {
      type: String,
      default: 'Beginner',
      enum: ['Beginner', 'Intermediate', 'Expert'],
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    portfolio: {
      type: String,
      default: '',
    },
    availability: {
      type: String,
      default: 'Part-time',
      enum: ['Full-time', 'Part-time', 'Freelance'],
    },
    // Ratings and reviews
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    // Client specific fields
    company: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash password if it has been modified
  if (!this.isModified('password')) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Method to get user without password
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

const User = mongoose.model('User', userSchema)

export default User
