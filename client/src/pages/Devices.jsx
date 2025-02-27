import React from 'react';
import Nav from '../Components/Nav.jsx';
import { useNavigate } from 'react-router-dom'; // For navigating to other pages

const Devices = () => {
  const navigate = useNavigate(); // Initialize the navigate function for routing

  // Define the routing for each card click
  const handleCardClick = (page) => {
    navigate(`/devices/${page}`); // Redirect to the respective page
  };

  const handleBack = () =>{
    navigate('/dashboard');
  };
  return (
    <>
      <Nav />
      <p className='m-10 text-white cursor-pointer hover:text-gray-300 w-48' onClick={handleBack}> &lt; Back to dashboard</p>
      <div className="m-19 flex flex-col gap-14">
        <div className="flex gap-10 justify-center items-center">
          {/* Card 1: Add Device */}
          <div
            className="h-[200px] w-[300px] rounded-xl bg-slate-900 flex flex-col items-center justify-center hover:scale-105 hover:bg-slate-700 transition-all duration-300 shadow-lg cursor-pointer"
            onClick={() => handleCardClick('add')}
          >
            <img src="/plus-square.svg" alt="Add Device" className="h-[100px] w-[120px] mb-4" />
            <p className="text-white text-lg">Add Device</p>
          </div>

          {/* Card 2: Add Multiple Devices */}
          <div
            className="h-[200px] w-[300px] rounded-xl bg-slate-900 flex flex-col items-center justify-center hover:scale-105 hover:bg-slate-700 transition-all duration-300 shadow-lg cursor-pointer"
            onClick={() => handleCardClick('add-multiple')}
          >
            <img src="/list.svg" alt="Add Multiple Devices" className="h-[100px] w-[120px] mb-4" />
            <p className="text-white text-lg">Add Multiple Devices</p>
          </div>

          {/* Card 3: Edit Device */}
          <div
            className="h-[200px] w-[300px] rounded-xl bg-slate-900 flex flex-col items-center justify-center hover:scale-105 hover:bg-slate-700 transition-all duration-300 shadow-lg cursor-pointer"
            onClick={() => handleCardClick('edit')}
          >
            <img src="/edit.svg" alt="Edit Device" className="h-[100px] w-[120px] mb-4" />
            <p className="text-white text-lg">Edit Device</p>
          </div>
        </div>

        <div className="flex gap-10 justify-center items-center">
          {/* Card 4: Delete Device */}
          <div
            className="h-[200px] w-[300px] rounded-xl bg-slate-900 flex flex-col items-center justify-center hover:scale-105 hover:bg-slate-700 transition-all duration-300 shadow-lg cursor-pointer"
            onClick={() => handleCardClick('delete')}
          >
            <img src="/trash.svg" alt="Delete Device" className="h-[100px] w-[120px] mb-4" />
            <p className="text-white text-lg">Delete Device</p>
          </div>

          {/* Card 5: View Device */}
          <div
            className="h-[200px] w-[300px] rounded-xl bg-slate-900 flex flex-col items-center justify-center hover:scale-105 hover:bg-slate-700 transition-all duration-300 shadow-lg cursor-pointer"
            onClick={() => handleCardClick('view')}
          >
            <img src="/eye.svg" alt="View Device" className="h-[100px] w-[120px] mb-4" />
            <p className="text-white text-lg">View Device</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Devices;
