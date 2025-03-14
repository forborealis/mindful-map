import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Replace react-icons with Material UI icons
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GroupsIcon from '@mui/icons-material/Groups';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';

const AboutUs = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeInTeam, setFadeInTeam] = useState(false);
  const [fadeInVision, setFadeInVision] = useState(false);
  const [fadeInMission, setFadeInMission] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const statsRef = useRef(null);
  
  useEffect(() => {
    setFadeIn(true);
    
    const handleScroll = () => {
      // Show/hide scroll to top button
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
      
      const visionSection = document.getElementById('vision-section');
      const missionSection = document.getElementById('mission-section');
      const teamSection = document.getElementById('team-section');
      
      if (visionSection) {
        const visionRect = visionSection.getBoundingClientRect();
        if (visionRect.top <= window.innerHeight * 0.8) {
          setFadeInVision(true);
          if (visionRect.top <= 200 && visionRect.bottom >= 200) {
            setActiveSection('vision-section');
          }
        }
      }
      
      if (missionSection) {
        const missionRect = missionSection.getBoundingClientRect();
        if (missionRect.top <= window.innerHeight * 0.8) {
          setFadeInMission(true);
          if (missionRect.top <= 200 && missionRect.bottom >= 200) {
            setActiveSection('mission-section');
          }
        }
      }
      
      if (teamSection) {
        const teamRect = teamSection.getBoundingClientRect();
        if (teamRect.top <= window.innerHeight * 0.8) {
          setFadeInTeam(true);
          if (teamRect.top <= 200 && teamRect.bottom >= 200) {
            setActiveSection('team-section');
          }
        }
      }
      
      // Parallax effect
      const parallaxElements = document.querySelectorAll('.parallax');
      const scrolled = window.scrollY;
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed');
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };
    
    // Increment stats
    const incrementStats = () => {
      const statsElement = statsRef.current;
      if (statsElement) {
        const statsRect = statsElement.getBoundingClientRect();
        if (statsRect.top <= window.innerHeight * 0.8) {
          const counters = statsElement.querySelectorAll('.stat-counter');
          counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.innerText);
            const increment = target / 30; // Increment by this amount each time
            
            if (count < target) {
              counter.innerText = Math.ceil(count + increment);
              setTimeout(incrementStats, 50);
            } else {
              counter.innerText = target;
            }
          });
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', incrementStats);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', incrementStats);
    };
  }, []);
  
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const teamMembers = [
    {
      name: "Hannah Aurora Busto",
      role: "Fullstack Developer",
      image: "/images/member1.png",
      social: { linkedin: "#", github: "#", twitter: "#" }
    },
    {
      name: "Aminah Malic",
      role: "Fullstack Developer",
      image: "/images/member3.png",
      social: { linkedin: "#", github: "#", twitter: "#" }
    },
    {
      name: "Prof. Pops Madriaga",
      role: "Project Adviser",
      image: "/images/maampops.png",
      social: { linkedin: "#", github: "#", twitter: "#" }
    },
    {
      name: "Angel Galapon",
      role: "Member",
      image: "/images/member2.png",
      social: { linkedin: "#", github: "#", twitter: "#" }
    },
    {
      name: "Resty Jr Cailao",
      role: "Member",
      image: "/images/member4.png",
      social: { linkedin: "#", github: "#", twitter: "#" }
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#67b88f] via-[#93c4ab] to-[#fdffff] font-nunito overflow-hidden">
      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab 
          color="primary" 
          size="small" 
          aria-label="scroll back to top"
          onClick={scrollToTop}
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16, 
            backgroundColor: '#64aa86',
            '&:hover': {
              backgroundColor: '#4a8a68',
            }
          }}
        >
          <ArrowUpwardIcon />
        </Fab>
      </Zoom>
      
      {/* Navigation */}
      <nav className="w-full bg-[#eef0ee] py-4 shadow-md fixed top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 
            className="text-[#64aa86] text-2xl font-bold cursor-pointer flex items-center"
            onClick={() => navigate('/')}
          >
            <motion.span whileHover={{ scale: 1.1 }}>Mindful Map</motion.span>
          </h1>
          <div className="flex space-x-6">
            <span 
              className={`text-[#64aa86] cursor-pointer transition-all duration-300 hover:text-[#4a8a68] ${activeSection === 'vision-section' ? 'font-bold border-b-2 border-[#64aa86]' : ''}`}
              onClick={() => scrollToSection('vision-section')}
            >
              Vision
            </span>
            <span 
              className={`text-[#64aa86] cursor-pointer transition-all duration-300 hover:text-[#4a8a68] ${activeSection === 'mission-section' ? 'font-bold border-b-2 border-[#64aa86]' : ''}`}
              onClick={() => scrollToSection('mission-section')}
            >
              Mission
            </span>
            <span 
              className={`text-[#64aa86] cursor-pointer transition-all duration-300 hover:text-[#4a8a68] ${activeSection === 'team-section' ? 'font-bold border-b-2 border-[#64aa86]' : ''}`}
              onClick={() => scrollToSection('team-section')}
            >
              The Team
            </span>
            <motion.span 
              className="bg-[#64aa86] text-white px-4 py-1 rounded-full cursor-pointer hover:bg-[#4a8a68]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </motion.span>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between mt-32"
      >
        <div className="text-center md:text-left md:w-1/2 md:pl-10 lg:pl-20">
          <h1 className="text-4xl md:text-6xl font-bold text-[#292f33] mb-6 leading-tight relative">
            <span className="relative">
              We're Here to Help
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#64aa86]"></span>
            </span>
          </h1>
          <p className="text-lg text-justify text-[#292f33] mb-8">
            Mindful Map is a daily mood and activity tracking system designed to help you understand the connection between your emotions and daily routines. By logging your moods and activities, you can identify patterns that influence your well-being, empowering you to manage your emotions more effectively.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#e8f5ef' }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-[#6fba94] font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => navigate('/signup')}
          >
            Start Your Journey
          </motion.button>
        </div>
        <div className={`md:w-1/2 mt-10 md:mt-0 flex justify-center md:justify-end md:pr-10 lg:pr-20 relative`}>
          <motion.div 
            className="absolute w-64 h-64 bg-[#64aa86] rounded-full opacity-10 -z-10"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ top: '-10%', right: '15%' }}
          />
          <motion.img 
            src="/images/about.png" 
            alt="About Us" 
            className="w-full h-auto max-w-lg relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.03, rotate: 1 }}
          />
        </div>
      </motion.div>

     
      
      {/* Vision Section */}
      <div id="vision-section" className={`w-full bg-[#eef0ee] py-20 transition-opacity duration-1000 ${fadeInVision ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="md:w-1/3 mb-10 md:mb-0"
            whileHover={{ rotate: 2 }}
          >
            <div className="relative">
              <div className="absolute -top-3 -right-3 w-32 h-32 bg-[#64aa86] rounded-full opacity-20"></div>
              <img 
                src="/images/vision.png" 
                alt="Vision" 
                className="w-full h-auto max-w-sm mx-auto relative z-10 parallax" 
                data-speed="0.05"
              />
            </div>
          </motion.div>
          <div className="md:w-2/3 md:pl-12 text-left">
            <div className="flex items-center mb-6">
              <LightbulbIcon sx={{ fontSize: 40, color: '#f59e0b', marginRight: 2 }} />
              <h2 className="text-4xl font-bold text-[#292f33] relative">
                Vision
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-amber-500"></span>
              </h2>
            </div>
            <motion.p 
              className="text-lg text-[#292f33] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: fadeInVision ? 1 : 0, y: fadeInVision ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              To empower individuals with self-awareness and emotional resilience by providing a seamless and insightful way to track and understand their moods and daily activities. Mindful Map envisions a world where everyone can achieve emotional balance and well-being through mindful reflection and data-driven insights.
            </motion.p>
            <motion.p 
              className="text-lg text-[#292f33]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: fadeInVision ? 1 : 0, y: fadeInVision ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Our vision is to create a supportive community where individuals can share their experiences and learn from each other. We believe that by fostering a culture of openness and understanding, we can help people develop healthier emotional habits and improve their overall quality of life.
            </motion.p>
          </div>
        </div>
      </div>
      
      {/* Mission Section */}
      <div id="mission-section" className={`w-full bg-[#64aa86] py-20 transition-opacity duration-1000 ${fadeInMission ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between">
          <div className="md:w-2/3 md:pr-12 text-left">
            <div className="flex items-center mb-6">
              <RocketLaunchIcon sx={{ fontSize: 40, color: '#fff', marginRight: 2 }} />
              <h2 className="text-4xl font-bold text-white relative">
                Mission
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-white"></span>
              </h2>
            </div>
            <motion.p 
              className="text-lg text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: fadeInMission ? 1 : 0, y: fadeInMission ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Mindful Map strives to help users in building healthier emotional habits by offering an intuitive platform for mood and activity tracking. Through personalized insights and recommendations, we aim to support users in properly managing their emotions, fostering self-awareness, and improving overall mental well-being.
            </motion.p>
            <motion.p 
              className="text-lg text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: fadeInMission ? 1 : 0, y: fadeInMission ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Our mission is to provide a user-friendly and accessible tool that empowers individuals to take control of their mental health. We are committed to continuous improvement and innovation, ensuring that Mindful Map remains a valuable resource for our users.
            </motion.p>
          </div>
          <motion.div
            className="md:w-1/3 mb-10 md:mb-0"
            whileHover={{ rotate: -2 }}
          >
            <div className="relative">
              <div className="absolute -top-3 -left-3 w-32 h-32 bg-white rounded-full opacity-20"></div>
              <img 
                src="/images/mission.png" 
                alt="Mission" 
                className="w-full h-auto max-w-sm mx-auto relative z-10 parallax" 
                data-speed="-0.05"
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Team Section */}
      <div id="team-section" className={`container mx-auto px-4 py-20 text-center transition-opacity duration-1000 ${fadeInTeam ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-center mb-12">
          <GroupsIcon sx={{ fontSize: 40, color: '#64aa86', marginRight: 2 }} />
          <h2 className="text-4xl md:text-5xl font-bold text-[#292f33] relative">
            Our Team
            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-[#64aa86]"></span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-20">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index}
              className="relative bg-[#eef0ee] rounded-lg shadow-lg overflow-hidden w-64 group"
              whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: fadeInTeam ? 1 : 0, y: fadeInTeam ? 0 : 50 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-teal-600"></div>
              <div className="relative pt-6 px-6">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#64aa86] rounded-full opacity-10"></div>
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-auto rounded-lg mb-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#292f33] mb-1">{member.name}</h3>
                <p className="text-[#64aa86] font-medium mb-4">{member.role}</p>
                <div className="flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a href={member.social.linkedin} className="text-gray-600 hover:text-[#0077B5]">
                    <LinkedInIcon />
                  </a>
                  <a href={member.social.github} className="text-gray-600 hover:text-[#333]">
                    <GitHubIcon />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <button 
            className="bg-[#64aa86] text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-[#4a8a68] transition-colors duration-300"
            onClick={() => navigate('/signup')}
          >
            Join Mindful Map Today
          </button>
        </motion.div>
      </div>
      
      {/* Footer */}
      <div className="w-full bg-[#292f33] text-white py-6 text-center">
        <p>© {new Date().getFullYear()} Mindful Map. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AboutUs;