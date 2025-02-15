import React, { useState, useEffect, useRef } from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
  const [showModal, setShowModal] = useState(false);
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
    <div className="bg-gradient-to-r from-[#67b88f] via-[#93c4ab] to-[#f8ffff] min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-4">
        <HelpOutlineIcon 
          style={{ fontSize: 30, color: 'white', cursor: 'pointer' }} 
          onClick={() => setShowModal(true)} 
        />
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="pomodoro-modal-title"
          aria-describedby="pomodoro-modal-description"
        >
          <Box 
            className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg"
            style={{ width: '250px' }}
          >
            <Typography id="pomodoro-modal-title" variant="h6" component="h2" style={{ color: '#3a3939', fontWeight: 'bold' }}>
              What is Pomodoro?
            </Typography>
            <Typography id="pomodoro-modal-description" style={{ color: '#3a3939', fontSize: '0.875rem', fontWeight: 'bold' }}>
              The Pomodoro Technique is a time management method developed by Francesco Cirillo. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. This technique helps improve focus and productivity.
            </Typography>
          </Box>
        </Modal>
      </div>
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
      <div className="absolute bottom-4 right-4" style={{ width: '300px' }}>
        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0"
          width="100%"
          height="170"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Pomodoro;