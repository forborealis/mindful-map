import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import BottomNav from '../BottomNav';

const MainPredictions = () => {
  const [value, setValue] = useState('prediction');
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [hasMoodLogs, setHasMoodLogs] = useState(true); // State to check if mood logs exist
  const [errorMessage, setErrorMessage] = useState(""); // To store the error message
  const [showModal, setShowModal] = useState(false); // State to control the popup modal visibility

  useEffect(() => {
    setFadeIn(true);

    // Check if the user has mood logs in the past 30 days
    const checkMoodLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setHasMoodLogs(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/get-mood-logs', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success && data.moodLogs && data.moodLogs.length > 0) {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          // Check if there's any mood log from the last 30 days
          const recentLogs = data.moodLogs.filter(log => new Date(log.timestamp) > thirtyDaysAgo);

          if (recentLogs.length === 0) {
            setHasMoodLogs(false);
          }
        } else {
          setHasMoodLogs(false);
        }
      } catch (error) {
        console.error("Error fetching mood logs:", error);
        setHasMoodLogs(false);
      }
    };

    checkMoodLogs();
  }, []);

  const handleDailyClick = () => {
    if (hasMoodLogs) {
      navigate("/daily-prediction");
    } else {
      setErrorMessage("Need at least one week of mood data for predictions. Please come back again later.");
      setShowModal(true); 
    }
  };

  const handleWeeklyClick = () => {
    if (hasMoodLogs) {
      navigate("/weekly-predictions");
    } else {
      setErrorMessage("Need at least one week of mood data for predictions. Please come back again later.");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#67b88f] via-[#93c4ab] to-[#fdffff] pb-20">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg mt-10">
        <div className={`transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'} md:w-1/2`}>
          <img src="/images/predictive.png" alt="Predictive" className="w-full h-auto mb-8 md:mb-0" />
        </div>
        <div className="md:w-1/2 md:pl-8 text-left">
          <h1 className="text-5xl font-bold text-[#3a3939] mb-4">Mood and Activity Predictions</h1>
          <p className="text-xl text-[#191919] mb-2">How does this work?</p>
          <p className="text-mg text-[#191919] mb-8">
            The system analyzes the moods that have been previously logged as well as their related activities, creating weekly and daily predictions based on the most occurring moods and activities. This feature helps the users understand their past logs, allowing them to see the mood they may have for the following days and what may influence these moods.
          </p>

          <div className="flex space-x-4">
            <button
              onClick={handleDailyClick}
              className="bg-[#6fba94] text-white font-bold px-10 py-1 rounded-full hover:bg-[#5da87a]"
            >
              Daily
            </button>
            <button
              onClick={handleWeeklyClick}
              className="bg-[#6fba94] text-white font-bold px-10 py-1 rounded-full hover:bg-[#5da87a]"
            >
              Weekly
            </button>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h2 className="text-xl font-bold text-black">Error</h2>
            <p className="text-black mt-2">{errorMessage}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white font-bold px-4 py-2 rounded-full hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav value={value} setValue={setValue} />
    </div>
  );
};

export default MainPredictions;
