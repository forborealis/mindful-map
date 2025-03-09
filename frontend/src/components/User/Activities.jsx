import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../BottomNav';

const Activities = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState('activities');

  const handleBreathingExerciseClick = () => {
    navigate('/breathing-exercise');
  };

  const handlePomodoroClick = () => {
    navigate('/pomodoro');
  };

  const handleBubblepopGameClick = () => {
    navigate('/bubblepop-game');
  };

  const handleCalmingMusicClick = () => {
    navigate('/calming-music');
  };

  return (
    <div className="bg-[#b4ddc8] min-h-screen flex flex-col justify-between">
      <div className="flex justify-center items-center flex-grow">
        <div className="grid grid-cols-4 gap-4 w-4/5">
          <div
            onClick={handleBreathingExerciseClick}
            className="bg-[#5aa8af] rounded-lg p-5 text-center cursor-pointer"
          >
            <img src="/images/breathingexercise.png" alt="Breathing Exercise" className="w-full rounded-lg" />
            <p className="text-white font-bold mt-2">Breathing Exercise</p>
          </div>
          <div
            onClick={handlePomodoroClick}
            className="bg-[#5aa8af] rounded-lg p-5 text-center cursor-pointer"
          >
            <img src="/images/pomodoro.png" alt="Pomodoro Technique" className="w-full rounded-lg" />
            <p className="text-white font-bold mt-2">Pomodoro Technique</p>
          </div>
          <div 
            onClick={handleBubblepopGameClick}
            className="bg-[#5aa8af] rounded-lg p-5 text-center cursor-pointer"
          >
            <img src="/images/bubblepopgame.png" alt="Stress-relief Bubble Popping Game" className="w-full rounded-lg" />
            <p className="text-white font-bold mt-2">Stress-relief Bubble Popping Game</p>
          </div>
          <div 
            onClick={handleCalmingMusicClick}
            className="bg-[#5aa8af] rounded-lg p-5 text-center cursor-pointer"
          >
            <img src="/images/relaxingmusic.png" alt="Calming Music" className="w-full rounded-lg" />
            <p className="text-white font-bold mt-2">Calming Music</p>
          </div>
        </div>
      </div>
      <BottomNav value={value} setValue={setValue} />
    </div>
  );
};

export default Activities;