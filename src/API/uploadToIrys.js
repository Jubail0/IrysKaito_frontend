
import API from "./api";


// Handle Upload API
export const uploadToIrys = async (payload) => {
    try {
      const response =  API.post("/api/upload",{jsonData: { profile: payload}});
      return response;
    } catch (error) {
      console.log(error)
    }
       
};




