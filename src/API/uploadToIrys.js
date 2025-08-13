import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
  });

// Handle Upload API
export const uploadToIrys = (payload) => {
        const existingToken = localStorage.getItem("userJWT"); 
        const response =  api.post("/api/upload", {
        jsonData: { profile: payload},
      },{
        headers: {
        Authorization: `Bearer ${existingToken}`
    }
      }
    
    );

      return response;

};




