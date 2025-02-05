const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { createJournalEntry, getJournalEntries, getJournalEntryById, updateJournalEntry, deleteJournalEntry, getJournalPrompt, upload } = require('../controllers/journalController');

const router = express.Router();

router.post('/journal', authMiddleware, upload.array('images', 10), createJournalEntry);
router.get('/journals', authMiddleware, getJournalEntries);
router.get('/journal/:id', authMiddleware, getJournalEntryById);
router.put('/journal/:id', authMiddleware, upload.array('images', 10), updateJournalEntry);
router.delete('/journal/:id', authMiddleware, deleteJournalEntry);

module.exports = router;