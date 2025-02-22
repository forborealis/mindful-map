const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/dashboard', authMiddleware, adminMiddleware, adminController.dashboard);
router.get('/monthly-users', authMiddleware, adminMiddleware, adminController.getMonthlyUsers);
router.get('/active-users', authMiddleware, adminMiddleware, adminController.getActiveUsers);
router.get('/inactive-users', authMiddleware, adminMiddleware, adminController.getInactiveUsers); // Added route for inactive users
router.get('/users', authMiddleware, adminMiddleware, adminController.getUsers);
router.get('/daily-forum-engagement', adminController.getDailyForumEngagement);
router.get('/weekly-forum-engagement', adminController.getWeeklyForumEngagement);

router.post("/soft-delete", authMiddleware, adminMiddleware, adminController.softDelete);
router.post("/reactivate", authMiddleware, adminMiddleware, adminController.reactivate);
router.post("/bulk-delete", authMiddleware, adminMiddleware, adminController.bulkDelete);

router.get("/prompts",  authMiddleware, adminMiddleware, adminController.getAllPrompts)
router.post("/add-prompt",  authMiddleware, adminMiddleware, adminController.addPrompt);
router.delete("/:id",  authMiddleware, adminMiddleware, adminController.deletePrompt);

module.exports = router;