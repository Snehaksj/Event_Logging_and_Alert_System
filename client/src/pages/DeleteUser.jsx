import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Nav from '../Components/Nav.jsx';
import axios from 'axios';
import Toast from '../Components/Toast.jsx'; // Import the Toast component

const DeleteUser = () => {
  const [username, setUsername] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    usernameMsg: "",
    generalMsg: "", // Added for general error messages
  });
  const [toastMessage, setToastMessage] = useState(""); // Toast message state
  const navigate = useNavigate(); // Initialize the navigate function

  const handleBack = () => {
    navigate('/users'); // Navigate back to the /users page
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setErrorMessages({ usernameMsg: "", generalMsg: "" });
  
    // Validate input
    if (!username) {
      setErrorMessages({
        usernameMsg: "Username is required",
      });
      return;
    }
  
    try {
      // Make an API request to delete the user using axios
      const response = await axios.delete(`http://localhost:8080/auth/delete/${username}`);
  
      // If the response status is 200, it means deletion was successful
      setToastMessage("User deleted successfully");
      setUsername(""); // Reset username field
    } catch (error) {
      // If an error occurs, check if it's a 400 response (user not found)
      if (error.response) {
        const data = error.response.data;
  
        if (data.message === "User not found") {
          setErrorMessages({ generalMsg: "User not found" });
          setToastMessage("User not found");
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
      <div className="m-10 p-11 h-[300px] w-96 bg-slate-900 absolute rounded-2xl top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-7">
        <h3 className="text-center text-2xl font-sans text-white">Delete User</h3>
        <form className="flex flex-col gap-6" onSubmit={handleDelete}>
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

          {/* Display general error message */}
          {errorMessages.generalMsg && (
            <p className="text-red-500">{errorMessages.generalMsg}</p>
          )}

          <button
            type="submit"
            className="mt-3 mb-2 mx-auto w-1/2 justify-center items-center text-white p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Delete User
          </button>
        </form>
      </div>

      {/* Conditionally render the Toast message at the bottom of the page */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </>
  );
};

export default DeleteUser;
