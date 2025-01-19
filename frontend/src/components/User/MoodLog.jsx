import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MoodLog = ({ setFormData }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMoodClick = (mood) => {
    setFormData((prevData) => ({ ...prevData, mood }));
    navigate('/home');
  };

  const handleContinueClick = () => {
    navigate('/log-activities');
  };

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const day = daysOfWeek[currentTime.getDay()];
  const date = `${months[currentTime.getMonth()]} ${currentTime.getDate()}`;
  const time = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-[#eef0ee] h-screen flex flex-col items-center justify-center relative">
      <h2 className="text-5xl font-bold mb-2">How are you feeling today?</h2>
      <div className="flex justify-between w-full max-w-md px-10 mb-6">
        <div className="text-sm text-left w-1/2">
          <p>{day}, {date}</p>
        </div>
        <div className="text-sm text-right w-1/2">
          <p>{time}</p>
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex space-x-6">
        <div onClick={() => handleMoodClick('Relaxed')} className="cursor-pointer text-center">
          <img src="/images/relaxed.svg" alt="Relaxed" className="w-28 h-28 mx-auto" />
          <p>Relaxed</p>
        </div>
        <div onClick={() => handleMoodClick('Happy')} className="cursor-pointer text-center">
          <img src="/images/happy.svg" alt="Happy" className="w-28 h-28 mx-auto" />
          <p>Happy</p>
        </div>
        <div onClick={() => handleMoodClick('Fine')} className="cursor-pointer text-center">
          <img src="/images/fine.svg" alt="Fine" className="w-28 h-28 mx-auto" />
          <p>Fine</p>
        </div>
        <div onClick={() => handleMoodClick('Anxious')} className="cursor-pointer text-center">
          <img src="/images/anxious.svg" alt="Anxious" className="w-28 h-28 mx-auto" />
          <p>Anxious</p>
        </div>
        <div onClick={() => handleMoodClick('Sad')} className="cursor-pointer text-center">
          <img src="/images/sad.svg" alt="Sad" className="w-28 h-28 mx-auto" />
          <p>Sad</p>
        </div>
        <div onClick={() => handleMoodClick('Angry')} className="cursor-pointer text-center">
          <img src="/images/angry.svg" alt="Angry" className="w-28 h-28 mx-auto" />
          <p>Angry</p>
        </div>
      </div>
      <button
        onClick={handleContinueClick}
        className="absolute bottom-10 right-10 bg-[#6fba94] text-white font-bold py-2 px-4 rounded-full hover:bg-[#5aa88f]"
      >
        Continue
      </button>
    </div>
  );
};

export default MoodLog;