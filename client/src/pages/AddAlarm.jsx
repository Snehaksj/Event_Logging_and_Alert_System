import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../Components/Nav.jsx';
import axios from 'axios';
import Toast from '../Components/Toast.jsx'; // Import the Toast component
import { useAuth } from '../Context/authContext.jsx'; // Assuming you have an AuthContext

const AddAlarm = () => {
  const { username, role } = useAuth(); // Get the username and role from authContext
  const [deviceName, setDeviceName] = useState("");
  const [criticality, setCriticality] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [devices, setDevices] = useState([]); // List of devices for the dropdown
  const [errorMessages, setErrorMessages] = useState({
    deviceNameMsg: "",
    criticalityMsg: "",
    messageMsg: "",
    severityMsg: "",
    generalMsg: "", // For general errors
  });
  const [toastMessage, setToastMessage] = useState(""); // Toast message state
  const navigate = useNavigate();

  // Fetch devices for the dropdown based on user role
  const fetchDevices = async () => {
    try {
      const response = await axios.get(
        role === '[ROLE_ADMIN]' 
          ? 'http://localhost:8080/devices/all' // Admin can access all devices
          : `http://localhost:8080/devices/${username}` // User can only access their own devices
      );
      setDevices(response.data);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    }
  };

  useEffect(() => {
    fetchDevices(); // Fetch devices when the component loads
  }, [role, username]);

  const handleBack = () => {
    navigate('/alarms'); // Navigate back to the alarms page
  };

  const handleAddAlarm = async (e) => {
    e.preventDefault();
    setErrorMessages({
      deviceNameMsg: "",
      criticalityMsg: "",
      messageMsg: "",
      severityMsg: "",
      generalMsg: ""
    });

    // Validate input fields
    if (!deviceName) {
      setErrorMessages((prev) => ({ ...prev, deviceNameMsg: "Device Name is required" }));
    }

    if (!criticality) {
      setErrorMessages((prev) => ({ ...prev, criticalityMsg: "Criticality is required" }));
    }

    if (!message) {
      setErrorMessages((prev) => ({ ...prev, messageMsg: "Message is required" }));
    }

    if (!severity) {
      setErrorMessages((prev) => ({ ...prev, severityMsg: "Severity is required" }));
    }

    if (!deviceName || !criticality || !message || !severity) return; // Stop if there are validation errors

    try {
      // Call the backend to create the alarm
      const response = await axios.post(`http://localhost:8080/alarms/create/${username}/${deviceName}`, {
        criticality,
        message,
        severity
      });

      if (response.status === 200) {
        setToastMessage("Alarm created successfully!");
        setDeviceName(""); // Reset the form after success
        setCriticality(""); 
        setMessage(""); 
        setSeverity("");
      }
    } catch (error) {
      setErrorMessages({ generalMsg: "An error occurred. Please try again." });
      setToastMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Nav />
      <p className="m-10 text-white cursor-pointer hover:text-gray-300 w-32" onClick={handleBack}>
        &lt; Back to Alarms
      </p>
      <div className="p-11 bg-slate-900 rounded-2xl w-2/5 mt-10 mx-auto flex flex-col gap-7">
        <h3 className="text-center text-2xl font-sans text-white">Create Alarm</h3>
        <form className="flex flex-col gap-6" onSubmit={handleAddAlarm}>
          {/* Device Dropdown */}
          <label className="text-slate-100">
            Device
            <select
              className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            >
              <option value="">Select Device</option>
              {devices.map((device) => (
                <option key={device.id} value={device.name}>
                  {device.name}
                </option>
              ))}
            </select>
          </label>
          {errorMessages.deviceNameMsg && <p className="text-red-500">{errorMessages.deviceNameMsg}</p>}

          {/* Criticality Dropdown */}
          <label className="text-slate-100">
            Criticality
            <select
              className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
              value={criticality}
              onChange={(e) => setCriticality(e.target.value)}
            >
              <option value="">Select Criticality</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </label>
          {errorMessages.criticalityMsg && <p className="text-red-500">{errorMessages.criticalityMsg}</p>}

          {/* Message Input */}
          <label className="text-slate-100">
            Message
            <input
              type="text"
              className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          {errorMessages.messageMsg && <p className="text-red-500">{errorMessages.messageMsg}</p>}

          {/* Severity Dropdown */}
          <label className="text-slate-100">
            Severity
            <select
              className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="">Select Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </label>
          {errorMessages.severityMsg && <p className="text-red-500">{errorMessages.severityMsg}</p>}

          {/* General error message */}
          {errorMessages.generalMsg && <p className="text-red-500">{errorMessages.generalMsg}</p>}

          <button
            type="submit"
            className="mt-3 mb-2 mx-auto w-1/2 justify-center items-center text-white p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Conditionally render the Toast message */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </>
  );
};

export default AddAlarm;
