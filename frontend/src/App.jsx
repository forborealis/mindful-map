import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
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
import CorrelationStatistics from './components/User/Statistics/CorrelationStatistics';
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

const useAuth = () => {
  const token = localStorage.getItem('token');
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (token) {
        try {
          const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserRole(userResponse.data.role);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
      setLoading(false);
    };

    fetchUserRole();
  }, [token]);

  return { token, userRole, loading };
};

const UserPrivateRoute = ({ children }) => {
  const { token, userRole, loading } = useAuth();
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevLocation) {
      setPrevLocation(location.pathname);
    }
  }, [location.pathname, prevLocation]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    toast.error('Please sign in to access this page.');
    return <Navigate to="/signin" />;
  }

  if (userRole !== 'user') {
    toast.error('Access denied.');
    return <Navigate to={prevLocation} replace />;
  }

  return children;
};

const AdminPrivateRoute = ({ children }) => {
  const { token, userRole, loading } = useAuth();
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevLocation) {
      setPrevLocation(location.pathname);
    }
  }, [location.pathname, prevLocation]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    toast.error('Please sign in to access this page.');
    return <Navigate to="/signin" />;
  }

  if (userRole !== 'admin') {
    toast.error('Access denied.');
    return <Navigate to={prevLocation} replace />;
  }

  return children;
};

const App = () => {
  const [formData, setFormData] = useState({
    mood: '',
    activities: [],
    social: [],
    health: [],
    sleepQuality: '',
  });

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/log-mood"
          element={
            <UserPrivateRoute>
              <MoodLog setFormData={setFormData} />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/log-activities"
          element={
            <UserPrivateRoute>
              <LogActivities formData={formData} setFormData={setFormData} />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/mood-entries"
          element={
            <UserPrivateRoute>
              <MoodEntries />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/calendar-log"
          element={
            <UserPrivateRoute>
              <CalendarLog formData={formData} setFormData={setFormData} />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/daily-recommendations"
          element={
            <UserPrivateRoute>
              <DailyRecommendations />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/journal-logs"
          element={
            <UserPrivateRoute>
              <JournalLogs />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/journal-entry"
          element={
            <UserPrivateRoute>
              <JournalEntry />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/view-journal/:id"
          element={
            <UserPrivateRoute>
              <ViewJournal />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/edit-journal/:id"
          element={
            <UserPrivateRoute>
              <EditJournal />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/journal-prompt"
          element={
            <UserPrivateRoute>
              <JournalPrompt />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <UserPrivateRoute>
              <Statistics />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/correlation"
          element={
            <UserPrivateRoute>
              <Correlation />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/correlation-statistics"
          element={
            <UserPrivateRoute>
              <CorrelationStatistics />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/mood-statistics/:mood"
          element={
            <UserPrivateRoute>
              <MoodStatistics />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/main-predictions"
          element={
            <UserPrivateRoute>
              <MainPredictions formData={formData} setFormData={setFormData} />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/weekly-predictions"
          element={
            <UserPrivateRoute>
              <WeeklyPredictions formData={formData} setFormData={setFormData} />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/daily-prediction"
          element={
            <UserPrivateRoute>
              <DailyPrediction formData={formData} setFormData={setFormData} />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminPrivateRoute>
              <Dashboard />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminPrivateRoute>
              <UsersTable />
            </AdminPrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;