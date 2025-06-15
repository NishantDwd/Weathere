const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authenticateToken = require('../middleware/authMiddleware');

// Anyone can view blogs
router.get('/list', blogController.list);

// Only authenticated users can post or delete
router.post('/add', authenticateToken, blogController.create);
router.delete('/delete', authenticateToken, blogController.delete);

module.exports = router;