// src/components/AdminAssignTask.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminAssignTask = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "low",
    status: "not_started",
    project_id: "",
    user_id: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsersAndProjects = async () => {
      try {
        const [userRes, projectRes] = await Promise.all([
          axios.get("http://localhost:8000/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/admin/projects", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(userRes.data);
        setProjects(projectRes.data);
      } catch (err) {
        console.error("Error fetching users/projects", err);
      }
    };

    fetchUsersAndProjects();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/admin/tasks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Task assigned successfully!");
      setFormData({
        title: "",
        description: "",
        deadline: "",
        priority: "low",
        status: "not_started",
        project_id: "",
        user_id: "",
      });
    } catch (err) {
      console.error("Error assigning task:", err);
      setMessage("Failed to assign task.");
    }
  };

  return (
    <div>
      <h2>Assign Task to User</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
        />
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select name="project_id" value={formData.project_id} onChange={handleChange} required>
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <select name="user_id" value={formData.user_id} onChange={handleChange} required>
          <option value="">Assign to User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        <button type="submit">Assign Task</button>
      </form>
    </div>
  );
};

export default AdminAssignTask;
