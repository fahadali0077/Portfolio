const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// GET /api/projects - Get all projects
router.get('/', projectController.getAllProjects);

// GET /api/projects/featured - Get featured projects
router.get('/featured', projectController.getFeaturedProjects);

// GET /api/projects/:id - Get single project
router.get('/:id', projectController.getProjectById);

module.exports = router;
