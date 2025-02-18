import { createContext, useState, useContext } from "react";

// Create a Context for authentication
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await fetch("http://your-backend-url.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - save user session (could be token, etc.) and return success
        setIsAuthenticated(true); // Set authenticated status
        return { success: true };
      } else {
        // If there was an error, return the error messages
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    setIsAuthenticated(false); // Update the state to indicate user is logged out
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
