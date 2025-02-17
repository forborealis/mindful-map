import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddReactionIcon from '@mui/icons-material/AddReaction';

const LandingPage = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [imageSrc, setImageSrc] = useState('/images/landing1.gif');
  const [fadeImage, setFadeImage] = useState(true);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleImageClick = () => {
    setFadeImage(false);
    setTimeout(() => {
      setImageSrc((prevSrc) =>
        prevSrc === '/images/landing1.gif' ? '/images/landing2.gif' : '/images/landing1.gif'
      );
      setFadeImage(true);
    }, 500); // Adjust the delay as needed
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex flex-col items-center justify-center font-nunito">
      <header className="w-full flex items-center p-2 absolute top-0 left-0 mt-10 ml-12">
        <AddReactionIcon className="text-[#292f33] h-4 w-4 mr-1" />
        <h1 className="text-[#292f33] text-lg font-bold">Mindful Map</h1>
      </header>
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left md:w-1/2 md:pl-48">
          <h1 className="text-6xl md:text-7xl font-semibold text-[#292f33] mb-6 leading-tight">
            Unlock a<br />
            Healthier Mind
          </h1>
          <p className="text-2xl text-[#292f33] mb-6">
            Keep track of your moods every day and determine how your activities can impact your daily mood.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <button
              className="bg-white text-[#292f33] px-8 py-2 rounded-full shadow-md hover:bg-gray-200"
              onClick={() => navigate('/about')}
            >
              About Us
            </button>
            <button
              className="bg-white text-[#292f33] px-8 py-2 rounded-full shadow-md hover:bg-gray-200"
              onClick={() => navigate('/signin')}
            >
              Try Now
            </button>
          </div>
        </div>
        <div className={`transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'} md:w-1/2 mt-20 md:mt-0 flex justify-center md:justify-end md:pr-28`}>
          <img
            src={imageSrc}
            alt="Mindful Map"
            className={`w-full h-auto max-w-lg cursor-pointer transition-opacity duration-500 ${fadeImage ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleImageClick}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;