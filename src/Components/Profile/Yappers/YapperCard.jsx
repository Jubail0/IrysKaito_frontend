import React from 'react'
import { motion } from "framer-motion";

function YapperCard({theme,themes, stats,statsRef, uploadedImage, validateAndLoadImage, setUploadedImage, user }) {

const mindsharePercentage = (mindshare) => `Mindshare: ${(mindshare * 100).toFixed(4)}%`;

const getRankLabel = (rank) => {
  if (rank <= 10) return "Legendary";
  if (rank <= 100) return "Elite";
  if (rank <= 500) return "Pro";
  if (rank <= 1000) return "Rising";
  return "Challenger";
};

  return (
<motion.div
  id="profile-card"
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
  className={`relative w-72 h-[520px] min-h-[520px] bg-gradient-to-b ${themes[theme].bg} bg-cover bg-blend-overlay rounded-3xl shadow-2xl border-4 overflow-hidden font-poppins`}
  style={{
    borderRadius: "1.5rem", // force inline radius for mobile renderers
    overflow: "hidden"      // ensures children don’t bleed outside
  }}
>

          {/* Holographic shimmer overlay */}
          <div className="holo-shimmer" data-html2canvas-ignore="true"></div>

          {/* Decorative top shape */}
          <div
            className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-r ${themes[theme].top} clip-path-card`}
          />

          {/* Content */}
          <div className="relative z-10 p-5 flex flex-col items-center">
            {/* Rating & Rank Label */}
            <div className="absolute top-6 left-6 text-center">
              <h2 className={`text-3xl font-extrabold ${themes[theme].text}`}>
                {user.rank || 86}
              </h2>
              <p className={`text-sm font-semibold ${themes[theme].text}`}>
                {getRankLabel(user.rank)}
              </p>
            </div>

            {/* Nationality & Club */}
            <div className="absolute top-6 right-6 text-right">
              <div className={`text-xl italic ${themes[theme].text}`}>
                IRYS
              </div>
              <p className={`text-xs ${themes[theme].text}`}>Club</p>
            </div>

            {/* Avatar Upload */}
            <div className="mt-12 mb-3 relative">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="avatar"
                    className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center rounded-full border-4 border-dashed border-gray-400 bg-gray-100 text-4xl text-gray-500">
                    ➕
                  </div>
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => validateAndLoadImage(e.target.files[0])}
              />
            </div>

            {/* Player Name */}
            <h3
              className={`text-xl font-bold tracking-wide ${themes[theme].text}`}
            >
              @{user.username}
            </h3>
            <p
              className={`text-sm mb-1 font-semibold ${themes[theme].text}`}
            >
              {mindsharePercentage(user.mindshare)}
            </p>
            <p
              className={`text-xs italic mb-3 ${themes[theme].text}`}
            >
              Proof of Voice!
            </p>

            {/* Stats Section */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-y-4 gap-x-2 w-full mt-2"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span
                    className={`text-lg font-extrabold ${themes[theme].text}`}
                  >
                    {stat.value}
                  </span>
                  <span
                    className={`text-xs font-medium ${themes[theme].text}`}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
  )
}


export default YapperCard

