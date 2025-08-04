import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./Components/SearchBar/Searchbar.jsx";
import ProfileCard from "./Components/Profile/Profile.jsx";
import AllStats from "./Components/Yappers/AllStats.jsx";

// ✅ Create a reusable Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Use the VITE_ prefix
  withCredentials: true,
});


// colors

export default function App() {
  const [username, setUsername] = useState("");
  const [timeframe, setTimeframe] = useState(7);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  const [error, setError] = useState("");
  const [allStatsData, setAllStatsData] = useState({});

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



  // ✅ Fetch data from backend
  const fetchData = async () => {
    try {
      const res = await api.get("/api/mindshare", {
        params: { timeframe },
      });

      const apiData = res.data?.top_1k_yappers;
      const allStats_data = {
        total_tweets: res.data?.total_tweets,
        total_yappers: res.data?.total_yappers,
        top_engagements: res.data?.top_engagements
      }

      if (!Array.isArray(apiData)) throw new Error("Invalid data format");

      setAllStatsData(allStats_data)
      setData(apiData);

  
    } catch (err) {
      console.error(err);
      console.log(err)
      setError("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  useEffect(() => {
  if (!username.trim()) {
    setFilteredData(null);
  }
}, [username]);

  return (
     <div className=" w-full bg-gradient-to-br from-[#51ffd6] to-white flex items-top justify-center px-4 py-10">
      <div className="w-full max-w-3xl flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 text-center">
      IRYS Amplifiers Profile Card
    </h1>
    <p className="text-base text-gray-500 mb-6 text-center">
      Find out where you rank among the top 1000 amplifiers.
    </p>

        <SearchBar
          username={username}
          setUsername={setUsername}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          onSearch={handleSearch}
        />

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        {!filteredData && <AllStats allStatsData={allStatsData}/>}
        {username && filteredData && <ProfileCard user={filteredData} timeFrame = {timeframe}/>}
      </div>
    </div>
  );
}