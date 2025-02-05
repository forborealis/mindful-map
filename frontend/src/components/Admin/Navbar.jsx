import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import ForumIcon from '@mui/icons-material/Forum';
import GavelIcon from '@mui/icons-material/Gavel';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PollIcon from '@mui/icons-material/Poll';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem('token');
    // Redirect to the login page
    navigate('/signin');
  };

  return (
    <div className="w-full h-16 bg-[#64aa86] flex justify-around items-center fixed bottom-0">
    <Link to="/admin/dashboard" className="flex flex-col items-center text-white">
      <PollIcon className="mb-1" />
      <span>Dashboard</span>
    </Link>
      <Link to="/admin/users" className="flex flex-col items-center text-white">
        <PeopleIcon className="mb-1" />
        <span>Users</span>
      </Link>
      <Link to="/admin/forum" className="flex flex-col items-center text-white">
        <ForumIcon className="mb-1" />
        <span>Forum</span>
      </Link>
      <Link to="/admin/moderate" className="flex flex-col items-center text-white">
        <GavelIcon className="mb-1" />
        <span>Moderate</span>
      </Link>
      <Link to="/signin" onClick={handleLogout} className="flex flex-col items-center text-white">
        <ExitToAppIcon className="mb-1" />
        <span>Sign out</span>
      </Link>
    </div>
  );
};

export default Navbar;