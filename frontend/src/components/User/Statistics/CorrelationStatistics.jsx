import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CorrelationStatistics = () => {
  const [correlationData, setCorrelationData] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('isoWeek'));
  const [hasPrevWeek, setHasPrevWeek] = useState(false);
  const [hasNextWeek, setHasNextWeek] = useState(false);
  const [moodData, setMoodData] = useState([]);
  const [sleepData, setSleepData] = useState([]);

  const getColorForMood = (mood) => {
    const moodColors = {
      relaxed: '#67b88f',
      happy: '#5dc791',
      fine: '#68d076',
      anxious: '#ebe153',
      sad: '#f7a046',
      angry: '#f75646'
    };
    return moodColors[mood.toLowerCase()] || '#ccc';
  };

  const getColorForSleepQuality = (quality) => {
    const sleepQualityColors = {
      'No Sleep': '#f75646',
      'Poor Sleep': '#f7a046',
      'Medium Sleep': '#ebe153',
      'Good Sleep': '#5dc791'
    };
    return sleepQualityColors[quality] || '#ccc';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5000/api/weekly-correlation', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            startOfWeek: currentWeek.toISOString(),
            endOfWeek: currentWeek.clone().endOf('isoWeek').toISOString()
          }
        });

        console.log('API Response:', response.data);
        setCorrelationData(response.data);

        // Check for previous week data
        const prevWeekResponse = await axios.get('http://localhost:5000/api/weekly-correlation', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            startOfWeek: currentWeek.clone().subtract(1, 'weeks').startOf('isoWeek').toISOString(),
            endOfWeek: currentWeek.clone().subtract(1, 'weeks').endOf('isoWeek').toISOString()
          }
        });
        setHasPrevWeek(prevWeekResponse.data.length > 0);

        // Check for next week data
        const nextWeekResponse = await axios.get('http://localhost:5000/api/weekly-correlation', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            startOfWeek: currentWeek.clone().add(1, 'weeks').startOf('isoWeek').toISOString(),
            endOfWeek: currentWeek.clone().add(1, 'weeks').endOf('isoWeek').toISOString()
          }
        });
        setHasNextWeek(nextWeekResponse.data.length > 0);

        // Process weekly correlation data
        const moodWeeklyData = [];
        const sleepWeeklyData = [];

        if (response.data && response.data.length > 0) {
          response.data.forEach(result => {
            if (result.correlationMood) {
              moodWeeklyData.push({
                week: `${currentWeek.startOf('isoWeek').format('MMM D')} - ${currentWeek.endOf('isoWeek').format('D')}`,
                mood: result.correlationMood,
                activity: result.correlationActivity,
                value: result.correlationValue
              });
            }
            if (result.sleepQuality) {
              sleepWeeklyData.push({
                week: `${currentWeek.startOf('isoWeek').format('MMM D')} - ${currentWeek.endOf('isoWeek').format('D')}`,
                quality: result.sleepQuality,
                value: result.sleepQualityValue
              });
            }
          });
        }

        console.log('Mood Data:', moodWeeklyData);
        console.log('Sleep Data:', sleepWeeklyData);

        setMoodData(moodWeeklyData);
        setSleepData(sleepWeeklyData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentWeek]);

  const handlePrevWeek = () => {
    if (hasPrevWeek) {
      setCurrentWeek(currentWeek.clone().subtract(1, 'weeks').startOf('isoWeek'));
    }
  };

  const handleNextWeek = () => {
    if (hasNextWeek) {
      setCurrentWeek(currentWeek.clone().add(1, 'weeks').startOf('isoWeek'));
    }
  };

  const startOfWeekFormatted = currentWeek.startOf('isoWeek').format('MMMM D');
  const endOfWeekFormatted = currentWeek.clone().endOf('isoWeek').format('D, YYYY');

  const moodChartData = {
    labels: moodData.map(data => data.week),
    datasets: moodData.map(data => ({
      label: `${data.mood} linked to ${data.activity}`,
      data: [data.value],
      backgroundColor: getColorForMood(data.mood),
    }))
  };

  const sleepChartData = {
    labels: sleepData.map(data => data.week),
    datasets: sleepData.map(data => ({
      label: data.quality,
      data: [data.value],
      backgroundColor: getColorForSleepQuality(data.quality),
    }))
  };

  return (
    <div style={{ backgroundColor: '#eef0ee', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', marginTop: '20px', width: '90%', maxWidth: '800px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        {hasPrevWeek && (
          <ChevronLeftIcon className="cursor-pointer" onClick={handlePrevWeek} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        )}
        <h2 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '24px', marginBottom: '20px' }}>{`${startOfWeekFormatted} - ${endOfWeekFormatted}`}</h2>
        {hasNextWeek && (
          <ChevronRightIcon className="cursor-pointer" onClick={handleNextWeek} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        )}
        <div style={{ marginBottom: '20px' }}>
          {correlationData ? (
            correlationData.length > 0 ? (
              correlationData.map((result, index) => (
                <p key={index} style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '27px' }}>
                  {result.correlationMood ? `${result.correlationMood} mood is (${result.correlationValue}%) linked to ${result.correlationActivity}` : `${result.sleepQualityValue}% of sleep this week is ${result.sleepQuality} Quality`}
                </p>
              ))
            ) : (
              <p style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '20px' }}>No significant correlations found.</p>
            )
          ) : (
            <p style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '20px' }}>Loading...</p>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', maxWidth: '800px', marginTop: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', width: '48%', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', height: '300px' }}>
          <h3 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '20px', marginBottom: '20px' }}>Mood-Activity Correlation</h3>
          <div style={{ height: '100%', width: '100%' }}>
            <Bar data={moodChartData} options={{ plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', width: '48%', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', height: '300px' }}>
          <h3 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '20px', marginBottom: '20px' }}>Sleep Quality</h3>
          <div style={{ height: '100%', width: '100%' }}>
            <Bar data={sleepChartData} options={{ plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationStatistics;