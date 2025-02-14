import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correlationData } = location.state;
  const [recommendations, setRecommendations] = useState([]);
  const [correlatedMood, setCorrelatedMood] = useState('');

  useEffect(() => {
    console.log('Correlation Data:', correlationData); // Debugging log

    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.post('http://localhost:5000/api/recommendations', { correlationData }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Fetched Recommendations:', response.data); // Debugging log
        setRecommendations(response.data);

        // Extract the correlated mood from the correlation data
        const moodResult = correlationData.find(result => result.correlationMood);
        if (moodResult) {
          setCorrelatedMood(moodResult.correlationMood);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [correlationData]);

  const handleBreathingExerciseClick = () => {
    navigate('/breathing-exercise');
  };

  const handlePomodoroClick = () => {
    navigate('/pomodoro');
  };

  return (
    <div style={{ background: 'linear-gradient(to right, #67b88f, #93c4ab, #f8ffff)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', width: '90%', maxWidth: '800px', textAlign: 'left', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <p style={{ color: '#b1b1b1', fontSize: '14px', marginBottom: '10px' }}>
          Your habits are strongly linked to feeling {correlatedMood}.
        </p>
        <p style={{ color: '#64aa86', fontWeight: 'bolder', fontSize: '26px', marginBottom: '20px' }}>
          Follow these strategies
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          {recommendations.map((rec, index) => (
            <li key={index} style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '20px', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              - {rec}
              {(rec.toLowerCase().includes('breathing') || rec.toLowerCase().includes('breathing exercise')) && (
                <ArrowCircleRightIcon
                  style={{ color: '#6fba94', marginLeft: '10px', cursor: 'pointer' }}
                  onClick={handleBreathingExerciseClick}
                />
              )}
              {rec.toLowerCase().includes('pomodoro') && (
                <AccessTimeFilledIcon
                  style={{ color: '#6fba94', marginLeft: '10px', cursor: 'pointer' }}
                  onClick={handlePomodoroClick}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Recommendations;