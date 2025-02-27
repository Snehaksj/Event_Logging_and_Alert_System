import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../Components/Nav.jsx';
import axios from 'axios';
import Toast from '../Components/Toast.jsx'; // Import the Toast component
import { useAuth } from '../Context/authContext.jsx'; // Assuming you have an AuthContext

const AddDevice = () => {
  const { username, role } = useAuth(); // Get the username and role from authContext
  const [deviceName, setDeviceName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [ram, setRam] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [softwareVersion, setSoftwareVersion] = useState("");
  const [transport, setTransport] = useState("");
  const [inputUsername, setInputUsername] = useState(""); // State for the username input (only visible if admin)
  const [users, setUsers] = useState([]); // List of users for the dropdown
  const [errorMessages, setErrorMessages] = useState({
    deviceNameMsg: "",
    ipAddressMsg: "",
    macAddressMsg: "",
    ramMsg: "",
    softwareVersionMsg: "",
    transportMsg: "",
    generalMsg: "", // For general errors
  });
  const [toastMessage, setToastMessage] = useState(""); // Toast message state
  const navigate = useNavigate();

  // Fetch users for the dropdown when the component loads
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  React.useEffect(() => {
    if (role === '[ROLE_ADMIN]') {
      fetchUsers();
    }
  }, [role]);

  // IP and MAC address validation functions
  const validateIpAddress = (ip) => {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  };

  const validateMacAddress = (mac) => {
    const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return regex.test(mac);
  };

  const handleBack = () => {
    navigate('/devices');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMessages({
      deviceNameMsg: "",
      ipAddressMsg: "",
      macAddressMsg: "",
      ramMsg: "",
      softwareVersionMsg: "",
      transportMsg: "",
      generalMsg: ""
    });

    // Validate deviceName and softwareVersion
    if (!deviceName) {
      setErrorMessages((prev) => ({
        ...prev,
        deviceNameMsg: "Device Name is required"
      }));
    }

    if (!softwareVersion) {
      setErrorMessages((prev) => ({
        ...prev,
        softwareVersionMsg: "Software Version is required"
      }));
    }

    // Validate other fields
    if (!ipAddress || !ram || !macAddress || !transport) {
      setErrorMessages((prev) => ({
        ...prev,
        ipAddressMsg: ipAddress ? "" : "IP Address is required",
        macAddressMsg: macAddress ? "" : "MAC Address is required",
        ramMsg: ram ? "" : "RAM is required",
        transportMsg: transport ? "" : "Transport is required",
      }));
      return;
    }

    // Validate IP and MAC formats
    if (!validateIpAddress(ipAddress)) {
      setErrorMessages({ ipAddressMsg: "Invalid IP address format" });
      
      return;
    }

    if (!validateMacAddress(macAddress)) {
      setErrorMessages({ macAddressMsg: "Invalid MAC address format" });
      return;
    }

    // Proceed to submit if all validations are successful
    if (!deviceName || !softwareVersion) {

      return;
    }

    // Use admin input for username if username is "admin", otherwise use the authContext username
    const apiUsername = role === "[ROLE_ADMIN]" ? inputUsername : username;

    try {
      // Make an API request to register the device using axios
      const response = await axios.post(`http://localhost:8080/devices/create/${apiUsername}/${deviceName}`, {
        "configuration":[ipAddress,ram,macAddress,softwareVersion,transport]
      });

      // If the response status is 200, it means registration was successful
      setToastMessage("Device added successfully");
      setDeviceName(""); // Reset device name field
      setIpAddress(""); // Reset IP address field
      setRam(""); // Reset RAM field
      setMacAddress(""); // Reset MAC address field
      setSoftwareVersion(""); // Reset software version field
      setTransport(""); // Reset transport field
    } catch (error) {
      setErrorMessages({ generalMsg: "An error occurred. Please try again." });
      setToastMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Nav />
      <p className='m-10 text-white cursor-pointer hover:text-gray-300 w-32' onClick={handleBack}> &lt; Back to devices</p>
      <div className="p-11 bg-slate-900 rounded-2xl w-2/5 mt-10 mx-auto flex flex-col gap-7">
        <h3 className="text-center text-2xl font-sans text-white">Add Device</h3>
        <form className="flex flex-col gap-6" onSubmit={handleAdd}>
          <label className="text-slate-100">
            Device Name
            <input
              type="text"
              className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
          </label>
          {errorMessages.deviceNameMsg && <p className="text-red-500">{errorMessages.deviceNameMsg}</p>}

          <label className="text-slate-100">
            IP Address
            <input
              type="text"
              className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
          </label>
          {errorMessages.ipAddressMsg && <p className="text-red-500">{errorMessages.ipAddressMsg}</p>}

          <label className="text-slate-100">
            RAM
            <select
              className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
              value={ram}
              onChange={(e) => setRam(e.target.value)}
            >
              <option value="">Select RAM</option>
              <option value="4GB">4GB</option>
              <option value="6GB">6GB</option>
            </select>
          </label>
          {errorMessages.ramMsg && <p className="text-red-500">{errorMessages.ramMsg}</p>}

          <label className="text-slate-100">
            MAC Address
            <input
              type="text"
              className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
              value={macAddress}
              onChange={(e) => setMacAddress(e.target.value)}
            />
          </label>
          {errorMessages.macAddressMsg && <p className="text-red-500">{errorMessages.macAddressMsg}</p>}

          <label className="text-slate-100">
            Software Version
            <input
              type="text"
              className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
              value={softwareVersion}
              onChange={(e) => setSoftwareVersion(e.target.value)}
            />
          </label>
          {errorMessages.softwareVersionMsg && <p className="text-red-500">{errorMessages.softwareVersionMsg}</p>}

          {/* Conditionally render the username input field if the user is admin */}
          {role === "[ROLE_ADMIN]" && (
            <label className="text-slate-100">
              Username
              <select
                className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
              >
                <option value="">Select Username</option>
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

          <label className="text-slate-100">
            Transport
            <select
              className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
            >
              <option value="">Select Transport</option>
              <option value="sdh">SDH</option>
              <option value="otn">OTN</option>
              <option value="dwdm">DWDM</option>
            </select>
          </label>
          {errorMessages.transportMsg && <p className="text-red-500">{errorMessages.transportMsg}</p>}

          {/* Display general error message */}
          {errorMessages.generalMsg && <p className="text-red-500">{errorMessages.generalMsg}</p>}

          <button
            type="submit"
            className="mt-3 mb-2 mx-auto w-1/2 justify-center items-center text-white p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Conditionally render the Toast admin at the bottom of the page */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </>
  );
};

export default AddDevice;
