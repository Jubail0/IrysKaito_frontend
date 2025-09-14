import React, { useState, useEffect } from "react";
import { toPng } from "html-to-image";
import {
roleColors,
roleEmojis,
roleImages,
templates,
allTags,
allBios,
} from "../../../Config/themes.js";

const BelieversProfile = () => {
  const [displayName, setDisplayName] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [role, setRole] = useState("Deshi");
  const [template, setTemplate] = useState("Glassmorphism");
  const [bio, setBio] = useState("Living the IRYS dream.");
  const [tags, setTags] = useState([]);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [showFollowPrompt, setShowFollowPrompt] = useState(false);
  const [showIFollowed, setShowIFollowed] = useState(false);

  // Load follow state from localStorage
  useEffect(() => {
    const followed = localStorage.getItem("followedOnX");
    if (followed === "true") {
      setHasFollowed(true);
    }
  }, []);

  // Delay before showing "I Followed" button
  useEffect(() => {
    if (showFollowPrompt) {
      const timer = setTimeout(() => {
        setShowIFollowed(true);
      }, 10000); // 10 sec
      return () => clearTimeout(timer);
    } else {
      setShowIFollowed(false);
    }
  }, [showFollowPrompt]);

  

  const handleImageUpload = (file) => {
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

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleDownloadClick = () => {
    if (!displayName.trim()) {
      alert("⚠️ Please enter your display name before downloading.");
      return;
    }
    if (!uploadedImage) {
      alert("⚠️ Please upload a profile image before downloading.");
      return;
    }
    if (!hasFollowed) {
      setShowFollowPrompt(true);
      return;
    }
    downloadCard();
  };

  const confirmFollow = () => {
    setHasFollowed(true);
    localStorage.setItem("followedOnX", "true");
    setShowFollowPrompt(false);
    downloadCard();
  };

  const downloadCard = () => {
    const node = document.getElementById("portrait-card");
    if (!node) return;

    toPng(node, { cacheBust: true, pixelRatio: 3 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${displayName || "yapper"}_card.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Oops, something went wrong!", err));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row items-start md:items-center justify-center gap-8 p-6">
      {/* Controls */}
      <div className="w-full md:w-80 space-y-6">
        {/* Name */}
        <div>
          <label className="block mb-2 text-sm">Display Name </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your Name"
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2 text-sm">Upload Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-gradient-to-r from-[#009689] to-[#00b7a2] text-white py-2 px-4 rounded-lg shadow hover:opacity-90 inline-block"
          >
            Choose Image
          </label>
        </div>

        {/* Role */}
        <div>
          <label className="block mb-2 text-sm">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          >
            {Object.keys(roleColors).map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Template */}
        <div>
          <label className="block mb-2 text-sm">Template</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          >
            {Object.keys(templates).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-2 text-sm">Bio</label>
          <select
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          >
            {allBios.map((b, idx) => (
              <option key={idx}>{b}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-2 text-sm">Tags</label>
          <div className="flex gap-2 flex-wrap">
            {allTags.map((tag) => (
              <span
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full cursor-pointer text-xs ${
                  tags.includes(tag)
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownloadClick}
          className="w-full bg-gradient-to-r from-[#009689] to-[#00b7a2] py-2 px-4 rounded-lg font-semibold shadow hover:opacity-90"
        >
          Download Card
        </button>
      </div>

     {/* Portrait Card Preview */}
<div className="overflow-visible w-64 h-96 mx-auto">
  <div
    id="portrait-card"
    className={`relative w-full h-full flex flex-col items-center p-6 text-center 
      ${templates[template].card}`}
  >
    {/* Frames by template */}
{template === "Glassmorphism" && (
  <>
    {/* Blurred gradient blobs */}
    <div className="absolute -top-20 -left-20 w-60 h-60 bg-pink-400/30 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl"></div>

    {/* Frosted glass glow */}
    <div className="absolute inset-0 rounded-[2rem] border border-white/20 backdrop-blur-xl"></div>
    <div className="absolute inset-0 rounded-[2rem] ring-1 ring-white/40"></div>
    <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]"></div>
  </>
)}

{template === "Minimal" && (
  <>
    {/* Elegant double border */}
    <div className="absolute inset-0 rounded-[2rem] border-2 border-gray-700"></div>
    <div className="absolute inset-[6px] rounded-[1.7rem] border border-gray-600"></div>
    <div className="absolute inset-0 rounded-[2rem] shadow-md shadow-black/30"></div>
  </>
)}

{template === "Futuristic" && (
  <>
    {/* Neon tech corners */}
    <div className="absolute inset-0 rounded-[2rem] border border-indigo-700/50"></div>
    <div className="absolute inset-0 rounded-[2rem] ring-1 ring-blue-500/30"></div>

    {/* Corner accents */}
    <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-cyan-400 rounded-tl-[2rem]"></div>
    <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-fuchsia-400 rounded-tr-[2rem]"></div>
    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-purple-400 rounded-bl-[2rem]"></div>
    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-pink-400 rounded-br-[2rem]"></div>
  </>
)}

{template === "Holographic" && (
  <>
    {/* Gradient shimmer frame (unchanged) */}
    <div className="absolute inset-0 rounded-[2rem] p-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-[gradient_6s_linear_infinite]">
      <div className="w-full h-full rounded-[2rem] bg-slate-900/80"></div>
    </div>
  </>
)}


    {/* Watermark */}
    {role && roleImages[role] && (
      <img
        src={roleImages[role]}
        alt={`${role} mascot`}
        className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none select-none"
      />
    )}

    {/* Foreground Content */}
    <div className="relative z-10 flex flex-col items-center">
      {/* Avatar */}
      <div
        className={`w-28 h-28 rounded-full overflow-hidden mb-4 shadow-lg relative 
          ${templates[template].avatarRing} transition-transform duration-300 hover:scale-105`}
      >
        {uploadedImage ? (
          <img
            src={uploadedImage}
            alt="Profile"
            className="object-cover w-full h-full shadow-inner rounded-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-sm text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Name + Bio */}
      <h3 className={`text-xl mb-1 font-semibold tracking-wide ${templates[template].text}`}>
        {displayName ? `${displayName} ✧ᴗ✧` : "Your Name"}
      </h3>
      <p className={`italic mb-3 text-sm ${templates[template].text}`}>{bio}</p>

      {/* Role Badge */}
      <span
        className={`flex items-center gap-2 font-bold px-4 py-1.5 text-xs rounded-full mb-3 shadow-md ${roleColors[role]}`}
      >
        <span className="bg-white/30 text-black rounded-full w-6 h-6 flex items-center justify-center text-base">
          {roleEmojis[role]}
        </span>
        {role}
      </span>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap justify-center">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-white/90 shadow-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
</div>

{/* Modal Overlay */}
{showFollowPrompt && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    {/* Modal Box */}
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 mx-3 animate-fadeIn">
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
        Follow to Continue
      </h2>
      {/* Subtitle */}
      <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
        Please follow <span className="font-semibold">@JubailMallick</span> on X to unlock the download.
      </p>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        {/* Follow on X */}
        <a
          href="https://x.com/JubailMallick"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none sm:w-48 px-5 py-3 
                     bg-gradient-to-r from-blue-500 to-blue-600 
                     hover:from-blue-600 hover:to-blue-700 
                     text-white rounded-xl shadow-md 
                     text-center font-semibold transition-all duration-200"
        >
          🚀 Follow on X
        </a>

        {/* I Followed — Download (only shows after follow) */}
        {showIFollowed && (
          <button
            onClick={confirmFollow}
            className="flex-1 sm:flex-none sm:w-56 px-5 py-3 
                       bg-gradient-to-r from-green-500 to-green-600 
                       hover:from-green-600 hover:to-green-700 
                       text-white rounded-xl shadow-md 
                       font-semibold transition-all duration-200"
          >
            ✅ I Followed — Download
          </button>
        )}
      </div>
    </div>
  </div>
)}









</div> ); };
     
  


export default BelieversProfile;
