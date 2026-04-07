// TODO: Utility functions for common operations
// Examples:
// - Password hashing and comparison
// - JWT token generation and verification
// - Error handling
// - Response formatting
// - Validation helpers

export const hashPassword = async (password) => {
  // TODO: Implement password hashing using bcryptjs
  // import bcrypt from 'bcryptjs'
  // const salt = await bcrypt.genSalt(10)
  // return await bcrypt.hash(password, salt)
}

export const comparePassword = async (password, hashedPassword) => {
  // TODO: Implement password comparison
  // import bcrypt from 'bcryptjs'
  // return await bcrypt.compare(password, hashedPassword)
}

export const generateToken = (userId, role) => {
  // TODO: Implement JWT token generation
  // import jwt from 'jsonwebtoken'
  // return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN
  // })
}

export const verifyToken = (token) => {
  // TODO: Implement JWT token verification
  // import jwt from 'jsonwebtoken'
  // return jwt.verify(token, process.env.JWT_SECRET)
}

export const formatResponse = (success, message, data = null) => {
  // TODO: Standard response format
  return {
    success,
    message,
    data,
    timestamp: new Date(),
  }
}
