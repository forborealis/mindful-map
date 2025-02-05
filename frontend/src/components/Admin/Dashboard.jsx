import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const navigate = useNavigate();
  const [monthlyUsers, setMonthlyUsers] = useState(0);
  const [monthlyUserData, setMonthlyUserData] = useState([]);
  const [activeUsersCount, setActiveUsersCount] = useState(0);

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem('token');
    // Redirect to the login page
    navigate('/signin');
  };

  useEffect(() => {
    const fetchMonthlyUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/monthly-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMonthlyUsers(response.data.reduce((acc, data) => acc + data.count, 0));
        setMonthlyUserData(response.data);
      } catch (error) {
        console.error('Error fetching monthly users:', error);
      }
    };

    const fetchActiveUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/active-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setActiveUsersCount(response.data.length);
      } catch (error) {
        console.error('Error fetching active users:', error);
      }
    };

    fetchMonthlyUsers();
    fetchActiveUsers();
  }, []);

  const barChartData = {
    labels: monthlyUserData.map(data => data.month),
    datasets: [
      {
        label: 'Users Created',
        data: monthlyUserData.map(data => data.count),
        backgroundColor: '#64aa86',
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#eef0ee]">
      <div className="flex justify-between p-6">
        <div className="bg-[#eef0ee] border border-[#6fba94] rounded-lg p-4 flex items-center w-1/2 mr-4">
          <ShowChartIcon className="text-[#64aa86] mr-4" />
          <div>
            <h2 className="text-[#292f33] font-bold">Total Monthly Users</h2>
            <p className="text-[#64aa86] font-bold">{monthlyUsers}</p>
          </div>
        </div>
        <div className="bg-[#eef0ee] border border-[#6fba94] rounded-lg p-4 flex items-center w-1/2">
          <TaskAltIcon className="text-[#64aa86] mr-4" />
          <div>
            <h2 className="text-[#292f33] font-bold">Active Users</h2>
            <p className="text-[#64aa86] font-bold">{activeUsersCount}</p>
          </div>
        </div>
      </div>
      <div className="bg-white border border-[#6fba94] rounded-lg p-4 m-6 max-w-4xl mx-auto">
        <h2 className="text-[#292f33] font-bold mb-4">Users Created Every Month</h2>
        <div className="h-64">
          <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Dashboard;