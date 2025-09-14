import React, { useState, useEffect } from "react";
import axios from "axios";
import Sprite3 from "../assets/sprite3.png";
import GalleryCard from "../Components/Gallery/GalleryCard.jsx";
import Filteration from "../Components/Gallery/Filteration.jsx";
import { FaSpinner, FaImage } from "react-icons/fa";
import { motion } from "framer-motion";

const IrysGallery = ({ connected, username }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const ExistingToken = localStorage.getItem("userJWT");
      if (!ExistingToken) {
        setLoading(false);
        return;
      }

      const res = await api.get(`/api/getCards`);
      const nodes = res.data || [];

      const responses = await Promise.all(
        nodes.map(async (node) => {
          const profileRes = await axios.get(
            `https://gateway.irys.xyz/${node.node.id}`,
            { headers: { "Cache-Control": "no-cache" } }
          );
          return { ...profileRes.data, nodeId: node.node.id };
        })
      );

      setProfiles(
        responses.sort(
          (a, b) =>
            new Date(b?.profile?.uploadedAt) - new Date(a?.profile?.uploadedAt)
        )
      );
    } catch (error) {
      console.error(error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleXLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/twitter`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <FaSpinner className="animate-spin text-5xl text-[#51FFD6]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-4 py-10 text-white max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative mt-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl lg:text-5xl font-extrabold flex items-center justify-center gap-3">
            <img
              src={Sprite3}
              className="w-[45px] lg:w-[60px]"
              alt="sprite"
            />
            IRYS GALLERY
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[#51FFD6] to-purple-500 rounded-full mt-3 mb-6"></div>
          <p className="text-base lg:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Browse through your uploads, revisit your milestones, and celebrate your growth.  
            Your Gallery is securely stored on Irys and always accessible —  
            a digital footprint of your journey.
          </p>
        </div>

        {/* Filter on right (only if connected) */}
        {connected && (
          <div className="absolute top-0 right-0 hideInMobile">
            <Filteration
              profiles={profiles}
              setProfiles={setProfiles}
              username={username}
            />
          </div>
        )}
      </div>

      {/* Guest View */}
      {!username ? (
        <div className="flex flex-col items-center mt-16">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg rounded-2xl p-8 max-w-md text-center">
            <p className="text-gray-400 mb-6">
              Connect your X account and wallet to explore, upload, and showcase
              your Card in the IRYS Gallery.
            </p>
            <button
              onClick={handleXLogin}
              className="px-6 py-3 rounded-xl bg-[#51FFD6] text-black font-semibold hover:scale-105 transition-transform"
            >
              Login with X
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-12">
          {/* Gallery */}
          {profiles.length > 0 ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
              {profiles.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <GalleryCard item={item} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center w-full mt-24 text-gray-500">
              <FaImage className="text-5xl mb-4 opacity-50" />
              <p className="text-center">
                No uploads yet! Start by sharing your first milestone 🚀
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IrysGallery;