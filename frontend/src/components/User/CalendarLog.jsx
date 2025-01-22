import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BottomNav from '../BottomNav';

const CalendarLog = () => {
  const [moodLogs, setMoodLogs] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [value, setValue] = useState('entries');
  const navigate = useNavigate();

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

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay());
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

  const getMoodForDate = (day) => {
    const log = moodLogs.find(log => {
      const logDate = new Date(log.date);
      return logDate.getFullYear() === currentYear && logDate.getMonth() === currentMonth && logDate.getDate() === day;
    });

    if (log) return log.mood;

    const logDate = new Date(currentYear, currentMonth, day);
    if (
      logDate >= currentWeekStart &&
      logDate <= currentWeekEnd &&
      logDate < today
    ) {
      return 'plus';
    }

    return 'gray';
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  const handlePlusClick = (day) => {
    navigate(`/log-mood?date=${currentYear}-${currentMonth + 1}-${day}`);
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
        <div className="grid grid-cols-7 gap-2 mt-12 max-w-screen-md mx-auto bg-gray-100 rounded-lg shadow p-4"> {/* Increased width */} 
            {daysOfWeek.map((day, i) => (
              <div key={i} className="text-center font-bold text-gray-400 mb-5">{day}</div>
            ))}
            {[...Array(firstDay)].map((_, i) => <div key={i}></div>)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const mood = getMoodForDate(day);
              const isToday = day === today.getDate();  

              return (
                <div key={day} className="flex flex-col items-center mb-3"> {/* Added margin below each row */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 md:w-12 md:h-12 rounded-full shadow 
                      ${isToday && mood === 'plus' ? 'text-green-500 bg-gray-200 border-2 border-green-500' : 
                        mood === 'plus' ? 'bg-gray-200' : mood === 'gray' ? 'bg-gray-200' : 'bg-white'}`}
                    >
                      {mood === 'plus' ? (
                        <button
                        className={`text-2xl rounded-full ${isToday ? 'text-green-500' : 'text-gray-400'} 
                          ${isToday ? 'bg-transparent' : 'bg-gray-200'}`}
                          style={{ padding: 0, border: 'none' }} 
                          onClick={() => handlePlusClick(day)}
                        >
                          +
                        </button>
                    ) : mood === 'gray' ? null : (
                      <img
                        src={`/images/${mood.toLowerCase()}.svg`}
                        alt={mood}
                        className="w-20 h-20 object-cover bg-transparent rounded-full"
                      />
                    )}
                  </div>
                  <span 
                    className={`mt-1 text-sm md:text-base font-semibold ${isToday ? 'text-green-500' : ''}`}
                  >
                    {day}
                  </span> 
                </div>
              );
            })}
          </div>
      </div>
      <BottomNav value={value} setValue={setValue} />
    </div>
  );
};

export default CalendarLog;
