import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CorrelationStatistics = () => {
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('isoWeek'));
  const [hasPrevWeek, setHasPrevWeek] = useState(false);
  const [hasNextWeek, setHasNextWeek] = useState(false);
  const [currentWeekData, setCurrentWeekData] = useState(null);
  const [prevWeekData, setPrevWeekData] = useState(null);
  const [moodComparison, setMoodComparison] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  const fetchWeeklyData = async (weekStart, weekEnd, setData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('http://localhost:5000/api/weekly-correlation-statistics', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          startOfWeek: weekStart.toISOString(),
          endOfWeek: weekEnd.toISOString()
        }
      });

      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const startOfWeek = currentWeek.clone().startOf('isoWeek');
    const endOfWeek = currentWeek.clone().endOf('isoWeek');

    fetchWeeklyData(startOfWeek, endOfWeek, setCurrentWeekData);

    const prevWeekStart = currentWeek.clone().subtract(1, 'weeks').startOf('isoWeek');
    const prevWeekEnd = currentWeek.clone().subtract(1, 'weeks').endOf('isoWeek');
    fetchWeeklyData(prevWeekStart, prevWeekEnd, setPrevWeekData);

    const nextWeekStart = currentWeek.clone().add(1, 'weeks').startOf('isoWeek');
    const nextWeekEnd = currentWeek.clone().add(1, 'weeks').endOf('isoWeek');
    fetchWeeklyData(nextWeekStart, nextWeekEnd, (data) => setHasNextWeek(data.length > 0));

    fetchWeeklyData(prevWeekStart, prevWeekEnd, (data) => setHasPrevWeek(data.length > 0));
  }, [currentWeek]);

  useEffect(() => {
    if (currentWeekData && prevWeekData) {
      const compareMoods = (current, previous) => {
        const moodValues = {
          relaxed: 5,
          happy: 4,
          fine: 3,
          anxious: 2,
          sad: 1,
          angry: 0
        };

        const currentMoodValue = current && current.correlationMood ? moodValues[current.correlationMood.toLowerCase()] || 0 : 0;
        const previousMoodValue = previous && previous.correlationMood ? moodValues[previous.correlationMood.toLowerCase()] || 0 : 0;

        const percentageChange = ((currentMoodValue - previousMoodValue) / 5) * 100;
        return percentageChange;
      };

      const currentMood = currentWeekData.find(result => result.correlationMood);
      const previousMood = prevWeekData.find(result => result.correlationMood);

      if (currentMood && previousMood) {
        const moodComparisonValue = compareMoods(currentMood, previousMood);
        setMoodComparison(moodComparisonValue);
      }
    }
  }, [currentWeekData, prevWeekData]);

  const handlePrevWeek = () => {
    if (hasPrevWeek) {
      setCurrentWeek(currentWeek.clone().subtract(1, 'weeks').startOf('isoWeek'));
    }
  };

  const handleNextWeek = () => {
    if (hasNextWeek) {
      setCurrentWeek(currentWeek.clone().add(1, 'weeks').startOf('isoWeek'));
    }
  };

  const startOfWeekFormatted = currentWeek.startOf('isoWeek').format('MMMM D');
  const endOfWeekFormatted = currentWeek.clone().endOf('isoWeek').format('D, YYYY');

  const generateMonthlyReport = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
  
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');
    const weeks = [];
  
    for (let weekStart = startOfMonth.clone(); weekStart.isBefore(endOfMonth); weekStart.add(1, 'weeks')) {
      const weekEnd = weekStart.clone().endOf('isoWeek');
      weeks.push({ startOfWeek: weekStart.clone().startOf('isoWeek'), endOfWeek: weekEnd.clone().endOf('isoWeek') });
    }
  
    const monthlyData = await Promise.all(weeks.map(async ({ startOfWeek, endOfWeek }) => {
      const response = await axios.get('http://localhost:5000/api/weekly-correlation-statistics', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          startOfWeek: startOfWeek.toISOString(),
          endOfWeek: endOfWeek.toISOString()
        }
      });
      return response.data;
    }));
  
    setMonthlyData(monthlyData);
  
    const compareMoods = (current, previous) => {
      const moodValues = {
        relaxed: 5,
        happy: 4,
        fine: 3,
        anxious: 2,
        sad: 1,
        angry: 0
      };
  
      const currentMoodValue = current && current.correlationMood ? moodValues[current.correlationMood.toLowerCase()] || 0 : 0;
      const previousMoodValue = previous && previous.correlationMood ? moodValues[previous.correlationMood.toLowerCase()] || 0 : 0;
  
      const percentageChange = ((currentMoodValue - previousMoodValue) / 5) * 100;
      return percentageChange;
    };
  
    const computeSleepQuality = (weekData) => {
      if (!weekData || weekData.length === 0) return 'No sleep data';
  
      const sleepQualityCount = {
        'No Sleep': 0,
        'Poor Sleep': 0,
        'Medium Sleep': 0,
        'Good Sleep': 0
      };
  
      weekData.forEach(result => {
        if (result.sleepQuality && result.sleepQuality in sleepQualityCount) {
          sleepQualityCount[result.sleepQuality]++;
        }
      });
  
      console.log('Sleep Quality Count:', sleepQualityCount);
  
      const totalSleepLogs = Object.values(sleepQualityCount).reduce((a, b) => a + b, 0);
      if (totalSleepLogs === 0) return 'No sleep data';
  
      const poorSleepLogs = sleepQualityCount['No Sleep'] + sleepQualityCount['Poor Sleep'];
      const mediumSleepLogs = sleepQualityCount['Medium Sleep'];
      const goodSleepLogs = sleepQualityCount['Good Sleep'];
  
      console.log('Total Sleep Logs:', totalSleepLogs);
      console.log('Poor Sleep Logs:', poorSleepLogs);
      console.log('Medium Sleep Logs:', mediumSleepLogs);
      console.log('Good Sleep Logs:', goodSleepLogs);
  
      const poorSleepPercentage = ((poorSleepLogs / totalSleepLogs) * 100).toFixed(2);
      const mediumSleepPercentage = ((mediumSleepLogs / totalSleepLogs) * 100).toFixed(2);
      const goodSleepPercentage = ((goodSleepLogs / totalSleepLogs) * 100).toFixed(2);
  
      console.log('Poor Sleep Percentage:', poorSleepPercentage);
      console.log('Medium Sleep Percentage:', mediumSleepPercentage);
      console.log('Good Sleep Percentage:', goodSleepPercentage);
  
      const sleepQualityResults = [
        { quality: 'Poor', percentage: poorSleepPercentage, count: poorSleepLogs },
        { quality: 'Medium', percentage: mediumSleepPercentage, count: mediumSleepLogs },
        { quality: 'Good', percentage: goodSleepPercentage, count: goodSleepLogs }
      ];
  
      const topSleepQuality = sleepQualityResults.reduce((prev, current) => (prev.count > current.count ? prev : current));
    //   return `${topSleepQuality.percentage}% of sleep this week is ${topSleepQuality.quality} Quality`;
    };
  
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Monthly Correlation Statistics', 105, 20, { align: 'center' });
    doc.addImage('images/logo1.png', 'PNG', 160, 10, 30, 30); // Add logo to the upper right side
  
    const tableData = monthlyData.map((weekData, index) => {
      const weekStart = weeks[index].startOfWeek.format('MMMM D');
      const weekEnd = weeks[index].endOfWeek.format('MMMM D, YYYY');
      const weekRange = `${weekStart} - ${weekEnd}`;
  
      const moodStat = weekData.length > 0 && weekData[0].correlationMood
        ? `${weekData[0].correlationMood} mood is (${weekData[0].correlationValue}%) linked to ${weekData[0].correlationActivity}`
        : 'No mood data';
  
      const sleepQuality = computeSleepQuality(weekData);
  
      const previousWeekData = index > 0 ? monthlyData[index - 1] : null;
      const weeklyComparison = previousWeekData && weekData.length > 0 && previousWeekData.length > 0
        ? compareMoods(weekData[0], previousWeekData[0]) > 0
          ? `Mood improved by ${compareMoods(weekData[0], previousWeekData[0]).toFixed(2)}% since last week`
          : `Mood worsened by ${Math.abs(compareMoods(weekData[0], previousWeekData[0])).toFixed(2)}% since last week`
        : 'No comparison data';
  
      return [weekRange, moodStat, sleepQuality, weeklyComparison];
    });
  
    doc.autoTable({
      startY: 60,
      head: [['Week', 'Mood Statistics', 'Sleep Quality', 'Weekly Comparison']],
      body: tableData,
      styles: {
        halign: 'center'
      },
      headStyles: {
        halign: 'center'
      }
    });
  
    doc.save('monthly_correlation_statistics.pdf');
  };

  return (
    <div style={{ backgroundColor: '#eef0ee', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', width: '90%', maxWidth: '800px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <PictureAsPdfIcon className="cursor-pointer" onClick={generateMonthlyReport} style={{ position: 'absolute', right: '10px', top: '10px' }} />
        {hasPrevWeek && (
          <ChevronLeftIcon className="cursor-pointer" onClick={handlePrevWeek} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        )}
        <h2 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '24px', marginBottom: '20px' }}>{`${startOfWeekFormatted} - ${endOfWeekFormatted}`}</h2>
        {hasNextWeek && (
          <ChevronRightIcon className="cursor-pointer" onClick={handleNextWeek} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        )}
        <div style={{ marginBottom: '20px' }}>
          {currentWeekData ? (
            currentWeekData.length > 0 ? (
              currentWeekData.map((result, index) => (
                <p key={index} style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '27px' }}>
                  {result.correlationMood ? `${result.correlationMood} mood is (${result.correlationValue}%) linked to ${result.correlationActivity}` : `${result.sleepQualityValue}% of sleep this week is ${result.sleepQuality} Quality`}
                </p>
              ))
            ) : (
              <p style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '20px' }}>No significant correlations found.</p>
            )
          ) : (
            <p style={{ color: '#89bcbc', fontWeight: 'bold', fontSize: '20px' }}>Loading...</p>
          )}
        </div>
        {moodComparison !== null && (
          <div style={{ marginTop: '20px', color: moodComparison > 0 ? 'green' : 'red', fontWeight: 'bold', fontSize: '20px' }}>
            {moodComparison > 0 ? `Mood improved by ${moodComparison.toFixed(2)}% since last week` : `Mood worsened by ${Math.abs(moodComparison).toFixed(2)}% since last week`}
          </div>
        )}
      </div>
    </div>
  );
};

export default CorrelationStatistics;