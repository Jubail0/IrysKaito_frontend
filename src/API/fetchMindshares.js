
import API from "./api.js";

export const fetchMinshareData = async (timeframe, setData, setError, setFetchDataLoading) => {
  setFetchDataLoading(true);

  try {
    const res = await API.get("/api/mindshare", { params: { timeframe } });
    const apiData = res.data?.top_1k_yappers;

    if (!Array.isArray(apiData)) throw new Error("Invalid data format");

    setError(""); // clear previous errors
    setData(apiData);
  } catch (err) {
    console.error("Fetch error:", err);
    setError("Failed to fetch data");
  } finally {
    setFetchDataLoading(false);
  }
};
