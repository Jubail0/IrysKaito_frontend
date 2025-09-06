import React, { useRef, useState } from 'react';
import { FaHeart, FaTwitter, FaDownload, FaBookmark, FaRetweet, FaRegEye,FaWallet } from "react-icons/fa";
import { GiArtificialHive } from "react-icons/gi";
import { HiOutlineChartBar } from "react-icons/hi";
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import { handleUpload } from '../../Handlers/handleuploads.js';
import { ethers } from 'ethers';
import axios from 'axios';

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
  });

const themes = {
  classic: {
    card: "bg-white border border-gray-200",
    banner: "bg-gradient-to-r from-cyan-400 to-teal-500",
    statBlock: "bg-gray-50",
    mindshareText: "text-[#009689]",
    statLabel: "text-gray-500",
    statValue: "text-gray-800",
    button: "bg-teal-500 hover:bg-teal-600 text-white"
  },
  vibrant: {
    card: "bg-gradient-to-br from-blue-100 via-white to-purple-100 border border-gray-300",
    banner: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
    statBlock: "bg-gradient-to-tr from-white via-indigo-50 to-white",
    mindshareText: "text-purple-600",
    statLabel: "text-gray-600",
    statValue: "text-indigo-700",
    button: "bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white"
  },
  dark: {
    card: "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 border border-gray-600",
    banner: "bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-900",
    statBlock: "bg-gray-700",
    mindshareText: "text-yellow-300",
    statLabel: "text-gray-300",
    statValue: "text-yellow-100",
    button: "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
  }
};




const Profile = ({ user, showConnect, timeframe, setAddress, connected, setConnected}) => {
  const avatarRef = useRef(null);
  const statsRef = useRef(null);
  const [themeKey, setThemeKey] = useState('classic');
  const themeKeys = Object.keys(themes);
  const theme = themes[themeKey];
  const [uploadLoading, setuploadLoading] = useState(false)

  if (!user) return null;

  const toggleTheme = () => {
    const currentIndex = themeKeys.indexOf(themeKey);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setThemeKey(themeKeys[nextIndex]);
  };

  const downloadCard = () => {
    const avatar = avatarRef.current;
    if (avatar) avatar.style.display = 'none';

    const stats = statsRef.current;
    if (stats) stats.style.marginTop = '-1rem';
     stats.style.marginBottom = '-2rem';
    const node = document.getElementById("profile-card");
    toPng(node, {
      cacheBust: true,
      pixelRatio: 2,
      skipAutoScale: true,
      filter: (node) => {
        return node !== avatarRef.current && !node.dataset?.html2canvasIgnore;
      }
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${user.username}_yapper_card.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Oops, something went wrong!", err))
      .finally(() => {
        if (avatar) avatar.style.display = 'block';
        if (stats) stats.style.marginTop = '';
         stats.style.marginBottom = '';
      });
  };

  const mindsharePercentage = (mindshare) => `Mindshare: ${(mindshare * 100).toFixed(4)}%`;

    const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const ExistingToken = localStorage.getItem("userJWT"); // the JWT you got from X login
       if (!ExistingToken) {console.error("X is not connected");
        return;
}
      const res = await api.post('/auth/link-wallet', {
        walletAddress: userAddress,
      },{
        headers: {
        Authorization: `Bearer ${ExistingToken}`
    }
      });
      const { token } = res.data;
      localStorage.setItem("userJWT", token);

       const payload = JSON.parse(atob(token.split(".")[1]));
       setAddress(payload.walletAddress);
       setConnected(true);

    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  return (
    <motion.div
      id="profile-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`rounded-3xl shadow-2xl w-full max-w-md overflow-hidden font-poppins ${theme.card}`}
    >
      <div className={`relative h-24 flex items-center justify-center ${theme.banner}`}>
        <motion.h1
          className="text-white text-6xl font-bold tracking-wide transform rotate-[-6deg] drop-shadow-lg"
          animate={{ rotate: [-6, 6, -6], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          Datapunks
        </motion.h1>

        <div className="absolute top-2 right-3 z-20">
          <button
            onClick={toggleTheme}
            data-html2canvas-ignore="true"
            className="bg-white bg-opacity-30 text-black border border-white rounded-full px-3 py-1 text-xs font-semibold hover:bg-opacity-50"
          >
            Toggle Theme
          </button>
        </div>

        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <img
            ref={avatarRef}
            src={`https://unavatar.io/twitter/${user.username}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${user.username}&background=random`;
            }}
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-white shadow-xl mx-auto"
          />
        </div>
      </div>

      <div className="pt-14 px-6 pb-6 text-center" ref={statsRef}>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">@{user.username}</h2>
        <p className={`text-sm mb-4 font-semibold ${theme.mindshareText}`}>{mindsharePercentage(user.mindshare)}</p>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          {[
            { label: 'Rank', icon: <HiOutlineChartBar className="text-yellow-500" />, value: user.rank },
            { label: 'Score', icon: null, value: user?.raw_community_score != null
    ? parseFloat(user.raw_community_score.toFixed(2))
    : 0  },
            { label: 'Impressions', icon: <FaRegEye className="text-blue-500" />, value: user.total_impressions.toLocaleString(), span: true },
            { label: 'Likes', icon: <FaHeart className="text-pink-500" />, value: user.total_likes.toLocaleString() },
            { label: 'Tweets', icon: <FaTwitter className="text-blue-400" />, value: user.tweet_counts },
            { label: 'Smart Engagements', icon: <GiArtificialHive className="text-purple-600" />, value: user.total_smart_engagements, span: true },
            { label: 'Retweets', icon: <FaRetweet className="text-green-500" />, value: user.total_retweets },
            { label: 'Bookmarks', icon: <FaBookmark className="text-yellow-500" />, value: user.total_bookmarks },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className={`${theme.statBlock} rounded-xl p-3 shadow-md hover:shadow-lg transition ${stat.span ? 'col-span-2' : ''}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <p className={`${theme.statLabel} font-medium`}>{stat.label}</p>
              <p className={`font-semibold flex justify-center items-center gap-1 ${theme.statValue}`}>
                {stat.icon} {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <button
          onClick={downloadCard}
          data-html2canvas-ignore="true"
          className={`mt-2 transition px-5 py-2 rounded-full font-semibold shadow-md flex items-center justify-center gap-2 w-full ${theme.button}`}
        >
          <FaDownload /> Download Card
        </button>

    
  
    {/* Connect Wallet Button */}
 { (showConnect && !connected) && <button
      onClick={connectWallet}
      data-html2canvas-ignore="true"
      className={`mt-2 transition px-5 py-2 rounded-full font-semibold shadow-md flex items-center justify-center gap-2 w-full ${theme.button}`}
    >
      <FaWallet /> Connect Wallet
    </button>}

    {/* Upload Button */}
  { connected && <button
      onClick={() => handleUpload(user, setuploadLoading, timeframe)}
      data-html2canvas-ignore="true"
      className={`mt-2 transition px-5 py-2 rounded-full font-semibold shadow-md flex items-center justify-center gap-2 w-full ${theme.button}`}
    >
      <FaDownload /> {uploadLoading ? "uploading..." : "Upload To IRYS"}
    </button>}


      </div>
    </motion.div>
  );
};

export default Profile;
