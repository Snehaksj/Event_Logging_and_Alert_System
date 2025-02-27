import React from 'react';
import Nav from '../Components/Nav.jsx';
import { useNavigate } from 'react-router-dom'; // For navigating to other pages
import { useAuth } from '../Context/authContext.jsx'; // Assuming you have a hook for user auth

const Alarms = () => {
  const navigate = useNavigate(); // Initialize the navigate function for routing
  const { role } = useAuth(); // Get the user's role from useAuth hook

  // Define the routing for each card click
  const handleCardClick = (page) => {
    navigate(`/alarms/${page}`); // Redirect to the respective page
  };

  const handleBack = () =>{
    navigate('/dashboard');
  };
  

  return (
    <>
      <Nav />
      <p className='m-10 text-white cursor-pointer hover:text-gray-300 w-48' onClick={handleBack}> &lt; Back to dashboard</p>
      <div className="m-28 flex flex-col gap-14">


        <div className="flex gap-10 justify-center items-center">
          {/* Card 1: Create Alarm */}
          <div
            className="h-[200px] w-[300px] rounded-xl bg-slate-900 flex flex-col items-center justify-center hover:scale-105 hover:bg-slate-700 transition-all duration-300 shadow-lg cursor-pointer"
            onClick={() => handleCardClick('create')}
          >
            <img src="/plus-square.svg" alt="Create Alarm" className="h-[100px] w-[120px] mb-4" />
            <p className="text-white text-lg">Create Alarm</p>
          </div>

          {/* Card 2: View Alarms */}
          <div
            className="h-[200px] w-[300px] rounded-xl bg-slate-900 flex flex-col items-center justify-center hover:scale-105 hover:bg-slate-700 transition-all duration-300 shadow-lg cursor-pointer"
            onClick={() => handleCardClick('view')}
          >
            <img src="/eye.svg" alt="View Alarms" className="h-[100px] w-[120px] mb-4" />
            <p className="text-white text-lg">View Alarms</p>
          </div>

        

        </div>
      </div>
    </>
  );
};

export default Alarms;
