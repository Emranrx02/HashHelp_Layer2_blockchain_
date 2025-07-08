import React, { useState } from "react";
import { ethers } from "ethers";

function ENSManager() {
  const [ensName, setEnsName] = useState("");
  const [status, setStatus] = useState("");

  async function checkENS() {
    if (!ensName) {
      alert("Please enter an ENS name.");
      return;
    }

    try {
      const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");
      const address = await provider.resolveName(ensName);

      if (address) {
        setStatus(`❌ Taken by: ${address}`);
      } else {
        setStatus("✅ Available!");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error checking ENS.");
    }
  }

  return (
    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
      <input
        type="text"
        placeholder="Enter ENS name (e.g., example.eth)"
        value={ensName}
        onChange={(e) => setEnsName(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          marginRight: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc"
        }}
      />
      <button
        onClick={checkENS}
        style={{
          padding: "10px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Check ENS
      </button>
      {status && <p style={{ marginTop: "0.5rem" }}>{status}</p>}
    </div>
  );
}

export default ENSManager;