import { connectWallet } from "../Web3/walletConnection.js";
import { uploadToIrys } from "../API/uploadToIrys.js";

export const handleUpload = async (user,setuploadLoading, timeframe) => {
    setuploadLoading(true);
  try {
   
    // Construct JSON payload
    const payload = {
      username: user.username,
      mindshare:user.mindshare,
      rank: user.rank,
      score: user.raw_community_score,
      stats: {
        likes: user.total_likes,
        tweets: user.tweet_counts,
        quoteTweets: user.total_quote_tweets,
        bookmarks: user.total_bookmarks,
        impressions: user.total_impressions,
        smartEngagements : user.total_smart_engagements,
        total_comm_engage : user.total_community_engagements,
        timeframe:timeframe
      },
    
    };

    // Upload to Irys
    const res = await uploadToIrys(payload); // You’ll define this function in a utility or hook

    if (res.status === 200) alert("Upload was successful")

  } catch (err) {
    console.error("Handle Upload failed", err);
     if(err.status === 401)  alert (err.response.data.error);
     if (err.status === 403) alert(err.response.data.error)
    
  } finally{
    setuploadLoading(false)
  }
};
