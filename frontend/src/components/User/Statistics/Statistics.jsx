import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Doughnut } from 'react-chartjs-2';
import BottomNav from '../../BottomNav';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Statistics = () => {
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState('statistics'); // Set the initial value to the index of the Statistics page
  const [moodCounts, setMoodCounts] = useState({});
  const [period, setPeriod] = useState('monthly'); // State to track the selected period

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5000/api/mood-log', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.data;

        // Calculate mood counts based on the selected period
        let startOfPeriod, endOfPeriod;
        if (period === 'weekly') {
          startOfPeriod = moment().startOf('isoWeek'); // Monday
          endOfPeriod = moment().endOf('isoWeek'); // Sunday
        } else {
          startOfPeriod = moment().startOf('month');
          endOfPeriod = moment().endOf('month');
        }

        const periodLogs = data.filter(log => {
          const logDate = moment(log.date);
          return logDate.isBetween(startOfPeriod, endOfPeriod, null, '[]');
        });

        const moodCountMap = {};
        periodLogs.forEach(log => {
          const { mood } = log;
          if (!moodCountMap[mood]) {
            moodCountMap[mood] = 0;
          }
          moodCountMap[mood]++;
        });

        setMoodCounts(moodCountMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [period]); // Re-fetch data when the period changes

  const moodColors = {
    relaxed: '#67b88f',
    happy: '#5dc791',
    fine: '#68d076',
    anxious: '#ebe153',
    sad: '#f7a046',
    angry: '#f75646'
  };

  const chartData = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        data: Object.values(moodCounts),
        backgroundColor: Object.keys(moodCounts).map(mood => moodColors[mood.toLowerCase()]),
        hoverBackgroundColor: Object.keys(moodCounts).map(mood => moodColors[mood.toLowerCase()])
      }
    ]
  };

  const chartOptions = {
    cutout: '50%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  const handleViewClick = () => {
    navigate('/correlation');
  };

  const handleMoodClick = (mood) => {
    navigate(`/mood-statistics/${mood}`);
  };

  const moodIcons = {
    relaxed: '/images/relaxed.svg',
    happy: '/images/happy.svg',
    fine: '/images/fine.svg',
    anxious: '/images/anxious.svg',
    sad: '/images/sad.svg',
    angry: '/images/angry.svg'
  };

  const sortedMoods = Object.keys(moodCounts).sort((a, b) => moodCounts[b] - moodCounts[a]);

  const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

  return (
    <div style={{ backgroundColor: '#eef0ee', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', marginTop: '20px', width: '90%', maxWidth: '800px', textAlign: 'left', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '24px' }}>Correlation Analysis</h2>
        <p style={{ color: '#3a3939', fontSize: '14px' }}>Know how your activities are related to your mood</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={handleViewClick} style={{ backgroundColor: '#6fba94', color: '#eef0ee', fontWeight: 'bold', padding: '10px 25px', borderRadius: '20px', border: 'none', cursor: 'pointer' }}>
            View
          </button>
        </div>
      </div>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginTop: '20px', marginBottom: '80px', width: '90%', maxWidth: '800px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '24px', textAlign: 'left' }}>Mood Count</h2>
            <p style={{ color: '#3a3939', fontSize: '14px', textAlign: 'left' }}>Click on mood to view related activities</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px', color: '#3a3939', fontWeight: 'bold' }}>Weekly</span>
            <IOSSwitch checked={period === 'monthly'} onChange={() => setPeriod(period === 'weekly' ? 'monthly' : 'weekly')} />
            <span style={{ marginLeft: '10px', color: '#3a3939', fontWeight: 'bold' }}>Monthly</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px', height: '300px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            {sortedMoods.map((mood, index) => (
              <div key={index} style={{ margin: '0 10px', textAlign: 'center', cursor: 'pointer' }} onClick={() => handleMoodClick(mood)}>
                <img src={moodIcons[mood.toLowerCase()]} alt={mood} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                <p style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '16px' }}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</p>
                <p style={{ color: '#6fba94', fontWeight: 'bold', fontSize: '16px' }}>{moodCounts[mood]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav value={navValue} setValue={setNavValue} />
    </div>
  );
};

export default Statistics;