// App.jsx
import React from 'react';
import './index.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx';
import ProfileCreation from './Pages/ProfileCreation.jsx'; 
import IrysGallery from './Pages/IrysGallery.jsx';
import {useEffect, useState} from "react"
import { authentication } from './API/auth.js';
import { fetchMinshareData } from './API/fetchMindshares.js';
import Lenis from "@studio-freight/lenis";
import axios from "axios";
import Quiz from './Pages/Quiz.jsx';
import Leaderboard from './Pages/Leaderboard.jsx';
import Maintenance from "./Components/Maintenance.jsx";

axios.defaults.withCredentials = true;

export default function App() {
   const [connected, setConnected] = useState(false);
   const [authUsername, setAuthUsername] = useState('');
   const [address, setAddress] = useState(null);

   const [data, setData] = useState([]);
   const [error, setError] = useState("");
   const [allStatsData, setAllStatsData] = useState({});
   const [timeframe, setTimeframe] = useState(7);
   const [fetchDataLoading, setfetchDataLoading] = useState(false);
   
    // toggle maintenance flags per page
  const quizMaintenance = false;   // lock quiz
  const leaderboardMaintenance = false; // lock leaderboard

   
 
    useEffect(() => {
      // 1️⃣ Check if JWT is returned from Twitter OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("userJWT", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      setAuthUsername(payload.username);

      // Clean URL
      window.history.replaceState({}, document.title, "/");
    } else {
      // Load username from existing JWT if present
      const existingToken = localStorage.getItem("userJWT");
      if (existingToken) {
        const payload = JSON.parse(atob(existingToken.split(".")[1]));
        setAuthUsername(payload.username);
      }
    }
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
      <Navbar connected ={connected} address={address} setConnected={setConnected} setAddress={setAddress} username={authUsername}/>
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
          connected={connected} 
          setConnected={setConnected} 
          setAddress={setAddress}
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

        <Route path="/quiz" element={
      
         quizMaintenance ? <Maintenance /> : <Quiz /> 
         
          } />
        <Route path="/leaderboard" element={
      
         leaderboardMaintenance ? <Maintenance /> : <Leaderboard /> 
         
          } />
      </Routes>
    </>
  );
}
