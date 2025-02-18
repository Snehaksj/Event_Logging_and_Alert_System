import { createContext, useState, useContext } from "react";

// Create a Context for authentication
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true); // Update the state to indicate user is logged in
  };

  const logout = () => {
    setIsAuthenticated(false); // Update the state to indicate user is logged out
  };

  const signup = async (username, email, password) => {
    try {
      const response = await fetch("http://your-backend-url.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          isAdmin: false, // Set this based on your needs
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - return a success response
        return { success: true };
      } else {
        // If there was an error, return the error messages
        return { success: false, error: data.error || "An error occurred" };
      }
    } catch (error) {
      console.error("Error during signup:", error);
      return { success: false, error: "Network error" };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
