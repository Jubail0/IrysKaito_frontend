import { useState } from "react"
import { WebUploader } from "@irys/web-upload"
import { WebEthereum } from "@irys/web-upload-ethereum"
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6"
import { ethers } from "ethers"

function UploadToIrys() {
  const [walletStatus, setWalletStatus] = useState("Not connected")
  const [irysStatus, setIrysStatus] = useState("Not connected")
  const [uploader, setUploader] = useState(null)
  const [uploadStatus, setUploadStatus] = useState("")
  const [uploadedUrl, setUploadedUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [balance, setBalance] = useState(null)
  const [progress, setProgress] = useState(0)

  // Fetch latest balance
  const fetchBalance = async (uploaderInstance) => {
    try {
      const balAtomic = await uploaderInstance.getBalance()
      setBalance(ethers.formatEther(BigInt(balAtomic))) // FIXED
    } catch (err) {
      console.error("Failed to fetch balance:", err)
    }
  }

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      setWalletStatus("No Ethereum provider found. Install MetaMask.")
      return
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      setWalletStatus(`Wallet connected: ${address}`)
    } catch {
      setWalletStatus("Wallet connection failed")
    }
  }

  // Connect to Irys testnet
  const connectIrys = async () => {
    if (!window.ethereum) {
      setIrysStatus("MetaMask not found")
      return
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const irysUploader = await WebUploader(WebEthereum)
        .withAdapter(EthersV6Adapter(provider))
        .devnet()

      setUploader(irysUploader)
      setIrysStatus(`Irys testnet connected: ${irysUploader.address}`)
      await fetchBalance(irysUploader)
    } catch (err) {
      console.error(err)
      setIrysStatus("Irys connection failed")
    }
  }

  // Fund account from wallet
  const fundAccount = async () => {
    if (!uploader) {
      alert("Connect to Irys first")
      return
    }
    try {
      const amountEth = "0.05"
      await uploader.fund(uploader.utils.toAtomic(amountEth), 1.2)
      await fetchBalance(uploader)
      alert(`✅ Funded Irys account with ${amountEth} ETH`)
    } catch (err) {
      console.error(err)
      alert("❌ Funding failed")
    }
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // Upload file with progress
  const uploadToIrys = async () => {
    if (!uploader) {
      setUploadStatus("Connect to Irys first")
      return
    }
    // if (!selectedFile) {
    //   setUploadStatus("No image selected")
    //   return
    // }

    // try {
    //   setProgress(0)
    //   setUploadStatus("Uploading...")

    //   const receipt = await uploader.uploadFile(selectedFile, {
    //     tags: [
    //       { name: "App", value: "Yappers Rank Card" },
    //       { name: "Content-Type", value: selectedFile.type }
    //     ],
    //     onUploadProgress: (ev) => {
    //       if (ev && ev.percentage) {
    //         setProgress(Math.round(ev.percentage))
    //       }
    //     }
    //   })

    //   const url = `https://gateway.irys.xyz/${receipt.id}`
    //   setUploadedUrl(url)
    //   setUploadStatus("✅ Upload succeeded")
    //   await fetchBalance(uploader)
    // } catch (err) {
    //   console.error(err)
    //   setUploadStatus("❌ Upload failed")
    // }

    const profileData = {
  username: "Alice",
  score: 9200,
  level: 15
};
const jsonString = JSON.stringify(profileData);

const receipt = await uploader.upload(
  Buffer.from(jsonString), 
  {
    tags: [
      { name: "App", value: "MyProfileCards" },
      { name: "Content-Type", value: "application/json" }
    ]
  }
);

const url = `https://gateway.irys.xyz/${receipt.id}`;
setUploadedUrl(url); 
console.log(url)

  }

  return (
    <div style={{ padding: "20px", maxWidth: "480px", margin: "auto" }}>
      <h2>Irys Testnet — Upload Rank Card</h2>

      <button onClick={connectWallet}>1️⃣ Connect Wallet</button>
      <p>{walletStatus}</p>

      <button
        onClick={connectIrys}
        disabled={!walletStatus.startsWith("Wallet connected")}
      >
        2️⃣ Connect Irys Testnet
      </button>
      <p>{irysStatus}</p>

      {uploader && (
        <div style={{ marginBottom: "10px" }}>
          <p>💰 Balance: {balance !== null ? `${balance} ETH` : "Loading..."}</p>
          <button onClick={fundAccount}>💵 Fund Irys Account</button>
        </div>
      )}

      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </div>
      )}

      <button onClick={uploadToIrys} disabled={!uploader}>
        3️⃣ Upload Card Image
      </button>

      {progress > 0 && progress < 100 && (
        <div style={{ marginTop: "10px" }}>
          <progress value={progress} max="100"></progress>
          <p>{progress}%</p>
        </div>
      )}

      <p>
        <strong>Status:</strong> {uploadStatus}
      </p>
      {uploadedUrl && (
        <p>
          ✅ View in Irys:{" "}
          <a href={uploadedUrl} target="_blank" rel="noreferrer">
            {uploadedUrl}
          </a>
        </p>
      )}
    </div>
  )
}

export default UploadToIrys
