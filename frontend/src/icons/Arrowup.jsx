import apiClient from "../utils/apiClient";
import React, { useState } from "react";
import { useQueryClient } from "react-query";

const Arrowup = ({ id, isActive }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  const handleClick = async (e) => {
    e.preventDefault();
    if (!userId || loading) return;

    try {
      setLoading(true);
      const res = await apiClient.post(`/api/posts/${id}/upvote`, {
        userId,
      });
      if (res.status === 200) {
        // Refetch questions so counts and highlighting stay in sync
        queryClient.invalidateQueries("getAllQuestions");
        queryClient.invalidateQueries("getMyQuestions");
      }
    } catch (err) {
      if (err?.response?.status === 400) {
        alert(err.response.data?.message || "You have already upvoted");
      } else {
        console.error(err);
        alert("Failed to upvote. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <svg
      onClick={handleClick}
      xmlns="http://www.w3.org/2000/svg"
      fill={isActive ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`w-4 h-4 md:w-5 md:h-5 cursor-pointer ${
        isActive ? "text-purple-600" : "dark:text-white text-gray-700"
      } ${loading ? "opacity-60 pointer-events-none" : ""}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
      />
    </svg>
  );
};

export default Arrowup;
