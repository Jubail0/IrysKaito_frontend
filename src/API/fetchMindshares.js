import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
  });


export const fetchMinshareData = async(timeframe, setAllStatsData,setData,setError,setfetchDataLoading) => {
    setfetchDataLoading(true)    
   try {
         
          const res = await api.get("/api/mindshare", {
            params: { timeframe },
          });
    
          const apiData = res.data?.top_1k_yappers;
          const allStats_data = {
            total_tweets: res.data?.total_tweets,
            total_yappers: res.data?.total_yappers,
            top_engagements: res.data?.top_engagements
          }
    
          if (!Array.isArray(apiData)) throw new Error("Invalid data format");
    
          setAllStatsData(allStats_data)
          setData(apiData)
        } catch (err) {
          console.error(err);
          console.log(err)
          setError("Failed to fetch data");
        } finally {
          setfetchDataLoading(false)
        }
      
}