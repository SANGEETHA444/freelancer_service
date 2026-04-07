import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/constants.js'

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  })
}

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signupController = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body

    // Validate input
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      })
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      })
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    })

    // Generate token
    const token = generateToken(user._id)

    // Return success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error during signup',
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // Find user by email (need to select password explicitly)
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Generate token
    const token = generateToken(user._id)

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error during login',
    })
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutController = async (req, res) => {
  try {
    // Token is cleared on frontend, just send success response
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error during logout',
    })
  }
}
