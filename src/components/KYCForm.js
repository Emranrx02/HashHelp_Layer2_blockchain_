import React, { useState } from "react";
import { db, storage } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function KYCForm({ account }) {
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) return setMessage("❌ Please connect your wallet.");
    if (!fullName || !country || !idNumber || !file) return setMessage("❌ Fill all fields and upload a file.");
    if (!storage) return setMessage("❌ Storage not configured (set REACT_APP_FIREBASE_STORAGE_BUCKET).");

    try {
      setSubmitting(true);
      setMessage("");

      const filePath = `kyc_documents/${account}/${Date.now()}_${file.name}`;
      const fileRef = ref(storage, filePath);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      await addDoc(collection(db, "kycSubmissions"), {
        walletAddress: account,
        fullName,
        country,
        idNumber,
        documentUrl: fileUrl,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setMessage("✅ KYC submitted successfully. We'll review it shortly.");
      setFullName("");
      setCountry("");
      setIdNumber("");
      setFile(null);
    } catch (err) {
      console.error("KYC submit error:", err);
      setMessage(`❌ Failed to submit KYC: ${err && err.message ? err.message : err}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "24px auto", padding: 20 }}>
      <h3>KYC Verification Form</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12, textAlign: "left" }}>
          <label>Full Name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
        </div>

        <div style={{ marginBottom: 12, textAlign: "left" }}>
          <label>Country</label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
        </div>

        <div style={{ marginBottom: 12, textAlign: "left" }}>
          <label>ID / Passport Number</label>
          <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
        </div>

        <div style={{ marginBottom: 12, textAlign: "left" }}>
          <label>Upload ID Document (jpg/png/pdf)</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <button type="submit" disabled={submitting} style={{ width: "100%", padding: 12, backgroundColor: submitting ? "#9e9e9e" : "#4caf50", color: "white", border: "none", borderRadius: 4 }}>
          {submitting ? "Submitting..." : "Submit KYC"}
        </button>
      </form>

      {message && <p style={{ marginTop: 12, color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}
    </div>
  );
}