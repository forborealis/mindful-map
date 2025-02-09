import React, { useEffect, useState } from 'react';
import axios from 'axios';
const Correlation = () => {
  const [correlationData, setCorrelationData] = useState(null);

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

        setCorrelationData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#eef0ee', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', marginTop: '20px', width: '90%', maxWidth: '800px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <h2 style={{ color: '#3a3939', fontWeight: 'bold', fontSize: '24px', marginBottom: '20px' }}>Correlation analysis results...</h2>
        <div style={{ marginBottom: '20px' }}>
          {correlationData ? (
            correlationData.length > 0 ? (
              correlationData.map((result, index) => (
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
        <div style={{ bottom: '10px', width: '100%', textAlign: 'center', color: '#b1b1b1', fontSize: '14px' }}>
          Click below for personalized recommendations
        </div>
        <button style={{ backgroundColor: '#6fba94', color: '#fff', fontWeight: 'bold', padding: '10px 25px', borderRadius: '20px', border: 'none', cursor: 'pointer', position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', width: '130px' }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Correlation;