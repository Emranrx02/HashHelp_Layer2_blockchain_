import React from "react";

function WalletManager({ account, setAccount }) {
  async function connectWallet() {
    if (window.ethereum) {
      const [selectedAccount] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(selectedAccount);
    } else {
      alert("Please install MetaMask!");
    }
  }

  function disconnectWallet() {
    setAccount("");
  }

  return (
    <div style={{ marginTop: "20px" }}>
      {!account ? (
        <button
          onClick={connectWallet}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p><strong>Connected:</strong> {account}</p>
          <button
            onClick={disconnectWallet}
            style={{
              padding: "8px 12px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "5px"
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