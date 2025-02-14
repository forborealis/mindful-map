import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../BottomNav';

const Recommendation = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState('recommendation');

  const handleBreathingExerciseClick = () => {
    navigate('/breathing-exercise');
  };

  const handlePomodoroClick = () => {
    navigate('/pomodoro');
  };

  return (
    <div className="bg-[#eef0ee] min-h-screen flex flex-col justify-between">
      <div className="flex justify-center items-center flex-grow">
        <div className="flex justify-around w-4/5">
          <div
            onClick={handleBreathingExerciseClick}
            className="bg-[#6fba94] rounded-lg w-1/4 p-5 text-center cursor-pointer"
          >
            <img src="/images/breathingexercise.png" alt="Breathing Exercise" className="w-full rounded-lg" />
            <p className="text-white font-bold mt-2">Breathing Exercise</p>
          </div>
          <div
            onClick={handlePomodoroClick}
            className="bg-[#6fba94] rounded-lg w-1/4 p-5 text-center cursor-pointer"
          >
            <img src="/images/pomodoro.png" alt="Pomodoro Technique" className="w-full rounded-lg" />
            <p className="text-white font-bold mt-2">Pomodoro Technique</p>
          </div>
          <div className="bg-[#6fba94] rounded-lg w-1/4 p-5 text-center cursor-pointer">
            <img src="/images/task.png" alt="List Tasks" className="w-full rounded-lg" />
            <p className="text-white font-bold mt-2">List Tasks</p>
          </div>
        </div>
      </div>
      <BottomNav value={value} setValue={setValue} />
    </div>
  );
};

export default Recommendation;