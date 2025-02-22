import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BottomNav from '../../BottomNav';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

const JournalLogs = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [challengesAnchorEl, setChallengesAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJournalEntries = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/journals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJournalEntries(response.data);
      filterEntriesByMonth(response.data, currentDate);
    };

    fetchJournalEntries();
  }, [currentDate]);

  const filterEntriesByMonth = (entries, date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const filtered = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === month && entryDate.getFullYear() === year;
    });
    setFilteredEntries(filtered);
  };

  const handleAddClick = () => {
    const today = new Date().toISOString().split('T')[0];
    const hasLoggedToday = journalEntries.some(entry => entry.date.split('T')[0] === today);

    if (hasLoggedToday) {
      toast.error('You already logged a journal entry for today.');
    } else {
      navigate('/journal-entry');
    }
  };

  const handleJournalClick = (id) => {
    navigate(`/view-journal/${id}`);
  };

  const handleMoreClick = (event, entry) => {
    setSelectedEntry(entry);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setAnchorEl(null);
    navigate(`/edit-journal/${selectedEntry._id}`);
  };

  const handleDeleteClick = () => {
    setAnchorEl(null);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/journal/${selectedEntry._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJournalEntries(journalEntries.filter(entry => entry._id !== selectedEntry._id));
      filterEntriesByMonth(journalEntries.filter(entry => entry._id !== selectedEntry._id), currentDate);
      toast.success('Journal entry deleted successfully.');
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      toast.error('Failed to delete journal entry.');
    } finally {
      setOpenDeleteModal(false);
      setSelectedEntry(null);
    }
  };

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
    setSelectedEntry(null);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const handleChallengesClick = (event) => {
    setChallengesAnchorEl(event.currentTarget);
  };

  const handleChallengesClose = () => {
    setChallengesAnchorEl(null);
  };

  const getWeekStartDate = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  };

  const weekStartDate = getWeekStartDate(new Date());
  const completedChallenges = journalEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entry.challenge && entryDate >= weekStartDate;
  }).length;
  const totalChallenges = 7; // Assuming there are 7 daily challenges in a week
  const progress = (completedChallenges / totalChallenges) * 100;

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="bg-[#eef0ee] min-h-screen flex flex-col justify-between">
      <div>
        <nav className="bg-white py-4 shadow-md relative">
          <div className="container mx-auto flex justify-between items-center px-4">
            <div className="flex items-center">
              <MilitaryTechIcon
                className="cursor-pointer"
                style={{ color: '#6fba94', fontSize: 30 }}
                onClick={handleChallengesClick}
              />
              <Menu
                anchorEl={challengesAnchorEl}
                open={Boolean(challengesAnchorEl)}
                onClose={handleChallengesClose}
              >
                <Box sx={{ width: '100%', padding: '10px' }}>
                  <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#6fba94' } }} />
                </Box>
                <MenuItem>
                  {completedChallenges}/{totalChallenges} Days Completed
                </MenuItem>
              </Menu>
            </div>
            <div className="flex items-center justify-center w-full">
              <ChevronLeftIcon className="cursor-pointer mx-2" onClick={handlePrevMonth} />
              <h1 className="text-xl font-bold">{formattedDate}</h1>
              <ChevronRightIcon className="cursor-pointer mx-2" onClick={handleNextMonth} />
            </div>
            <button
              onClick={handleAddClick}
              className="absolute top-2 right-4 bg-[#6fba94] text-white rounded-full p-2 shadow-md"
            >
              <AddIcon />
            </button>
          </div>
        </nav>
        <div className="relative p-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredEntries.map((entry) => (
              <div
                key={entry._id}
                className="bg-white p-4 rounded-lg shadow-md h-64 w-full relative"
              >
                <div className="absolute top-4 right-4">
                  <MoreHorizIcon onClick={(event) => handleMoreClick(event, entry)} className="cursor-pointer" />
                </div>
                <div className="text-[#6fba94] font-bold">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className="mt-2 cursor-pointer" onClick={() => handleJournalClick(entry._id)}>
                  <h2 className="text-xl font-bold mb-2">{entry.challenge?.title || 'No Challenge'}</h2>
                  <p className="text-gray-700 mb-2">{entry.challenge?.description || 'No Description'}</p>
                  {entry.challengeData && Object.values(entry.challengeData).map((text, index) => (
                    <p key={index} className="text-gray-700">{index + 1}. {text}</p>
                  ))}
                </div>
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {entry.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`upload-${index}`}
                      className="w-30 h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav value="journal" setValue={() => {}} />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
      <Dialog
        open={openDeleteModal}
        onClose={handleCloseModal}
      >
        <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this journal entry?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JournalLogs;