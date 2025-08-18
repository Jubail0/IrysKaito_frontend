// src/components/Leaderboard.js
import { useState, useEffect } from "react";
import { FaCrown, FaSpinner, FaTrophy } from "react-icons/fa";
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Attach token to each request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("userJWT");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default function Leaderboard() {
  const [alltime, setAlltime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const a = await API.get("/leaderboard/ranks");
        setAlltime(a.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <FaSpinner className="animate-spin text-3xl text-[#51FFD6]" />
      </div>
    );

  // Colors for top 3 trophies
  const trophyColors = ["text-yellow-400", "text-gray-400", "text-orange-500"];

  return (
    <div className="max-w-2xl mx-auto py-10 font-sans">
      <div className="bg-[#242526] p-6 rounded-2xl shadow-md text-white">
        <h2 className="text-2xl font-bold tracking-wide text-[#51FFD6] mb-4 flex items-center">
          <FaCrown className="mr-2 text-yellow-400" /> All-Time Leaderboard
        </h2>
        <ul className="space-y-2">
          {alltime.map((u, i) => (
            <li
              key={i}
              className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0 text-lg font-medium"
            >
              <div className="flex items-center gap-2">
                <span className="text-white italic font-bold">{i + 1}. @{u.username}</span>
                {i < 3 && (
                  <FaTrophy className={`${trophyColors[i]} text-lg`} />
                )}
              </div>
              <span className="text-[#51FFD6] font-bold">{u.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
