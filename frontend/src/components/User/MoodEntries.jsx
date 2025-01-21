import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BottomNav from '../BottomNav';

const MoodEntries = () => {
  const [moodLogs, setMoodLogs] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [value, setValue] = useState('entries');

  useEffect(() => {
    const fetchMoodLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/mood-log', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMoodLogs(response.data);
      } catch (error) {
        console.error('Error fetching mood logs:', error);
      }
    };

    fetchMoodLogs();
  }, []);

  const filteredLogs = moodLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
  });

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="bg-[#eef0ee] min-h-screen flex flex-col justify-between">
      <div>
        <nav className="bg-white py-4 shadow-md">
          <div className="container mx-auto flex justify-center items-center">
            <ChevronLeftIcon className="cursor-pointer mx-2" onClick={handlePrevMonth} />
            <h1 className="text-xl font-bold">{months[currentMonth]} {currentYear}</h1>
            <ChevronRightIcon className="cursor-pointer mx-2" onClick={handleNextMonth} />
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center pt-10 pb-20 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <p>No logs for this month.</p>
          ) : (
            filteredLogs.map((moodLog) => {
              const { mood, activities, social, health, sleepQuality, date, time } = moodLog;
              const logDate = new Date(date);
              const day = daysOfWeek[logDate.getDay()];
              const formattedDate = `${months[logDate.getMonth()]} ${logDate.getDate()}`;

              return (
                <div key={moodLog._id} className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-md mb-6">
                  <div className="flex items-start mb-4">
                    <img src={`/images/${mood.toLowerCase()}.svg`} alt={mood} className="w-16 h-16 mr-4 rounded-full" />
                    <div>
                      <p className="text-sm text-[#b1b1b1]">{day}, {formattedDate}</p>
                      <p className="text-lg font-semibold">{mood}</p>
                      <p className="text-sm text-[#b1b1b1]">{time}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {activities.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Activities</h3>
                        <div className="flex flex-wrap">
                          {activities.map((activity) => (
                            <div key={activity} className="flex items-center mr-4 mb-2">
                              <img src={`/images/${activity.toLowerCase()}.svg`} alt={activity} className="w-8 h-8 mr-2" />
                              <p className="font-bold text-[#b1b1b1]">{activity}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {social.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Social</h3>
                        <div className="flex flex-wrap">
                          {social.map((socialItem) => (
                            <div key={socialItem} className="flex items-center mr-4 mb-2">
                              <img src={`/images/${socialItem.toLowerCase()}.svg`} alt={socialItem} className="w-8 h-8 mr-2" />
                              <p className="font-bold text-[#b1b1b1]">{socialItem}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {health.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Health</h3>
                        <div className="flex flex-wrap">
                          {health.map((healthItem) => (
                            <div key={healthItem} className="flex items-center mr-4 mb-2">
                              <img src={`/images/${healthItem.toLowerCase()}.svg`} alt={healthItem} className="w-8 h-8 mr-2" />
                              <p className="font-bold text-[#b1b1b1]">{healthItem}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {sleepQuality && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Sleep Quality</h3>
                        <div className="flex items-center">
                          <img src={`/images/${sleepQuality.toLowerCase().replace(' ', '-')}.svg`} alt={sleepQuality} className="w-8 h-8 mr-2" />
                          <p className="font-bold text-[#b1b1b1]">{sleepQuality}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <BottomNav value={value} setValue={setValue} />
    </div>
  );
};

export default MoodEntries;