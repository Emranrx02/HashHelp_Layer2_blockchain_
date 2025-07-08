import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

function TransactionHistory() {
  const [events, setEvents] = useState([]);

  const contractAddress = "0xe9350d0023B3E94D892d4a0c15c6Ae0A5D5132d8";
  const contractABI = React.useMemo(() => [
    "event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp)"
  ], []);

  useEffect(() => {
    async function fetchEvents() {
      if (!window.ethereum) return;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      try {
        const filter = contract.filters.DonationReceived();
        const logs = await contract.queryFilter(filter, 0, "latest");

        const parsedLogs = logs.map(log => ({
          donor: log.args.donor,
          amount: ethers.utils.formatEther(log.args.amount),
          time: new Date(log.args.timestamp.toNumber() * 1000).toLocaleString()
        }));

        setEvents(parsedLogs.reverse());
      } catch (error) {
        console.error("Error fetching donation events:", error);
      }
    }

    fetchEvents();
  }, [contractABI]);

  return (
    <div style={{ marginTop: "10px" }}>
      <h3 style={{ color: "#fff" }}>Donation History</h3>
      {events.length === 0 ? (
        <p style={{ color: "#fff" }}>No donations yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{
                borderBottom: "1px solid #ddd",
                padding: "8px",
                background: "#f1f1f1",
                color: "green"
              }}>Donor</th>
              <th style={{
                borderBottom: "1px solid #ddd",
                padding: "8px",
                background: "#f1f1f1",
                color: "red"
              }}>Amount (ETH)</th>
              <th style={{
                borderBottom: "1px solid #ddd",
                padding: "8px",
                background: "#f1f1f1",
                color: "green"
              }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <tr key={idx}>
                <td style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "center",
                  background: "#ffffff",
                  color: "green",
                  wordBreak: "break-all"
                }}>
                  {event.donor}
                </td>
                <td style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "center",
                  background: "#ffffff",
                  color: "red",
                  fontWeight: "bold"
                }}>
                  {event.amount}
                </td>
                <td style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "center",
                  background: "#ffffff",
                  color: "green"
                }}>
                  {event.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionHistory;