import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddReactionIcon from '@mui/icons-material/AddReaction';

const LandingPage = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-bg flex flex-col items-center justify-center font-nunito">
      <header className="w-full flex items-center p-2 absolute top-0 left-0 mt-10 ml-12">
        <AddReactionIcon className="text-black h-4 w-4 mr-1" />
        <h1 className="text-black text-lg font-bold">Mindful Map</h1>
      </header>
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left md:w-1/2 md:pl-48">
          <h1 className="text-4xl md:text-7xl font-semibold text-black mb-6 leading-tight">
            Unlock a<br />
            Healthier Mind
          </h1>
          <p className="text-base text-black mb-6">
            Keep track of your moods every day and determine how your activities can impact your daily mood.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <button className="bg-white text-black px-8 py-2 rounded-full shadow-md hover:bg-gray-200">About Us</button>
            <button
              className="bg-white text-black px-8 py-2 rounded-full shadow-md hover:bg-gray-200"
              onClick={() => navigate('/signin')}
            >
              Try Now
            </button>
          </div>
        </div>
        <div className={`transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'} md:w-1/2 mt-20 md:mt-0 flex justify-center md:justify-end md:pr-28`}>
          <img src="/images/landing.png" alt="Mindful Map" className="w-full h-auto max-w-lg" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;