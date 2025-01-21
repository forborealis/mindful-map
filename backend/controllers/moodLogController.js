const MoodLog = require('../models/MoodLog');

exports.saveMood = async (req, res) => {
  try {
    const { mood, activities, social, health, sleepQuality } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No user found in request.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingLog = await MoodLog.findOne({
      user: req.user._id,
      date: { $gte: today }
    });

    if (existingLog) {
      return res.status(400).json({ success: false, message: 'You have already created a log for today. Please come back tomorrow.' });
    }

    const newMoodLog = new MoodLog({
      user: req.user._id,
      mood,
      activities,
      social,
      health,
      sleepQuality,
      date: new Date(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    await newMoodLog.save();

    // Check if the mood is negative and return recommendations
    if (['angry', 'sad', 'anxious'].includes(mood.toLowerCase())) {
      return res.status(200).json({ success: true, message: 'Mood log saved successfully.', mood });
    }

    res.status(200).json({ success: true, message: 'Mood log saved successfully.' });
  } catch (error) {
    console.error('Error saving mood log:', error);
    res.status(500).json({ success: false, message: 'Server error while saving mood log.' });
  }
};

exports.getAllMoodLogs = async (req, res) => {
  try {
    const moodLogs = await MoodLog.find({ user: req.user._id }).sort({ date: -1 });
    if (!moodLogs.length) {
      return res.status(404).json({ success: false, message: 'No mood logs found' });
    }
    res.status(200).json(moodLogs);
  } catch (error) {
    console.error('Error fetching mood logs:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching mood logs.' });
  }
};