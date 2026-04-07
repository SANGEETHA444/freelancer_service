import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/constants.js'

// TODO: Implement JWT authentication middleware
// This middleware should:
// 1. Extract token from Authorization header
// 2. Verify token using JWT
// 3. Attach user data to request object
// 4. Pass to next middleware

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    // TODO: Verify token and attach user to req
    next()
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}
