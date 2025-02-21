import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext"; // Import the Auth context

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    usernameMsg: "",
    passwordMsg: "",
    generalMsg: "", // Added for general error messages
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth(); // Destructure login and isAuthenticated from auth context

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
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
      const data = await login(username, password);
      
      if (data.success) {
        navigate("/dashboard"); // Redirect to home page after successful login
      } else {
        setErrorMessages({
          generalMsg: data.error || "Login failed", // Set the general error message
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessages({ generalMsg: "An unexpected error occurred" });
    }
  };

  return (
    <div className="bg-black h-[100vh] w-full flex flex-col overflow-hidden bg-cover bg-no-repeat">
      <div className="flex h-full justify-center items-center">
        <div
          className="bg-black bg-opacity-60 p-10 rounded-xl flex flex-col gap-5 max-w-md w-full mx-4"
          style={{
            filter: "drop-shadow(0 0 70px rgb(101, 47, 231))",
          }}
        >
          <h3 className="text-3xl text-slate-100 font-medium text-center p-5 max-md:text-2xl max-md:p-2">
            Login
          </h3>
          <form
            className="flex flex-col gap-4 text-sm max-md:text-xs"
            onSubmit={handleLogin}
          >
            <label className="text-slate-100">
              Username
              <input
                type="text"
                className="mt-1 p-2 border border-slate-400 bg-black opacity-55 rounded-md w-full"
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
                className="mt-1 p-2 border border-gray-400 bg-black opacity-55 rounded-md w-full"
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
              className="mt-4 mb-2 mx-auto w-1/2 justify-center items-center text-white p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
