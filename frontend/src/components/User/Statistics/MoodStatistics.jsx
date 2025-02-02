import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import BottomNav from '../../BottomNav';

const MoodStatistics = () => {
  const { mood } = useParams();
  const location = useLocation();
  const [activityData, setActivityData] = useState([]);
  const [socialData, setSocialData] = useState([]);
  const [healthData, setHealthData] = useState([]);

  const moodIcons = {
    relaxed: '/images/relaxed.svg',
    happy: '/images/happy.svg',
    fine: '/images/fine.svg',
    anxious: '/images/anxious.svg',
    sad: '/images/sad.svg',
    angry: '/images/angry.svg'
  };

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

        // Determine the period from the query parameter
        const queryParams = new URLSearchParams(location.search);
        const period = queryParams.get('period') || 'monthly';

        // Calculate activity percentages for the selected mood
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
          return logDate.isBetween(startOfPeriod, endOfPeriod, null, '[]') && log.mood.toLowerCase() === mood.toLowerCase();
        });

        const activityCountMap = {};
        const socialCountMap = {};
        const healthCountMap = {};

        periodLogs.forEach(log => {
          log.activities.forEach(activity => {
            if (activityCategories.activities.includes(activity.toLowerCase())) {
              if (!activityCountMap[activity]) {
                activityCountMap[activity] = 0;
              }
              activityCountMap[activity]++;
            }
          });

          log.social.forEach(social => {
            if (activityCategories.social.includes(social.toLowerCase())) {
              if (!socialCountMap[social]) {
                socialCountMap[social] = 0;
              }
              socialCountMap[social]++;
            }
          });

          log.health.forEach(health => {
            if (activityCategories.health.includes(health.toLowerCase())) {
              if (!healthCountMap[health]) {
                healthCountMap[health] = 0;
              }
              healthCountMap[health]++;
            }
          });
        });

        const totalActivities = Object.values(activityCountMap).reduce((a, b) => a + b, 0);
        const totalSocial = Object.values(socialCountMap).reduce((a, b) => a + b, 0);
        const totalHealth = Object.values(healthCountMap).reduce((a, b) => a + b, 0);

        const activityPercentages = Object.keys(activityCountMap).map(activity => ({
          activity,
          percentage: ((activityCountMap[activity] / totalActivities) * 100).toFixed(1)
        }));

        const socialPercentages = Object.keys(socialCountMap).map(social => ({
          social,
          percentage: ((socialCountMap[social] / totalSocial) * 100).toFixed(1)
        }));

        const healthPercentages = Object.keys(healthCountMap).map(health => ({
          health,
          percentage: ((healthCountMap[health] / totalHealth) * 100).toFixed(1)
        }));

        // Sort by percentage from greatest to lowest
        activityPercentages.sort((a, b) => b.percentage - a.percentage);
        socialPercentages.sort((a, b) => b.percentage - a.percentage);
        healthPercentages.sort((a, b) => b.percentage - a.percentage);

        setActivityData(activityPercentages);
        setSocialData(socialPercentages);
        setHealthData(healthPercentages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [mood, location.search]);

  const activityIcons = {
    studying: '/images/studying.svg',
    work: '/images/work.svg',
    exam: '/images/exam.svg',
    gaming: '/images/gaming.svg',
    drinking: '/images/drinking.svg',
    relax: '/images/relax.svg',
    movie: '/images/movie.svg',
    music: '/images/music.svg',
    reading: '/images/reading.svg',
    family: '/images/family.svg',
    friends: '/images/friends.svg',
    relationship: '/images/relationship.svg',
    colleagues: '/images/colleagues.svg',
    pets: '/images/pets.svg',
    exercise: '/images/exercise.svg',
    walk: '/images/walk.svg',
    run: '/images/run.svg',
    eatHealthy: '/images/eathealthy.svg',
    // Add other activity icons here
  };

  const renderActivity = (activity, index) => (
    <div key={index} style={{ margin: '10px', textAlign: 'center', width: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src={activityIcons[activity.activity.toLowerCase()]} alt={activity.activity} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
      <p style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>{activity.activity.charAt(0).toUpperCase() + activity.activity.slice(1)}</p>
      <div style={{ border: '1px solid #6fba94', borderRadius: '15px', padding: '2px 8px', display: 'inline-block', textAlign: 'center' }}>
        <p style={{ color: '#6fba94', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>{activity.percentage}%</p>
      </div>
    </div>
  );

  const renderSocial = (social, index) => (
    <div key={index} style={{ margin: '10px', textAlign: 'center', width: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src={activityIcons[social.social.toLowerCase()]} alt={social.social} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
      <p style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>{social.social.charAt(0).toUpperCase() + social.social.slice(1)}</p>
      <div style={{ border: '1px solid #6fba94', borderRadius: '15px', padding: '2px 8px', display: 'inline-block', textAlign: 'center' }}>
        <p style={{ color: '#6fba94', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>{social.percentage}%</p>
      </div>
    </div>
  );

  const renderHealth = (health, index) => (
    <div key={index} style={{ margin: '10px', textAlign: 'center', width: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src={activityIcons[health.health.toLowerCase()]} alt={health.health} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
      <p style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>{health.health.charAt(0).toUpperCase() + health.health.slice(1)}</p>
      <div style={{ border: '1px solid #6fba94', borderRadius: '15px', padding: '2px 8px', display: 'inline-block', textAlign: 'center' }}>
        <p style={{ color: '#6fba94', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>{health.percentage}%</p>
      </div>
    </div>
  );

  const activityCategories = {
    activities: ['studying', 'work', 'exam', 'gaming', 'drinking', 'relax', 'movie', 'music', 'reading'],
    social: ['family', 'friends', 'relationship', 'colleagues', 'pets'],
    health: ['exercise', 'walk', 'run', 'eat healthy']
  };

  const renderCategory = (category, data, renderFunction) => (
    <div style={{ marginBottom: '20px', width: '100%' }}>
      <h3 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '20px', textAlign: 'left', marginLeft: '20px' }}>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {data.map((item, index) => renderFunction(item, index))}
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#eef0ee', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', marginTop: '20px', width: '90%', maxWidth: '800px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        {renderCategory('activities', activityData, renderActivity)}
        <hr style={{ width: '100%', border: '1px solid #ddd', margin: '20px 0' }} />
        {renderCategory('social', socialData, renderSocial)}
        <hr style={{ width: '100%', border: '1px solid #ddd', margin: '20px 0' }} />
        {renderCategory('health', healthData, renderHealth)}
      </div>
    </div>
  );
};

export default MoodStatistics;