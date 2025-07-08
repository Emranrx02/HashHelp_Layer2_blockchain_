import React from "react";

function WalletManager({ account, setAccount }) {
  // Connect wallet function
  async function connectWallet() {
    if (window.ethereum) {
      try {
        const [selectedAccount] = await window.ethereum.request({
          method: "eth_requestAccounts"
        });
        setAccount(selectedAccount);
      } catch (err) {
        console.error("Connection error:", err);
        alert("❌ Wallet connection failed.");
      }
    } else {
      alert("⚠️ Please install MetaMask!");
    }
  }

  // Disconnect wallet function
  function disconnectWallet() {
    setAccount("");
  }

  return (
    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
      {!account ? (
        <button
          onClick={connectWallet}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p style={{ wordBreak: "break-all", marginBottom: "0.5rem" }}>
            ✅ Connected: {account}
          </p>
          <button
            onClick={disconnectWallet}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}

export default WalletManager;