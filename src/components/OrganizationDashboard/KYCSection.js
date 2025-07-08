import React, { useState } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function KYCSection() {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [regNo, setRegNo] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orgName || !email || !mobile || !regNo || !file) {
      setMessage("❌ Please fill all fields and select a document.");
      return;
    }

    try {
      const storageRef = ref(storage, `kyc_docs/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "organization_kyc"), {
        orgName,
        email,
        mobile,
        regNo,
        documentURL: downloadURL,
        status: "pending",
        createdAt: serverTimestamp()
      });

      setMessage("✅ KYC Submitted! We will review soon.");
      setOrgName("");
      setEmail("");
      setMobile("");
      setRegNo("");
      setFile(null);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error submitting KYC.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h3>Organization KYC Verification</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Organization Name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Registration Number"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
          style={inputStyle}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={inputStyle}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Submit KYC
        </button>
      </form>
      {message && (
        <p style={{ marginTop: "10px", color: message.includes("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc"
};

export default KYCSection;