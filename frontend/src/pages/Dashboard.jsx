import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard"; 
import UserDashboard from "./UserDashboard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { logout } = useAuth();
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get("http://localhost:8000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

      fetchProfile();
    
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Unauthorized or failed to load user.</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} style={{ height: "2rem" }}>
          Logout
        </button>
      </div>
        {user.is_admin ? <AdminDashboard user={user} /> : <UserDashboard user={user} />}
    </div>
  );
};

export default Dashboard;
