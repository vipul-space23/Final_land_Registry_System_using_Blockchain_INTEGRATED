# 🏗️ SmartRegistry: Blockchain-Powered Land Ownership System

<div align="center">

💠 *A Decentralized Application (dApp) for Secure, Transparent, and Efficient Land Registry Management* 💠  
📚 [Demo Link] • [Documentation Link] • [Report Issues Link]

</div>

---

## 📋 Table of Contents

1. [🌟 Overview](#-overview)  
2. [🚨 Problem Statement](#-problem-statement)  
3. [🎯 Key Features](#-key-features)  
4. [💻 Technical Stack](#-technical-stack)  
5. [🏗️ System Architecture](#️-system-architecture)  
6. [🔄 User Flow](#-user-flow)  
7. [🚀 Installation](#-installation)  
8. [📱 Usage](#-usage)  
9. [📜 Smart Contract Details](#-smart-contract-details)  
10. [🔮 Future Enhancements](#-future-enhancements)  
11. [👥 Contributors](#-contributors)  
12. [📄 License](#-license)  
13. [🙏 Acknowledgments](#-acknowledgments)

---

## 🌟 Overview

**SmartRegistry** revolutionizes the traditional paper-based land registration system using **Blockchain**, **IPFS**, and **Smart Contracts**.  
Every property becomes a **secure digital NFT**, ensuring **authenticity**, **transparency**, and **tamper-proof ownership** transfers.  

Built for **Datta Meghe College of Engineering**, this academic prototype demonstrates how **Web3** can redefine trust in property management.

---

### 🎓 Academic Details

- 🏫 **Institution:** Datta Meghe College of Engineering, Airoli, Navi Mumbai  
- 🖥️ **Department:** Information Technology  
- 🎓 **University:** University of Mumbai  
- 📅 **Academic Year:** 2025–26  

---

## 🚨 Problem Statement

🏠 Traditional land registry systems suffer from:
- 📄 **Paper-Based Records:** Prone to forgery, loss, and decay  
- 🕰️ **Delays:** Manual verification takes weeks/months  
- 💰 **High Costs:** Multiple intermediaries increase expenses  
- 🔓 **No Transparency:** Centralized databases are easily tampered  
- ⚠️ **Frequent Fraud:** Duplicate land titles and disputes  

---

## 🎯 Key Features

### 🔐 Security & Transparency
- **Immutable Ledger:** All ownership data is blockchain-recorded  
- **NFT-Based Titles:** Each property is a unique tokenized asset  
- **Hash Verification:** Confirms document authenticity  
- **IPFS Integration:** Decentralized document storage via **Pinata**

### ⚡ Efficiency
- **Smart Contracts:** Automate sale, payment & ownership transfer  
- **Instant Verification:** Real-time hash comparison  
- **No Middlemen:** Direct buyer-seller blockchain interaction  

### 👥 User Experience
- **MetaMask Login:** Secure wallet-based authentication  
- **Email Notifications:** Auto alerts on approval/rejection  
- **Modern UI:** Built with React.js for simplicity & responsiveness  

---

## 💻 Technical Stack

| Layer | Technology | Purpose |
|:------|:------------|:---------|
| 🖥️ **Frontend** | React.js | Interactive UI for all users |
| ⚙️ **Backend** | Node.js + Express | API & server-side logic |
| ⛓️ **Blockchain** | Solidity | Smart contract development |
| 🌐 **Web3 Layer** | Web3.js / Ethers.js | Connects frontend to blockchain |
| 🗄️ **Database** | MongoDB | Off-chain user & property data |
| 🧾 **Storage** | IPFS (Pinata) | Decentralized document storage |
| 🔑 **Authentication** | MetaMask | Wallet-based user login |

---

## 🏗️ System Architecture

### 🧩 Level 0 Data Flow Diagram (DFD)

```text
┌─────────────────┐
│   Land Seller   │──────────────┐
└─────────────────┘              │
        │ Registration Data (Aadhaar, PAN, Wallet)
        ▼
┌─────────────────┐              │
│   Land Buyer    │──────────────┤
└─────────────────┘              │
                                ▼
                       ┌───────────────────────────┐
                       │     SmartRegistry dApp     │
                       │ (React + Node + Blockchain)│
                       └───────────────────────────┘
                            │            │
                            ▼            ▼
                    ┌─────────────┐   ┌──────────────┐
                    │   MongoDB   │   │  Blockchain  │
                    │ (User Data) │   │ (NFT Ledger) │
                    └─────────────┘   └──────────────┘
                            │            │
                            ▼            ▼
                    ┌─────────────┐   ┌──────────────┐
                    │    IPFS     │   │ SmartContract │
                    │ (Pinata)    │   │  (Escrow)     │
                    └─────────────┘   └──────────────┘


📈 Data Flow:

Users → System: Registration, document uploads, transaction requests

System → Blockchain: NFT minting, ownership transfer

System → IPFS: Document hash & storage

System → Users: Verification updates, NFT receipt

🔄 User Flow
⚙️ Phase 1: Registration & Land Verification
1️⃣ Land Seller Registration:

Registers with Aadhaar & PAN → connects MetaMask → submits verification request 2️⃣ Land Inspector Verification:

Views pending requests → checks documents → approves/rejects

✅ On approval, email sent to seller: “Profile Verified” 3️⃣ Property Registration (Demo Setup):

Land Inspector registers property → uploads Mother Deed + Property Document

→ stored on IPFS (Pinata) → hash generated → NFT minted 4️⃣ Seller Land Verification:

Seller logs in → re-uploads same documents

→ system auto-generates hash → compares with IPFS

✅ Match = Verified → Seller can list/edit/withdraw property

🏠 Phase 2: Property Sale & Transfer
5️⃣ Buyer Browses Property Listings:

Buyer logs in via MetaMask → views verified properties → filters by price/location 6️⃣ Purchase Request Flow:

Buyer sends request → Seller sees notification → Accept / Reject

✅ On Accept → Smart Contract enabled 7️⃣ Smart Contract Transaction:

Buyer deposits ETH (Escrow) → Inspector validates →

NFT transfers to Buyer → ETH sent to Seller → Ownership updated on blockchain 🎉 Result: Buyer becomes new verified property owner.

🚀 Installation
🧩 Prerequisites
Node.js (v16+)

MongoDB

MetaMask Browser Extension

Pinata (IPFS account)

Ethereum Testnet (Sepolia / Goerli)

🛠️ Setup
# Clone repository
git clone [https://github.com/yourusername/smartregistry.git](https://github.com/yourusername/smartregistry.git)
cd smartregistry

# Backend
cd backend
npm install
cp .env.example .env  # Configure your MongoDB URI, Pinata Keys, etc.
npm run dev

# Frontend
cd ../frontend
npm install
npm start

# Smart Contract
cd ../blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia

📱 Usage
User Role,Actions
🧑‍💼 Land Sellers,"Register with Aadhaar/PAN, wait for verification, upload property docs, list/edit/withdraw properties, accept buyer offers."
🧑‍💻 Land Buyers,"Connect MetaMask, browse verified land listings, send purchase requests, deposit ETH, receive property NFT."
🕵️‍♂️ Land Inspectors,"Review user verification requests, register demo properties, approve/reject KYC, validate ownership transfers."

📜 Smart Contract Details
⚙️ Key Functions
mintPropertyNFT() → Create NFT for verified property

listProperty() → List property for sale

purchaseProperty() → Buyer escrow + NFT transfer

transferOwnership() → Finalize ownership

verifyDocumentHash() → Compare IPFS hashes

🛡️ Security Features
Reentrancy guard

Escrow contract for payment safety

Role-based access (inspector/seller/buyer)

Emergency pause functionality

🔮 Future Enhancements
🔗 Multi-chain support (Polygon, BSC)

💰 Fractional ownership NFTs

🤖 AI-based document forgery detection

⚖️ Property valuation oracles

📱 Mobile App (React Native)

🏛️ Integration with Govt. Registries

🌍 Multi-language UI

👥 Contributors
Name,Role,Contact
🧑‍💻 [Your Name],Project Lead,[email@example.com]
👩‍💻 [Team Member 2],Blockchain Developer,[email@example.com]
🧑‍🎨 [Team Member 3],Frontend Developer,[email@example.com]
🧑‍🔧 [Team Member 4],Backend Developer,[email@example.com]
📄 License
This project is licensed under the MIT License — see the LICENSE file for details.

🙏 Acknowledgments
🏫 Datta Meghe College of Engineering (DMCE), Airoli

🎓 University of Mumbai

🧱 OpenZeppelin for smart contract templates

🌐 Pinata (IPFS) for decentralized storage support

💡 Faculty guides and mentors for their valuable input

⭐ Star this repository if you found it useful!

💙 Made with passion by IT Department, DMCE.
