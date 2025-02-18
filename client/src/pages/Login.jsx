import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext"; // Import the Auth context

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    usernameOrEmailMsg: "",
    passwordMsg: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth(); // Destructure login from auth context

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessages({ usernameOrEmailMsg: "", passwordMsg: "" });

    // Validate input
    if (!usernameOrEmail || !password) {
      setErrorMessages({
        usernameOrEmailMsg: usernameOrEmail ? "" : "Username/Email is required",
        passwordMsg: password ? "" : "Password is required",
      });
      return;
    }

    try {
      const data = await login(usernameOrEmail, password);

      if (data.success) {
        navigate("/home"); // Redirect to home page after successful login
      } else {
        setErrorMessages({
          usernameOrEmailMsg: data.error.usernameOrEmailMsg || "",
          passwordMsg: data.error.passwordMsg || "",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessages({ passwordMsg: "An unexpected error occurred" });
    }
  };

  const handleBacktoHome = () => {
    navigate("/"); // Navigate back to home page
  };

  return (
    <div className="bg-black h-[100vh] w-full flex flex-col overflow-hidden bg-cover bg-no-repeat">
      <p
        className="text-l text-gray-200 m-4 hover:text-[#ff00cc] cursor-pointer w-32 fixed top-3 left-2"
        onClick={handleBacktoHome}
      >
        &larr; Back to home
      </p>
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
              Username/Email
              <input
                type="text"
                className="mt-1 p-2 border border-slate-400 bg-black opacity-55 rounded-md w-full"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </label>
            {errorMessages.usernameOrEmailMsg && (
              <p className="text-red-500">{errorMessages.usernameOrEmailMsg}</p>
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
            <button
              type="submit"
              className="mt-4 mb-2 mx-auto w-1/2 justify-center items-center text-white p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Submit
            </button>
          </form>
          <p className="text-slate-300 text-center text-sm">
            Don’t have an account?&nbsp;
            <Link to="/signup" className="text-[#ff00cc]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
