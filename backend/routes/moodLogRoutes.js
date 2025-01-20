const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { saveMood } = require('../controllers/moodLogController');

const router = express.Router();

router.post('/mood-log', authMiddleware, saveMood);
  
module.exports = router;