const Journal = require('../models/Journal');
const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'journal_entries',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage: storage });

exports.createJournalEntry = async (req, res) => {
  try {
    const { content, prompt } = req.body;
    let images = [];

    if (req.files) {
      images = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path);
          return result.secure_url;
        })
      );
    }

    const newJournalEntry = new Journal({
      user: req.user._id,
      content,
      prompt,
      images,
    });

    await newJournalEntry.save();
    res.status(201).json(newJournalEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getJournalEntries = async (req, res) => {
  try {
    const journalEntries = await Journal.find({ user: req.user._id, deleted: { $ne: true } });
    res.status(200).json(journalEntries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getJournalEntryById = async (req, res) => {
  try {
    const journalEntry = await Journal.findById(req.params.id);
    if (!journalEntry || journalEntry.deleted) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.status(200).json(journalEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateJournalEntry = async (req, res) => {
  try {
    const { content } = req.body;
    const journalEntry = await Journal.findById(req.params.id);
    if (!journalEntry || journalEntry.deleted) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    journalEntry.content = content;
    if (req.files) {
      const images = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path);
          return result.secure_url;
        })
      );
      journalEntry.images = images;
    }

    await journalEntry.save();
    res.status(200).json(journalEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteJournalEntry = async (req, res) => {
  try {
    const journalEntry = await Journal.findById(req.params.id);
    if (!journalEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    journalEntry.deleted = true;
    await journalEntry.save();
    res.status(200).json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.upload = upload;