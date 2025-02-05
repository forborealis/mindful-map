const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { saveMood, getAllMoodLogs, getPaginatedMoodLogs, checkMoodLogs } = require('../controllers/moodLogController');

const router = express.Router();

router.post('/mood-log', authMiddleware, saveMood);
router.get('/mood-log', authMiddleware, getAllMoodLogs);
router.get('/mood-log/paginated', authMiddleware, getPaginatedMoodLogs);
router.get('/check-mood-logs', authMiddleware, checkMoodLogs);

module.exports = router;