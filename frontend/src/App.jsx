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
import JournalPrompt from './components/User/Journal/JournalPrompt';
import Statistics from './components/User/Statistics/Statistics';
import Correlation from './components/User/Statistics/Correlation';
import MoodStatistics from './components/User/Statistics/MoodStatistics';
import WeeklyPredictions from './components/User/WeeklyPredictions';
import DailyPrediction from './components/User/DailyPrediction';
import MainPredictions from './components/User/MainPredictions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import Dashboard from './components/Admin/Dashboard';
import UsersTable from './components/Admin/UsersTable';

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
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const checkMoodLog = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Fetch user role
          const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserRole(userResponse.data.role);

          // Check mood log only if the user is not an admin
          if (userResponse.data.role !== 'admin') {
            const response = await axios.get('http://localhost:5000/api/mood-log', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const today = new Date().toISOString().split('T')[0];
            const loggedToday = response.data.some(log => log.date.split('T')[0] === today);
            setHasLoggedMood(loggedToday);
          } else {
            setHasLoggedMood(false); // Admins don't need to log mood
          }
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
              {userRole === 'admin' ? (
                <Navigate to="/admin/dashboard" />
              ) : hasLoggedMood ? (
                <Navigate to="/mood-entries" />
              ) : (
                <Navigate to="/log-mood" />
              )}
            </PrivateRoute>
          }
        />
        <Route
          path="/log-mood"
          element={
            <PrivateRoute>
              {userRole === 'admin' ? <Navigate to="/admin/dashboard" /> : <MoodLog setFormData={setFormData} />}
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
              {userRole === 'admin' ? <Navigate to="/admin/dashboard" /> : <MoodEntries />}
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
        <Route
          path="/journal-prompt"
          element={
            <PrivateRoute>
              <JournalPrompt />
            </PrivateRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <PrivateRoute>
              <Statistics />
            </PrivateRoute>
          }
        />
        <Route
          path="/correlation"
          element={
            <PrivateRoute>
              <Correlation />
            </PrivateRoute>
          }
        />
        <Route
          path="/mood-statistics/:mood"
          element={
            <PrivateRoute>
              <MoodStatistics />
            </PrivateRoute>
          }
        />
        <Route
          path="/main-predictions"
          element={
            <PrivateRoute>
              <MainPredictions formData={formData} setFormData={setFormData} />
            </PrivateRoute>
          }
        />
        <Route
          path="/weekly-predictions"
          element={
            <PrivateRoute>
              <WeeklyPredictions formData={formData} setFormData={setFormData} />
            </PrivateRoute>
          }
        />
        <Route
          path="/daily-prediction"
          element={
            <PrivateRoute>
              <DailyPrediction formData={formData} setFormData={setFormData} />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <UsersTable />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;