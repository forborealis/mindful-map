import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import BottomNav from '../BottomNav';

const MainPredictions = () => {
  const [value, setValue] = useState('prediction');
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleDailyClick = () => {
    navigate("/daily-prediction"); 
  };

  const handleWeeklyClick = () => {
    navigate("/weekly-predictions"); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#67b88f] via-[#93c4ab] to-[#fdffff] pb-20">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg mt-10">
        <div className={`transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'} md:w-1/2`}>
          <img src="/images/predictive.png" alt="Predictive" className="w-full h-auto mb-8 md:mb-0" />
        </div>
        <div className="md:w-1/2 md:pl-8 text-left">
          <h1 className="text-5xl font-bold text-[#3a3939] mb-4">Mood and Activity Predictions</h1>
          <p className="text-xl text-[#191919] mb-2">How does this work?</p>
          <p className="text-mg text-[#191919] mb-8">
            The system analyzes the moods that have been previously logged as well as their related activities, creating weekly and daily predictions based on the most occurring moods and activities. This feature helps the users understand their past logs, allowing them to see the mood they may have for the following days and what may influence these moods.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={handleDailyClick}
              className="bg-[#6fba94] text-white font-bold px-10 py-1 rounded-full hover:bg-[#5da87a]"
            >
              Daily 
            </button>
            <button
              onClick={handleWeeklyClick}
              className="bg-[#6fba94] text-white font-bold px-10 py-1 rounded-full hover:bg-[#5da87a]"
            >
              Weekly 
            </button>
          </div>
        </div>
      </div>
      <BottomNav value={value} setValue={setValue} />
    </div>
  );
};

export default MainPredictions;