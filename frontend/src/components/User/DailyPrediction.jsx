import { useEffect, useState } from "react";

const DailyPrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' });

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
        if (data.success && data.predictions[currentDay]) {
          setPrediction(data.predictions[currentDay]);
        } else {
          setPrediction(null); // Ensure prediction is null if no data is found
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
          <p className="text-lg text-[#3a3939]">Loading your prediction...</p>
        ) : prediction && prediction.mood !== "No prediction available" ? (
          <p className="text-lg text-[#3a3939]">
            {prediction.activity 
              ? `You may feel ${prediction.mood} today because of ${prediction.activity}` 
              : `You may feel ${prediction.mood} today`}
          </p>
        ) : (
          <p className="text-lg text-[#3a3939]">
            No prediction available today because no logged moods for the past 30 days.
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyPrediction;
