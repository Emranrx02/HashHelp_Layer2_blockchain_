import React from "react";

function ENSResolver({ ensSearchName, setEnsSearchName, resolveENSName, ensSearchResult }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <input
        type="text"
        placeholder="Search ENS name (e.g., vitalik.eth)"
        value={ensSearchName}
        onChange={(e) => setEnsSearchName(e.target.value)}
        style={{
          padding: "8px",
          width: "250px",
          marginRight: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          color: "#333"
        }}
      />
      <button
        onClick={resolveENSName}
        style={{
          padding: "8px 12px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Search ENS Name
      </button>
      {ensSearchResult && (
        <p style={{ marginTop: "10px", fontSize: "1rem" }}>
          <strong>Result:</strong> {ensSearchResult}
        </p>
      )}
    </div>
  );
}

export default ENSResolver;