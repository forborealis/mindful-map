import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BottomNav from '../BottomNav';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@mui/material/CircularProgress';
import { Menu, MenuItem, FormControlLabel, Checkbox, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const MoodEntries = () => {
  const [moodLogs, setMoodLogs] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [value, setValue] = useState('entries');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDays, setSelectedDays] = useState({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });

  const fetchMoodLogs = async (page) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/mood-log/paginated', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          month: currentMonth + 1,
          year: currentYear,
          page,
          limit: 4,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching mood logs:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadInitialLogs = async () => {
      const initialLogs = await fetchMoodLogs(0);
      setMoodLogs(initialLogs);
      setPage(1);
      setHasMore(initialLogs.length === 4);
    };

    loadInitialLogs();
  }, [currentMonth, currentYear]);

  const loadMoreLogs = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Add a delay of 1 second
    const newLogs = await fetchMoodLogs(page);
    setMoodLogs((prevLogs) => [...prevLogs, ...newLogs]);
    setPage((prevPage) => prevPage + 1);
    setHasMore(newLogs.length === 4);
    setLoading(false);
  };

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setPage(0);
    setMoodLogs([]);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setPage(0);
    setMoodLogs([]);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleDayChange = (event) => {
    setSelectedDays({
      ...selectedDays,
      [event.target.name]: event.target.checked,
    });
  };

  const filteredMoodLogs = useMemo(() => {
    return moodLogs.filter((moodLog) => {
      const logDate = new Date(moodLog.date);
      const day = daysOfWeek[logDate.getDay()];
      return selectedDays[day] || !Object.values(selectedDays).some(Boolean);
    });
  }, [moodLogs, selectedDays]);

  return (
    <div className="bg-[#b4ddc8] min-h-screen flex flex-col justify-between">
      <div>
        <nav className="bg-white py-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center justify-center w-full">
              <ChevronLeftIcon className="cursor-pointer mx-2" onClick={handlePrevMonth} />
              <h1 className="text-xl font-bold">{months[currentMonth]} {currentYear}</h1>
              <ChevronRightIcon className="cursor-pointer mx-2" onClick={handleNextMonth} />
            </div>
            <div className="absolute right-0 mr-4">
              <Button
                aria-controls="filter-menu"
                aria-haspopup="true"
                onClick={handleFilterClick}
                startIcon={<FilterListIcon style={{ color: '#6fba94' }} />}
              >
              </Button>
              <Menu
                id="filter-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleFilterClose}
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedDays[day]}
                          onChange={handleDayChange}
                          name={day}
                        />
                      }
                      label={day}
                    />
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>
        </nav>
        <InfiniteScroll
          dataLength={filteredMoodLogs.length}
          next={loadMoreLogs}
          hasMore={hasMore}
          loader={<div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 60px 0' }}><CircularProgress /></div>}
          endMessage={<p style={{ textAlign: 'center' }}>No more logs</p>}
        >
          <div className="flex flex-col items-center justify-center pt-10 pb-20 overflow-y-auto">
            {filteredMoodLogs.length === 0 ? (
              <p>No logs for this month.</p>
            ) : (
              filteredMoodLogs.map((moodLog) => {
                const { mood, activities, social, health, sleepQuality, date, time } = moodLog;
                const logDate = new Date(date);
                const day = daysOfWeek[logDate.getDay()];
                const formattedDate = `${months[logDate.getMonth()]} ${logDate.getDate()}`;

                return (
                  <div key={moodLog._id} className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-md mb-6">
                    <div className="flex items-start mb-4">
                      <img src={`/images/${mood.toLowerCase()}.gif`} alt={mood} className="w-20 h-20 mr-4 rounded-full" />
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
                                <img src={`/images/${activity.toLowerCase()}.gif`} alt={activity} className="w-12 h-12 mr-2" />
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
                                <img src={`/images/${socialItem.toLowerCase()}.gif`} alt={socialItem} className="w-12 h-12 mr-2" />
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
                                <img src={`/images/${healthItem.toLowerCase()}.gif`} alt={healthItem} className="w-12 h-12 mr-2" />
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
                            <img src={`/images/${sleepQuality.toLowerCase().replace(' ', '-')}.gif`} alt={sleepQuality} className="w-12 h-12 mr-2" />
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
        </InfiniteScroll>
      </div>
      <BottomNav value={value} setValue={setValue} />
    </div>
  );
};

export default MoodEntries;