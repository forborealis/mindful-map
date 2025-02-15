import React, { useState, useEffect } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

const calmingMessages = [
  "Breathe in... Breathe out... You are in control of your breath.",
  "Stay calm... Everything will be okay.",
  "Relax your mind... Let go of all your worries.",
  "Take it easy... You deserve a break.",
  "Feel the peace... Embrace the tranquility around you.",
  "You are doing great... Keep up the good work.",
  "Everything is okay... Trust the process.",
  "Let go of stress... You are stronger than you think.",
  "Embrace tranquility... Find your inner peace.",
  "Find your center... Stay grounded and focused.",
  "Inhale positivity... Exhale negativity.",
  "Exhale negativity... Let go of what you can't control.",
  "You are strong... Believe in your strength.",
  "Stay focused... You are capable of amazing things.",
  "Keep calm and carry on... You are resilient."
];

const motivationalQuotes = [
  "Believe in yourself! You have the power to achieve great things.",
  "You can do it! Keep pushing forward and never give up.",
  "Stay positive! Every day is a new opportunity to grow.",
  "Keep going! Your hard work will pay off in the end.",
  "You are amazing! Embrace your uniqueness and shine bright."
];

const BubblePopGame = () => {
  const [bubbles, setBubbles] = useState(Array(8).fill(false));
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState('');
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const audio = new Audio('/music/bubblepop.mp3');
    audio.load();

    // Shuffle and pick 8 unique messages
    const shuffledMessages = calmingMessages.sort(() => 0.5 - Math.random()).slice(0, 8);
    setMessages(shuffledMessages);
  }, []);

  const handleBubbleClick = (index) => {
    const audio = new Audio('/music/bubblepop.mp3');
    audio.play();

    const newBubbles = [...bubbles];
    newBubbles[index] = true;
    setBubbles(newBubbles);

    if (newBubbles.every(bubble => bubble)) {
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setQuote(randomQuote);
      setFadeOut(true);
      setTimeout(() => {
        setShowQuote(true);
        setFadeOut(false);
        setBubbles(Array(8).fill(false)); // Reset bubbles to hide calming messages
      }, 2000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#61c3c6] via-[#abe1e6] to-[#caeded] min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-4">
        <HelpOutlineIcon 
          style={{ fontSize: 30, color: 'white', cursor: 'pointer' }} 
          onClick={() => setShowModal(true)} 
        />
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="bubblepop-modal-title"
          aria-describedby="bubblepop-modal-description"
        >
          <Box 
            className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg"
            style={{ width: '250px' }}
          >
            <Typography id="bubblepop-modal-title" variant="h6" component="h2" style={{ color: '#3a3939', fontWeight: 'bold' }}>
              What is Bubble Pop?
            </Typography>
            <Typography id="bubblepop-modal-description" style={{ color: '#3a3939', fontSize: '0.875rem', fontWeight: 'bold' }}>
              The Bubble Pop game is a stress relief mini-game where you pop bubbles to reveal calming messages. After popping all bubbles, you unlock a motivational quote to inspire you.
            </Typography>
          </Box>
        </Modal>
      </div>
      <h1 className="text-5xl font-bold text-white mb-8">Pop the Bubbles!</h1>
      <div className={`grid grid-cols-4 gap-12 ${fadeOut ? 'fade-out' : ''}`}>
        {bubbles.map((popped, index) => (
          <div
            key={index}
            className={`relative w-32 h-32 flex items-center justify-center cursor-pointer ${popped ? '' : 'bubble'}`}
            style={{
              backgroundImage: popped ? 'none' : 'url(/images/bubble.png)',
              backgroundSize: 'cover'
            }}
            onClick={() => handleBubbleClick(index)}
          >
            {popped && <span className="absolute text-white text-lg font-bold text-center">{messages[index]}</span>}
          </div>
        ))}
      </div>
      {showQuote && (
        <div className="mt-8 p-6 bg-white bg-opacity-20 rounded-lg shadow-lg fade-in">
          <p className="text-2xl font-bold text-[#54aaad]">
            {quote} <SentimentSatisfiedAltIcon style={{ color: 'yellow', marginLeft: '8px' }} />
          </p>
        </div>
      )}
      <style jsx="true">{`
        .bubble {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .fade-out {
          animation: fadeOut 2s forwards;
        }
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .fade-in {
          animation: fadeIn 2s forwards;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default BubblePopGame;