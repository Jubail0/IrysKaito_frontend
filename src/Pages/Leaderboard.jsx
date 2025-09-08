// src/components/Leaderboard.js
import { useState, useEffect } from "react";
import { FaCrown, FaSpinner, FaFire, FaGift } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";

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
        <FaSpinner className="animate-spin text-4xl text-[#51FFD6]" />
      </div>
    );

  if (alltime.length === 0)
    return (
      <div className="text-center py-10 text-gray-400">
        No leaderboard data available yet 🚀
      </div>
    );

  // Colors for top 3
  const badgeColors = [
    "bg-yellow-500 text-black",
    "bg-gray-400 text-black",
    "bg-orange-500 text-black",
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 font-sans px-4">
      {/* Responsive 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leaderboard (Left side) */}
        <div className="bg-[#242526] p-6 rounded-2xl shadow-lg text-white border border-gray-700">
          <h2 className="text-2xl font-bold tracking-wide text-[#51FFD6] mb-6 flex items-center">
            <FaCrown className="mr-2 text-yellow-400 drop-shadow-md" /> All-Time
            Leaderboard
          </h2>

          <ul className="space-y-3">
            {alltime.map((u, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex justify-between items-center py-3 px-4 rounded-xl 
                  border border-gray-700 hover:bg-[#2c2d2f] transition duration-200
                  ${i < 3 ? "bg-opacity-80" : ""}`}
              >
                {/* Rank + Username */}
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 flex items-center justify-center rounded-full font-bold ${
                      i < 3 ? badgeColors[i] : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-white font-semibold">@{u.username}</span>
                </div>

                {/* Score + Streak */}
                <div className="flex items-center gap-4">
                  <span className="text-[#51FFD6] font-bold">{u.score}</span>
                  {u.streak !== undefined && (
                    <span className="flex items-center gap-1 font-semibold bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text">
                      <FaFire className="text-orange-400" /> {u.streak}
                    </span>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Rewards Card (Right side) */}
        <div className="bg-[#1f2022] p-6 rounded-2xl shadow-lg border border-gray-700 text-white h-fit">
          <h3 className="text-xl font-bold flex items-center gap-2 text-[#51FFD6] mb-4">
            <FaGift className="text-pink-400" /> Weekly Rewards
          </h3>

          <p className="text-gray-300 mb-2">
            <span className="font-semibold text-[#51FFD6]">
              Total weekly rewards:{" "}
            </span>
            2 IRYS test tokens
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold text-[#51FFD6]">
              Qualifying participants:{" "}
            </span>
            Top 10
          </p>
        

          <ul className="space-y-2 text-sm">
            <li>
              🥇 1st place → <span className="font-bold">0.40 IRYS</span>
            </li>
            <li>
              🥈 2nd place → <span className="font-bold">0.30 IRYS</span>
            </li>
            <li>
              🥉 3rd place → <span className="font-bold">0.25 IRYS</span>
            </li>
            <li>4th place → 0.20 IRYS</li>
            <li>5th place → 0.15 IRYS</li>
            <li>6th–10th place → 0.14 IRYS each (total 0.70)</li>
          </ul>
            <p className="text-orange-400 mb-4 italic">
            Extra bonus 🎉 for whoever maintains the highest streak!
          </p>
        </div>
      </div>
    </div>
  );
}
