import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import BottomNav from '../BottomNav';

const MainPredictions = () => {
  const [value, setValue] = useState('prediction');
  const navigate = useNavigate();

  const handleDailyClick = () => {
    navigate("/daily-prediction"); 
  };

  const handleWeeklyClick = () => {
    navigate("/weekly-predictions"); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#67b88f] via-[#93c4ab] to-[#fdffff]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#3a3939]">Mood and Activity Predictions</h1>
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={handleDailyClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Daily Prediction
        </button>
        <button
          onClick={handleWeeklyClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Weekly Predictions
        </button>
      </div>
      <BottomNav value={value} setValue={setValue} />
    </div>
  );
};

export default MainPredictions;
