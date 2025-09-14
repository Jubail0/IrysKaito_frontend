import React, { useRef, useState } from "react";
import {
  FaDownload,
  FaWallet,
} from "react-icons/fa";
import { toPng } from "html-to-image";
import { themes } from '../../../Config/themes.js'
import { handleUpload } from "../../../Handlers/handleuploads.js";
import { walletConnect } from "../../../Web3/walletConnection.js";
import YapperCard from "./YapperCard.jsx";

const YappersProfile = ({
  user,
  timeframe,
  setAddress,
  connected,
  setConnected,
}) => {
  const statsRef = useRef(null);
  const [uploadLoading, setuploadLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [theme, setTheme] = useState("classic");


  if (!user) return null;


 const validateAndLoadImage = (file) => {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
  alert("Please upload a valid image file (jpg, png, etc).");
  return;
}

  // Limit size (10MB = 10 * 1024 * 1024)
  if (file.size > 5 * 1024 * 1024) {
    alert("Please upload an image smaller than 10MB.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => setUploadedImage(ev.target.result);
  reader.readAsDataURL(file);
};

  const downloadCard = () => {
    if (!uploadedImage) {
      alert("Please upload a profile image before downloading the card.");
      return;
    }
const node = document.getElementById("card-wrapper");
    toPng(node, {
      cacheBust: true,
      pixelRatio: 2,
      skipAutoScale: true,
      filter: (node) => !node.dataset?.html2canvasIgnore,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${user.username}_yapper_card.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Oops, something went wrong!", err));
  };


  const stats = [
    { label: "Likes", value: user.total_likes },
    { label: "Retweets", value: user.total_retweets },
    { label: "Tweets", value: user.tweet_counts },
    { label: "Bookmarks", value: user.total_bookmarks },
    { label: "Impressions", value: user.total_impressions },
    { label: "Rank", value: user.rank },
  ];



  return (
    <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-center md:items-start">
      {/* Left side - Card + Buttons */}
      <div className="flex flex-col items-center">
<div
  id="card-wrapper"
  className="rounded-3xl overflow-hidden"
  style={{ clipPath: "inset(0 round 1.5rem)" }}
>
        <YapperCard
        theme ={theme}
        themes = {themes}
        stats = {stats}
        statsRef = {statsRef}
        uploadedImage = {uploadedImage}
        validateAndLoadImage = {validateAndLoadImage}
        setUploadedImage={setUploadedImage}
        user={user}
        
        /> 

</div>

        {/* Buttons */}
        <button
          onClick={downloadCard}
          data-html2canvas-ignore="true"
          className="mt-3 transition px-5 py-2 rounded-full font-semibold shadow-md flex items-center justify-center gap-2 w-72 bg-yellow-500 hover:bg-yellow-600 text-gray-900"
        >
          <FaDownload /> Download Card
        </button>
<div className="hidden md:block w-full">
        {!connected ? (
          <button
            onClick={()=>walletConnect(setAddress, setConnected)}
            data-html2canvas-ignore="true"
            className="mt-2 transition px-5 py-2 rounded-full font-semibold shadow-md flex items-center justify-center gap-2 w-72 bg-yellow-500 hover:bg-yellow-600 text-gray-900"
          >
            <FaWallet /> Connect wallet to upload
          </button>
        ) : (
          <button
            onClick={() => handleUpload(user, setuploadLoading, timeframe, theme)}
            data-html2canvas-ignore="true"
            className="mt-2 transition px-5 py-2 rounded-full font-semibold shadow-md flex items-center justify-center gap-2 w-72 bg-yellow-500 hover:bg-yellow-600 text-gray-900"
          >
            <FaDownload /> {uploadLoading ? "Uploading" : "Upload"}
          </button>
        )}
      </div> </div>

      {/* Right side - Template Selection */}
      <div className="hidden md:block  flex-1 bg-white rounded-xl shadow-md p-5">
        <h2 className="text-lg font-bold mb-3">Choose Template</h2>
       <div className="grid grid-cols-2 gap-3">
  {Object.keys(themes).map((themeKey) => (
    <button
      key={themeKey}
      onClick={() => setTheme(themeKey)}
      className={`rounded-lg border-2 p-3 ${
        theme === themeKey ? "border-yellow-500" : "border-gray-300"
      }`}
    >
      <div
        className={`w-full h-16 sm:h-20 rounded bg-gradient-to-r ${themes[themeKey].top}`}
      />
      <p className="text-xs sm:text-sm mt-1 capitalize">{themeKey}</p>
    </button>
  ))}
</div>

      </div>
    </div>
  );
};

// Custom styles for clip-path & shimmer
const style = document.createElement("style");
style.innerHTML = `
  .clip-path-card {
    clip-path: polygon(0 0, 50% 20%, 100% 0, 100% 100%, 0 100%);
  }

  .holo-shimmer {
    position: absolute;
    top: 0;
    left: -150%;
    width: 250%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent 0%,
      rgba(255,255,255,0.3) 40%,
      rgba(255,255,255,0.6) 50%,
      transparent 60%
    );
    animation: shimmer 8s infinite linear;
    mix-blend-mode: overlay;
    pointer-events: none;
    border-radius: inherit;
  }

  @keyframes shimmer {
    0% { transform: translateX(0); }
    100% { transform: translateX(100%); }
  }
`;
document.head.appendChild(style);

export default YappersProfile;


