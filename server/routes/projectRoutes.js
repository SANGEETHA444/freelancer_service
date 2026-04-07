import express from 'express'
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByClient,
} from '../controllers/projectController.js'
import { authMiddleware, authorizeRole } from '../middleware/auth.js'
import { validateProject } from '../middleware/validation.js'

const router = express.Router()

// GET /api/projects - Get all projects (public)
router.get('/', getAllProjects)

// POST /api/projects - Create new project (requires auth, client only)
router.post('/', authMiddleware, authorizeRole(['client']), createProject)

// GET /api/projects/client/:clientId - Get projects by specific client
router.get('/client/:clientId', getProjectsByClient)

// GET /api/projects/:id - Get project by ID (public)
router.get('/:id', getProjectById)

// PUT /api/projects/:id - Update project (requires auth, owner only)
router.put('/:id', authMiddleware, updateProject)

// DELETE /api/projects/:id - Delete project (requires auth, owner only)
router.delete('/:id', authMiddleware, deleteProject)

export default router
