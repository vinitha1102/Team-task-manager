import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import TaskItem from "../components/TaskItem";

const UserDashboard = ({ user }) => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/my-tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Welcome, {user.username}</h2>
      <h3 className="text-xl font-medium mb-2">Your Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} token={token} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
