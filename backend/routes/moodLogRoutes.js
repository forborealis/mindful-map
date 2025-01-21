const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { saveMood, getAllMoodLogs } = require('../controllers/moodLogController');

const router = express.Router();

router.post('/mood-log', authMiddleware, saveMood);
router.get('/mood-log', authMiddleware, getAllMoodLogs);

module.exports = router;