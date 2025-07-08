// src/components/DonationPostForm.js
import React, { useState } from "react";
import axios from "axios";

function DonationPostForm({ onPostCreated }) {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      // Pinata API call
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer b0cda1ac2f4fa7bb786c`
        }
      });

      const cid = res.data.IpfsHash;
      const post = {
        description,
        cid,
        timestamp: new Date().toISOString()
      };

      // Save post locally (in real app, call smart contract here)
      onPostCreated(post);

      alert("✅ Uploaded Successfully!");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("Error uploading to Pinata.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      background: "#0F1924",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem"
    }}>
      <h3>Create a New Post</h3>
      <textarea
        placeholder="Write a description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: "4px",
          marginBottom: "0.5rem"
        }}
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        style={{ marginBottom: "0.5rem", display: "block" }}
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          background: "#2196F3",
          color: "white",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        {loading ? "Uploading..." : "Upload to Pinata"}
      </button>
    </div>
  );
}

export default DonationPostForm;