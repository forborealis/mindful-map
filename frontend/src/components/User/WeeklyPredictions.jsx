import { useEffect, useState } from "react";

const WeeklyPredictions = () => {
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);

  const dayOrder = [
    'Monday',
    'Tuesday', 
    'Wednesday', 
    'Thursday', 
    'Friday', 
    'Saturday', 
    'Sunday'
  ];

  // Get the current day
  const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' });

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const response = await fetch('http://localhost:5000/api/predict-mood', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  
          },
        });

        const data = await response.json();
        if (data.success) {
          setPredictions(data.predictions);
        } else {
          console.error("Failed to fetch predictions:", data.message);
        }
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#67b88f] via-[#93c4ab] to-[#fdffff]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#3a3939]">
          Your Mood Predictions for the Week
        </h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        {loading ? (
          <p className="text-lg text-[#3a3939]">Loading predictions...</p>
        ) : Object.keys(predictions).length > 0 ? (
          <div>
            {dayOrder.map((day) => {
              const prediction = predictions[day];
              const isCurrentDay = day === currentDay; // Check if it's the current day

              return (
                <p 
                  key={day} 
                  className={`text-lg ${isCurrentDay ? 'font-bold italic text-[#3a3939]' : 'text-gray-500'} mb-4`}
                >
                  {prediction.activity 
                    ? `You may feel ${prediction.mood} on ${day} because of ${prediction.activity}`
                    : `You may feel ${prediction.mood} on ${day}`}
                </p>
              );
            })}
          </div>
        ) : (
          <p className="text-lg text-[#3a3939]">No mood predictions available.</p>
        )}
      </div>
    </div>
  );
};

export default WeeklyPredictions;
