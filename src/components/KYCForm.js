import React, { useState } from "react";
import { db, storage } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function KYCForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [nid, setNid] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !mobile || !email || !nid || !file) {
      setMessage("❌ Please fill all fields and select a file.");
      return;
    }

    if (!/^\d{10,15}$/.test(mobile)) {
      setMessage("❌ Mobile number must be 10-15 digits.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("❌ Please enter a valid email address.");
      return;
    }

    try {
      // include a timestamp to avoid file name collisions and make debugging easier
      const storageRef = ref(storage, `kyc_docs/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "kyc_submissions"), {
        firstName,
        lastName,
        mobile,
        email,
        nid,
        documentURL: downloadURL,
        status: "pending",
        createdAt: serverTimestamp()
      });

      setMessage("✅ Thanks for submitting your KYC. We are reviewing and will approve soon.");
      setFirstName("");
      setLastName("");
      setMobile("");
      setEmail("");
      setNid("");
      setFile(null);
    } catch (error) {
      // Log full error for developer debugging and show the message to the user
      console.error("Error submitting KYC:", error);
      const errMsg = error && error.message ? error.message : String(error);
      setMessage(`❌ Error submitting KYC: ${errMsg}`);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "30px auto",
        padding: "25px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        color: "#333"
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>KYC Verification Form</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="NID Number"
          value={nid}
          onChange={(e) => setNid(e.target.value)}
          style={inputStyle}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ width: "100%", marginBottom: "12px" }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          Submit KYC
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: "15px",
            color: message.includes("✅") ? "green" : "red",
            fontWeight: "bold",
            textAlign: "center"
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: "12px",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px"
};

export default KYCForm;