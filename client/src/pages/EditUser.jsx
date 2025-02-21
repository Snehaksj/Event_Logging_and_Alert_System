import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Nav from '../Components/Nav.jsx';
import axios from 'axios';
import Toast from '../Components/Toast.jsx'; // Import the Toast component

const EditUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    usernameMsg: "",
    passwordMsg: "",
    generalMsg: "", // Added for general error messages
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // Toast message state
  const navigate = useNavigate(); // Initialize the navigate function

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleBack = () => {
    navigate('/users'); // Navigate back to the /users page
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setErrorMessages({ usernameMsg: "", passwordMsg: "", generalMsg: "" });
  
    // Validate input
    if (!username || !password) {
      setErrorMessages({
        usernameMsg: username ? "" : "Username is required",
        passwordMsg: password ? "" : "Password is required",
      });
      return;
    }
  
    try {
      // Make an API request to register the user using axios
      const response = await axios.post("http://localhost:8080/auth/register", {
        username: username,
        password: password,
      });
  
      // If the response status is 200, it means registration was successful
      setToastMessage("Password changed successfully");
      setUsername(""); // Reset username field
      setPassword(""); // Reset password field
    } catch (error) {
      // If an error occurs, check if it's a 400 response (user already exists)
      if (error.response) {
        const data = error.response.data;
  
        if (data.message === "Username already exists") {
          setErrorMessages({ generalMsg: "Username already exists" });
          setToastMessage("Username already exists");
        } else {
          setErrorMessages({ generalMsg: "An error occurred. Please try again." });
          setToastMessage("An error occurred. Please try again.");
        }
      } else {
        // In case of network errors or unexpected issues
        setErrorMessages({ generalMsg: "An unexpected error occurred." });
        setToastMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <Nav />
      <p className='m-10 text-white cursor-pointer hover:text-pink-600 w-28' onClick={handleBack}> &larr; Back to users</p>
      <div className="m-10 p-11 h-[400px] w-96 bg-slate-900 absolute rounded-2xl top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-7">
        <h3 className="text-center text-2xl font-sans text-white">Change Password</h3>
        <form className="flex flex-col gap-6" onSubmit={handleEdit}>
          <label className="text-slate-100">
            Username
            <input
              type="text"
              className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          {errorMessages.usernameMsg && (
            <p className="text-red-500">{errorMessages.usernameMsg}</p>
          )}
          <label className="text-slate-100 relative">
            Password
            <input
              type={showPassword ? "text" : "password"}
              className="mt-1 p-1 border border-gray-400 bg-black opacity-55 rounded-md w-full items-center justify-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-9 cursor-pointer max-md:top-7"
              onClick={togglePassword}
            >
              <img
                src={showPassword ? "/eye.svg" : "/eye-off.svg"}
                alt="Toggle visibility"
                width={20}
                height={20}
              />
            </span>
          </label>
          {errorMessages.passwordMsg && (
            <p className="text-red-500">{errorMessages.passwordMsg}</p>
          )}

          {/* Display general error message */}
          {errorMessages.generalMsg && (
            <p className="text-red-500">{errorMessages.generalMsg}</p>
          )}

          <button
            type="submit"
            className="mt-3 mb-2 mx-auto w-1/2 justify-center items-center text-white p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Conditionally render the Toast message at the bottom of the page */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </>
  );
};

export default EditUser;
