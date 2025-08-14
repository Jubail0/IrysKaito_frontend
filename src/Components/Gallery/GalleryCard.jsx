import React, { useRef, useEffect } from "react";
 import gsap from "gsap";
 import { ScrollTrigger } from "gsap/ScrollTrigger";

 gsap.registerPlugin(ScrollTrigger);

 const GalleryCard =({item})=> {
   const cardRef = useRef(null);

   useEffect(() => {
     const el = cardRef.current;

     gsap.fromTo(
       el,
       { opacity: 0, y: 80 }, // start lower
       {
         opacity: 1,
         y: 0,
         duration: 0.8,
         ease: "power3.out",
         scrollTrigger: {
           trigger: el,
           start: "top 85%", // when entering from bottom
           end: "top 20%", // when near top
           scrub: true, // ties animation to scroll
           onLeave: () => {
             gsap.to(el, { opacity: 0, y: -80, duration: 0.6, ease: "power3.in" });
           },
           onEnterBack: () => {
             gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
           },
           onLeaveBack: () => {
             gsap.to(el, { opacity: 0, y: 80, duration: 0.6, ease: "power3.in" });
           }
         }
       }
     );
   }, []);

  const mindsharePercentage = (mindshare) => `Mindshare: ${(mindshare * 100).toFixed(4)}%`;

  function formatUTCDate(isoString) {
  const date = new Date(isoString);
   return date.toLocaleString("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }) + " UTC";
}


function formatDuration(value) {
  switch (value) {
    case 7:
      return '7D';
    case 30:
      return '30D';
    case 90:
      return '3M';
    case 180:
      return '6M';
    case 365:
      return '12M';
    default:
      return `${value}D`; // fallback
  }
}


   return (
    <div
  ref={cardRef}
  className="bg-gradient-to-b from-[#1b1b1b] to-[#131313] p-5 rounded-2xl shadow-md border border-gray-800 hover:border-[#51FFD6] hover:shadow-lg hover:shadow-[#51FFD633] transition-all duration-300"
>
  {/* Profile Picture */}
  <div className="flex justify-center mb-4">
    <img
      src={`https://unavatar.io/x/${item.profile?.username}`}
      alt="avatar"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `https://ui-avatars.com/api/?name=${item.profile?.username}&background=random`;
      }}
      className="w-20 h-20 rounded-full border-2 border-[#51FFD6] object-cover shadow-md hover:scale-105 transition-transform duration-300"
    />
  </div>

  {/* Username */}
  <h3 className="text-xl font-semibold mb-1 text-gray-100 text-center">
    <a
      href={`https://twitter.com/${item.profile?.username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-[#51FFD6] transition-colors duration-200"
    >
      @{item.profile.username}
    </a>
  </h3>

  {/* Rank and Score */}
 <p className="text-sm text-center mb-3 mt-2">
  <span className="px-3 py-1 bg-[#2a2a2a] rounded-full border border-gray-700 shadow-sm">
    <span className="text-[#51FFD6] font-semibold">Rank:</span> #{item.profile?.rank} &nbsp;|&nbsp; 
    <span className="text-[#FFB74D] font-semibold">{mindsharePercentage(item.profile?.mindshare)}</span> &nbsp;|&nbsp; 
    <span className="text-[#4FC3F7] font-semibold">Score:</span> {parseFloat(item.profile?.score).toFixed(2)}
  </span>
</p>

  {/* Stats */}
  <ul className="mb-4 space-y-1 text-sm text-gray-300">
    <li className="flex justify-between">
      <span className="text-gray-400">Timeframe</span>
      <span>{formatDuration(item.profile?.stats.timeframe)}</span>
    </li>
    <li className="flex justify-between">
      <span className="text-gray-400">Likes</span>
      <span>{item.profile?.stats.likes}</span>
    </li>
    <li className="flex justify-between">
      <span className="text-gray-400">Tweets</span>
      <span>{item.profile?.stats.tweets}</span>
    </li>
    <li className="flex justify-between">
      <span className="text-gray-400">Quotes</span>
      <span>{item.profile?.stats.quoteTweets.toLocaleString()}</span>
    </li>
    <li className="flex justify-between">
      <span className="text-gray-400">Bookmarks</span>
      <span>{item.profile?.stats.bookmarks}</span>
    </li>
    <li className="flex justify-between">
      <span className="text-gray-400">Impressions</span>
      <span>{item.profile?.stats.impressions.toLocaleString()}</span>
    </li>
    <li className="flex justify-between">
      <span className="text-gray-400">Smart Engagements</span>
      <span>{item.profile?.stats.smartEngagements.toLocaleString()}</span>
    </li>
    <li className="flex justify-between">
      <span className="text-gray-400">Community Engagements</span>
      <span>{item.profile?.stats.total_comm_engage.toLocaleString()}</span>
    </li>
  </ul>

  {/* Uploaded Date */}
  <p className="text-xs text-gray-500 text-center">
    Uploaded on: {formatUTCDate(item.profile?.uploadedAt)}
  </p>

{
    <p className="text-xs text-gray-500 text-center mt-2">
  <a
    href={`https://gateway.irys.xyz/${item?.nodeId}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-400 hover:underline"
  >
    View on IRYS
  </a>
</p>
  }

</div>

   );
 };

 export default GalleryCard;
