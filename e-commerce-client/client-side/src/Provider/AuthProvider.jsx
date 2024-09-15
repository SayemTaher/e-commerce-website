import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create the AuthContext
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem("token") || null); 

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const userInfo = JSON.parse(storedUser); 
        setUser(userInfo); 
        setToken(token); 
      } catch (error) {
        console.error("Failed to parse user data:", error);
        
        localStorage.removeItem("user");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user)); 

        setToken(token); 
        setUser(user);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // Register function
  const registerUser = async (userInfo) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        userInfo
      );

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token); 
        localStorage.setItem("user", JSON.stringify(user)); 

        setToken(token);
        setUser(user);
      }

      return response.data;
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const contextValue = {
    user,
    token,
    login,
    registerUser,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
