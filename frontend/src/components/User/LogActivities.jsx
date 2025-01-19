import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogActivities = ({ formData, setFormData }) => {
  const navigate = useNavigate();

  const handleActivityClick = (activity) => {
    setFormData((prevData) => ({
      ...prevData,
      activities: [...prevData.activities, activity],
    }));
  };

  const handleSocialClick = (social) => {
    setFormData((prevData) => ({
      ...prevData,
      social: [...prevData.social, social],
    }));
  };

  const handleHealthClick = (health) => {
    setFormData((prevData) => ({
      ...prevData,
      health: [...prevData.health, health],
    }));
  };

  const handleSleepQualityClick = (sleepQuality) => {
    setFormData((prevData) => ({
      ...prevData,
      sleepQuality,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/mood-log', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/home');
    } catch (error) {
      console.error('Error submitting activities:', error);
    }
  };

  const activities = [
    { name: 'Studying', icon: '/images/studying.svg' },
    { name: 'Exam', icon: '/images/exam.svg' },
    { name: 'Work', icon: '/images/work.svg' },
    { name: 'Reading', icon: '/images/reading.svg' },
    { name: 'Gaming', icon: '/images/gaming.svg' },
    { name: 'Music', icon: '/images/music.svg' },
    { name: 'Movie', icon: '/images/movie.svg' },
    { name: 'Drinking', icon: '/images/drinking.svg' },
    { name: 'Relax', icon: '/images/relax.svg' },
  ];

  const social = [
    { name: 'Family', icon: '/images/family.svg' },
    { name: 'Friends', icon: '/images/friends.svg' },
    { name: 'Relationship', icon: '/images/relationship.svg' },
    { name: 'Colleagues', icon: '/images/colleagues.svg' },
    { name: 'Pets', icon: '/images/pets.svg' },
  ];

  const health = [
    { name: 'Exercise', icon: '/images/exercise.svg' },
    { name: 'Walk', icon: '/images/walk.svg' },
    { name: 'Run', icon: '/images/run.svg' },
    { name: 'Eat Healthy', icon: '/images/eat-healthy.svg' },
  ];

  const sleepQuality = [
    { name: 'No Sleep', icon: '/images/no-sleep.svg' },
    { name: 'Poor Sleep', icon: '/images/poor-sleep.svg' },
    { name: 'Medium Sleep', icon: '/images/medium-sleep.svg' },
    { name: 'Good Sleep', icon: '/images/good-sleep.svg' },
  ];

  return (
    <div className="bg-[#eef0ee] min-h-screen flex flex-col items-center justify-start pt-20 pb-20 relative">
      <h2 className="text-5xl font-bold mb-8">How did your day go?</h2>
      <div className="w-full max-w-3xl bg-[#eef0ee] border border-[#b1b1b1] rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-4">Activities</h3>
        <div className="grid grid-cols-5 gap-2">
          {activities.map((activity) => (
            <div
              key={activity.name}
              onClick={() => handleActivityClick(activity.name)}
              className="cursor-pointer text-center"
            >
              <img src={activity.icon} alt={activity.name} className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">{activity.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-3xl bg-[#eef0ee] border border-[#b1b1b1] rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-4">Social</h3>
        <div className="grid grid-cols-5 gap-2">
          {social.map((socialItem) => (
            <div
              key={socialItem.name}
              onClick={() => handleSocialClick(socialItem.name)}
              className="cursor-pointer text-center"
            >
              <img src={socialItem.icon} alt={socialItem.name} className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">{socialItem.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-3xl bg-[#eef0ee] border border-[#b1b1b1] rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-4">Health</h3>
        <div className="grid grid-cols-4 gap-2">
          {health.map((healthItem) => (
            <div
              key={healthItem.name}
              onClick={() => handleHealthClick(healthItem.name)}
              className="cursor-pointer text-center"
            >
              <img src={healthItem.icon} alt={healthItem.name} className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">{healthItem.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-3xl bg-[#eef0ee] border border-[#b1b1b1] rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-4">Sleep Quality</h3>
        <div className="grid grid-cols-4 gap-2">
          {sleepQuality.map((sleepItem) => (
            <div
              key={sleepItem.name}
              onClick={() => handleSleepQualityClick(sleepItem.name)}
              className="cursor-pointer text-center"
            >
              <img src={sleepItem.icon} alt={sleepItem.name} className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">{sleepItem.name}</p>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="absolute bottom-10 right-10 bg-[#6fba94] text-white font-bold py-2 px-4 rounded-full hover:bg-[#5aa88f]"
      >
        Continue
      </button>
    </div>
  );
};

export default LogActivities;