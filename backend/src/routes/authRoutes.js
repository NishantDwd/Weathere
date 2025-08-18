const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');


// Helper to validate and short-circuit
function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Signup
const signupValidators = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
router.post('/signup', ...signupValidators, runValidation, authController.signup);

// Login
const loginValidators = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
router.post('/login', ...loginValidators, runValidation, authController.login);

// Reset password
const resetValidators = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required'),
];
router.post('/reset-password', ...resetValidators, runValidation, authController.resetPassword);

// Change password (auth required)
const changePassValidators = [
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required'),
];
router.post('/change-password', authenticateToken, ...changePassValidators, runValidation, authController.changePassword);

// Change username (auth required)
const changeUserValidators = [
  body('newUsername').notEmpty().withMessage('New username is required'),
];
router.post('/change-username', authenticateToken, ...changeUserValidators, runValidation, authController.changeUsername);

// Profile
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;