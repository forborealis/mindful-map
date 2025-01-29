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

        // Filter logs for the current week
        const startOfWeek = moment().startOf('week');
        const endOfWeek = moment().endOf('week');
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
        Object.keys(moodActivityMap).forEach(mood => {
          Object.keys(moodActivityMap[mood]).forEach(activity => {
            if (moodActivityMap[mood][activity] >= 3) {
              const totalLogs = Object.values(moodActivityMap[mood]).reduce((a, b) => a + b, 0);
              const percentage = ((moodActivityMap[mood][activity] / totalLogs) * 100).toFixed(2);
              correlationResults.push(`${mood} (${percentage}%) linked to ${activity}`);
            }
          });
        });

        // Analyze sleep quality patterns
        const totalSleepLogs = Object.values(sleepQualityCount).reduce((a, b) => a + b, 0);
        const poorSleepLogs = sleepQualityCount['No Sleep'] + sleepQualityCount['Poor Sleep'];
        if (poorSleepLogs / totalSleepLogs >= 0.5) {
          correlationResults.push(`Mood may be linked to poor sleep quality (${((poorSleepLogs / totalSleepLogs) * 100).toFixed(2)}%)`);
        }

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
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', marginTop: '20px', width: '90%', maxWidth: '800px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '24px' }}>Correlation analysis results...</h2>
        <div style={{ marginTop: '20px' }}>
          {correlationData ? (
            correlationData.length > 0 ? (
              correlationData.map((result, index) => (
                <p key={index} style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '20px' }}>{result}</p>
              ))
            ) : (
              <p style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '20px' }}>No significant correlations found.</p>
            )
          ) : (
            <p style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '20px' }}>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Correlation;