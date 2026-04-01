const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');

// GET /api/skills - Get all skills
router.get('/', skillController.getAllSkills);

// GET /api/skills/category/:category - Get skills by category
router.get('/category/:category', skillController.getSkillsByCategory);

module.exports = router;
