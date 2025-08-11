// App.jsx
import React from 'react';
import './index.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx';
import ProfileCreation from './Pages/ProfileCreation.JSX'; 
import IrysGallery from './Pages/IrysGallery.JSX';
import {useEffect, useState} from "react"
import { authentication } from './API/auth.js';
import { fetchMinshareData } from './API/fetchMindshares.js';
import Lenis from "@studio-freight/lenis";


export default function App() {
   const [connected, setConnected] = useState(false);
   const [authUsername, setAuthUsername] = useState('');
   const [address, setAddress] = useState(null);

   const [data, setData] = useState([]);
   const [error, setError] = useState("");
   const [allStatsData, setAllStatsData] = useState({});
   const [timeframe, setTimeframe] = useState(7);
   const [fetchDataLoading, setfetchDataLoading] = useState(false);

   
 
    useEffect(() => {
    authentication(setConnected, setAuthUsername, setAddress);
    },[]);

 

    useEffect(() => {
    fetchMinshareData(timeframe, setAllStatsData,setData,setError, setfetchDataLoading);
    },[timeframe]);

    useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <>
      <Navbar connected ={connected} address={address} setConnected={setConnected} setAddress={setAddress} />
      <Routes>
        <Route path="/" element={
          <ProfileCreation 
          authUsername={authUsername} 
          allStatsData={allStatsData} 
          data={data} 
          timeframe={timeframe} 
          setTimeframe={setTimeframe} 
          error={error} 
          setError={setError}
          fetchLoading = {fetchDataLoading}
          />
         
        }/>

        <Route path="/gallery" element={
      
          <IrysGallery  
          connected={connected} 
          setConnected={setConnected} 
          username ={authUsername}
          address={address} 
          setAddress={setAddress} />
         
          } />
      </Routes>
    </>
  );
}
