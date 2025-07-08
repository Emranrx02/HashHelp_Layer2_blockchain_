// src/components/DonationFeed.js
import React from "react";

function DonationFeed({ posts }) {
  if (posts.length === 0) {
    return <p>No posts yet.</p>;
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>Recent Posts</h3>
      {posts.map((post, index) => (
        <div key={index} style={{
          background: "#16222A",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem"
        }}>
          <p>{post.description}</p>
          {post.cid && (
            <img
              src={`https://gateway.pinata.cloud/ipfs/${post.cid}`}
              alt="Uploaded"
              style={{ maxWidth: "100%", borderRadius: "4px" }}
            />
          )}
          <small>{new Date(post.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default DonationFeed;