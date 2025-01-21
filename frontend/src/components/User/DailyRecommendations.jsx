import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const recommendations = {
  angry: [
    "Take deep breaths and count to ten.",
    "Go for a walk to clear your mind.",
    "Listen to calming music.",
    "Practice mindfulness meditation.",
    "Write down your thoughts in a journal.",
    "Engage in a physical activity like running or yoga.",
    "Talk to a friend or family member.",
    "Try a relaxation technique like progressive muscle relaxation.",
    "Take a break and do something you enjoy.",
    "Practice gratitude by listing things you're thankful for.",
    "Use a stress ball or other stress-relief tool.",
    "Read a book or watch a movie.",
    "Spend time in nature.",
    "Do a creative activity like drawing or painting.",
    "Practice positive self-talk."
  ],
  sad: [
    "Reach out to a friend or family member.",
    "Engage in a hobby you enjoy.",
    "Take a walk outside and get some fresh air.",
    "Listen to uplifting music.",
    "Watch a funny movie or TV show.",
    "Write down your feelings in a journal.",
    "Practice mindfulness meditation.",
    "Do a physical activity like exercise or yoga.",
    "Spend time with a pet.",
    "Try a new activity or learn something new.",
    "Practice gratitude by listing things you're thankful for.",
    "Read a book or listen to an audiobook.",
    "Do a creative activity like drawing or painting.",
    "Cook or bake something you enjoy.",
    "Practice positive self-talk."
  ],
  anxious: [
    "Practice deep breathing exercises.",
    "Try mindfulness meditation.",
    "Engage in a physical activity like running or yoga.",
    "Write down your worries in a journal.",
    "Listen to calming music.",
    "Take a break and do something you enjoy.",
    "Talk to a friend or family member.",
    "Practice progressive muscle relaxation.",
    "Spend time in nature.",
    "Use a stress ball or other stress-relief tool.",
    "Read a book or watch a movie.",
    "Practice gratitude by listing things you're thankful for.",
    "Do a creative activity like drawing or painting.",
    "Try a relaxation technique like guided imagery.",
    "Practice positive self-talk."
  ]
};

const DailyRecommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = location.state?.mood;

  const [selectedRecommendations, setSelectedRecommendations] = useState([]);

  useEffect(() => {
    if (mood && recommendations[mood]) {
      const randomRecommendations = recommendations[mood]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setSelectedRecommendations(randomRecommendations);
    }
  }, [mood]);

  const handleNext = () => {
    navigate('/mood-entries');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#67b88f] via-[#93c4ab] to-[#fdffff]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#3a3939]">
          Since you're feeling {mood} today...
        </h1>
        <p className="text-lg text-[#3a3939] mt-2">
          Follow these recommendations to help improve your mood:
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        {selectedRecommendations.map((rec, index) => (
          <p key={index} className="text-lg text-[#3a3939] mb-4">
            {rec}
          </p>
        ))}
      </div>
      <button
        onClick={handleNext}
        className="mt-8 bg-[#6fba94] text-white font-bold py-2 px-10 rounded-full hover:bg-[#5aa88f] absolute bottom-10 right-10"
      >
        Next
      </button>
    </div>
  );
};

export default DailyRecommendations;