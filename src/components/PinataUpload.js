import React, { useState } from "react";
import axios from "axios";

function PinataUpload() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !description) {
      alert("Please provide both a description and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: "PostWithDescription",
      keyvalues: {
        description: description
      }
    });
    formData.append("pinataMetadata", metadata);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxContentLength: "Infinity",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`
          },
        }
      );

      console.log("✅ Uploaded:", res.data);
      alert(`✅ Uploaded to IPFS! CID: ${res.data.IpfsHash}`);
      setDescription("");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("❌ Upload failed.");
    }
  };

  return (
    <div
      style={{
        background: "#0F1924",
        padding: "2rem",
        borderRadius: "8px",
        textAlign: "center",
        width: "100%",
        maxWidth: "500px",
        marginTop: "1rem",
        boxShadow: "0 0 10px rgba(0,0,0,0.4)"
      }}
    >
      <h2 style={{ marginBottom: "1rem", color: "#fff" }}>
        👋 Hi! Here is your dashboard.
      </h2>
      <p style={{ marginBottom: "1.5rem", color: "#aaa" }}>
        You can create posts, upload files, and store them on the blockchain.
      </p>

      <textarea
        placeholder="Write a description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          width: "100%",
          padding: "0.6rem",
          borderRadius: "4px",
          border: "1px solid #333",
          marginBottom: "1rem",
          background: "#1c1c1c",
          color: "#fff"
        }}
      />

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="file"
          onChange={handleFileChange}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            background: "#1c1c1c",
            color: "#fff",
            border: "1px solid #333"
          }}
        />
      </div>

      <button
        onClick={handleUpload}
        style={{
          padding: "0.8rem 1.5rem",
          background: "#2196F3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Upload to Pinata
      </button>
    </div>
  );
}

export default PinataUpload;