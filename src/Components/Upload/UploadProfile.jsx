import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

export default function UploadProfile() {
  const [textData, setTextData] = useState("");
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState({});

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
  });

  const uploadProfile = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const message = "I confirm uploading my profile data to Irys";
      const signature = await signer.signMessage(message);

      const response = await api.post("/upload", {
        address,
        signature,
        message,
        jsonData: {
          profile: textData,
          uploadedAt: new Date().toISOString(), // Send UTC time to backend
        },
      });

      const data = response.data;
      setTextData("");
      fetchUploads(address);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUploads = async (address) => {
    try {
      const { data } = await api.get(`/uploads/${address}`);
      setUploads(data);
      data.forEach((u) => fetchIrysData(u.node.id));
    } catch (err) {
      console.error("Error fetching uploads:", err);
    }
  };

  const fetchIrysData = async (txId) => {
    try {
      const res = await fetch(`https://devnet.irys.xyz/${txId}`);
      const json = await res.json();
      setFetchedData((prev) => ({ ...prev, [txId]: json }));
    } catch (err) {
      console.error(`Error fetching Irys data for ${txId}:`, err);
    }
  };

  const connectAndFetch = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    fetchUploads(address);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <textarea
        value={textData}
        onChange={(e) => setTextData(e.target.value)}
        placeholder="Enter profile text..."
        disabled={loading}
        style={{ width: "100%", minHeight: "100px" }}
      />
      <br />

      <button onClick={uploadProfile} disabled={loading || !textData}>
        {loading ? "Uploading..." : "Upload Profile"}
      </button>

      <button onClick={connectAndFetch} disabled={loading}>
        Load My Uploads
      </button>

      {loading && <p>⏳ Upload in progress...</p>}

      <h3>My Uploads</h3>
      <div style={{ display: "grid", gap: "1rem" }}>
        {uploads.map((u) => {
          const txId = u.node.id;
          const data = fetchedData[txId];

          return (
            <div
              key={txId}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <a
                href={`https://devnet.irys.xyz/${txId}`}
                target="_blank"
                rel="noreferrer"
              >
                🔗 {txId}
              </a>
              {data && (
                <div>
                  <p><strong>Profile:</strong> {data.profile}</p>
                  {data.uploadedAt && (
                    <p style={{ fontSize: "0.8rem", color: "#666" }}>
                      📅 Uploaded on: {new Date(data.uploadedAt).toUTCString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
