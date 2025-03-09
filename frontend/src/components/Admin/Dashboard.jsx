import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BlockIcon from '@mui/icons-material/Block';
import ForumIcon from '@mui/icons-material/Forum';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
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
  const [weeklyEngagementData, setWeeklyEngagementData] = useState([]);
  const [dailyMoodLogsData, setDailyMoodLogsData] = useState([]);
  const [dailyJournalLogsData, setDailyJournalLogsData] = useState([]);
  const [weeklyCorrelationValuesData, setWeeklyCorrelationValuesData] = useState([]);
  const [weeklyForumPostsData, setWeeklyForumPostsData] = useState([]);
  const [activeVsInactiveUsersData, setActiveVsInactiveUsersData] = useState({ active: 0, inactive: 0 });
  const [moodLogsPage, setMoodLogsPage] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
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
  
    const fetchDailyMoodLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/daily-mood-logs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDailyMoodLogsData(response.data);
      } catch (error) {
        console.error('Error fetching daily mood logs:', error);
      }
    };
  
    const fetchDailyJournalLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/daily-journal-logs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDailyJournalLogsData(response.data);
      } catch (error) {
        console.error('Error fetching daily journal logs:', error);
      }
    };
  
    const fetchWeeklyCorrelationValues = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/weekly-correlation-values', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWeeklyCorrelationValuesData(response.data);
      } catch (error) {
        console.error('Error fetching weekly correlation values:', error);
      }
    };
  
    const fetchWeeklyForumPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/weekly-forum-posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWeeklyForumPostsData(response.data);
      } catch (error) {
        console.error('Error fetching weekly forum posts:', error);
      }
    };
  
    const fetchActiveVsInactiveUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/active-vs-inactive-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setActiveVsInactiveUsersData(response.data);
      } catch (error) {
        console.error('Error fetching active vs inactive users:', error);
      }
    };
  
    fetchMonthlyUsers();
    fetchActiveUsers();
    fetchInactiveUsers();
    fetchDailyEngagement();
    fetchWeeklyEngagement();
    fetchDailyMoodLogs();
    fetchDailyJournalLogs();
    fetchWeeklyCorrelationValues();
    fetchWeeklyForumPosts();
    fetchActiveVsInactiveUsers();
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

  const dailyMoodLogsChartData = {
    labels: dailyMoodLogsData.slice(moodLogsPage * 10, (moodLogsPage + 1) * 10).map(data => data.date),
    datasets: [
      {
        label: 'Mood Logs',
        data: dailyMoodLogsData.slice(moodLogsPage * 10, (moodLogsPage + 1) * 10).map(data => data.count),
        borderColor: '#64aa86',
        backgroundColor: 'rgba(100, 170, 134, 0.2)',
        fill: true,
        tension: 0.4, // Make the line wavy
      },
    ],
  };

  const dailyJournalLogsChartData = {
    labels: dailyJournalLogsData.map(data => data.date),
    datasets: [
      {
        label: 'Journal Logs',
        data: dailyJournalLogsData.map(data => data.count),
        borderColor: '#64aa86',
        backgroundColor: 'rgba(100, 170, 134, 0.2)',
        fill: true,
        tension: 0.4, // Make the line wavy
      },
      
    ],
    
  };

  const weeklyCorrelationValuesChartData = {
    labels: weeklyCorrelationValuesData.map(data => data.week),
    datasets: [
      {
        label: 'Weekly Correlation Values',
        data: weeklyCorrelationValuesData.map(data => data.count),
        borderColor: '#64aa86',
        backgroundColor: 'rgba(100, 170, 134, 0.2)',
        fill: true,
        tension: 0.4, // Make the line wavy
      },
    ],
  };

  const lineChartOptions = {
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

  const weeklyForumPostsChartData = {
    labels: weeklyForumPostsData.map(data => data.week),
    datasets: [
      {
        label: 'Forum Posts',
        data: weeklyForumPostsData.map(data => data.count),
        borderColor: '#64aa86',
        backgroundColor: 'rgba(100, 170, 134, 0.2)',
        fill: true,
        tension: 0.4, // Make the line wavy
      },
    ],
  };
  
  const activeVsInactiveUsersChartData = {
    labels: ['Active Users', 'Inactive Users'],
    datasets: [
      {
        label: 'Users',
        data: [activeVsInactiveUsersData.active, activeVsInactiveUsersData.inactive],
        backgroundColor: ['#64aa86', '#f44336'],
      },
    ],
  };
  
  const pieChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.raw;
          },
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
    <div className="flex min-h-screen bg-[#F8FAF9]">
      {/* Sidebar */}
      <div className="w-1/5">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#F8FAF9] border border-[#6fba94] rounded-lg p-4 flex items-center h-36 w-72">
            <ShowChartIcon className="text-[#64aa86] mr-4" style={{ fontSize: '48px' }} />
            <div>
              <h2 className="text-[#292f33] font-bold text-xl">Total Users</h2>
              <p className="text-[#64aa86] font-bold text-2xl">{monthlyUsers}</p>
            </div>
          </div>
          <div className="bg-[#F8FAF9] border border-[#6fba94] rounded-lg p-4 flex items-center h-36 w-72">
            <TaskAltIcon className="text-[#64aa86] mr-4" style={{ fontSize: '48px' }} />
            <div>
              <h2 className="text-[#292f33] font-bold text-xl">Active Users</h2>
              <p className="text-[#64aa86] font-bold text-2xl">{activeUsersCount}</p>
            </div>
          </div>
          <div className="bg-[#F8FAF9] border border-[#6fba94] rounded-lg p-4 flex items-center h-36 w-72">
            <BlockIcon className="text-[#64aa86] mr-4" style={{ fontSize: '48px' }} />
            <div>
              <h2 className="text-[#292f33] font-bold text-xl">Inactive Users</h2>
              <p className="text-[#64aa86] font-bold text-2xl">{inactiveUsersCount}</p>
            </div>
          </div>
          <div className="bg-[#F8FAF9] border border-[#6fba94] rounded-lg p-4 flex items-center h-36 w-72">
            <ForumIcon className="text-[#64aa86] mr-4" style={{ fontSize: '48px' }} />
            <div>
              <h2 className="text-[#292f33] font-bold text-xl">Weekly Forum Engagement</h2>
              <p className="text-[#64aa86] font-bold text-2xl">{weeklyEngagementData.reduce((acc, data) => acc + data.count, 0)}</p>
            </div>
          </div>
        </div>

    {/* Chart Containers */}
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div id="monthly-users-chart" className="relative bg-transparent border border-[#6fba94] rounded-lg p-6 max-w-4xl">
        <h2 className="text-[#292f33] font-bold text-xl mb-4">Monthly Users</h2>
        <div className="absolute top-2 right-2">
          <DownloadIcon
            className="text-[#64aa86] cursor-pointer"
            style={{ fontSize: '20px' }}
            onClick={() => generatePDF('monthly-users-chart', 'Monthly Users')}
          />
        </div>
        <div className="h-64">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
      <div id="daily-engagement-chart" className="relative bg-transparent border border-[#6fba94] rounded-lg p-6 max-w-4xl">
        <h2 className="text-[#292f33] font-bold text-xl mb-4">Daily Forum Engagement</h2>
        <div className="absolute top-2 right-2">
          <DownloadIcon
            className="text-[#64aa86] cursor-pointer"
            style={{ fontSize: '20px' }}
            onClick={() => generatePDF('daily-engagement-chart', 'Daily Forum Engagement')}
          />
        </div>
        <div className="h-64">
          <Bar data={dailyEngagementChartData} options={dailyEngagementChartOptions} />
        </div>
      </div>
    </div>

    {/* New Chart Containers */}
  <div className="flex flex-col items-center mt-6">
    <div className="grid grid-cols-2 gap-4 w-full max-w-6xl">
      <div id="weekly-forum-posts-chart" className="relative bg-transparent border border-[#6fba94] rounded-lg p-6">
        <h2 className="text-[#292f33] font-bold text-xl mb-4">Weekly Forum Posts</h2>
        <div className="absolute top-2 right-2">
          <DownloadIcon
            className="text-[#64aa86] cursor-pointer"
            style={{ fontSize: '20px' }}
            onClick={() => generatePDF('weekly-forum-posts-chart', 'Weekly Forum Posts')}
          />
        </div>
        <div className="h-64">
          <Line data={weeklyForumPostsChartData} options={lineChartOptions} />
        </div>
      </div>
      <div id="active-vs-inactive-users-chart" className="relative bg-transparent border border-[#6fba94] rounded-lg p-6">
        <h2 className="text-[#292f33] font-bold text-xl mb-4">Active and Inactive Users</h2>
        <div className="absolute top-2 right-2">
          <DownloadIcon
            className="text-[#64aa86] cursor-pointer"
            style={{ fontSize: '20px' }}
            onClick={() => generatePDF('active-vs-inactive-users-chart', 'Active vs Inactive Users')}
          />
        </div>
        <div className="h-64">
          <Pie data={activeVsInactiveUsersChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
    <div id="daily-mood-logs-chart" className="relative bg-transparent border border-[#6fba94] rounded-lg p-6 w-full max-w-6xl mt-6">
      <h2 className="text-[#292f33] font-bold text-xl mb-4">Daily Mood Logs</h2>
      <div className="absolute top-2 right-2">
        <DownloadIcon
          className="text-[#64aa86] cursor-pointer"
          style={{ fontSize: '20px' }}
          onClick={() => generatePDF('daily-mood-logs-chart', 'Daily Mood Logs')}
        />
      </div>
      <div className="h-64">
        <Line data={dailyMoodLogsChartData} options={lineChartOptions} />
      </div>
      <div className="flex justify-center mt-2">
        <button className="text-[#64aa86] mx-2" onClick={() => setMoodLogsPage(moodLogsPage > 0 ? moodLogsPage - 1 : 0)}>&lt;</button>
        <button className="text-[#64aa86] mx-2" onClick={() => setMoodLogsPage(moodLogsPage < Math.ceil(dailyMoodLogsData.length / 10) - 1 ? moodLogsPage + 1 : moodLogsPage)}>&gt;</button>
      </div>
    </div>
    <div id="daily-journal-logs-chart" className="relative bg-transparent border border-[#6fba94] rounded-lg p-6 w-full max-w-6xl mt-6">
      <h2 className="text-[#292f33] font-bold text-xl mb-4">Daily Journal Logs</h2>
      <div className="absolute top-2 right-2">
        <DownloadIcon
          className="text-[#64aa86] cursor-pointer"
          style={{ fontSize: '20px' }}
          onClick={() => generatePDF('daily-journal-logs-chart', 'Daily Journal Logs')}
        />
      </div>
      <div className="h-64">
        <Line data={dailyJournalLogsChartData} options={lineChartOptions} />
      </div>
    </div>
    <div id="weekly-correlation-values-chart" className="relative bg-transparent border border-[#6fba94] rounded-lg p-6 w-full max-w-6xl mt-6">
      <h2 className="text-[#292f33] font-bold text-xl mb-4">Weekly Correlation Values</h2>
      <div className="absolute top-2 right-2">
        <DownloadIcon
          className="text-[#64aa86] cursor-pointer"
          style={{ fontSize: '20px' }}
          onClick={() => generatePDF('weekly-correlation-values-chart', 'Weekly Correlation Values')}
        />
      </div>
      <div className="h-64">
        <Line data={weeklyCorrelationValuesChartData} options={lineChartOptions} />
      </div>
    </div>
  </div>
          </div>
        </div>
      );
    };

export default Dashboard;