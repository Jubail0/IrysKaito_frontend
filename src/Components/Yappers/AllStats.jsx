import { FaUsers, FaHeart, FaChartLine } from "react-icons/fa";
import CountUp from "react-countup";
import { motion } from "framer-motion";



export default function AllStats({allStatsData}) {
    // Each stat with its own background color
const stats = [
  {
    icon: <FaUsers className="text-white text-3xl" />,
    title: "Total Yappers",
    value: allStatsData?.total_yappers,
    bgColor: "bg-teal-500",
  },
  {
    icon: <FaHeart className="text-white text-3xl" />,
    title: "Total Tweets",
    value: allStatsData?.total_tweets,
    bgColor: "bg-pink-500",
  },
  {
    icon: <FaChartLine className="text-white text-3xl" />,
    title: "Top Engagements",
    value: allStatsData?.top_engagements,
    bgColor: "bg-blue-500",
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
    <div className="flex justify-center items-center px-6 mt-12">
      <div className="w-full max-w-[1600px] p-10 flex flex-wrap justify-center gap-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className={`w-72 h-40 ${stat.bgColor} rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col justify-center items-center gap-2`}
            initial="hidden"
            animate="visible"
            custom={index}
            variants={cardVariants}
          >
            <div>{stat.icon}</div>
            <h2 className="text-lg font-semibold text-white">{stat.title}</h2>
            <p className="text-3xl font-bold text-white">
              <CountUp end={stat.value} duration={2} separator="," />
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
