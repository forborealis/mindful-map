import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Chart } from 'chart.js';

const Correlation = () => {
  const [correlationData, setCorrelationData] = useState([]);
  const [socialData, setSocialData] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [sleepQualityData, setSleepQualityData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5000/api/weekly-correlation', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Fetched data:', response.data); // Debugging line

        // Assuming the response data contains all types of correlation data
        const activities = response.data.filter(item => item.correlationActivity && !item.correlationActivity.includes('Friends'));
        const social = response.data.filter(item => item.correlationActivity && item.correlationActivity.includes('Friends'));
        const sleepQuality = response.data.filter(item => item.sleepQuality);
        const health = response.data.find(item => item.healthStatus);

        setCorrelationData(activities);
        setSocialData(social);
        setSleepQualityData(sleepQuality);
        setHealthStatus(health ? health.healthStatus : null);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleNextClick = () => {
    navigate('/recommendations', { state: { correlationData, socialData, healthStatus, sleepQualityData } });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const createChart = (data, labels, title, callback) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ['#FF6384', '#D3D3D3'],
            hoverBackgroundColor: ['#FF6384', '#D3D3D3']
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: title
            }
          }
        }
      });
      setTimeout(() => callback(canvas), 1000); // Wait for the chart to be fully rendered
    };

    const activityData = correlationData.map(item => item.correlationValue);
    const activityLabels = correlationData.map(item => `${item.correlationMood} - ${item.correlationActivity}`);
    createChart(activityData, activityLabels, 'Activity Correlation', (activityChart) => {
      const socialDataValues = socialData.map(item => item.correlationValue);
      const socialLabels = socialData.map(item => `${item.correlationMood} - ${item.correlationActivity}`);
      createChart(socialDataValues, socialLabels, 'Social Correlation', (socialChart) => {
        const sleepDataValues = sleepQualityData.map(item => item.sleepQualityValue);
        const sleepLabels = sleepQualityData.map(item => item.sleepQuality);
        createChart(sleepDataValues, sleepLabels, 'Sleep Quality Correlation', (sleepChart) => {
          doc.text('Correlation Analysis Report', 10, 10);
          doc.addImage(activityChart.toDataURL('image/png'), 'PNG', 10, 20, 60, 60);
          doc.text(activityLabels[0] || '', 10, 85);
          doc.addImage(socialChart.toDataURL('image/png'), 'PNG', 80, 20, 60, 60);
          doc.text(socialLabels[0] || '', 80, 85);
          doc.addImage(sleepChart.toDataURL('image/png'), 'PNG', 150, 20, 60, 60);
          doc.text(sleepLabels[0] || '', 150, 85);
          doc.save('correlation_analysis_report.pdf');
        });
      });
    });
  };

  const getChartData = (data, label) => ({
    labels: [label, ''],
    datasets: [{
      data: [data, 100 - data],
      backgroundColor: ['#FF6384', '#D3D3D3'],
      hoverBackgroundColor: ['#FF6384', '#D3D3D3']
    }]
  });

  return (
    <div style={{ backgroundColor: '#eef0ee', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', marginTop: '20px', width: '90%', maxWidth: '800px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <PictureAsPdfIcon onClick={generatePDF} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', color: '#6fba94' }} />
        <h2 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '24px', marginBottom: '20px' }}>Correlation analysis results...</h2>
        <div style={{ marginBottom: '20px' }}>
          {correlationData.length > 0 ? (
            correlationData.map((result, index) => (
              <p key={index} style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '27px' }}>
                {result.correlationMood && result.correlationActivity ? `${result.correlationMood} mood is (${result.correlationValue}%) linked to ${result.correlationActivity}` : null}
              </p>
            ))
          ) : (
            <p style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '20px' }}>No significant correlations found.</p>
          )}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '20px' }}>Social</h3>
          {socialData.length > 0 ? (
            socialData.map((result, index) => (
              <p key={index} style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '27px' }}>
                {result.correlationMood ? `${result.correlationMood} mood is (${result.correlationValue}%) linked to ${result.correlationActivity}` : null}
              </p>
            ))
          ) : (
            <p style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '20px' }}>No significant social correlations found.</p>
          )}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '20px' }}>Health</h3>
          {healthStatus ? (
            <p style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '27px' }}>
              {healthStatus === 'low' ? 'Health-related activities have been low' : 'Health-related activities are normal'}
            </p>
          ) : (
            <p style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '20px' }}>No significant health correlations found.</p>
          )}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '20px' }}>Sleep Quality</h3>
          {sleepQualityData.length > 0 ? (
            sleepQualityData.map((result, index) => (
              <p key={index} style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '27px' }}>
                {result.sleepQuality ? `${result.sleepQualityValue}% of sleep this week is ${result.sleepQuality} Quality` : null}
              </p>
            ))
          ) : (
            <p style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '20px' }}>No significant sleep quality correlations found.</p>
          )}
        </div>
        <div style={{ bottom: '10px', width: '100%', textAlign: 'center', color: '#b1b1b1', fontSize: '14px' }}>
          Click below for personalized recommendations
        </div>
        <button onClick={handleNextClick} style={{ backgroundColor: '#6fba94', color: '#fff', fontWeight: 'bold', padding: '10px 25px', borderRadius: '20px', border: 'none', cursor: 'pointer', position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '130px' }}>
          Next
        </button>
      </div>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginTop: '20px', width: '100%', maxWidth: '1000px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <Doughnut data={getChartData(correlationData[0]?.correlationValue || 0, 'Anxious Mood')} />
          <p style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Anxious Mood</p>
        </div>
        <div>
          <Doughnut data={getChartData(socialData[0]?.correlationValue || 0, 'Friends')} />
          <p style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Friends</p>
        </div>
        <div>
          <Doughnut data={getChartData(sleepQualityData[0]?.sleepQualityValue || 0, 'Poor Sleep Quality')} />
          <p style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Poor Sleep Quality</p>
        </div>
      </div>
    </div>
  );
};

export default Correlation;