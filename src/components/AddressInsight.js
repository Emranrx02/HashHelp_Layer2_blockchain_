// src/components/AddressInsight.js
import React, { useState } from "react";
import { ethers } from "ethers";

// আপনার Contract Address
const contractAddress = "0xe9350d0023B3E94D892d4a0c15c6Ae0A5D5132d8";
// আপনার Contract ABI
const contractABI = [
  "event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp)"
];

function AddressInsight() {
  const [input, setInput] = useState("");
  const [balance, setBalance] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsight = async () => {
    if (!input) {
      setError("Please enter ENS or address.");
      return;
    }
    setLoading(true);
    setError("");
    setBalance(null);
    setDonations([]);

    try {
      // Ethereum Mainnet Provider for ENS
      const ethProvider = new ethers.providers.JsonRpcProvider(
        "https://mainnet.infura.io/v3/6dc5e6f2ccaf4345b63afe30b6e1f89b"
      );

      // Arbitrum Mainnet Provider for Contract
      const arbProvider = new ethers.providers.JsonRpcProvider(
        "https://arbitrum-mainnet.infura.io/v3/6dc5e6f2ccaf4345b63afe30b6e1f89b"
      );

      let address = input;

      if (input.endsWith(".eth")) {
        address = await ethProvider.resolveName(input);
        if (!address) throw new Error("Invalid ENS name.");
      }

      // Fetch balance
      const bal = await arbProvider.getBalance(address);
      setBalance(parseFloat(ethers.utils.formatEther(bal)));

      // Fetch donation events
      const contract = new ethers.Contract(contractAddress, contractABI, arbProvider);
      const filter = contract.filters.DonationReceived(address);
      const events = await contract.queryFilter(filter);

      setDonations(
        events.map((e) => ({
          hash: e.transactionHash,
          amount: ethers.utils.formatEther(e.args.amount),
          date: new Date(e.args.timestamp.toNumber() * 1000).toLocaleString()
        }))
      );

    } catch (err) {
      console.error(err);
      setError("Error fetching data.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      margin: "2rem auto",
      maxWidth: "800px",
      background: "#e6f7ec",
      padding: "1.5rem",
      borderRadius: "10px",
      boxShadow: "0 0 8px rgba(13, 134, 47, 0.1)"
    }}>
      <h3 style={{
        textAlign: "center",
        marginBottom: "1rem",
        color: "#2e7d32"
      }}>
        🔍 Address Donation Insight
      </h3>
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "1rem"
      }}>
        <input
          type="text"
          placeholder="ENS or Address"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={fetchInsight}
          style={{
            padding: "10px",
            background: "#4CAF50",
            color: "#fff",
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

      {balance !== null && (
        <p style={{
          marginTop: "1rem",
          fontWeight: "bold",
          color: "#2e7d32"
        }}>
          ✅ Live Balance: {balance.toFixed(4)} ETH
        </p>
      )}

      {donations.length > 0 && (
        <>
          <h4 style={{
            marginTop: "1.5rem",
            color: "#2e7d32"
          }}>
            🎁 Contract Donations
          </h4>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "0.5rem"
          }}>
            <thead>
              <tr>
                <th style={{
                  borderBottom: "1px solid #ddd",
                  padding: "8px",
                  background: "#f1f1f1",
                  color: "#2e7d32"
                }}>
                  Tx Hash
                </th>
                <th style={{
                  borderBottom: "1px solid #ddd",
                  padding: "8px",
                  background: "#f1f1f1",
                  color: "#c62828"
                }}>
                  Amount
                </th>
                <th style={{
                  borderBottom: "1px solid #ddd",
                  padding: "8px",
                  background: "#f1f1f1",
                  color: "#2e7d32"
                }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.hash}>
                  <td style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    textAlign: "center",
                    wordBreak: "break-all",
                    color: "#2e7d32"
                  }}>
                    <a href={`https://arbiscan.io/tx/${d.hash}`} target="_blank" rel="noopener noreferrer">
                      {d.hash.slice(0, 10)}...
                    </a>
                  </td>
                  <td style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    textAlign: "center",
                    color: "#c62828",
                    fontWeight: "bold"
                  }}>
                    {d.amount} ETH
                  </td>
                  <td style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    textAlign: "center",
                    color: "#2e7d32"
                  }}>
                    {d.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AddressInsight;