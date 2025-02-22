import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BlockIcon from '@mui/icons-material/Block';
import ForumIcon from '@mui/icons-material/Forum'; // Import ForumIcon
import DownloadIcon from '@mui/icons-material/Download'; // Import DownloadIcon
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Dashboard = () => {
  const navigate = useNavigate();
  const [monthlyUsers, setMonthlyUsers] = useState(0);
  const [monthlyUserData, setMonthlyUserData] = useState([]);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [inactiveUsersCount, setInactiveUsersCount] = useState(0);
  const [dailyEngagementData, setDailyEngagementData] = useState([]);
  const [weeklyEngagementData, setWeeklyEngagementData] = useState([]); // State for weekly engagement data

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

    const fetchDailyEngagement = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/daily-forum-engagement', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDailyEngagementData(response.data);
      } catch (error) {
        console.error('Error fetching daily engagement:', error);
      }
    };

    const fetchWeeklyEngagement = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/weekly-forum-engagement', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWeeklyEngagementData(response.data);
      } catch (error) {
        console.error('Error fetching weekly engagement:', error);
      }
    };

    fetchMonthlyUsers();
    fetchActiveUsers();
    fetchInactiveUsers();
    fetchDailyEngagement();
    fetchWeeklyEngagement();
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
        ticks: {
          stepSize: 1, // Ensure only whole numbers are displayed
        },
      },
    },
  };

  const dailyEngagementChartData = {
    labels: dailyEngagementData.map(data => data.date),
    datasets: [
      {
        label: '',
        data: dailyEngagementData.map(data => data.count),
        backgroundColor: '#64aa86',
      },
    ],
  };

  const dailyEngagementChartOptions = {
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
        ticks: {
          stepSize: 1, // Ensure only whole numbers are displayed
        },
      },
    },
  };

  const generatePDF = (chartId, title) => {
    const input = document.querySelector(`#${chartId} canvas`);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const logoWidth = 25; 
      const logoHeight = 25;
      const margin = 15;
      const lineY = 42;  // Adjusted line position
      
      const tupLogo = new Image();
      const rightLogo = new Image();
      tupLogo.src = '/images/tup.png';
      rightLogo.src = '/images/logo.png';
      
      Promise.all([
        new Promise((resolve, reject) => {
          tupLogo.onload = resolve;
          tupLogo.onerror = reject;
        }),
        new Promise((resolve, reject) => {
          rightLogo.onload = resolve;
          rightLogo.onerror = reject;
        })
      ]).then(() => {
        pdf.addImage(tupLogo, 'PNG', margin, 10, logoWidth, logoHeight);
        
        const rightLogoX = pageWidth - margin - logoWidth;
        pdf.addImage(rightLogo, 'PNG', rightLogoX, 10, logoWidth, logoHeight);
        
        const textStart = margin + logoWidth + 10;
        const textWidth = rightLogoX - textStart;
        
        // University name 
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        const universityName = "TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES-TAGUIG";
        const universityX = textStart + (textWidth - pdf.getTextWidth(universityName)) / 2 - 5;
        pdf.text(universityName, universityX, 20);
        
        // Program name
        pdf.setFontSize(11);
        const program = "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY";
        const programX = textStart + (textWidth - pdf.getTextWidth(program)) / 2 - 5;
        pdf.text(program, programX, 27);
        
        // Address
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const address = "Km. 14 East Service Road, Western Bicutan, Taguig City 1630, Metro Manila, Philippines";
        const addressX = textStart + (textWidth - pdf.getTextWidth(address)) / 2 - 5;
        pdf.text(address, addressX, 34);
        
        // Horizontal line
        pdf.setLineWidth(0.6);
        pdf.setDrawColor(100, 179, 138);  
        pdf.line(35, lineY, pageWidth - 35, lineY);
        
        // Add report title
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin, lineY + 20);
        
        // Add chart inside a transparent container with a thin black outline
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.rect(30, 70, 150, 80); // Draw the rectangle
        pdf.addImage(imgData, 'PNG', 35, 75, 140, 70); // Centered and lower, smaller width
        
        pdf.save(`${title}.pdf`);
      }).catch(error => {
        console.error('Error loading images:', error);
      });
    });
  };

  return (
    <div className="flex min-h-screen bg-[#eef0ee]">
      {/* Sidebar */}
      <div className="w-1/5">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className="grid grid-cols-4 gap-4"> {/* Reduced gap to make containers closer */}
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
          <div className="bg-[#eef0ee] border border-[#6fba94] rounded-lg p-4 flex items-center h-36 w-72">
            <ForumIcon className="text-[#64aa86] mr-4" style={{ fontSize: '48px' }} />
            <div>
              <h2 className="text-[#292f33] font-bold text-xl">Weekly Forum Engagement</h2>
              <p className="text-[#64aa86] font-bold text-2xl">{weeklyEngagementData.reduce((acc, data) => acc + data.count, 0)}</p>
            </div>
          </div>
        </div>

        {/* Chart Containers */}
        <div className="grid grid-cols-2 gap-4 mt-6"> {/* Reduced gap to make containers closer */}
          <div id="monthly-users-chart" className="relative bg-white border border-[#6fba94] rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-[#292f33] font-bold text-xl mb-4">Monthly Users</h2>
            <div className="absolute top-2 right-2">
              <DownloadIcon
                className="text-[#64aa86] cursor-pointer"
                style={{ fontSize: '20px' }} // Make the icon smaller
                onClick={() => generatePDF('monthly-users-chart', 'Monthly Users')}
              />
            </div>
            <div className="h-64">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
          <div id="daily-engagement-chart" className="relative bg-white border border-[#6fba94] rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-[#292f33] font-bold text-xl mb-4">Daily Forum Engagement</h2>
            <div className="absolute top-2 right-2">
              <DownloadIcon
                className="text-[#64aa86] cursor-pointer"
                style={{ fontSize: '20px' }} // Make the icon smaller
                onClick={() => generatePDF('daily-engagement-chart', 'Daily Forum Engagement')}
              />
            </div>
            <div className="h-64">
              <Bar data={dailyEngagementChartData} options={dailyEngagementChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;