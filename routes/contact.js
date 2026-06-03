const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');

// Admin auth guard — requires a matching key in the x-admin-key header.
// If ADMIN_API_KEY is unset, the admin route is locked down entirely.
const requireAdmin = (req, res, next) => {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) {
    return res.status(503).json({
      success: false,
      message: 'Admin endpoint is not configured.'
    });
  }
  const provided = req.get('x-admin-key');
  if (!provided || provided !== expected) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

// Validation middleware
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('subject')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Subject must be between 3 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

// POST /api/contact - Submit contact form
router.post('/', contactValidation, contactController.submitContact);

// GET /api/contact - Get all contacts (admin only)
router.get('/', requireAdmin, contactController.getAllContacts);

// GET /api/contact/test-email - Diagnose email config (admin only)
router.get('/test-email', requireAdmin, contactController.testEmail);

module.exports = router;
