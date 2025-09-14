import { ethers } from "ethers";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export const walletConnect = async (setAddress, setConnected) => {
    try {

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const ExistingToken = localStorage.getItem("userJWT");
      if (!ExistingToken) {
        console.error("X is not connected");
        return;
      }

      const res = await api.post(
        "/auth/link-wallet",
        { walletAddress: userAddress },
        {
          headers: { Authorization: `Bearer ${ExistingToken}` },
        }
      );

      const { token } = res.data;
      localStorage.setItem("userJWT", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      setAddress(payload.walletAddress);
      setConnected(true);
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };


  // Disconnect wallet 
  export const disconnectWallet = async (setConnected, setAddress, setBalance) => {
  try {
    const token = localStorage.getItem("userJWT"); // your current JWT
    if (!token) return console.error("No token found");

    const res = await api.post(
      '/auth/disconnect-wallet',
      {}, // no body needed
      { headers: { Authorization: `Bearer ${token}` } } // send existing token
    );

    // Update frontend with new token
    const { token: newToken } = res.data;
    if (newToken) {
      localStorage.setItem("userJWT", newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    }

    // Clear wallet state
    setConnected(false);
    setBalance(null);
    setAddress("");
    console.log("Wallet disconnected");
  } catch (error) {
    console.error("Failed to disconnect wallet:", error);
  }
};
