const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { predictMood } = require("../controllers/moodPredictionController");

const router = express.Router();

router.get("/predict-mood", authMiddleware, predictMood);

module.exports = router;
