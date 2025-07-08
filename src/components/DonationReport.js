import React from "react";
import { jsPDF } from "jspdf";

function DonationReport({ amount, amountUSD, donor, date }) {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Donation Receipt", 105, 20, null, null, "center");

    // Section Title
    doc.setFontSize(14);
    doc.text("Donation Details", 20, 40);

    // Donor Address
    doc.setFontSize(12);
    doc.text("Donor Address:", 20, 55);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(donor, 170), 60, 55);

    // Amount
    doc.setFont("helvetica", "bold");
    doc.text("Amount:", 20, 75);
    doc.setFont("helvetica", "normal");
    doc.text(`${amount} ETH (~$${amountUSD})`, 60, 75);

    // Date
    doc.setFont("helvetica", "bold");
    doc.text("Date:", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text(date, 60, 90);

    // Thank you note
    doc.setFontSize(13);
    doc.setTextColor(0, 128, 0);
    doc.text(
      "Thank you! You are so kind and thanks for trusting blockchain.",
      105,
      120,
      null,
      null,
      "center"
    );

    doc.save("Donation_Receipt.pdf");
  };

  return (
    <button
      onClick={generatePDF}
      style={{
        marginTop: "12px",
        padding: "10px 20px",
        backgroundColor: "#3498db",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Download Receipt
    </button>
  );
}

export default DonationReport;