// JWT configuration
// TODO: Add JWT secret and expiration time

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}

// MongoDB URI
export const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freelance-marketplace'

// API URL
export const apiUrl = process.env.API_URL || 'http://localhost:5000'
