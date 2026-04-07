import express from 'express'

// TODO: Import project controller functions
// import { createProject, getAllProjects, getProjectById, updateProject, deleteProject, getProjectsByClient } from '../controllers/projectController.js'
// Import middleware
// import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// TODO: Routes
// GET /api/projects - Get all projects
// router.get('/', getAllProjects)

// POST /api/projects - Create new project (requires auth)
// router.post('/', authMiddleware, createProject)

// GET /api/projects/:id - Get project by ID
// router.get('/:id', getProjectById)

// PUT /api/projects/:id - Update project (requires auth)
// router.put('/:id', authMiddleware, updateProject)

// DELETE /api/projects/:id - Delete project (requires auth)
// router.delete('/:id', authMiddleware, deleteProject)

// GET /api/projects/client/:clientId - Get projects by client
// router.get('/client/:clientId', getProjectsByClient)

export default router
