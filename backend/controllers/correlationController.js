const moment = require('moment');
const MoodLog = require('../models/MoodLog'); 
const Correlation = require('../models/Correlation'); 
const getWeeklyCorrelation = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }

    const data = await MoodLog.find({ user: req.user.id });


    const startOfWeek = moment().startOf('isoWeek'); 
    const endOfWeek = moment().endOf('isoWeek'); 
    const currentWeekLogs = data.filter(log => {
      const logDate = moment(log.date);
      return logDate.isBetween(startOfWeek, endOfWeek, null, '[]');
    });

    const moodActivityMap = {};
    const sleepQualityCount = {
      'No Sleep': 0,
      'Poor Sleep': 0,
      'Medium Sleep': 0,
      'Good Sleep': 0
    };

    currentWeekLogs.forEach(log => {
      const { mood, activities, sleepQuality } = log;
      activities.forEach(activity => {
        if (!moodActivityMap[mood]) {
          moodActivityMap[mood] = {};
        }

        if (!moodActivityMap[mood][activity]) {
          moodActivityMap[mood][activity] = 0;
        }

        moodActivityMap[mood][activity]++;
      });

      if (sleepQuality in sleepQualityCount) {
        sleepQualityCount[sleepQuality]++;
      }
    });

    const correlationResults = [];
    let topMood = null;
    let topMoodCount = 0;
    let topMoodActivity = null;
    let topMoodActivityCount = 0;

    Object.keys(moodActivityMap).forEach(mood => {
      const moodCount = Object.values(moodActivityMap[mood]).reduce((a, b) => a + b, 0);
      if (moodCount >= 3 && moodCount > topMoodCount) {
        topMood = mood;
        topMoodCount = moodCount;
        topMoodActivity = null;
        topMoodActivityCount = 0;

        Object.keys(moodActivityMap[mood]).forEach(activity => {
          if (moodActivityMap[mood][activity] > topMoodActivityCount) {
            topMoodActivity = activity;
            topMoodActivityCount = moodActivityMap[mood][activity];
          }
        });
      }
    });

    if (topMood && topMoodActivity) {
      const percentage = ((topMoodActivityCount / topMoodCount) * 100).toFixed(2);
      correlationResults.push({
        correlationValue: percentage,
        correlationMood: topMood,
        correlationActivity: topMoodActivity
      });
    }

    // Analyze sleep quality patterns
    const totalSleepLogs = Object.values(sleepQualityCount).reduce((a, b) => a + b, 0);
    const poorSleepLogs = sleepQualityCount['No Sleep'] + sleepQualityCount['Poor Sleep'];
    const mediumSleepLogs = sleepQualityCount['Medium Sleep'];
    const goodSleepLogs = sleepQualityCount['Good Sleep'];

    const poorSleepPercentage = ((poorSleepLogs / totalSleepLogs) * 100).toFixed(2);
    const mediumSleepPercentage = ((mediumSleepLogs / totalSleepLogs) * 100).toFixed(2);
    const goodSleepPercentage = ((goodSleepLogs / totalSleepLogs) * 100).toFixed(2);

    const sleepQualityResults = [
      { quality: 'Poor', percentage: poorSleepPercentage, count: poorSleepLogs },
      { quality: 'Medium', percentage: mediumSleepPercentage, count: mediumSleepLogs },
      { quality: 'Good', percentage: goodSleepPercentage, count: goodSleepLogs }
    ];

    // Find the top sleep quality result
    const topSleepQuality = sleepQualityResults.reduce((prev, current) => (prev.count > current.count ? prev : current));
    correlationResults.push({
      sleepQualityValue: topSleepQuality.percentage,
      sleepQuality: topSleepQuality.quality
    });

    const correlation = new Correlation({
      user: req.user.id,
      correlationResults
    });

    await correlation.save();

    res.status(200).json(correlationResults);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWeeklyCorrelation
};