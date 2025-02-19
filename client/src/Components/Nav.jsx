import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import { useAuth } from "../Context/authContext";
const Nav = () => {
  const navigate = useNavigate();
 const { logout } = useAuth(); 
  const handleLogout = () => {
    // Call the logout function passed as prop
    
    logout();
    // After logout, navigate back to the login page
    navigate('/login');
  };

  return (
    <nav className='w-full pt-3 px-3 flex items-center justify-between relative'>
      <div className="flex flex-row gap-2 items-center">
        <a href='https://www.tejasnetworks.com/'> 
          <img src="/Tejas_logo.png" alt="Tejas Networks Logo" className='h-14'/>
        </a>
        <h1 className='text-2xl font-bold text-slate-300'>Tejas Networks</h1>
      </div>
      <h2 className='text-slate-200 font-semibold text-3xl absolute left-1/2 transform -translate-x-1/2 top-6'
          style={{ fontFamily: 'Poppins, sans-serif', textShadow: '0px 0px 30px rgb(29, 120, 248)' }}>
        Event Logging and Alert System
      </h2>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className='bg-red-500 text-md text-white py-1 px-2 rounded-lg shadow-lg hover:bg-red-600 transition duration-300 absolute right-3 top-6'>
        Logout
      </button>
    </nav>
  );
};

export default Nav;
