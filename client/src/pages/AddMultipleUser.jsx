import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../Components/Nav.jsx';
import Toast from '../Components/Toast.jsx'; // Import Toast component

const AddMultipleUser = () => {
  const [file, setFile] = useState(null);
  const [errorMessages, setErrorMessages] = useState("");
  const [toastMessage, setToastMessage] = useState(""); // Toast message state
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/users');
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    
    // Validate file type (only Excel files allowed)
    if (uploadedFile && (uploadedFile.name.endsWith('.xlsx') || uploadedFile.name.endsWith('.xls'))) {
      setFile(uploadedFile);
      setErrorMessages(""); // Reset any previous errors
    } else {
      setErrorMessages("Please upload a valid Excel file (.xlsx or .xls).");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setErrorMessages("No file uploaded! Please select a valid Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8080/users/create-bulk", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setToastMessage("Users uploaded successfully.");
      setErrorMessages(""); // Reset any previous error messages
    } catch (error) {
      if (error.response) {
        setErrorMessages(error.response.data); // Display backend error message within the form
      } else {
        setErrorMessages("An unexpected error occurred while uploading users.");
      }
    }
  };

  return (
    <>
      <Nav />
      <p className='m-10 text-white cursor-pointer hover:text-gray-300 w-28' onClick={handleBack}> &lt; Back to users</p>
      <div className="m-10 p-11 h-[330px] w-96 bg-slate-900 absolute rounded-2xl top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-7">
        <h3 className="text-center text-2xl font-sans text-white">Add Multiple Users</h3>
        <form className="flex flex-col gap-6" onSubmit={handleUpload}>
          <label className="text-slate-100">
            Upload Excel File
            <input
              type="file"
              accept=".xlsx,.xls"
              className="mt-1 p-1 border border-slate-400 bg-black opacity-55 rounded-md w-full"
              onChange={handleFileChange}
            />
          </label>

          {/* Display any error messages */}
          {errorMessages && (
            <p className="text-red-500">{errorMessages}</p>
          )}

          <button
            type="submit"
            className="mt-2 mb-2 mx-auto w-1/2 justify-center items-center text-white p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Upload
          </button>
        </form>
      </div>

      {/* Conditionally render the Toast message at the bottom of the page for success */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </>
  );
};

export default AddMultipleUser;
