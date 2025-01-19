import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Home from './components/User/Home';
import MoodLog from './components/User/MoodLog';
import LogActivities from './components/User/LogActivities';
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
  const [hasLoggedMood, setHasLoggedMood] = useState(false);
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
          const response = await axios.get('http://localhost:5000/api/mood-logs', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const today = new Date().toISOString().split('T')[0];
          const loggedToday = response.data.data.some(log => log.date.split('T')[0] === today);
          setHasLoggedMood(loggedToday);
        } catch (error) {
          console.error('Error checking mood log:', error);
        }
      }
    };
    checkMoodLog();
  }, []);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              {hasLoggedMood ? <Home /> : <Navigate to="/log-mood" />}
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
              <LogActivities setFormData={setFormData} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;