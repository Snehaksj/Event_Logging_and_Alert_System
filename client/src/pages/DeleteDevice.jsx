import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { useAuth } from '../Context/authContext.jsx'; // Assuming you have an AuthContext
import Nav from '../Components/Nav.jsx';
import Toast from '../Components/Toast.jsx';

const DeleteDevice = () => {
  const { username, role } = useAuth(); // Get the username and role from authContext
  const [devices, setDevices] = useState([]); // List of devices
  const [selectedDevice, setSelectedDevice] = useState(""); // Selected device name
  const [toastMessage, setToastMessage] = useState(""); // Toast message state
  const [errorMessages, setErrorMessages] = useState({
    generalMsg: "", // Added for general error messages
  });
  const [refreshDevices, setRefreshDevices] = useState(false); // Trigger for re-fetching devices
  const navigate = useNavigate(); // Initialize the navigate function

  const handleBack = () => {
    navigate('/devices'); // Navigate back to the /devices page
  };

  // Fetch devices based on role and username
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const apiUrl =
          role === '[ROLE_ADMIN]'
            ? 'http://localhost:8080/devices/all'
            : `http://localhost:8080/devices/user/${username}`;

        const devicesResponse = await axios.get(apiUrl);
        setDevices(devicesResponse.data); // Set the fetched devices
      } catch (error) {
        setErrorMessages({ generalMsg: "Failed to fetch devices. Please try again." });
      }
    };

    fetchDevices();
  }, [role, username, refreshDevices]); // Re-fetch if role, username, or refreshDevices changes

  const handleDelete = async (e) => {
    e.preventDefault();
    setErrorMessages({ generalMsg: "" });

    // Validate input
    if (!selectedDevice) {
      setErrorMessages({
        generalMsg: "Please select a device to delete",
      });
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8080/devices/delete/${selectedDevice}`);

      if (response.status === 200) {
        setToastMessage("Device deleted successfully!");
        setSelectedDevice(""); // Reset selected device
        setRefreshDevices(prev => !prev); // Trigger device list re-fetch
      } else {
        setErrorMessages({ generalMsg: "Failed to delete device. Please try again." });
      }
    } catch (error) {
      setErrorMessages({ generalMsg: "An error occurred while deleting the device. Please try again." });
    }
  };

  return (
    <>
      <Nav />
      <p className='m-10 text-white cursor-pointer hover:text-pink-600 w-36' onClick={handleBack}>
        &larr; Back to devices
      </p>

      <div className="m-10 p-11 h-[300px] w-96 bg-slate-900 absolute rounded-2xl top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-7">
        <h3 className="text-center text-2xl font-sans text-white">Delete Device</h3>
        
        {/* Device Selection Dropdown */}
        <div className="mb-4">
          <label className="text-slate-100">Select Device</label>
          <select
            className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            <option value="">-- Choose a Device --</option>
            {devices.length > 0 ? (
              devices.map((device) => (
                <option key={device.name} value={device.name}>
                  {device.name}
                </option>
              ))
            ) : (
              <option>No devices available</option>
            )}
          </select>
        </div>

        {/* Display error messages */}
        {errorMessages.generalMsg && (
          <p className="text-red-500">{errorMessages.generalMsg}</p>
        )}

        <button
          type="submit"
          onClick={handleDelete}
          className="mt-2 mb-2 mx-auto w-1/2 justify-center items-center text-white p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Delete Device
        </button>
      </div>

      {/* Conditionally render the Toast message at the bottom of the page */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </>
  );
};

export default DeleteDevice;
