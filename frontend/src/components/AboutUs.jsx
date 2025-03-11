import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeInTeam, setFadeInTeam] = useState(false);
  const [fadeInVision, setFadeInVision] = useState(false);
  const [fadeInMission, setFadeInMission] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);

    const handleScroll = () => {
      const visionSection = document.getElementById('vision-section');
      const missionSection = document.getElementById('mission-section');
      const teamSection = document.getElementById('team-section');
      const visionRect = visionSection.getBoundingClientRect();
      const missionRect = missionSection.getBoundingClientRect();
      const teamRect = teamSection.getBoundingClientRect();
      if (visionRect.top <= window.innerHeight) {
        setFadeInVision(true);
      }
      if (missionRect.top <= window.innerHeight) {
        setFadeInMission(true);
      }
      if (teamRect.top <= window.innerHeight) {
        setFadeInTeam(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#67b88f] via-[#93c4ab] to-[#fdffff] font-nunito">
     <nav className="w-full bg-[#eef0ee] py-4 shadow-md fixed top-0 z-50">
  <div className="container mx-auto flex justify-start items-center pl-4">
    <h1 className="text-[#64aa86] text-2xl font-bold cursor-pointer mr-4" onClick={() => navigate('/')}>
      Mindful Map
    </h1>
    <div className="flex space-x-4">
      <span className="text-[#64aa86] cursor-pointer" onClick={() => scrollToSection('vision-section')}>Vision</span>
      <span className="text-[#64aa86] cursor-pointer" onClick={() => scrollToSection('mission-section')}>Mission</span>
      <span className="text-[#64aa86] cursor-pointer" onClick={() => scrollToSection('team-section')}>The Team</span>
      <span className="text-[#64aa86] cursor-pointer" onClick={() => navigate('/signup')}>Sign Up</span>
    </div>
  </div>
</nav>
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between mt-32">
        <div className="text-center md:text-left md:w-1/2 md:pl-48">
          <h1 className="text-4xl md:text-6xl font-bold text-[#292f33] mb-6 leading-tight">
            We're Here to Help
          </h1>
          <p className="text-lg text-justify text-[#292f33] mb-6">
            Mindful Map is a daily mood and activity tracking system designed to help you understand the connection between your emotions and daily routines. By logging your moods and activities, you can identify patterns that influence your well-being, empowering you to manage your emotions more effectively. With insightful visualizations and personalized recommendations, Mindful Map encourages self-awareness and emotional balance.
          </p>
          <button
            className="bg-white text-[#6fba94] font-bold px-8 py-2 rounded-full shadow-md hover:bg-gray-200"
            onClick={() => navigate('/signup')}
          >
            Try Today
          </button>
        </div>
        <div className={`md:w-1/2 mt-10 md:mt-0 flex justify-center md:justify-end md:pr-28 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          <img src="/images/about.png" alt="About Us" className="w-full h-auto max-w-lg hover:scale-105 transition-transform duration-300" />
        </div>
      </div>
      <div id="vision-section" className={`w-full bg-[#eef0ee] py-10 transition-opacity duration-1000 ${fadeInVision ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <img src="/images/vision.png" alt="Vision" className="w-1/2 md:w-1/3 transition-transform duration-1000 transform translate-y-10 ${fadeInVision ? 'translate-y-0' : ''}" />
          <div className="md:w-2/3 text-left">
            <h2 className="text-4xl font-bold text-[#292f33] mb-4">Vision</h2>
            <p className="text-lg text-[#292f33]">
              To empower individuals with self-awareness and emotional resilience by providing a seamless and insightful way to track and understand their moods and daily activities. Mindful Map envisions a world where everyone can achieve emotional balance and well-being through mindful reflection and data-driven insights.
            </p>
            <p className="text-lg text-[#292f33] mt-4">
              Our vision is to create a supportive community where individuals can share their experiences and learn from each other. We believe that by fostering a culture of openness and understanding, we can help people develop healthier emotional habits and improve their overall quality of life.
            </p>
          </div>
        </div>
      </div>
      <div id="mission-section" className={`w-full bg-[#64aa86] py-10 transition-opacity duration-1000 ${fadeInMission ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 text-right">
            <h2 className="text-4xl font-bold text-[#eef0ee] mb-4">Mission</h2>
            <p className="text-lg text-[#eef0ee]">
              Mindful Map strives to help users in building healthier emotional habits by offering an intuitive platform for mood and activity tracking. Through personalized insights and recommendations, we aim to support users in properly managing their emotions, fostering self-awareness, and improving overall mental well-being.
            </p>
            <p className="text-lg text-[#eef0ee] mt-4">
              Our mission is to provide a user-friendly and accessible tool that empowers individuals to take control of their mental health. We are committed to continuous improvement and innovation, ensuring that Mindful Map remains a valuable resource for our users.
            </p>
          </div>
          <img src="/images/mission.png" alt="Mission" className="w-1/2 md:w-1/3 transition-transform duration-1000 transform translate-y-10 ${fadeInMission ? 'translate-y-0' : ''}" />
        </div>
      </div>
      <div id="team-section" className={`container mx-auto px-4 mt-20 text-center transition-opacity duration-1000 ${fadeInTeam ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-4xl md:text-6xl font-bold text-[#292f33] mb-6">
          Our Team
        </h2>

        <div className="flex flex-wrap justify-center space-x-4 mb-20">
          <div className="relative bg-[#eef0ee] p-6 rounded-lg shadow-md w-64 text-left">
            <div className="absolute inset-0 flex justify-center items-center z-0" style={{ top: '-90px' }}>
              <div className="w-48 h-48 rounded-lg bg-[#3a3939]"></div>
            </div>
            <img src="/images/member1.png" alt="Hannah Aurora Busto" className="w-full h-auto mb-4 relative z-10" />
            <hr className="border-t-2 border-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-[#292f33]">Hannah Aurora Busto</h3>
            <p className="text-mg text-[#292f33]">Fullstack Developer</p>
          </div>
          <div className="relative bg-[#eef0ee] p-6 rounded-lg shadow-md w-64 text-left">
            <div className="absolute inset-0 flex justify-center items-center z-0" style={{ top: '-90px' }}>
              <div className="w-48 h-48 rounded-lg bg-[#3a3939]"></div>
            </div>
            <img src="/images/member3.png" alt="Aminah Malic" className="w-full h-auto mb-4 relative z-10" />
            <hr className="border-t-2 border-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-[#292f33]">Aminah Malic</h3>
            <p className="text-mg text-[#292f33]">Fullstack Developer</p>
          </div>
          <div className="relative bg-[#eef0ee] p-6 rounded-lg shadow-md w-64 text-left">
            <div className="absolute inset-0 flex justify-center items-center z-0" style={{ top: '-90px' }}>
              <div className="w-48 h-48 rounded-lg bg-[#3a3939]"></div>
            </div>
            <img src="/images/maampops.png" alt="Ms. Pops V. Madriaga" className="w-full h-auto mb-4 relative z-10" />
            <hr className="border-t-2 border-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-[#292f33]">Prof. Pops Madriaga</h3>
            <p className="text-mg text-[#292f33]">Project Adviser</p>
          </div>
          <div className="relative bg-[#eef0ee] p-6 rounded-lg shadow-md w-64 text-left">
            <div className="absolute inset-0 flex justify-center items-center z-0" style={{ top: '-90px' }}>
              <div className="w-48 h-48 rounded-lg bg-[#3a3939]"></div>
            </div>
            <img src="/images/member2.png" alt="Angel Galapon" className="w-full h-auto mb-4 relative z-10" />
            <hr className="border-t-2 border-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-[#292f33]">Angel Galapon</h3>
            <p className="text-mg text-[#292f33]">Member</p>
          </div>
          <div className="relative bg-[#eef0ee] p-6 rounded-lg shadow-md w-64 text-left">
            <div className="absolute inset-0 flex justify-center items-center z-0" style={{ top: '-90px' }}>
              <div className="w-48 h-48 rounded-lg bg-[#3a3939]"></div>
            </div>
            <img src="/images/member4.png" alt="Resty Jr Cailao" className="w-full h-auto mb-4 relative z-10" />
            <hr className="border-t-2 border-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-[#292f33]">Resty Jr Cailao</h3>
            <p className="text-mg text-[#292f33]">Member</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;