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

const JournalLogs = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
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
      toast.error('Journal already logged for the day!');
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

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="bg-[#eef0ee] min-h-screen flex flex-col justify-between">
      <div>
        <nav className="bg-white py-4 shadow-md relative">
          <div className="container mx-auto flex justify-center items-center">
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
                  {entry.content.split(' ').slice(0, 20).join(' ')}...
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