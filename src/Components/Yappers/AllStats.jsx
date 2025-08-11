import { FaUsers, FaHeart, FaChartLine } from "react-icons/fa";
import CountUp from "react-countup";
import { motion } from "framer-motion";



export default function AllStats({allStatsData}) {
    // Each stat with its own background color
const stats = [
  {
    icon: <FaHeart className="text-[#0190D6] text-3xl" />,
    title: "Total Tweets",
    value: allStatsData?.total_tweets,
    bgColor: "bg-[#1A1A1A]",
  },
  {
    icon: <FaUsers className="text-[#BAC5FF] text-3xl" />,
    title: "Total Yappers",
    value: allStatsData?.total_yappers,
    bgColor: "bg-[#1A1A1A]",
  },
  {
    icon: <FaChartLine className="text-[#FFAF16] text-3xl" />,
    title: "Top Engagements",
    value: allStatsData?.top_engagements,
    bgColor: "bg-[#1A1A1A]",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

  return (
<div className="flex justify-center items-center px-4 sm:px-6 mt-12">
  <div className="w-full  flex flex-col sm:flex-row items-center gap-6 ">
    {stats.map((stat, index) => (
      <motion.div
        key={stat.title}
        className="w-[350px] p-8 border border-[#41454E] rounded-4xl transition-all duration-300 ease-in-out hover:bg-[#51FFD6] hover:scale-105"
        initial="hidden"
        animate="visible"
        custom={index}
        variants={cardVariants}
      >
        <div
          className={`w-full h-40 ${stat.bgColor} rounded-3xl flex flex-col justify-center items-center gap-2 shadow-lg shadow-[#1A1A1A]`}
        >
          <div>{stat.icon}</div>
          <h2 className="text-lg sm:text-xl md:text-1xl font-semibold text-white text-center">
            {stat.title}
          </h2>
          <p className="text-2xl  font-bold text-white">
            <CountUp end={stat.value} duration={2} separator="," />
          </p>
        </div>
      </motion.div>
    ))}
  </div>
</div>



)}
