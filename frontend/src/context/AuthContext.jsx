// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token) {
          const res = await axios.get("http://127.0.0.1:8000/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(res.data);

        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setUser(null);
      }
    };

    fetchProfile();
  }, [token]);

  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post("http://127.0.0.1:8000/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const accessToken = response.data.access_token;
      localStorage.setItem("token", accessToken);
      setToken(accessToken); 
      setUser({ username });// this will trigger useEffect to fetch profile
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
