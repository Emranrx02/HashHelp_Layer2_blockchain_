import React, { useState } from "react";
import KYCForm from "./KYCForm";

function KYCSection() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ marginTop: "20px" }}>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          Start KYC
        </button>
      )}

      {showForm && (
        <div
          style={{
            marginTop: "20px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "6px",
            color: "#333",
            maxWidth: "400px",
            width: "100%"
          }}
        >
          <KYCForm />
        </div>
      )}
    </div>
  );
}

export default KYCSection;