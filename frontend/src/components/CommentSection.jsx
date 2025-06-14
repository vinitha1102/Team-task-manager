// src/components/CommentSection.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CommentSection = ({ taskId }) => {
  const { token } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/admin/tasks/${taskId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setPosting(true);
    try {
      const res = await axios.post(
        `http://localhost:8000/tasks/${taskId}/comments`,
        { text: newComment, task_id: taskId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="mt-4 border-t pt-2">
      <h3 className="font-semibold mb-2">Comments</h3>
      {loading ? (
        <p className="text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((comment) => (
            <li key={comment.id} className="border p-2 rounded bg-gray-50">
              <p>{comment.text}</p>
              <span className="text-xs text-gray-500">
                {new Date(comment.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 border rounded px-2 py-1"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={posting}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded"
          disabled={posting}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
