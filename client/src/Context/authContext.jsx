import { createContext, useState, useContext } from "react";

// Create a Context for authentication
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isAdmin = false;
  // Login method
  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          isAdmin
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true); // Set authenticated status
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: "Network error" };
    }
  };

  // Logout method
  const logout = () => {
    setIsAuthenticated(false); // Update the state to indicate the user is logged out
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
