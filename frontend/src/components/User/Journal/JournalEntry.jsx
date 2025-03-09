import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BottomNav from '../../BottomNav';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const challenges = {
  Monday: {
    title: 'Gratitude Challenge',
    description: 'List 5 people/things you are grateful for.',
    fields: [
      { placeholder: 'Person/Thing 1', state: 'gratitude1' },
      { placeholder: 'Person/Thing 2', state: 'gratitude2' },
      { placeholder: 'Person/Thing 3', state: 'gratitude3' },
      { placeholder: 'Person/Thing 4', state: 'gratitude4' },
      { placeholder: 'Person/Thing 5', state: 'gratitude5' },
    ],
    recommendations: [
      'Family', 'Good food', 'A warm blanket', 'An affectionate pet', 'Friends', 'Health', 'Nature', 'A good book',
      'Sunshine', 'A cozy home', 'Music', 'Laughter', 'Clean water', 'Education', 'A comfortable bed', 'Technology',
      'Art', 'Freedom', 'Love', 'Opportunities', 'Happiness', 'Peace'
    ]
  },
  Tuesday: {
    title: 'Self-Love Challenge',
    description: 'List 3 things you like about yourself.',
    fields: [
      { placeholder: 'Thing 1', state: 'selfLove1' },
      { placeholder: 'Thing 2', state: 'selfLove2' },
      { placeholder: 'Thing 3', state: 'selfLove3' },
    ],
    recommendations: [
      'Kindness', 'Creativity', 'Resilience', 'Sense of humor', 'Empathy', 'Intelligence', 'Patience', 'Determination',
      'Honesty', 'Courage', 'Generosity', 'Adaptability', 'Confidence', 'Optimism', 'Loyalty', 'Humility',
      'Compassion', 'Curiosity', 'Discipline', 'Positivity'
    ]
  },
  Wednesday: {
    title: 'Achievement Challenge',
    description: 'List 3 achievements you are proud of.',
    fields: [
      { placeholder: 'Achievement 1', state: 'achievement1' },
      { placeholder: 'Achievement 2', state: 'achievement2' },
      { placeholder: 'Achievement 3', state: 'achievement3' },
    ],
    recommendations: [
      'Graduation', 'Job promotion', 'Learning a new skill', 'Helping others', 'Personal growth', 'Fitness goals',
      'Creative projects', 'Overcoming challenges', 'Travel experiences', 'Building relationships', 'Starting a business',
      'Volunteering', 'Public speaking', 'Writing a book', 'Completing a marathon', 'Financial independence',
      'Raising a family', 'Mentoring others', 'Achieving work-life balance', 'Winning an award'
    ]
  },
  Thursday: {
    title: 'Kindness Challenge',
    description: 'List 3 acts of kindness you have done or witnessed.',
    fields: [
      { placeholder: 'Act of Kindness 1', state: 'kindness1' },
      { placeholder: 'Act of Kindness 2', state: 'kindness2' },
      { placeholder: 'Act of Kindness 3', state: 'kindness3' },
    ],
    recommendations: [
      'Helping a neighbor', 'Volunteering', 'Donating to charity', 'Listening to someone', 'Complimenting others',
      'Sharing a meal', 'Supporting a friend', 'Random acts of kindness', 'Paying it forward', 'Offering a ride',
      'Babysitting for free', 'Helping with groceries', 'Writing a thank-you note', 'Visiting the elderly',
      'Cleaning up litter', 'Donating clothes', 'Helping with homework', 'Offering a smile', 'Giving directions',
      'Planting a tree'
    ]
  },
  Friday: {
    title: 'Hobby Challenge',
    description: 'List 3 hobbies or activities you enjoy.',
    fields: [
      { placeholder: 'Hobby/Activity 1', state: 'hobby1' },
      { placeholder: 'Hobby/Activity 2', state: 'hobby2' },
      { placeholder: 'Hobby/Activity 3', state: 'hobby3' },
    ],
    recommendations: [
      'Reading', 'Gardening', 'Cooking', 'Painting', 'Hiking', 'Playing an instrument', 'Writing', 'Photography',
      'Dancing', 'Knitting', 'Fishing', 'Cycling', 'Traveling', 'Bird watching', 'Pottery', 'Scrapbooking',
      'Woodworking', 'Yoga', 'Gaming', 'Swimming'
    ]
  },
  Saturday: {
    title: 'Relaxation Challenge',
    description: 'List 3 ways you relax and unwind.',
    fields: [
      { placeholder: 'Relaxation Method 1', state: 'relaxation1' },
      { placeholder: 'Relaxation Method 2', state: 'relaxation2' },
      { placeholder: 'Relaxation Method 3', state: 'relaxation3' },
    ],
    recommendations: [
      'Meditation', 'Reading a book', 'Taking a bath', 'Listening to music', 'Walking in nature', 'Yoga', 'Watching a movie',
      'Journaling', 'Deep breathing', 'Aromatherapy', 'Stretching', 'Napping', 'Drawing', 'Gardening', 'Cooking',
      'Spending time with pets', 'Crafting', 'Playing a musical instrument', 'Practicing mindfulness', 'Stargazing'
    ]
  },
  Sunday: {
    title: 'Reflection Challenge',
    description: 'Reflect on the past week and list 3 things you learned.',
    fields: [
      { placeholder: 'Lesson 1', state: 'lesson1' },
      { placeholder: 'Lesson 2', state: 'lesson2' },
      { placeholder: 'Lesson 3', state: 'lesson3' },
    ],
    recommendations: [
      'Patience', 'Gratitude', 'Self-awareness', 'Empathy', 'Time management', 'Problem-solving', 'Communication',
      'Adaptability', 'Resilience', 'Forgiveness', 'Mindfulness', 'Teamwork', 'Leadership', 'Conflict resolution',
      'Critical thinking', 'Decision making', 'Stress management', 'Goal setting', 'Self-discipline', 'Work-life balance'
    ]
  },
};

const JournalEntry = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [challengeData, setChallengeData] = useState({});
  const navigate = useNavigate();

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const challenge = challenges[currentDay];

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('challenge', JSON.stringify(challenge));
      formData.append('challengeData', JSON.stringify(challengeData));
      images.forEach((image) => {
        formData.append('images', image);
      });

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/journal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Journal entry saved:', response.data);
      toast.success('Journal logged for the day!');
      setTimeout(() => {
        navigate('/journal-logs');
      }, 2000);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to log journal entry.');
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleImageClick = (image) => {
    setSelectedImage(URL.createObjectURL(image));
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleBackClick = () => {
    navigate('/journal-logs');
  };

  const handleWarningModalClose = () => {
    setShowWarningModal(false);
  };

  const handleWarningModalProceed = () => {
    setShowWarningModal(false);
    handleSave();
  };

  const handleChallengeInputChange = (field, value) => {
    setChallengeData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleRecommendationClick = (field, recommendation) => {
    setChallengeData((prevData) => ({ ...prevData, [field]: recommendation }));
  };

  const getRecommendations = (field) => {
    const usedRecommendations = Object.values(challengeData);
    const availableRecommendations = challenge.recommendations.filter(
      (rec) => !usedRecommendations.includes(rec)
    );

    // Ensure each input box has unique recommendations
    const recommendations = [];
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * availableRecommendations.length);
      recommendations.push(availableRecommendations[randomIndex]);
      availableRecommendations.splice(randomIndex, 1);
    }

    return recommendations;
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-[#b4ddc8] min-h-screen flex flex-col justify-between">
      <nav className="bg-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <ArrowBackIcon className="cursor-pointer" onClick={handleBackClick} />
          <h1 className="text-xl font-bold">{currentDate}</h1>
          <div></div> {/* Placeholder for alignment */}
        </div>
      </nav>
      <div className="flex-grow flex items-center justify-center p-4 mb-16"> {/* Added margin-bottom */}
        <div className="relative w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between mb-4">
            <button
              onClick={handleSave}
              className="bg-[#64aa86] text-white font-bold py-2 px-6 rounded-full"
            >
              Save
            </button>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">{challenge.title}</h2>
            <p className="mb-4">{challenge.description}</p>
            {challenge.fields.map((field) => (
              <div key={field.state} className="mb-4">
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg mb-2"
                  placeholder={field.placeholder}
                  value={challengeData[field.state] || ''}
                  onChange={(e) => handleChallengeInputChange(field.state, e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  {getRecommendations(field.state).map((recommendation, index) => (
                    <span
                      key={index}
                      className="bg-[#64aa86] text-white px-3 py-1 rounded-full cursor-pointer"
                      onClick={() => handleRecommendationClick(field.state, recommendation)}
                    >
                      {recommendation}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-upload">
            <ImageIcon
              className="text-[#64aa86] cursor-pointer"
              style={{ fontSize: 40 }}
            />
          </label>
          <div className="flex space-x-2 mt-4">
            {images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`upload-${index}`}
                className="w-32 h-32 object-cover cursor-pointer rounded-lg"
                onClick={() => handleImageClick(image)}
              />
            ))}
          </div>
        </div>
      </div>
      <BottomNav value="journal" setValue={() => {}} />
      <Modal open={!!selectedImage} onClose={handleCloseModal}>
        <Box className="flex items-center justify-center h-screen relative">
          <img src={selectedImage} alt="Selected" className="max-w-full max-h-full" />
          <CloseIcon
            className="absolute top-4 right-4 text-white cursor-pointer"
            style={{ fontSize: 40 }}
            onClick={handleCloseModal}
          />
        </Box>
      </Modal>
      <Modal open={showWarningModal} onClose={handleWarningModalClose}>
        <Box className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-20">
          <h2 className="text-xl font-bold mb-4">You are not alone</h2>
          <p className="mb-4">
            It looks like your journal entry contains words that may indicate you are feeling down. 
            Please remember that you are not alone. Speak to trusted friends or family members and seek professional help if you can.
          </p>
          <div className="flex justify-end">
            <button
              onClick={handleWarningModalClose}
              className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleWarningModalProceed}
              className="bg-[#64aa86] text-white font-bold py-2 px-4 rounded"
            >
              Proceed
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default JournalEntry;