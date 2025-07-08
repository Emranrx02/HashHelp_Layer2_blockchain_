import React, { useState } from "react";
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
  }
];

export default function PublicProfile() {
  const [input, setInput] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    if (!input) {
      setError("Please enter an ENS name or address.");
      return;
    }

    setLoading(true);
    setError("");
    setPosts([]);
    setBalance("");
    setAddress("");

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Resolve ENS if needed
      let resolved = input;
      if (input.endsWith(".eth")) {
        resolved = await provider.resolveName(input);
        if (!resolved) throw new Error("ENS name not found.");
      }

      setAddress(resolved);

      // Fetch balance
      const bal = await provider.getBalance(resolved);
      const ethAmount = ethers.utils.formatEther(bal);
      setBalance(ethAmount);

      // Fetch posts
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const filter = contract.filters.PostCreated(resolved);
      const events = await contract.queryFilter(filter);

      const parsed = events.map(e => ({
        description: e.args.description,
        ipfsHash: e.args.ipfsHash,
        timestamp: new Date(e.args.timestamp.toNumber() * 1000).toLocaleString()
      }));

      setPosts(parsed.reverse());
    } catch (err) {
      console.error(err);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
      <h3>🔍 Public Donation Profile</h3>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter ENS or Address"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "0.6rem",
            borderRadius: "4px",
            border: "1px solid #555",
            background: "#0F1924",
            color: "#fff"
          }}
        />
        <button
          onClick={fetchProfile}
          style={{
            padding: "0.6rem 1rem",
            background: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {address && (
        <div style={{ textAlign: "left", marginTop: "1rem" }}>
          <p><strong>Wallet:</strong> {address}</p>
          <p><strong>Balance:</strong> {parseFloat(balance).toFixed(4)} ETH</p>
        </div>
      )}

      {posts.length > 0 && (
        <>
          <h4 style={{ marginTop: "1rem" }}>📜 Posts:</h4>
          {posts.map((post, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #333",
                padding: "1rem",
                borderRadius: "6px",
                marginBottom: "1rem",
                background: "#1c1c1c",
                color: "#eee"
              }}
            >
              <p>{post.description}</p>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${post.ipfsHash}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#4fc3f7" }}
              >
                View IPFS
              </a>
              <p style={{ fontSize: "0.85rem", color: "#aaa" }}>
                ⏰ {post.timestamp}
              </p>
            </div>
          ))}
        </>
      )}

      {address && posts.length === 0 && !loading && (
        <p>No posts found for this address.</p>
      )}
    </div>
  );
}