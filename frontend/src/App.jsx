import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Home from './components/User/Home';
import MoodLog from './components/User/MoodLog';
import LogActivities from './components/User/LogActivities';
import MoodEntries from './components/User/MoodEntries';
import CalendarLog from './components/User/CalendarLog';
import DailyRecommendations from './components/User/DailyRecommendations';
import JournalLogs from './components/User/Journal/JournalLogs';
import JournalEntry from './components/User/Journal/JournalEntry';
import ViewJournal from './components/User/Journal/ViewJournal';
import EditJournal from './components/User/Journal/EditJournal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error('Please sign in to access this page.');
    return <Navigate to="/signin" />;
  }
  return children;
};

const App = () => {
  const [hasLoggedMood, setHasLoggedMood] = useState(null); // Initialize as null to indicate loading state
  const [formData, setFormData] = useState({
    mood: '',
    activities: [],
    social: [],
    health: [],
    sleepQuality: '',
  });

  useEffect(() => {
    const checkMoodLog = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/mood-log', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const today = new Date().toISOString().split('T')[0];
          const loggedToday = response.data.some(log => log.date.split('T')[0] === today);
          setHasLoggedMood(loggedToday);
        } catch (error) {
          console.error('Error checking mood log:', error);
          setHasLoggedMood(false); // Set to false if there's an error
        }
      } else {
        setHasLoggedMood(false); // No token means not logged in
      }
    };
    checkMoodLog();
  }, []);

  if (hasLoggedMood === null) {
    return <div>Loading...</div>; // Show loading state while checking mood log
  }

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              {hasLoggedMood ? <Navigate to="/mood-entries" /> : <Navigate to="/log-mood" />}
            </PrivateRoute>
          }
        />
        <Route
          path="/log-mood"
          element={
            <PrivateRoute>
              <MoodLog setFormData={setFormData} />
            </PrivateRoute>
          }
        />
        <Route
          path="/log-activities"
          element={
            <PrivateRoute>
              <LogActivities formData={formData} setFormData={setFormData} />
            </PrivateRoute>
          }
        />
        <Route
          path="/mood-entries"
          element={
            <PrivateRoute>
              <MoodEntries />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar-log"
          element={
            <PrivateRoute>
              <CalendarLog formData={formData} setFormData={setFormData} />
            </PrivateRoute>
          }
        />
        <Route
          path="/daily-recommendations"
          element={
            <PrivateRoute>
              <DailyRecommendations />
            </PrivateRoute>
          }
        />
        <Route
          path="/journal-logs"
          element={
            <PrivateRoute>
              <JournalLogs />
            </PrivateRoute>
          }
        />
        <Route
          path="/journal-entry"
          element={
            <PrivateRoute>
              <JournalEntry />
            </PrivateRoute>
          }
        />
         <Route
          path="/view-journal/:id"
          element={
            <PrivateRoute>
              <ViewJournal />
            </PrivateRoute>
          }
        />
         <Route
          path="/edit-journal/:id"
          element={
            <PrivateRoute>
              <EditJournal />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;