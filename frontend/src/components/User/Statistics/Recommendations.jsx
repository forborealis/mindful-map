import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { jsPDF } from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';
import { Chart } from 'chart.js';

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correlationData, sleepQualityData, recommendations: initialRecommendations } = location.state;
  const [recommendations, setRecommendations] = useState(initialRecommendations || []);
  const [correlatedMood, setCorrelatedMood] = useState('');

  useEffect(() => {
    console.log('Correlation Data:', correlationData); // Debugging log
    console.log('Sleep Quality Data:', sleepQualityData); // Debugging log
    console.log('Initial Recommendations:', initialRecommendations); // Debugging log

    if (!initialRecommendations || initialRecommendations.length === 0) {
      const fetchRecommendations = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }

          const response = await axios.post('http://localhost:5000/api/recommendations', { correlationData: [...correlationData, ...sleepQualityData] }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          console.log('Fetched Recommendations:', response.data); // Debugging log
          setRecommendations(response.data);

          // Extract the correlated mood from the correlation data
          const moodResult = correlationData.find(result => result.correlationMood);
          if (moodResult) {
            setCorrelatedMood(moodResult.correlationMood);
          }
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      };

      fetchRecommendations();
    } else {
      // Extract the correlated mood from the correlation data
      const moodResult = correlationData.find(result => result.correlationMood);
      if (moodResult) {
        setCorrelatedMood(moodResult.correlationMood);
      }
    }
  }, [correlationData, sleepQualityData, initialRecommendations]);

  const handleBreathingExerciseClick = () => {
    navigate('/breathing-exercise');
  };

  const handlePomodoroClick = () => {
    navigate('/pomodoro');
  };

  const handleListTaskClick = () => {
    navigate('/list-task');
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica');

    const createChart = (data, labels, callback) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: [data, 100 - data],
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
              display: false
            }
          }
        }
      });
      setTimeout(() => callback(canvas), 1000); // Wait for the chart to be fully rendered
    };

    const pageWidth = doc.internal.pageSize.getWidth();
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
      doc.addImage(tupLogo, 'PNG', margin, 10, logoWidth, logoHeight);
      
      const rightLogoX = pageWidth - margin - logoWidth;
      doc.addImage(rightLogo, 'PNG', rightLogoX, 10, logoWidth, logoHeight);
      
      const textStart = margin + logoWidth + 10;
      const textWidth = rightLogoX - textStart;
      
      // University name 
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const universityName = "TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES-TAGUIG";
      const universityX = textStart + (textWidth - doc.getTextWidth(universityName)) / 2 - 5;
      doc.text(universityName, universityX, 20);
      
      // Program name
      doc.setFontSize(11);
      const program = "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY";
      const programX = textStart + (textWidth - doc.getTextWidth(program)) / 2 - 5;
      doc.text(program, programX, 27);
      
      // Address
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const address = "Km. 14 East Service Road, Western Bicutan, Taguig City 1630, Metro Manila, Philippines";
      const addressX = textStart + (textWidth - doc.getTextWidth(address)) / 2 - 5;
      doc.text(address, addressX, 34);
      
      // Horizontal line
      doc.setLineWidth(0.6);
      doc.setDrawColor(100, 179, 138);  
      doc.line(35, lineY, pageWidth - 35, lineY);
      
      // Add report title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Recommendations Report', margin, lineY + 20);

      // Create charts
      const activityData = correlationData.map(item => item.correlationValue);
      const activityLabels = correlationData.map(item => item.correlationActivity);
      createChart(activityData[0] || 0, ['Activity', ''], (activityChart) => {
        const sleepDataValues = sleepQualityData.map(item => item.sleepQualityValue);
        const sleepLabels = sleepQualityData.map(item => item.sleepQuality);
        createChart(sleepDataValues[0] || 0, ['Sleep Quality', ''], (sleepChart) => {
          // Add charts to PDF
          doc.setFontSize(12);
          doc.text('Mood-Activity Correlation', pageWidth / 2 - 60, 100, { align: 'center' });
          doc.addImage(activityChart.toDataURL('image/png'), 'PNG', pageWidth / 2 - 90, 110, 60, 60);
          doc.text(activityLabels[0] || '', pageWidth / 2 - 60, 175, { align: 'center' });
          doc.text('Sleep Quality Correlation', pageWidth / 2 + 60, 100, { align: 'center' });
          doc.addImage(sleepChart.toDataURL('image/png'), 'PNG', pageWidth / 2 + 30, 110, 60, 60);
          doc.text(sleepLabels[0] + ' Quality' || '', pageWidth / 2 + 60, 175, { align: 'center' });

          // Add recommendations in table format
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Recommendations', margin, 200);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          const startY = 210; // Start lower on the page
          const tableMargin = 20;
          const tableWidth = pageWidth - 2 * tableMargin;
          const colWidth = tableWidth / 2;

          const moodRecommendations = recommendations.slice(0, 3);
          const sleepRecommendations = recommendations.slice(3, 5);

          doc.autoTable({
            startY: startY,
            head: [['Mood Correlation Recommendations', 'Sleep Quality Recommendations']],
            body: [
              [moodRecommendations[0] || '', sleepRecommendations[0] || ''],
              [moodRecommendations[1] || '', sleepRecommendations[1] || ''],
              [moodRecommendations[2] || '', '']
            ],
            theme: 'grid',
            styles: {
              cellPadding: 3,
              fontSize: 10,
              valign: 'middle',
              halign: 'left',
              overflow: 'linebreak',
              tableWidth: 'wrap',
              cellWidth: 'wrap'
            },
            columnStyles: {
              0: { cellWidth: colWidth },
              1: { cellWidth: colWidth }
            }
          });

          doc.save('recommendations_report.pdf');
        });
      });
    }).catch(error => {
      console.error('Error loading images:', error);
    });
  };

  const getChartData = (data, label) => ({
    datasets: [{
      data: [data, 100 - data],
      backgroundColor: ['#FF6384', '#D3D3D3'],
      hoverBackgroundColor: ['#FF6384', '#D3D3D3']
    }]
  });

  return (
    <div style={{ background: 'linear-gradient(to right, #67b88f, #93c4ab, #f8ffff)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', width: '90%', maxWidth: '800px', textAlign: 'left', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <DownloadIcon onClick={generatePDF} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', color: '#6fba94' }} />
        <p style={{ color: '#b1b1b1', fontSize: '14px', marginBottom: '10px' }}>
          Your habits are strongly linked to feeling {correlatedMood}.
        </p>
        <p style={{ color: '#64aa86', fontWeight: 'bolder', fontSize: '26px', marginBottom: '20px' }}>
          Follow these strategies
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          {recommendations.map((rec, index) => (
            <li key={index} style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '20px', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              - {rec}
              {(rec.toLowerCase().includes('breathing') || rec.toLowerCase().includes('breathing exercise')) && (
                <ArrowCircleRightIcon
                  style={{ color: '#6fba94', marginLeft: '10px', cursor: 'pointer' }}
                  onClick={handleBreathingExerciseClick}
                />
              )}
              {rec.toLowerCase().includes('pomodoro') && (
                <AccessTimeFilledIcon
                  style={{ color: '#6fba94', marginLeft: '10px', cursor: 'pointer' }}
                  onClick={handlePomodoroClick}
                />
              )}
              {rec.toLowerCase().includes('list your tasks') && (
                <ChecklistIcon
                  style={{ color: '#6fba94', marginLeft: '10px', cursor: 'pointer' }}
                  onClick={handleListTaskClick}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Recommendations;