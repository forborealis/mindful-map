import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BarChartIcon from '@mui/icons-material/BarChart';
import ForumIcon from '@mui/icons-material/Forum';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BookIcon from '@mui/icons-material/Book';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const BottomNav = ({ value, setValue }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 'entries') {
      navigate('/mood-entries');
    } 
    if (newValue === 'calendar') {
      navigate('/calendar-log');
    } 
    if (newValue === 'journal') {
      navigate('/journal-logs');
    }
    // Add navigation for other pages when they are implemented
  };

  const handleLogoutClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <>
      <BottomNavigation value={value} onChange={handleChange} className="fixed bottom-0 left-0 right-0 bg-white shadow-md">
        <BottomNavigationAction
          label="Entries"
          value="entries"
          icon={<ListAltIcon />}
          style={{ color: value === 'entries' ? '#6fba94' : '#b1b1b1' }}
        />
        <BottomNavigationAction
          label="Statistics"
          value="statistics"
          icon={<BarChartIcon />}
          style={{ color: value === 'statistics' ? '#6fba94' : '#b1b1b1' }}
        />
        <BottomNavigationAction
          label="Forum"
          value="forum"
          icon={<ForumIcon />}
          style={{ color: value === 'forum' ? '#6fba94' : '#b1b1b1' }}
        />
        <BottomNavigationAction
          label="Calendar"
          value="calendar"
          icon={<CalendarTodayIcon />}
          style={{ color: value === 'calendar' ? '#6fba94' : '#b1b1b1' }}
        />
        <BottomNavigationAction
          label="Journal"
          value="journal"
          icon={<BookIcon />}
          style={{ color: value === 'journal' ? '#6fba94' : '#b1b1b1' }}
        />
        <BottomNavigationAction
          label="Logout"
          value="logout"
          icon={<ExitToAppIcon />}
          style={{ color: value === 'logout' ? '#6fba94' : '#b1b1b1' }}
          onClick={handleLogoutClick}
        />
      </BottomNavigation>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BottomNav;