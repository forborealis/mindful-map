import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BottomNav from '../../BottomNav';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const ViewJournal = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [challengeData, setChallengeData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchJournalEntry = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/journal/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setImages(response.data.images);
        setChallenge(response.data.challenge);
        setChallengeData(response.data.challengeData);
      } catch (error) {
        console.error('Error fetching journal entry:', error);
        toast.error('Failed to load journal entry.');
      }
    };

    fetchJournalEntry();
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleBackClick = () => {
    navigate('/journal-logs');
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-[#eef0ee] min-h-screen flex flex-col justify-between">
      <nav className="bg-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <ArrowBackIcon className="cursor-pointer" onClick={handleBackClick} />
          <h1 className="text-xl font-bold">{currentDate}</h1>
          <div></div> {/* Placeholder for alignment */}
        </div>
      </nav>
      <div className="flex-grow flex flex-col items-center justify-start p-4"> {/* Adjusted justify-content */}
        <div className="relative w-full max-w-2xl mt-4"> {/* Added margin-top */}
          {challenge && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">{challenge.title}</h2>
              <p className="mb-4">{challenge.description}</p>
              {challenge.fields.map((field, index) => (
                <div key={field.state}>
                  <textarea
                    className="w-full p-4 border-none outline-none resize-none mb-4"
                    placeholder={field.placeholder}
                    value={challengeData[field.state] || ''}
                    readOnly
                  />
                  {index < challenge.fields.length - 1 && <hr className="border-t border-gray-300 mb-4" />}
                </div>
              ))}
            </div>
          )}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`upload-${index}`}
                className="w-40 h-24 object-cover rounded-lg cursor-pointer"
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
    </div>
  );
};

export default ViewJournal;