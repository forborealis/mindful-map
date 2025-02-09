const express = require('express');
const { getWeeklyCorrelation } = require('../controllers/correlationController');
const { authMiddleware } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.get('/weekly-correlation', authMiddleware, getWeeklyCorrelation);

module.exports = router;