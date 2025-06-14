// src/components/AdminDashboard.jsx
import React from "react";
import AdminProjects from "../components/AdminProjects";
import AdminAssignTask from "../components/AdminAssignTask";
import AdminTaskComments from "../components/AdminTaskComments";

const AdminDashboard = ({ user }) => {
  return (
    <div>
      <h2>Welcome, {user.username}</h2>

      <AdminProjects />

      <h2>Assign Tasks</h2>
      <AdminAssignTask />
      <AdminTaskComments />
    </div>
  );
};

export default AdminDashboard;
