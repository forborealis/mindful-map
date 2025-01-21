import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const LogActivities = ({ formData, setFormData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const moodFromState = location.state?.mood;

  // Initialize the formData with the passed mood if not already set
  useEffect(() => {
    if (moodFromState && !formData.mood) {
      setFormData((prevData) => ({ ...prevData, mood: moodFromState }));
    }
  }, [moodFromState, formData, setFormData]);

  const [selectedItems, setSelectedItems] = useState({
    mood: '',
    activities: [],
    social: [],
    health: [],
    sleepQuality: '',
  });

  const handleSelect = (type, value) => {
    setSelectedItems((prev) => {
      if (type === 'sleepQuality') {
        return { ...prev, sleepQuality: value };
      }

      const alreadySelected = prev[type].includes(value);
      const updated = alreadySelected
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value];

      return { ...prev, [type]: updated };
    });

    setFormData((prevData) => ({
      ...prevData,
      [type]:
        type === 'sleepQuality'
          ? value
          : prevData[type].includes(value)
          ? prevData[type].filter((item) => item !== value)
          : [...prevData[type], value],
    }));
  };

  const handleSubmit = async () => {
    console.log("FormData being sent:", formData); 
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please log in again.');
        return;
      }
  
      const response = await axios.post(`http://localhost:5000/api/mood-log`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Server Response:", response.data);  
      if (['angry', 'sad', 'anxious'].includes(formData.mood.toLowerCase())) {
        navigate('/daily-recommendations', { state: { mood: formData.mood.toLowerCase() } });
      } else {
        navigate('/mood-entries');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        console.error('Error submitting log:', error.message);
      }
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
    { name: 'Eat Healthy', icon: '/images/eat healthy.svg' },
  ];

  const sleepQuality = [
    { name: 'No Sleep', icon: '/images/no-sleep.svg' },
    { name: 'Poor Sleep', icon: '/images/poor-sleep.svg' },
    { name: 'Medium Sleep', icon: '/images/medium-sleep.svg' },
    { name: 'Good Sleep', icon: '/images/good-sleep.svg' },
  ];

  const renderItems = (items, type) => (
    <div className={`grid ${type === 'health' || type === 'sleepQuality' ? 'grid-cols-4' : 'grid-cols-5'} gap-2`}>
      {items.map((item) => {
        const isSelected =
          type === 'sleepQuality'
            ? selectedItems[type] === item.name
            : selectedItems[type].includes(item.name);

        return (
          <div
            key={item.name}
            onClick={() => handleSelect(type, item.name)}
            className="relative cursor-pointer text-center"
          >
            <img
              src={item.icon}
              alt={item.name}
              className={`w-10 h-10 mx-auto mb-2 ${
                isSelected ? 'opacity-60' : ''
              }`}
            />
            {isSelected && (
              <div className="absolute top-0 right-0 bg-green-500 w-4 h-4 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✔</span>
              </div>
            )}
            <p className="text-sm">{item.name}</p>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-[#eef0ee] min-h-screen flex flex-col items-center justify-start pt-20 pb-20 relative">
      <h2 className="text-5xl font-bold mb-8">How did your day go?</h2>
      <div className="w-full max-w-3xl bg-[#eef0ee] border border-[#b1b1b1] rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-4">Activities</h3>
        {renderItems(activities, 'activities')}
      </div>
      <div className="w-full max-w-3xl bg-[#eef0ee] border border-[#b1b1b1] rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-4">Social</h3>
        {renderItems(social, 'social')}
      </div>
      <div className="w-full max-w-3xl bg-[#eef0ee] border border-[#b1b1b1] rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-4">Health</h3>
        {renderItems(health, 'health')}
      </div>
      <div className="w-full max-w-3xl bg-[#eef0ee] border border-[#b1b1b1] rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-4">Sleep Quality</h3>
        {renderItems(sleepQuality, 'sleepQuality')}
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