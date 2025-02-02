import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import BottomNav from '../../BottomNav'; // Adjust the import path as necessary

const Correlation = () => {
  const [correlationData, setCorrelationData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        console.log('Token:', token); // Debugging statement

        const response = await axios.get('http://localhost:5000/api/mood-log', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Response:', response); // Debugging statement

        const data = response.data;

        // Filter logs for the current week (Monday to Sunday)
        const startOfWeek = moment().startOf('isoWeek'); // Monday
        const endOfWeek = moment().endOf('isoWeek'); // Sunday
        const currentWeekLogs = data.filter(log => {
          const logDate = moment(log.date);
          return logDate.isBetween(startOfWeek, endOfWeek, null, '[]');
        });

        console.log('Current Week Logs:', currentWeekLogs); // Debugging statement

        // Process data to find correlations
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

        console.log('Mood Activity Map:', moodActivityMap); // Debugging statement
        console.log('Sleep Quality Count:', sleepQualityCount); // Debugging statement

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

        console.log('Top Mood:', topMood); // Debugging statement
        console.log('Top Mood Count:', topMoodCount); // Debugging statement
        console.log('Top Mood Activity:', topMoodActivity); // Debugging statement
        console.log('Top Mood Activity Count:', topMoodActivityCount); // Debugging statement

        if (topMood && topMoodActivity) {
          const percentage = ((topMoodActivityCount / topMoodCount) * 100).toFixed(2);
          correlationResults.push(`${topMood} mood is (${percentage}%) linked to ${topMoodActivity}`);
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
        correlationResults.push(`${topSleepQuality.percentage}% of sleep this week is ${topSleepQuality.quality} Quality`);

        console.log('Correlation Results:', correlationResults); // Debugging statement

        setCorrelationData(correlationResults);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#eef0ee', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <BottomNav />
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', marginTop: '20px', width: '90%', maxWidth: '800px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <h2 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '24px', marginBottom: '20px' }}>Correlation analysis results...</h2>
        <div style={{ marginBottom: '20px' }}>
          {correlationData ? (
            correlationData.length > 0 ? (
              correlationData.map((result, index) => (
                <p key={index} style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '27px' }}>{result}</p>
              ))
            ) : (
              <p style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '20px' }}>No significant correlations found.</p>
            )
          ) : (
            <p style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '20px' }}>Loading...</p>
          )}
        </div>
        <div style={{ bottom: '10px', width: '100%', textAlign: 'center', color: '#b1b1b1', fontSize: '14px' }}>
          Click below for personalized recommendations
        </div>
        <button style={{ backgroundColor: '#6fba94', color: '#fff', fontWeight: 'bold', padding: '10px 25px', borderRadius: '20px', border: 'none', cursor: 'pointer', position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', width: '130px' }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Correlation;