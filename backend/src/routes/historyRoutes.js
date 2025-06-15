const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/add', authenticateToken, historyController.add);
router.get('/list', authenticateToken, historyController.list);
router.delete('/delete', authenticateToken, historyController.delete);
router.delete('/clear', authenticateToken, historyController.clear);

module.exports = router;