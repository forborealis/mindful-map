import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodIcon from '@mui/icons-material/Mood';
import RecommendIcon from '@mui/icons-material/Recommend';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookIcon from '@mui/icons-material/Book';

const images = [
  '/images/landing1.png',
  '/images/landing2.png',
  '/images/landing3.png',
  '/images/landing4.png',
  '/images/landing5.png'
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeImage, setFadeImage] = useState(true);
  const [showWhatWeDo, setShowWhatWeDo] = useState(false);

  useEffect(() => {
    setFadeIn(true);
    const interval = setInterval(() => {
      setFadeImage(false);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFadeImage(true);
      }, 500);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const whatWeDoSection = document.getElementById('what-we-do-section');
      const whatWeDoRect = whatWeDoSection.getBoundingClientRect();
      if (whatWeDoRect.top <= window.innerHeight) {
        setShowWhatWeDo(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-nunito overflow-x-hidden" style={{ backgroundColor: '#eef0ee' }}>
      <header className="w-full flex items-center p-2 absolute top-0 left-0 mt-10 ml-12">
        <h1 className="text-[#6fba94] text-2xl font-bold">Mindful Map</h1>
      </header>
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between mt-20">
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
              className="bg-[#64aa86] text-white px-8 py-2 rounded-full shadow-md hover:bg-[#5a9a76]"
              onClick={() => navigate('/about')}
            >
              About Us
            </button>
            <button
              className="bg-[#64aa86] text-white px-8 py-2 rounded-full shadow-md hover:bg-[#5a9a76]"
              onClick={() => navigate('/signin')}
            >
              Try Now
            </button>
          </div>
        </div>
        <div className={`transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'} md:w-1/2 mt-20 md:mt-0 flex justify-center md:justify-end md:pr-28 relative`}>
          <div className="absolute inset-0 flex justify-center items-center z-0">
            <div className="w-[500px] h-[500px] rounded-full bg-[#64aa86] opacity-100" style={{ filter: 'blur(100px)' }}></div>
          </div>
          <img
            src={images[currentImageIndex]}
            alt="Mindful Map"
            className={`w-full h-auto max-w-lg transition-opacity duration-500 ${fadeImage ? 'opacity-100' : 'opacity-0'} z-10`}
          />
        </div>
      </div>
      <div id="what-we-do-section" className={`transition-opacity duration-1000 ${showWhatWeDo ? 'opacity-100' : 'opacity-0'} mt-20 w-full flex flex-col items-center justify-center mb-20`}>
        <div className="w-4/5 bg-[#a6d0bb] rounded-3xl p-6">
          <h2 className="text-4xl text-[#292f33] font-bold text-center mb-8">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#eef0ee] hover:bg-[#64aa86] p-10 rounded-3xl shadow-md transition-colors duration-300 flex flex-col items-center justify-center">
              <div className="bg-[#6fba94] rounded-full p-4 mb-4">
                <MoodIcon className="text-[#eef0ee]" style={{ fontSize: 40 }} />
              </div>
              <h3 className="text-xl text-[#292f33] font-bold mb-2 text-center">Mood and Tracking</h3>
              <p className="text-mg text-center">
                The system will run a correlation analysis which allows you to understand and visualize how your habits affect your emotions.
              </p>
            </div>
            <div className="bg-[#eef0ee] hover:bg-[#64aa86] p-10 rounded-3xl shadow-md transition-colors duration-300 flex flex-col items-center justify-center">
              <div className="bg-[#6fba94] rounded-full p-4 mb-4">
                <RecommendIcon className="text-[#eef0ee]" style={{ fontSize: 40 }} />
              </div>
              <h3 className="text-xl text-[#292f33] font-bold mb-2 text-center">Personalized Recommendation</h3>
              <p className="text-mg text-center">
                Based on the results of your analysis, get recommendations that are tailored according to the statistics that you've received.
              </p>
            </div>
            <div className="bg-[#eef0ee] hover:bg-[#64aa86] p-10 rounded-3xl shadow-md transition-colors duration-300 flex flex-col items-center justify-center">
              <div className="bg-[#6fba94] rounded-full p-4 mb-4">
                <BarChartIcon className="text-[#eef0ee]" style={{ fontSize: 40 }} />
              </div>
              <h3 className="text-xl text-[#292f33] font-bold mb-2 text-center">Data Visualization</h3>
              <p className="text-mg text-center">
                Through varying charts, be able understand your mood trends along with your sleep quality patterns and correlation statistics.
              </p>
            </div>
            <div className="bg-[#eef0ee] hover:bg-[#64aa86] p-10 rounded-3xl shadow-md transition-colors duration-300 flex flex-col items-center justify-center">
              <div className="bg-[#6fba94] rounded-full p-4 mb-4">
                <BookIcon className="text-[#eef0ee]" style={{ fontSize: 40 }} />
              </div>
              <h3 className="text-xl text-[#292f33] font-bold mb-2 text-center">Journaling Challenges</h3>
              <p className="text-mg text-center">
                Participate in daily journal challenges with system-automated prompts and recommendations on what you can input, put your thoughts into words.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;