import express from 'express'
import { signupController, loginController, logoutController } from '../controllers/authController.js'
import { validateSignup, validateLogin } from '../middleware/validation.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// POST /api/auth/signup - Register new user
router.post('/signup', validateSignup, signupController)

// POST /api/auth/login - Login user
router.post('/login', validateLogin, loginController)

// POST /api/auth/logout - Logout user
router.post('/logout', authMiddleware, logoutController)

export default router
