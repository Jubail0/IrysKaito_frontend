import React, { useState } from "react";

const Filteration = ({ profiles, setProfiles, currentUserAddress }) => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const[oldProfiles, setOldProfiles] = useState([]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setOldProfiles(profiles);

    if (filter === "ALL") {
      setProfiles(oldProfiles); // Show all
    } else if (filter === "ME") {
      const filtered = profiles.filter(
        (p) => p.profile.uploadedBy?.toLowerCase() === currentUserAddress?.toLowerCase()
      );
      setProfiles(filtered);
    }

    
  };

  return (
   <div className="flex gap-2">
  <button
    className={`px-4 py-1 rounded-md border font-bold transition-all ${
      activeFilter === "ALL"
        ? "bg-teal-700 text-white border-[#34C9A7]"
        : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
    }`}
    onClick={() => handleFilterChange("ALL")}
  >
    ALL
  </button>

  <button
    className={`px-4 py-1 rounded-md border font-bold transition-all ${
      activeFilter === "ME"
        ? "bg-teal-700 text-white border-[#34C9A7]"
        : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
    }`}
    onClick={() => handleFilterChange("ME")}
  >
    Me
  </button>
</div>

  );
};

export default Filteration;
