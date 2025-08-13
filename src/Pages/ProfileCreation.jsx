import React, { useState, useEffect } from "react";
import SearchBar from "../Components/SearchBar/Searchbar.jsx";
import ProfileCard from "../Components/Profile/Profile.jsx";
import AllStats from "../Components/Yappers/AllStats.jsx";
import SpriteAnimation from "../Animation/SpriteAnimation.jsx";

export default function ProfileCreation({
  authUsername,allStatsData,data,error,setError,timeframe,setTimeframe,fetchLoading, connected, setConnected, setAddress
}) {

  const [filteredData, setFilteredData] = useState(null);
  const [showConnect, setShowConnect] = useState(false);
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
    isUsernameValid ? setShowConnect(true) : setShowConnect(false);
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
        <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white text-center mb-5">
           Profile Card Creation
        </h1>

        <p className="text-base sm:text-md text-gray-400 text-center mb-12">
        See where you landed in the top 1,000 and rock your IRYS card like a badge of honor.
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
        {username && filteredData && 
        <ProfileCard 
        user={filteredData} 
        showConnect={showConnect} 
        timeframe={timeframe}
        setAddress ={setAddress} 
        connected ={connected} 
        setConnected = {setConnected}
        />}
      </div>
    </div>
  );
}
