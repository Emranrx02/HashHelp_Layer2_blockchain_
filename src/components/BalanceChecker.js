import React, { useState } from "react";
import { ethers } from "ethers";

function BalanceChecker() {
  const [input, setInput] = useState("");
  const [balanceETH, setBalanceETH] = useState(null);
  const [balanceUSD, setBalanceUSD] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBalance = async () => {
    if (!input) {
      setError("Please enter an ENS or address.");
      return;
    }

    setLoading(true);
    setError("");
    setBalanceETH(null);
    setBalanceUSD(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let address = input;

      if (input.endsWith(".eth")) {
        address = await provider.resolveName(input);
        if (!address) {
          setError("Invalid ENS name.");
          setLoading(false);
          return;
        }
      }

      const balance = await provider.getBalance(address);
      const eth = parseFloat(ethers.utils.formatEther(balance));
      setBalanceETH(eth);

      // Fetch ETH price
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await res.json();
      const usd = eth * data.ethereum.usd;
      setBalanceUSD(usd);
    } catch (err) {
      console.error(err);
      setError("Error fetching balance.");
    }

    setLoading(false);
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", background: "#f0fdf4", borderRadius: "8px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
      <h3 style={{ textAlign: "center" }}>💰 Address Balance Checker</h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="ENS or Address"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: "1",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
        <button
          onClick={fetchBalance}
          style={{
            padding: "8px 12px",
            background: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Check
        </button>
      </div>
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {balanceETH !== null && (
        <div
          style={{
            marginTop: "1rem",
            padding: "12px 16px",
            background: "#e6f4ea",
            border: "1px solid #4caf50",
            borderRadius: "6px",
            color: "#2e7d32",
            fontWeight: "bold",
            textAlign: "center"
          }}
        >
          ✅ {input.slice(0, 8)}... Balance: {balanceETH.toFixed(4)} ETH (~${balanceUSD.toFixed(2)})
        </div>
      )}
    </div>
  );
}

export default BalanceChecker;