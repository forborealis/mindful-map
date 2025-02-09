const express = require('express');
const { getWeeklyCorrelation, getMonthlyCorrelation } = require('../controllers/correlationController');
const { authMiddleware } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.get('/weekly-correlation', authMiddleware, getWeeklyCorrelation);
router.get('/monthly-correlation', authMiddleware, getMonthlyCorrelation);

module.exports = router;