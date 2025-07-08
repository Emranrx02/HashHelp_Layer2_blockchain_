import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xac45090d82da90c47a8fda64ea1676178c26b686";
const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "org", type: "address" },
      { indexed: false, internalType: "string", name: "description", type: "string" },
      { indexed: false, internalType: "string", name: "ipfsHash", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }
    ],
    name: "PostCreated",
    type: "event"
  },
  {
    inputs: [
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string", name: "ipfsHash", type: "string" }
    ],
    name: "createPost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

export default function OrganizationDashboard() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!description || !file) {
      alert("Please enter description and select a file.");
      return;
    }

    // Prepare FormData for Pinata
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: "Post",
      keyvalues: { description }
    });
    formData.append("pinataMetadata", metadata);

    try {
      // Upload to Pinata
      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`
        },
        body: formData
      });

      if (!res.ok) throw new Error("Pinata upload failed.");
      const data = await res.json();
      const ipfsHash = data.IpfsHash;

      console.log("IPFS Hash:", ipfsHash);

      // Call Smart Contract
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const tx = await contract.createPost(description, ipfsHash);
        await tx.wait();

        alert("✅ Post stored on blockchain!");
        fetchPosts();
        setDescription("");
        setFile(null);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Upload or contract call failed.");
    }
  };

  const fetchPosts = async () => {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const events = await contract.queryFilter("PostCreated");

    const parsed = events.map(e => ({
      org: e.args.org,
      description: e.args.description,
      ipfsHash: e.args.ipfsHash,
      timestamp: new Date(e.args.timestamp.toNumber() * 1000).toLocaleString()
    }));
    setPosts(parsed.reverse());
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>👋 Hi! Here is your dashboard.</h2>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Write a description..."
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        style={{
          marginTop: "1rem",
          padding: "0.7rem 1.5rem",
          background: "#2196F3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Upload & Store
      </button>

      <h3 style={{ marginTop: "2rem" }}>📜 All Posts</h3>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post, idx) => (
  <div
    key={idx}
    style={{
      border: "1px solid #444",
      padding: "1.2rem",
      borderRadius: "8px",
      marginBottom: "1.2rem",
      background: "#1f1f1f",
      color: "#ddd",
      transition: "transform 0.2s",
      cursor: "pointer"
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
  >
    <h4 style={{ margin: "0 0 0.5rem", color: "#4fc3f7" }}>✨ New Post</h4>
    <p style={{ fontSize: "1.1rem", marginBottom: "0.8rem" }}>
      {post.description}
    </p>
    <a
      href={`https://gateway.pinata.cloud/ipfs/${post.ipfsHash}`}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "inline-block",
        marginBottom: "0.6rem",
        padding: "0.4rem 0.8rem",
        background: "#2196F3",
        color: "#fff",
        borderRadius: "4px",
        textDecoration: "none",
        fontWeight: "bold"
      }}
    >
      📂 View IPFS IMAGE 
    </a>
    <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
      ⏰ {post.timestamp}
    </p>
  </div>
))}
    </div>
  );
}