import React, { useState, useEffect } from "react";
import SearchBar from "../Components/SearchBar/Searchbar.jsx";
import ProfileCard from "../Components/Profile/Profile.jsx";
import AllStats from "../Components/Yappers/AllStats.jsx";
import SpriteAnimation from "../Animation/SpriteAnimation.jsx";

export default function ProfileCreation({authUsername,allStatsData,data,error,setError,timeframe,setTimeframe,fetchLoading}) {
  const [filteredData, setFilteredData] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [username, setUsername] = useState("");
  // ✅ Search user from loaded data

  const handleSearch = async() => {
    if (!username.trim()) return setError("Field is empty!");
    
    const user = data.find((u) => u.username.toLowerCase() === username.toLowerCase());

    if (user) {
      setFilteredData(user);
      setError("");
    } else {
      setFilteredData(null);
      setError("No yappers found");
    }

    const isUsernameValid = authUsername.toLowerCase() === username.toLowerCase(); 
    isUsernameValid ? setShowUpload(true) : setShowUpload(false);
  };


  useEffect(() => {
  if (!username.trim()) {
    setFilteredData(null);
  }
}, [username]);

  return (
    
     <div className=" w-full flex items-top justify-center px-4 py-10">
      <div className="hideInMobile">
        <SpriteAnimation />
      </div>
      <div className="w-full max-w-3xl flex flex-col items-center">
        <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white text-center mb-6">
           Profile Card Creation
        </h1>

        <p className="text-base sm:text-lg text-gray-300 text-center mb-12">
          Find out your spot in the top 1000 amplifiers and claim your profile card
        </p>

        <SearchBar
          username={username}
          setUsername={setUsername}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          onSearch={handleSearch}
        />

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {fetchLoading && <p className="text-gray-500 text-center mt-2 mb-2">Loading stats data...</p>}

        {!filteredData && <AllStats allStatsData={allStatsData}/>}
        {username && filteredData && <ProfileCard user={filteredData} showUpload={showUpload} timeframe={timeframe}/>}
      </div>
    </div>
  );
}
