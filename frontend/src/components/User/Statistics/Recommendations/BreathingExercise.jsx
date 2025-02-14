import React, { useEffect, useState, useRef } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const BreathingExercise = () => {
  const [phase, setPhase] = useState('Breathe In');
  const [count, setCount] = useState(4);
  const phases = ['Breathe In', 'Hold1', 'Breathe Out', 'Hold2'];
  const audioRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 1) {
          setPhase((prevPhase) => {
            const nextIndex = (phases.indexOf(prevPhase) + 1) % phases.length;
            return phases[nextIndex];
          });
          return 4;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [phases]);

  useEffect(() => {
    audioRef.current.play();
  }, []);

  const adjustVolume = (event) => {
    audioRef.current.volume = event.target.value;
  };

  return (
    <div className="bg-gradient-to-r from-[#67b88f] via-[#93c4ab] to-[#f8ffff] min-h-screen flex justify-center items-center relative">
      <div className="bg-white p-5 rounded-lg w-11/12 max-w-2xl text-left shadow-lg">
        <p className="text-[#b1b1b1] text-sm mb-2">
          Follow this breathing exercise
        </p>
        <p className="text-[#64aa86] font-bold text-2xl mb-5">
          Box Breathing Exercise
        </p>
        <div className="flex justify-center items-center h-64 relative">
          <div className="w-96 h-48 border-4 border-[#64aa86] flex flex-col justify-center items-center relative">
            <p className={`absolute top-2 text-lg ${phase === 'Breathe In' ? 'text-[#64aa86] font-bold' : 'text-[#b1b1b1]'}`}>Breathe In</p>
            <p className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-lg ${phase === 'Hold1' ? 'text-[#64aa86] font-bold' : 'text-[#b1b1b1]'}`}>Hold</p>
            <p className={`absolute bottom-2 text-lg ${phase === 'Breathe Out' ? 'text-[#64aa86] font-bold' : 'text-[#b1b1b1]'}`}>Breathe Out</p>
            <p className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-lg ${phase === 'Hold2' ? 'text-[#64aa86] font-bold' : 'text-[#b1b1b1]'}`}>Hold</p>
            <p className="text-lg font-bold">{count}</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 flex items-center">
        <VolumeUpIcon className="text-white mr-2" />
        <input type="range" min="0" max="1" step="0.01" onChange={adjustVolume} style={{ accentColor: 'white' }} />
      </div>
      <audio ref={audioRef} src="/music/breathingexercise.mp3" loop></audio>
    </div>
  );
};

export default BreathingExercise;