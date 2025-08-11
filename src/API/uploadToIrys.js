import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
  });

// Handle Upload API
export const uploadToIrys = (address, signature, message, payload) => {
        const response =  api.post("/api/upload", {
        address,
        signature,
        message,
        jsonData: { profile: payload},
      });

      return response;

};




