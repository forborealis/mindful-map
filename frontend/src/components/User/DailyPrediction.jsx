import { useEffect, useState } from "react";

const DailyPrediction = () => {
  const [prediction, setPrediction] = useState({});
  const [loading, setLoading] = useState(true);

  const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' });

  const formatActivities = (activities) => {
    if (!activities || activities.length === 0) return "";
    if (activities.length === 1) return ` because of ${activities[0]}`;
    return ` because of ${activities[0]} and ${activities[1]}`;
  };

  useEffect(() => {
    const fetchPrediction = async () => {
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
          setPrediction(data.predictions[currentDay] || { mood: "No prediction available", activities: [] });
        } else {
          console.error("Failed to fetch predictions:", data.message);
        }
      } catch (error) {
        console.error("Error fetching prediction:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [currentDay]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#67b88f] via-[#93c4ab] to-[#fdffff]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#3a3939]">
          Your Mood Prediction for Today
        </h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        {loading ? (
          <p className="text-lg text-[#3a3939]">Loading prediction...</p>
        ) : (
          <p className="text-lg text-[#3a3939]">
            {prediction.mood === "No prediction available"
              ? `No prediction available for ${currentDay}`
              : `You may feel ${prediction.mood} today${formatActivities(prediction.activities)}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyPrediction;
