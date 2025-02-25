import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/authContext.jsx'; // Assuming you have an AuthContext
import Nav from '../Components/Nav.jsx';
import Toast from '../Components/Toast.jsx';

const EditDevice = () => {
  const { username, role } = useAuth(); // Get the username and role from authContext
  const [devices, setDevices] = useState([]); // List of devices
  const [users, setUsers] = useState([]); // List of users (to populate the username dropdown)
  const [selectedDeviceName, setSelectedDeviceName] = useState(""); // Selected device name
  const [deviceName, setDeviceName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [ram, setRam] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [softwareVersion, setSoftwareVersion] = useState("");
  const [transport, setTransport] = useState("");
  const [inputUsername, setInputUsername] = useState(""); // For admin to change username
  const [oldUsername, setOldUsername] = useState(""); // For admin to change username
  const [selectedDevice, setSelectedDevice] = useState(null); // For storing the selected device details
  const [toastMessage, setToastMessage] = useState(""); // Toast message state
  const [errorMessages, setErrorMessages] = useState({
    generalMsg: "",
  });
  const navigate = useNavigate();

  // Fetch devices and users when the component loads
  useEffect(() => {
    const fetchDevicesAndUsers = async () => {
      try {
        // Fetch devices based on the role
        const apiUrl =
          role === '[ROLE_ADMIN]'
            ? 'http://localhost:8080/devices/all'
            : `http://localhost:8080/devices/user/${username}`;

        const devicesResponse = await axios.get(apiUrl);
        setDevices(devicesResponse.data);
        
        // Fetch all users for the admin
        if (role === '[ROLE_ADMIN]') {
          const usersResponse = await axios.get('http://localhost:8080/users');
          setUsers(usersResponse.data);
        }
      } catch (error) {
        setErrorMessages({ generalMsg: "Failed to fetch devices or users. Please try again." });
      }
    };

    fetchDevicesAndUsers();
  }, [role, username]); // Re-fetch if role or username changes

  // Handle the selection of a device
  const handleDeviceSelection = (deviceName) => {
    setSelectedDeviceName(deviceName);
    const device = devices.find((device) => device.name === deviceName);
    setSelectedDevice(device);
    if (device) {
      setDeviceName(device.name);
      setIpAddress(device.configuration[0]);
      setRam(device.configuration[1] || ""); // Handle cases where config values might not be available
      setMacAddress(device.configuration[2]);
      setSoftwareVersion(device.configuration[3]);
      setTransport(device.configuration[4]);
      setInputUsername(device.user.username || ""); // Set the device's username
      setOldUsername(device.user.username || ""); // Set the device's username
    }
  };

  // Handle form submission to update the device
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation for required fields
    if (!deviceName || !softwareVersion || !ipAddress || !ram || !macAddress || !transport) {
      setErrorMessages({ generalMsg: "All fields must be filled in." });
      return;
    }

    try {
      const updatedDevice = {
        configuration: [ipAddress, ram, macAddress, softwareVersion, transport],
      };
      const apiUsername = role === "[ROLE_ADMIN]" ? inputUsername : username; // Use the input username if admin, otherwise the current user's username
      // Use the correct endpoint for PUT request
      const response = await axios.put(
        `http://localhost:8080/devices/edit/${oldUsername}/${apiUsername}/${deviceName}`,
        updatedDevice
      );

      if (response.status === 200) {
        setToastMessage("Device updated successfully!");
        setSelectedDevice(null); // Reset after successful update
        setDeviceName(""); // Reset fields
        setIpAddress("");
        setRam("");
        setMacAddress("");
        setSoftwareVersion("");
        setTransport("");
        
      } else {
        // Handle unexpected errors from the backend
        setErrorMessages({ generalMsg: "Failed to update the device. Please try again." });
      }
    } catch (error) {
      console.log(error);
      setErrorMessages({ generalMsg: "An error occurred while updating the device. Please try again." });
      setToastMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Nav />
      <p className="m-10 text-white cursor-pointer hover:text-gray-300 w-32" onClick={() => navigate('/devices')}>
        &lt; Back to devices
      </p>
      <div className="p-11 bg-slate-900 rounded-2xl w-2/5 mt-10 mx-auto flex flex-col gap-7">
        <h3 className="text-center text-2xl font-sans text-white">Edit Device</h3>

        {/* Device selection dropdown */}
        <div className="mb-4">
          <label className="text-slate-100">Select Device</label>
          <select
            className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
            value={selectedDeviceName}
            onChange={(e) => handleDeviceSelection(e.target.value)}
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

        {/* Device Configuration Form */}
        {selectedDevice && (
          <form className="flex flex-col gap-6" onSubmit={handleUpdate}>
            {/* IP Address */}
            <label className="text-slate-100">
              IP Address
              <input
                type="text"
                className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
                placeholder={selectedDevice.configuration[0]}
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
            </label>

            {/* RAM */}
            <label className="text-slate-100">
              RAM
              <select
                className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
              >
                <option value="">{selectedDevice.configuration[1] || "Select RAM"}</option>
                <option value="4GB">4GB</option>
                <option value="6GB">6GB</option>
                <option value="8GB">8GB</option>
              </select>
            </label>

            {/* MAC Address */}
            <label className="text-slate-100">
              MAC Address
              <input
                type="text"
                className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
                placeholder={selectedDevice.configuration[2]}
                value={macAddress}
                onChange={(e) => setMacAddress(e.target.value)}
              />
            </label>

            {/* Software Version */}
            <label className="text-slate-100">
              Software Version
              <input
                type="text"
                className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
                placeholder={selectedDevice.configuration[3]}
                value={softwareVersion}
                onChange={(e) => setSoftwareVersion(e.target.value)}
              />
            </label>

            {/* Admin username field */}
            {role === "[ROLE_ADMIN]" && (
              <label className="text-slate-100">
                Username
                <select
                  className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                >   
                <option value="">{selectedDevice.user.username || "Select Username"}</option>
                {users
                  .filter((user) => user.role === "USER") // Filter only users with role 'USER'
                  .map((user) => (
                    <option key={user.username} value={user.username}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {/* Transport */}
            <label className="text-slate-100">
              Transport
              <select
                className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
              >
                <option value="">{selectedDevice.configuration[4] || "Select Transport"}</option>
                <option value="sdh">SDH</option>
                <option value="otn">OTN</option>
                <option value="dwdm">DWDM</option>
              </select>
            </label>

            {/* Display general error message */}
            {errorMessages.generalMsg && <p className="text-red-500">{errorMessages.generalMsg}</p>}

            <button
              type="submit"
              className="mt-3 mb-2 mx-auto w-1/2 justify-center items-center text-white p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Update Device
            </button>
          </form>
        )}
      </div>

      {/* Conditionally render the Toast message at the bottom of the page */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </>
  );
};

export default EditDevice;
