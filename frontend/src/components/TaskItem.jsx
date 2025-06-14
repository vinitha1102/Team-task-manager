// src/components/TaskItem.jsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const TaskItem = ({ task }) => {
  const { token } = useAuth();
  const [status, setStatus] = useState(task.status);
  const [commentText, setCommentText] = useState("");
  const [commentBoxVisible, setCommentBoxVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await axios.put(
        `http://localhost:8000/tasks/${task.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    setSubmitting(true);
    setSubmitMessage("");

    try {
      await axios.post(
        `http://localhost:8000/tasks/${task.id}/comments`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitMessage("Comment submitted!");
      setCommentText("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
      setSubmitMessage("Failed to submit comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ border: "1px solid white", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
      <h4>{task.title}</h4>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p>
        <strong>Status:</strong>
        <select value={status} onChange={handleStatusChange} style={{ marginLeft: "0.5rem" }}>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </p>

      <button
        onClick={() => setCommentBoxVisible(!commentBoxVisible)}
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "0.5rem 1rem",
          marginTop: "0.5rem",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        {commentBoxVisible ? "Hide Comment" : "Leave Comment"}
      </button>

      {commentBoxVisible && (
        <div style={{ marginTop: "0.5rem" }}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows="3"
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
            placeholder="Enter your comment"
          />
          <br />
          <button
            onClick={handleCommentSubmit}
            disabled={submitting}
            style={{
              backgroundColor: "#0a84ff",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {submitting ? "Submitting..." : "Submit Comment"}
          </button>
          {submitMessage && <p style={{ marginTop: "0.5rem" }}>{submitMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
