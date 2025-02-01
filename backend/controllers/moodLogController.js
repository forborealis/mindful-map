const MoodLog = require('../models/MoodLog');

exports.saveMood = async (req, res) => {
  try {
    const { mood, activities, social, health, sleepQuality, date } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No user found in request.' });
    }

    // Convert the date string to a Date object and set it to UTC midnight
    const logDate = new Date(date);
    logDate.setUTCHours(0, 0, 0, 0); 

    const existingLog = await MoodLog.findOne({
      user: req.user._id,
      date: { 
        $gte: logDate, 
        $lt: new Date(logDate.getTime() + 24 * 60 * 60 * 1000) 
      }
    });

    if (existingLog) {
      return res.status(400).json({ success: false, message: 'You have already created a log for this date.' });
    }

    const newMoodLog = new MoodLog({
      user: req.user._id,
      mood,
      activities,
      social,
      health,
      sleepQuality,
      date: logDate, // UTC midnight
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

exports.getPaginatedMoodLogs = async (req, res) => {
  try {
    const { month, year, page = 0, limit = 4 } = req.query;
    const skip = page * limit;

    const moodLogs = await MoodLog.find({
      user: req.user._id,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1)
      }
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json(moodLogs);
  } catch (error) {
    console.error('Error fetching paginated mood logs:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching paginated mood logs.' });
  }
};