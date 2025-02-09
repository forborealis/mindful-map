import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BlockIcon from '@mui/icons-material/Block';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const navigate = useNavigate();
  const [monthlyUsers, setMonthlyUsers] = useState(0);
  const [monthlyUserData, setMonthlyUserData] = useState([]);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [inactiveUsersCount, setInactiveUsersCount] = useState(0);

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

    const fetchInactiveUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/inactive-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInactiveUsersCount(response.data.length);
      } catch (error) {
        console.error('Error fetching inactive users:', error);
      }
    };

    fetchMonthlyUsers();
    fetchActiveUsers();
    fetchInactiveUsers();
  }, []);

  const barChartData = {
    labels: monthlyUserData.map(data => data.month),
    datasets: [
      {
        label: '',
        data: monthlyUserData.map(data => data.count),
        backgroundColor: '#64aa86',
      },
    ],
  };

  const barChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.raw;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-[#eef0ee]">
      {/* Sidebar */}
      <div className="w-1/5">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className="grid grid-cols-4 gap-10">
          <div className="bg-[#eef0ee] border border-[#6fba94] rounded-lg p-4 flex items-center h-36 w-72">
            <ShowChartIcon className="text-[#64aa86] mr-4" style={{ fontSize: '48px' }} />
            <div>
              <h2 className="text-[#292f33] font-bold text-xl">Total Monthly Users</h2>
              <p className="text-[#64aa86] font-bold text-2xl">{monthlyUsers}</p>
            </div>
          </div>
          <div className="bg-[#eef0ee] border border-[#6fba94] rounded-lg p-4 flex items-center h-36 w-72">
            <TaskAltIcon className="text-[#64aa86] mr-4" style={{ fontSize: '48px' }} />
            <div>
              <h2 className="text-[#292f33] font-bold text-xl">Active Users</h2>
              <p className="text-[#64aa86] font-bold text-2xl">{activeUsersCount}</p>
            </div>
          </div>
          <div className="bg-[#eef0ee] border border-[#6fba94] rounded-lg p-4 flex items-center h-36 w-72">
            <BlockIcon className="text-[#64aa86] mr-4" style={{ fontSize: '48px' }} />
            <div>
              <h2 className="text-[#292f33] font-bold text-xl">Inactive Users</h2>
              <p className="text-[#64aa86] font-bold text-2xl">{inactiveUsersCount}</p>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-white border border-[#6fba94] rounded-lg p-6 mt-6 max-w-2xl mx-auto">
          <h2 className="text-[#292f33] font-bold text-xl mb-4">Monthly Users</h2>
          <div className="h-64">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;