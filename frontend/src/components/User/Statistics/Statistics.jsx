import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Doughnut, Line } from 'react-chartjs-2';
import BottomNav from '../../BottomNav';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartDataLabels
);

const Statistics = () => {
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState('statistics'); // Set the initial value to the index of the Statistics page
  const [moodCounts, setMoodCounts] = useState({});
  const [sleepQualityData, setSleepQualityData] = useState([]);
  const [moodPeriod, setMoodPeriod] = useState('monthly'); // State to track the selected period for mood count
  const [sleepPeriod, setSleepPeriod] = useState('monthly'); // State to track the selected period for sleep quality
  const moodChartRef = useRef(null);
  const sleepChartRef = useRef(null);
  const pdfIconRef = useRef(null);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5000/api/mood-log', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.data;

        // Calculate mood counts based on the selected period
        let startOfPeriod, endOfPeriod;
        if (moodPeriod === 'weekly') {
          startOfPeriod = moment().startOf('isoWeek'); // Monday
          endOfPeriod = moment().endOf('isoWeek'); // Sunday
        } else {
          startOfPeriod = moment().startOf('month');
          endOfPeriod = moment().endOf('month');
        }

        const periodLogs = data.filter(log => {
          const logDate = moment(log.date);
          return logDate.isBetween(startOfPeriod, endOfPeriod, null, '[]');
        });

        const moodCountMap = {};

        periodLogs.forEach(log => {
          const { mood } = log;
          if (!moodCountMap[mood]) {
            moodCountMap[mood] = 0;
          }
          moodCountMap[mood]++;
        });

        setMoodCounts(moodCountMap);
      } catch (error) {
        console.error('Error fetching mood data:', error);
      }
    };

    fetchMoodData();
  }, [moodPeriod]); // Re-fetch mood data when the mood period changes

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5000/api/mood-log', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.data;

        // Calculate sleep quality based on the selected period
        let startOfPeriod, endOfPeriod;
        if (sleepPeriod === 'weekly') {
          startOfPeriod = moment().startOf('isoWeek'); // Monday
          endOfPeriod = moment().endOf('isoWeek'); // Sunday
        } else {
          startOfPeriod = moment().startOf('month');
          endOfPeriod = moment().endOf('month');
        }

        const periodLogs = data.filter(log => {
          const logDate = moment(log.date);
          return logDate.isBetween(startOfPeriod, endOfPeriod, null, '[]');
        });

        const sleepQualityMap = {};

        periodLogs.forEach(log => {
          const { sleepQuality } = log;
          if (!sleepQualityMap[log.date]) {
            sleepQualityMap[log.date] = [];
          }
          sleepQualityMap[log.date].push(sleepQuality);
        });

        const sleepQualityNumeric = {
          'No Sleep': 1,
          'Poor Sleep': 2,
          'Medium Sleep': 3,
          'Good Sleep': 4
        };

        const sleepQualityData = Object.keys(sleepQualityMap).map(date => {
          const avgSleepQuality = sleepQualityMap[date].reduce((acc, quality) => acc + sleepQualityNumeric[quality], 0) / sleepQualityMap[date].length;
          return { date, avgSleepQuality };
        });

        setSleepQualityData(sleepQualityData);
      } catch (error) {
        console.error('Error fetching sleep data:', error);
      }
    };

    fetchSleepData();
  }, [sleepPeriod]); // Re-fetch sleep data when the sleep period changes

  const moodColors = {
    relaxed: '#67b88f',
    happy: '#5dc791',
    fine: '#68d076',
    anxious: '#ebe153',
    sad: '#f7a046',
    angry: '#f75646'
  };

  const chartData = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        data: Object.values(moodCounts),
        backgroundColor: Object.keys(moodCounts).map(mood => moodColors[mood.toLowerCase()]),
        hoverBackgroundColor: Object.keys(moodCounts).map(mood => moodColors[mood.toLowerCase()]),
        borderWidth: 1,
        borderColor: '#fff',
        hoverBorderColor: '#fff'
      }
    ]
  };

  const chartOptions = {
    cutout: '50%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      datalabels: {
        color: '#fff',
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;
        }
      }
    }
  };

  const sleepQualityChartData = {
    labels: sleepQualityData.map(data => moment(data.date).format('MMM D')),
    datasets: [
      {
        data: sleepQualityData.map(data => data.avgSleepQuality),
        borderColor: '#6fba94',
        backgroundColor: 'rgba(111, 186, 148, 0.2)',
        fill: true
      }
    ]
  };

  const sleepQualityChartOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            const sleepQualityLabels = ['No Sleep', 'Poor Sleep', 'Medium Sleep', 'Good Sleep'];
            return sleepQualityLabels[value - 1];
          }
        }
      }
    }
  };

  const handleViewClick = () => {
    navigate('/correlation');
  };

  const handleWeeklyStatisticsClick = () => {
    navigate('/correlation-statistics');
  };

  const handleMoodClick = (mood) => {
    navigate(`/mood-statistics/${mood}?period=${moodPeriod}`);
  };

  const handleDownloadPDF = async () => {
    const moodInput = moodChartRef.current;
    const sleepInput = sleepChartRef.current;
    const pdfIcon = pdfIconRef.current;
    pdfIcon.style.display = 'none'; // Hide the PDF icon before capturing the screenshot
  
    const moodCanvas = await html2canvas(moodInput, { scale: 4 });
    const sleepCanvas = await html2canvas(sleepInput, { scale: 1 });
  
    pdfIcon.style.display = 'block'; // Show the PDF icon again after capturing the screenshot
  
    const moodImgData = moodCanvas.toDataURL('image/png');
    const sleepImgData = sleepCanvas.toDataURL('image/png');
  
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 180;
    const moodImgHeight = (moodCanvas.height * imgWidth) / moodCanvas.width;
    const sleepImgHeight = (sleepCanvas.height * imgWidth) / sleepCanvas.width;
  
    const centerX = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
  
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
      pdf.text('Mood and Sleep Quality Report', margin, lineY + 20);
      
      // Add mood chart
      pdf.addImage(moodImgData, 'PNG', centerX, 70, imgWidth, moodImgHeight);
  
      // Add sleep quality chart
      pdf.addImage(sleepImgData, 'PNG', centerX, 70 + moodImgHeight + 20, imgWidth, sleepImgHeight); // Moved upward by reducing the gap
  
      pdf.save(`Mood_and_Sleep_Quality_${moodPeriod}.pdf`);
    }).catch(error => {
      console.error('Error loading images:', error);
    });
  };
  const moodIcons = {
    relaxed: '/images/relaxed.gif',
    happy: '/images/happy.gif',
    fine: '/images/fine.gif',
    anxious: '/images/anxious.gif',
    sad: '/images/sad.gif',
    angry: '/images/angry.gif'
  };

  const sortedMoods = Object.keys(moodCounts).sort((a, b) => moodCounts[b] - moodCounts[a]);

  const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0,
        },
        
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

  return (
    <div style={{ backgroundColor: '#b4ddc8', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' }}>
      <div ref={pdfIconRef} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }} onClick={handleDownloadPDF}>
        <DownloadIcon style={{ color: '#6fba94', fontSize: 24,  }} />
      </div>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', marginTop: '20px', width: '90%', maxWidth: '800px', textAlign: 'left', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '24px' }}>Correlation Analysis</h2>
        <p style={{ color: '#3a3939', fontSize: '14px' }}>Know how your activities are related to your mood</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button onClick={handleViewClick} style={{ backgroundColor: '#6fba94', color: '#eef0ee', fontWeight: 'bold', padding: '10px 25px', borderRadius: '20px', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
            View Result
          </button>
          <button onClick={handleWeeklyStatisticsClick} style={{ backgroundColor: '#6fba94', color: '#eef0ee', fontWeight: 'bold', padding: '10px 25px', borderRadius: '20px', border: 'none', cursor: 'pointer' }}>
            Statistics
          </button>
        </div>
      </div>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginTop: '20px', width: '90%', maxWidth: '800px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '24px', textAlign: 'left' }}>Mood Count</h2>
            <p style={{ color: '#3a3939', fontSize: '14px', textAlign: 'left' }}>Click on mood to view related activities</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px', color: '#3a3939', fontWeight: 'bold' }}>Weekly</span>
            <IOSSwitch checked={moodPeriod === 'monthly'} onChange={() => setMoodPeriod(moodPeriod === 'weekly' ? 'monthly' : 'weekly')} />
            <span style={{ marginLeft: '10px', color: '#3a3939', fontWeight: 'bold' }}>Monthly</span>
          </div>
        </div>
        <div ref={moodChartRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{ width: '100%', maxWidth: '400px', height: '350px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            {sortedMoods.map((mood, index) => (
              <div key={index} style={{ margin: '0 10px', textAlign: 'center', cursor: 'pointer' }} onClick={() => handleMoodClick(mood)}>
                <img src={moodIcons[mood.toLowerCase()]} alt={mood} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                <p style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '16px' }}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</p>
                <p style={{ color: '#6fba94', fontWeight: 'bold', fontSize: '20px' }}>{moodCounts[mood]}</p>
              <br></br>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginTop: '20px', marginBottom: '80px', width: '90%', maxWidth: '800px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '24px', textAlign: 'left' }}>Sleep Quality</h2>
            <p style={{ color: '#3a3939', fontSize: '14px', textAlign: 'left' }}>Track your sleep quality over time</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px', color: '#3a3939', fontWeight: 'bold' }}>Weekly</span>
            <IOSSwitch checked={sleepPeriod === 'monthly'} onChange={() => setSleepPeriod(sleepPeriod === 'weekly' ? 'monthly' : 'weekly')} />
            <span style={{ marginLeft: '10px', color: '#3a3939', fontWeight: 'bold' }}>Monthly</span>
          </div>
        </div>
        <div ref={sleepChartRef} style={{ width: '100%', maxWidth: '600px', height: '300px', margin: '0 auto', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <Line data={sleepQualityChartData} options={sleepQualityChartOptions} />
        </div>
      </div>
      <BottomNav value={navValue} setValue={setNavValue} />
    </div>
  );
};

export default Statistics;