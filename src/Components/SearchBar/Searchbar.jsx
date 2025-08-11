import React from "react";

// Label + value pair
const timeframeOptions = [
  { label: "7D", value: 7 },
  { label: "30D", value: 30 },
  { label: "3M", value: 90 },
  { label: "6M", value: 180 },
  { label: "12M", value: 365 },
];

export default function Searchbar({ username, setUsername, timeframe, setTimeframe, onSearch }) {

const handleTimeframeChange = (e) => {
    const numericValue = parseInt(e.target.value, 10);
    setTimeframe(numericValue);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full mb-6">
      <input
        type="text"
        placeholder="Enter username (without @)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="flex-1 px-4 py-2 rounded bg-[#1f1f1f] border w-full sm:w-auto border-[#333] text-white placeholder:text-gray-300"
      />
      
      <select
  value={timeframe}
  onChange={handleTimeframeChange}
  className="  px-4 py-2 rounded-xl border ml-2 border-gray-300 w-full sm:w-auto text-white shadow-md focus:outline-none focus:ring-2  transition-all duration-200 cursor-pointer"
>
  {timeframeOptions.map((option, idx) => (
    <option key={idx} value={option.value} className="text-gray-800">
      {option.label}
    </option>
  ))}
</select>

      <button
        onClick={onSearch}
        className="bg-teal-700 hover:bg-teal-600 text-white font-bold px-6 py-2 rounded-lg w-full sm:w-auto transition ml-2"
      >
        Search
      </button>
    </div>
  );
}