import React, { useRef } from 'react';
import { FaHeart, FaTwitter, FaDownload } from "react-icons/fa";
import { toPng } from 'html-to-image';

const Profile = ({ user }) => {
  const avatarRef = useRef(null);

  if (!user) return null;

  const downloadCard = () => {
    const node = document.getElementById("profile-card");

    toPng(node, {
      cacheBust: true,
      pixelRatio: 2,
      skipAutoScale: true,
      filter: (node) => {
        // Exclude avatar and download button
        return node !== avatarRef.current && !node.dataset?.html2canvasIgnore;
      }
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${user.username}_yapper_card.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Oops, something went wrong!", err);
      });
  };

  const mindsharePercentage = (mindshare) => {
    return `Mindshare: ${(mindshare * 100).toFixed(4)}%`;
  };

  return (
    <div
      id="profile-card"
      className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 font-poppins"
    >
      {/* Banner with title */}
      <div className="relative h-24 bg-gradient-to-r from-cyan-400 to-teal-500 flex items-center justify-center">
        <h1 className="text-white text-8xl font-bold tracking-wide transform rotate-[-6deg]">Datapunks</h1>

        {/* Profile Picture */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <img
            ref={avatarRef}
            src={`https://unavatar.io/twitter/${user.username}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${user.username}&background=random`;
            }}
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg mx-auto"
          />
        </div>
      </div>

      <div className="pt-14 px-6 pb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">@{user.username}</h2>
        <p className="text-gray-500 text-sm mb-4">{mindsharePercentage(user.mindshare)}</p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
          <div className="bg-gray-50 rounded-xl p-3 shadow-sm">
            <p className="text-gray-500">Rank</p>
            <p className="font-semibold">{user.rank}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 shadow-sm">
            <p className="text-gray-500">Score</p>
            <p className="font-semibold">{parseFloat(user.raw_community_score.toFixed(2))}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 shadow-sm col-span-2">
            <p className="text-gray-500">Impressions</p>
            <p className="font-semibold">{user.total_impressions.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 shadow-sm">
            <p className="text-gray-500">Likes</p>
            <p className="font-semibold flex justify-center items-center gap-1">
              <FaHeart className="text-pink-400" /> {user.total_likes.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 shadow-sm">
            <p className="text-gray-500">Tweets</p>
            <p className="font-semibold flex justify-center items-center gap-1">
              <FaTwitter className="text-blue-400" /> {user.tweet_counts}
            </p>
          </div>
        </div>

        <button
          onClick={downloadCard}
          data-html2canvas-ignore="true"
          className="mt-2 bg-teal-500 hover:bg-teal-600 transition px-5 py-2 rounded-full text-white font-semibold shadow-md flex items-center justify-center gap-2 w-full"
        >
          <FaDownload /> Download Card
        </button>
      </div>
    </div>
  );
};

export default Profile;
