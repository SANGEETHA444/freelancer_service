import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/constants.js'
import User from '../models/User.js'

// @desc    Verify JWT token and attach user to request
// @access  Private
export const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token found, please login',
      })
    }

    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret)

    // Find user and attach to request
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      })
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      })
    }

    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    })
  }
}

// @desc    Check if user has required role
// @access  Private
export const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
      })
    }

    next()
  }
}
