import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
  });

export const authentication = async (setConnected, setAuthUsername, setAddress) => {
 
  try {
    const res = await api.get('/auth/me');
    const { username, walletAddress } = res.data;
   
    if(username) setAuthUsername(username);

    if (walletAddress) {
      setAddress(walletAddress);
      setConnected(true);
    } else {
      setConnected(false);
    }

    // Add wallet event listeners
  if (window.ethereum) {
    
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
     
          setAddress(null);
          setConnected(false);
          console.log("Wallet disconnected");
        } else {
          
          setAddress(accounts[0]);
          setConnected(true);
         console.log("Wallet switched")
        }
      });

    }

  } catch (error) {
    console.log("Authentication failed:", error);
  }
};



  