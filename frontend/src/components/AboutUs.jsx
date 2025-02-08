import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeInTeam, setFadeInTeam] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);

    const handleScroll = () => {
      const teamSection = document.getElementById('team-section');
      const rect = teamSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight) {
        setFadeInTeam(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#67b88f] via-[#93c4ab] to-[#fdffff] font-nunito">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between mt-20">
        <div className="text-center md:text-left md:w-1/2 md:pl-48">
          <h1 className="text-4xl md:text-6xl font-bold text-[#292f33] mb-6 leading-tight">
            We're Here to Help
          </h1>
          <p className="text-base text-[#292f33] mb-6">
            Mindful Map is a daily mood and activity tracking system designed to help you understand the connection between your emotions and daily routines. By logging your moods and activities, you can identify patterns that influence your well-being, empowering you to manage your emotions more effectively. With insightful visualizations and personalized recommendations, Mindful Map encourages self-awareness and emotional balance.
          </p>
          <button
            className="bg-white text-[#6fba94] font-bold px-8 py-2 rounded-full shadow-md hover:bg-gray-200"
            onClick={() => navigate('/signup')}
          >
            Try Today
          </button>
        </div>
        <div className={`md:w-1/2 mt-20 md:mt-0 flex justify-center md:justify-end md:pr-28 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          <img src="/images/about.png" alt="About Us" className="w-full h-auto max-w-lg" />
        </div>
      </div>
      <div id="team-section" className={`container mx-auto px-4 mt-20 text-center transition-opacity duration-1000 ${fadeInTeam ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-4xl md:text-6xl font-bold text-[#292f33] mb-6">
          Our Team
        </h2>
        <p className="text-base text-[#292f33] mb-12">
          Meet the people working behind the mental health-friendly system.
        </p>
        <div className="flex flex-wrap justify-center space-x-4 mb-20">
          <div className="bg-[#eef0ee] p-6 rounded-lg shadow-md w-64 text-left">
            <img src="/images/member1.png" alt="Hannah Aurora Busto" className="w-full h-auto mb-4" />
            <hr className="border-t-2 border-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-[#292f33]">Hannah Aurora Busto</h3>
            <p className="text-sm text-[#292f33]">UI Designer & Developer</p>
          </div>
          <div className="bg-[#eef0ee] p-6 rounded-lg shadow-md w-64 text-left">
            <img src="/images/member3.png" alt="Aminah Malic" className="w-full h-auto mb-4" />
            <hr className="border-t-2 border-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-[#292f33]">Aminah Malic</h3>
            <p className="text-sm text-[#292f33]">Developer</p>
          </div>
          <div className="bg-[#eef0ee] p-6 rounded-lg shadow-md w-64 text-left">
            <img src="/images/member2.png" alt="Angel Galapon" className="w-full h-auto mb-4" />
            <hr className="border-t-2 border-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-[#292f33]">Angel Galapon</h3>
            <p className="text-sm text-[#292f33]">Member</p>
          </div>
          <div className="bg-[#eef0ee] p-6 rounded-lg shadow-md w-64 text-left">
            <img src="/images/member4.png" alt="Resty Jr Cailao" className="w-full h-auto mb-4" />
            <hr className="border-t-2 border-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-[#292f33]">Resty Jr Cailao</h3>
            <p className="text-sm text-[#292f33]">Member</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;