// src/components/AdminTaskComments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminTaskComments = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const fetchComments = async (taskId) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/admin/tasks/${taskId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedTaskId(taskId);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  return (
    <div>
      <h2>Admin: View Task Status & Comments</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.status} (User ID: {task.user_id})
            <button onClick={() => fetchComments(task.id)}>View Comments</button>
          </li>
        ))}
      </ul>

      {selectedTaskId && (
        <div style={{ marginTop: "20px" }}>
          <h3>Comments for Task #{selectedTaskId}</h3>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>{comment.text}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTaskComments;
