const moment = require('moment');
const MoodLog = require('../models/MoodLog');
const Correlation = require('../models/Correlation');

const recommendationsData = {
  moods: {
    relaxed: [
      'Continue engaging in activities that help you relax.',
      'Practice mindfulness or meditation.',
      'Spend time in nature.',
      'Listen to calming music.'
    ],
    happy: [
      'Keep doing activities that make you happy.',
      'Share your happiness with friends and family.',
      'Engage in hobbies you love.',
      'Stay active and exercise regularly.'
    ],
    fine: [
      'Maintain a balanced lifestyle.',
      'Ensure you have a good work-life balance.',
      'Stay connected with loved ones.',
      'Take breaks and relax when needed.'
    ],
    anxious: {
      studying: [
        'Practice deep breathing exercises.',
        'Prepare a study schedule to manage time effectively.',
        'Remind Yourself: Progress Over Perfection',
        'Exercise or Move Around.',
        'Listen to Calming Music or Brown Noise'
      ],
      exam: [
        'Practice deep breathing exercises.',
        'Prepare a study schedule to manage time effectively.',
        'Take regular breaks during study sessions.',
        'Follow the Pomodoro Technique.',
        'Start Studying Early.',
        'List your tasks and prioritize them.',
        'Stay hydrated.'
      ],
      work: [
        'Practice deep breathing exercises.',
        'Take regular breaks during work.',
        'Talk to someone you trust about your feelings.',
        'Try relaxation techniques like yoga or meditation.'
      ],
      gaming: [
        'Set time limits for gaming sessions.',
        'Take breaks to relax and stretch.',
        'Engage in physical activities to reduce anxiety.',
        'Talk to someone you trust about your feelings.'
      ]
    },
    sad: {
      studying: [
        'Talk to a friend or family member about your feelings.',
        'Engage in activities that you enjoy.',
        'Consider seeking professional help if needed.',
        'Practice self-care and be kind to yourself.'
      ],
      exam: [
        'Talk to a friend or family member about your feelings.',
        'Engage in activities that you enjoy.',
        'Consider seeking professional help if needed.',
        'Practice self-care and be kind to yourself.'
      ],
      work: [
        'Talk to a friend or family member about your feelings.',
        'Engage in activities that you enjoy.',
        'Consider seeking professional help if needed.',
        'Practice self-care and be kind to yourself.'
      ],
      gaming: [
        'Talk to a friend or family member about your feelings.',
        'Engage in activities that you enjoy.',
        'Consider seeking professional help if needed.',
        'Practice self-care and be kind to yourself.'
      ]
    },
    angry: {
      studying: [
        'Practice deep breathing exercises to calm down.',
        'Engage in physical activities to release pent-up energy.',
        'Talk to someone you trust about your feelings.',
        'Try relaxation techniques like yoga or meditation.'
      ],
      exam: [
        'Practice deep breathing exercises to calm down.',
        'Engage in physical activities to release pent-up energy.',
        'Talk to someone you trust about your feelings.',
        'Try relaxation techniques like yoga or meditation.'
      ],
      work: [
        'Practice deep breathing exercises to calm down.',
        'Engage in physical activities to release pent-up energy.',
        'Talk to someone you trust about your feelings.',
        'Try relaxation techniques like yoga or meditation.'
      ],
      gaming: [
        'Practice deep breathing exercises to calm down.',
        'Engage in physical activities to release pent-up energy.',
        'Talk to someone you trust about your feelings.',
        'Try relaxation techniques like yoga or meditation.'
      ]
    }
  },
  sleepQualities: {
    'No Sleep': [
      'Establish a regular sleep schedule.',
      'Create a relaxing bedtime routine.',
      'Avoid caffeine and heavy meals before bed.',
      'Consider seeking professional help if needed.'
    ],
    'Poor': [
      'Maintain a consistent sleep schedule.',
      'Create a relaxing bedtime routine.',
      'Limit screen time before bed.',
      'Ensure your sleep environment is comfortable.'
    ],
    'Medium': [
      'Maintain a consistent sleep schedule.',
      'Create a relaxing bedtime routine.',
      'Avoid caffeine and heavy meals before bed.',
      'Ensure your sleep environment is comfortable.'
    ],
    'Good': [
      'Continue maintaining a consistent sleep schedule.',
      'Keep up with your relaxing bedtime routine.',
      'Ensure your sleep environment remains comfortable.',
      'Avoid caffeine and heavy meals before bed.'
    ]
  }
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

let cachedRecommendations = null;
let lastGeneratedDate = null;

const generateRecommendations = (correlationData) => {
  const recommendations = [];

  correlationData.forEach(result => {
    if (result.correlationMood && result.correlationActivity) {
      const mood = result.correlationMood.toLowerCase();
      const activity = result.correlationActivity.toLowerCase();

      if (recommendationsData.moods[mood] && recommendationsData.moods[mood][activity]) {
        const shuffledRecommendations = shuffleArray(recommendationsData.moods[mood][activity]);
        recommendations.push(...shuffledRecommendations.slice(0, 3));
      } else if (recommendationsData.moods[mood]) {
        const shuffledRecommendations = shuffleArray(recommendationsData.moods[mood]);
        recommendations.push(...shuffledRecommendations.slice(0, 3));
      }
    } else if (result.sleepQuality) {
      const sleepQuality = result.sleepQuality;

      if (recommendationsData.sleepQualities[sleepQuality]) {
        const shuffledRecommendations = shuffleArray(recommendationsData.sleepQualities[sleepQuality]);
        recommendations.push(...shuffledRecommendations.slice(0, 2));
      }
    }
  });

  return recommendations;
};

const getWeeklyCorrelation = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }

    const data = await MoodLog.find({ user: req.user.id });

    const startOfWeek = moment().startOf('isoWeek'); // Monday
    const endOfWeek = moment().endOf('isoWeek'); // Sunday
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
        correlationValue: parseFloat(percentage),
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
      sleepQualityValue: parseFloat(topSleepQuality.percentage),
      sleepQuality: topSleepQuality.quality
    });

    // Check if today is Sunday and if the correlation results for the current week have already been stored
    const today = moment().day();
    if (today === 0) { // 0 represents Sunday
      const existingCorrelation = await Correlation.findOne({
        user: req.user.id,
        createdAt: {
          $gte: startOfWeek.toDate(),
          $lte: endOfWeek.toDate()
        }
      });

      if (!existingCorrelation) {
        const correlation = new Correlation({
          user: req.user.id,
          correlationResults
        });

        await correlation.save();
      }
    }

    res.status(200).json(correlationResults);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMonthlyCorrelation = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }

    const { startOfMonth, endOfMonth } = req.query;

    const correlations = await Correlation.find({
      user: req.user.id,
      createdAt: {
        $gte: new Date(startOfMonth),
        $lte: new Date(endOfMonth)
      }
    });

    res.status(200).json(correlations);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const today = moment().startOf('day');

    if (!cachedRecommendations || !lastGeneratedDate || !today.isSame(lastGeneratedDate, 'day')) {
      const { correlationData } = req.body;
      cachedRecommendations = generateRecommendations(correlationData);
      lastGeneratedDate = today;
    }

    res.status(200).json(cachedRecommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getWeeklyCorrelation,
  getMonthlyCorrelation,
  getRecommendations
};