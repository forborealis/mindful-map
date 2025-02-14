import React, { useState, useEffect, useRef } from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: '1.1rem', 
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const Pomodoro = () => {
  const [time, setTime] = useState(1500); 
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  const toggleStartPause = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  const resetTimer = () => {
    setTime(1500);
    setIsActive(false);
  };

  const setPomodoro = () => {
    setTime(1500);
    setIsActive(false);
  };

  const setShortBreak = () => {
    setTime(300);
    setIsActive(false);
  };

  const setLongBreak = () => {
    setTime(900);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-[#67b88f] via-[#93c4ab] to-[#f8ffff] min-h-screen flex justify-center items-center">
      <div className="bg-white bg-opacity-20 p-10 rounded-lg text-center" style={{ width: '90%', maxWidth: '800px' }}>
        <Breadcrumbs aria-label="breadcrumb" className="mb-8 flex justify-center">
          <StyledBreadcrumb component="a" href="#" label="Pomodoro" onClick={setPomodoro} />
          <StyledBreadcrumb component="a" href="#" label="Short Break" onClick={setShortBreak} />
          <StyledBreadcrumb component="a" href="#" label="Long Break" onClick={setLongBreak} />
        </Breadcrumbs>
        <div className="text-9xl font-bold mt-16 mb-16 text-white">{formatTime(time)}</div> {/* Added margin-top */}
        <div className="flex justify-center items-center space-x-4">
          <div onClick={toggleStartPause} className="cursor-pointer">
            {isActive ? <PauseIcon style={{ fontSize: 50, color: 'white' }} /> : <PlayArrowIcon style={{ fontSize: 50, color: 'white' }} />}
          </div>
          <div onClick={resetTimer} className="cursor-pointer">
            <ReplayIcon style={{ fontSize: 50, color: 'white' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;