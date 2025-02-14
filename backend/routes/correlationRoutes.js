const express = require('express');
const { getWeeklyCorrelation, getMonthlyCorrelation, getRecommendations } = require('../controllers/correlationController');
const { authMiddleware } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.get('/weekly-correlation', authMiddleware, getWeeklyCorrelation);
router.get('/monthly-correlation', authMiddleware, getMonthlyCorrelation);
router.post('/recommendations', authMiddleware, getRecommendations);

module.exports = router;