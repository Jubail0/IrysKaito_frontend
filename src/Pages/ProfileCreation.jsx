import React, { useState, useEffect } from "react";
import SearchBar from "../Components/SearchBar/Searchbar.jsx";
import YappersProfile from "../Components/Profile/Yappers/yappersProfile.jsx";
import BelieversProfile from "../Components/Profile/Believers/BelieversProfile.jsx";
import { motion } from "framer-motion";

export default function ProfileCreation({
  data,
  error,
  setError,
  timeframe,
  setTimeframe,
  fetchLoading,
  connected,
  setConnected,
  setAddress,
  
}) {
  const [filteredData, setFilteredData] = useState(null);
  const [username, setUsername] = useState("");
  const [yappers, setYappers] = useState(true); // default Amplifiers view

  // ✅ Search user from loaded data
  const handleSearch = () => {
    if (!username.trim()) return setError("Field is empty!");

    const user = data.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (user) {
      setFilteredData(user);
      setError("");
    } else {
      setFilteredData(null);
      setError("No yappers found");
    }
  };

  useEffect(() => {
    if (!username.trim()) {
      setFilteredData(null);
    }
  }, [username]);

  const toggleUsers = (e) => {
    const ID = e.target.id;
    return ID === "1" ? setYappers(true) : setYappers(false);
  };

  return (
    <div className="w-full flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-3xl flex flex-col items-center space-y-8">
        {/* Title Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Profile Card Creation
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto">
            Create your IRYS card and share it with the world.
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center items-center gap-6">
          <button
            id="1"
            onClick={toggleUsers}
            className={`pb-1 transition-all ${
              yappers
                ? "text-[#009689] border-b-2 border-[#009689] font-medium"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Amplifiers
          </button>
          <button
            id="2"
            onClick={toggleUsers}
            className={`pb-1 transition-all ${
              !yappers
                ? "text-[#009689] border-b-2 border-[#009689] font-medium"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Believers
          </button>
        </div>

        {/* Content Section */}
        <div className="w-full">
          {/* Amplifiers (Yappers) View */}
          {yappers && (
            <>
              <SearchBar
                username={username}
                setUsername={setUsername}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                onSearch={handleSearch}
              />

              {/* Error & Loading */}
              {error && (
                <p className="text-red-500 text-sm text-center my-3">
                  {error}
                </p>
              )}
              {fetchLoading  && (
  <p className="text-gray-400 text-sm text-center my-3 animate-pulse">
    Loading stats data...
  </p>
)}

              {/* Results */}
              {username && filteredData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <YappersProfile
                    user={filteredData}
                    timeframe={timeframe}
                    setAddress={setAddress}
                    connected={connected}
                    setConnected={setConnected}
                  />
                </motion.div>
              )}

              {/* Empty state */}
              {!username && !filteredData && (
                <p className="text-gray-500 text-center mt-6">
                  🔍 Search your username to generate your IRYS card
                </p>
              )}
            </>
          )}

          {/* Believers View */}
          {!yappers && <BelieversProfile />}
        </div>
      </div>
    </div>
  );
}
