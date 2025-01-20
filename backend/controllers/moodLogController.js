const MoodLog = require('../models/MoodLog');

exports.saveMood = async (req, res) => {
  try {
    const { mood, activities, social, health, sleepQuality } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No user found in request.' });
    }

    const newMoodLog = new MoodLog({
      user: req.user._id,
      mood,
      activities,
      social,
      health,
      sleepQuality,
    });

    await newMoodLog.save();
    res.status(200).json({ success: true, message: 'Mood log saved successfully.' });
  } catch (error) {
    console.error('Error saving mood log:', error);
    res.status(500).json({ success: false, message: 'Server error while saving mood log.' });
  }
};
