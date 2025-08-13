import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sprite3 from "../assets/sprite3.png";
import GalleryCard from '../Components/Gallery/GalleryCard.jsx';
import Filteration from '../Components/Gallery/Filteration.jsx';
import { gsap } from 'gsap';

const IrysGallery = ({connected, username,address }) => {
  const [profiles, setProfiles] = useState([]);
  const [nodes, setNodes ] = useState([]);
  const imgRef = useRef(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
  });

 const fetchAllProfiles = async() => {
  
  const ExistingToken = localStorage.getItem("userJWT"); 
      if (!ExistingToken) {
        console.error("User not logged in");
        return;
}
  try {
    const res = await api.get(`/api/getCards`)
    setNodes(res.data);
   
  } catch (error) {
    console.log(error);
  }
 }

 const fetchAllNodes = async() => {
  try {

    const GetProfile = async(node) => {

      const res = await axios.get(`https://gateway.irys.xyz/${node.node.id}`)
      return res;
    }
   const fetchNodes = nodes.map((node) => {
      return GetProfile(node);
    });

    const responses = await Promise.all(fetchNodes)
  
    const newResponses = responses.map((item,index) => {
      return item.data
    })

    setProfiles(newResponses.sort((a, b) => new Date(b.profile.uploadedAt) - new Date(a.profile.uploadedAt)));

  } catch (error) {
    console.log(error)
  }
 }
 
 
useEffect(()=>{
 fetchAllProfiles();
 },[])

useEffect(()=>{
if(nodes) {
fetchAllNodes()
}

 },[nodes])



  const handleXLogin = async () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}auth/twitter`;
  };



useEffect(() => {
    if (imgRef.current) {
      gsap.from(imgRef.current, {
        y: -50,
        opacity: 0,
        rotate: -15,
        duration: 1,
        ease: 'bounce.out',
      });
    }
  }, []);
  return (
    <div className="min-h-screen px-4 py-8 text-white max-w-7xl mx-auto ">
      <div className="flex items-center justify-between ">
  {/* Centered Title */}
     <h1 className="text-2xl lg:text-4xl font-bold flex items-center justify-center gap-4 flex-1 text-center">
  <img src={Sprite3} className="w-[40px] lg:w-[50px] mb-2" alt="sprite" />
  IRYS GALLERY
   </h1>

  {/* Filter on the Right */}
 { connected && <div className='hideInMobile'>
    <Filteration
      profiles={profiles}
      setProfiles={setProfiles}
      currentUserAddress={address}
    />
  </div>}
</div>
        
      { !connected && <p className="text-base text-gray-500 text-center mb-8 mt-2 max-w-md mx-auto">
  Connect your X account and wallet to explore, and upload your Mindshares in the IRYS Gallery.</p>}
      {!username ? (
        <div className="flex justify-center">
          <button
            onClick={handleXLogin}
            className="px-6 py-3 rounded-lg bg-[#51FFD6] mt-5 text-white font-semibold hover:scale-105 transition-transform"
          >
            Login with X
          </button>
        </div>
      ) :  (
        <div>
          <div className={`grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-15`}>
            {profiles.length > 0 ? (
              profiles.map((item, index) => (
               <GalleryCard item={item} key={index}/>
              ))
            ) 
            
            : (
              <p className="text-center  text-gray-400">{ !profiles && `No uploads yet.`}</p>
            )
            
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default IrysGallery;
