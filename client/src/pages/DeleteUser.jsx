import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Nav from '../Components/Nav.jsx';
import axios from 'axios';
import Toast from '../Components/Toast.jsx'; // Import the Toast component

const DeleteUser = () => {
  const [users, setUsers] = useState([]); // State to hold users
  const [selectedUser, setSelectedUser] = useState(""); // State for selected user
  const [errorMessages, setErrorMessages] = useState({
    selectedUserMsg: "",
    generalMsg: "", // Added for general error messages
  });
  const [toastMessage, setToastMessage] = useState(""); // Toast message state
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch users when the component mounts or after deletion
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users"); // Fetch the users list
      setUsers(response.data); // Set the fetched users
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessages({ generalMsg: "Failed to fetch users" });
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on mount
  }, []); // Empty dependency array so this only runs on mount

  const handleBack = () => {
    navigate('/users'); // Navigate back to the /users page
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setErrorMessages({ selectedUserMsg: "", generalMsg: "" });

    // Validate input
    if (!selectedUser) {
      setErrorMessages({
        selectedUserMsg: "Please select a user to delete",
      });
      return;
    }

    try {
      // Make an API request to delete the user using axios
      const response = await axios.delete("http://localhost:8080/users/delete", {
        data: { username: selectedUser }, // Pass the username as part of the request body
      });

      // If the response status is 200, it means deletion was successful
      setToastMessage("User deleted successfully");
      setSelectedUser(""); // Reset selected user field
      fetchUsers(); // Refetch users after deletion
    } catch (error) {
      // Check if error.response exists (i.e., if the server responded with an error)
      if (error.response) {
        const data = error.response.data;
        if (data.message === "Username does not exist") {
          setErrorMessages({ generalMsg: "Username does not exist" });
        } else {
          setErrorMessages({ generalMsg: "An error occurred. Please try again." });
        }
      } else {
        // If no response was received (network error or other issues)
        setErrorMessages({ generalMsg: "An unexpected error occurred." });
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
            Select User
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
            >
              <option value="">-- Select User --</option>
              {users.map((user) => (
                <option key={user.username} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
          </label>
          {errorMessages.selectedUserMsg && (
            <p className="text-red-500">{errorMessages.selectedUserMsg}</p>
          )}

          {/* Display general error message */}
          {errorMessages.generalMsg && (
            <p className="text-red-500">{errorMessages.generalMsg}</p>
          )}

          <button
            type="submit"
            className="mt-2 mb-2 mx-auto w-1/2 justify-center items-center text-white p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
