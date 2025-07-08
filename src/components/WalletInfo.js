import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function WalletInfo({ account }) {
  const [balance, setBalance] = useState("");
  const [usd, setUsd] = useState("");

  const fetchBalance = React.useCallback(async () => {
    if (!account || !window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const rawBalance = await provider.getBalance(account);
    const eth = parseFloat(ethers.utils.formatEther(rawBalance));
    setBalance(eth.toFixed(4));

    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    const data = await res.json();
    setUsd((eth * data.ethereum.usd).toFixed(2));
  }, [account]);

  useEffect(() => {
    fetchBalance();
  }, [account, fetchBalance]);

  return (
    <div
      style={{
        background: "#1c1c1c",
        padding: "1rem",
        borderRadius: "8px",
        textAlign: "center",
        marginBottom: "1rem"
      }}
    >
      <p>
        <strong>Connected Wallet:</strong><br />
        {account}
      </p>
      {balance && usd && (
        <p>
          <strong>Balance:</strong> {balance} ETH (${usd})
        </p>
      )}
    </div>
  );
}