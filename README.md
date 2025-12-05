# TransparencyWorld - Layer 2 Blockchain Donation Platform

TransparencyWorld is a decentralized application (DApp) designed as part of a project to demonstrate how blockchain technology can make donations transparent, auditable, and secure. This platform leverages Layer 2 Ethereum networks, NFT-based file storage, and smart contracts to create an end-to-end solution for managing and verifying donations.

## 🎯 Purpose

This project was developed to:

- Enable donors to contribute funds transparently.
- Allow organizations to create and share verifiable donation posts with IPFS storage.
- Provide public profiles where anyone can verify donation activities.
- Showcase decentralized verification and record-keeping as a proof of concept.

## ✨ Features

✅ **Donor Workflow**

- Connect your wallet.
- Donate ETH via smart contract.
- Download donation receipts.
- Track your total donations.

✅ **Organization Workflow**

- Upload donation posts with descriptions and images to IPFS.
- Store post metadata on-chain.
- Maintain an immutable history of activities.

✅ **Public Verification**

- Search any wallet address or ENS name.
- View balance and posted donation records.
- Confirm authenticity of charitable claims.

✅ **ENS Integration**

- Supports resolving ENS names to Ethereum addresses.

✅ **Layer 2 Support**

- Built to operate on Arbitrum for lower fees.

## 🛠️ Tech Stack

- React.js (Frontend)
- ethers.js (Ethereum interaction)
- Solidity Smart Contract (Post records)
- Pinata IPFS API (File storage)
- Firebase (KYC workflow)
- Vercel (Deployment)

## 📂 Project Structure

src/
├── components/
│ ├── DonationSection.js
│ ├── OrganizationDashboard.js
│ ├── PublicProfile.js
│ └── …
├── contracts/
│ └── DonationContract.sol
├── App.js
├── index.js
└── …

## 🚀 Getting Started

1. Install dependencies

```bash
npm install
```

2. Firebase environment

Create a `.env` file in the project root (next to `package.json`) and copy values from `.env.example`.

Required keys (example):

```
REACT_APP_FIREBASE_API_KEY=AIza...YOUR_API_KEY...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=0123456789
REACT_APP_FIREBASE_APP_ID=1:0123456789:web:abcdef123456
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

Important: After editing `.env`, restart the dev server since Create React App reads env variables at startup.

3. Start the dev server

```bash
npm run dev
```

4. Connect wallet

• MetaMask recommended

---

📄 License

This project is developed by Emran for educational and demonstration purposes only.
Do not attempt to copy, reuse, or redistribute any part of this project without explicit permission. Unauthorized use is strictly prohibited.

contract : https://emranhaque.com
```
