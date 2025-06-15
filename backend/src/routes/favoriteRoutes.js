const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/add', authenticateToken, favoriteController.add);
router.get('/list', authenticateToken, favoriteController.list);
router.delete('/remove', authenticateToken, favoriteController.remove);

module.exports = router;