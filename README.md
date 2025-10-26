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

```
## 🔄 User Flow

### ⚙️ Phase 1: Registration & Land Verification

#### 1️⃣ Land Seller Registration
- Registers with **Aadhaar & PAN**  
- Connects **MetaMask** wallet  
- Submits verification request  

#### 2️⃣ Land Inspector Verification
- Views **pending verification requests**  
- Checks **uploaded documents**  
- Approves or rejects request  
✅ On approval, email sent to seller: **“Profile Verified”**  

#### 3️⃣ Property Registration (Demo Setup)
- Land Inspector registers property for demo purposes  
- Uploads required documents:  
  - **Mother Deed (PDF)**  
  - **Property Document (PDF)**  
- Documents stored on **IPFS (Pinata)**  
- Hash of documents generated and stored  
- **NFT minted** on blockchain representing property  
- Property record created (initially **not listed for sale**)  

#### 4️⃣ Seller Land Verification
- Seller logs in and re-uploads the same property documents  
- System **automatically generates hash** and compares with IPFS record  
✅ If hash matches → verification successful  
- Seller can then:  
  - **List property** for sale (set price, upload images, edit details)  
  - **Withdraw property** (remove from sale)  

---

### 🏠 Phase 2: Property Sale & Transfer

#### 5️⃣ Buyer Browses Property Listings
- Buyer logs in via **MetaMask**  
- Views **verified property listings**  
- Can filter by:  
  - Price  
  - Location  
  - Size  

#### 6️⃣ Purchase Request Flow
- Buyer sends purchase request to seller  
- Seller sees request in dashboard (**Requests section**)  
- Seller can either:  
  - **Accept** → enables smart contract transaction  
  - **Reject** → request declined  

#### 7️⃣ Smart Contract Transaction
- Buyer deposits **ETH** into smart contract (Escrow)  
- Land Inspector validates transaction (optional)  
- Smart contract executes:  
  - Transfers **NFT** to Buyer  
  - Releases **ETH** to Seller  
  - Updates blockchain ledger for ownership  
🎉 Result: Buyer becomes **new verified property owner**  

---

## 🚀 Installation

### 🧩 Prerequisites
- **Node.js** (v16+)  
- **MongoDB**  
- **MetaMask** browser extension  
- **Pinata** (IPFS account)  
- Ethereum test network (Sepolia / Goerli)  

### 🛠️ Setup

```bash
# Clone repository
git clone https://github.com/yourusername/smartregistry.git
cd smartregistry

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure MongoDB URI, Pinata Keys, etc.
npm run dev

# Frontend setup
cd ../frontend
npm install
npm start

# Smart contract deployment
cd ../blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```
## 📱 Usage

### 🧑‍💼 Land Sellers
- Register with **Aadhaar/PAN**  
- Connect **MetaMask** wallet  
- Wait for **inspector verification**  
- Upload property documents for **hash verification**  
- List property with **price, images, and details**  
- Accept or reject **buyer requests**  
- Receive **ETH automatically** upon sale  

### 🧑‍💻 Land Buyers
- Connect **MetaMask** wallet  
- Browse **verified property listings**  
- Filter properties by **price, location, or size**  
- Send **purchase request** to seller  
- Deposit **ETH** to smart contract (Escrow)  
- Receive **NFT ownership** after successful transaction  

### 🕵️‍♂️ Land Inspectors
- Review **pending user verification requests**  
- Approve or reject based on **document authenticity**  
- Register **demo properties** for testing  
- Validate **ownership transfers** before finalization  

---

## 📜 Smart Contract Details

### ⚙️ Key Functions
- `mintPropertyNFT()` → Create NFT for verified property  
- `listProperty()` → List property for sale  
- `purchaseProperty()` → Buyer escrow + NFT transfer  
- `transferOwnership()` → Finalize ownership  
- `verifyDocumentHash()` → Compare IPFS document hashes  

### 🛡️ Security Features
- Reentrancy guard to prevent attacks  
- Escrow mechanism for secure payments  
- Role-based access control (Inspector/Seller/Buyer)  
- Emergency pause functionality  

---

## 🔮 Future Enhancements
- 🔗 Multi-chain support (Polygon, BSC)  
- 💰 Fractional ownership NFTs for co-ownership  
- 🤖 AI-based document forgery detection  
- ⚖️ Property valuation oracles  
- 📱 Mobile Application (React Native)  
- 🏛️ Integration with Government Land Registries  
- 🌍 Multi-language user interface  

---

## 👥 Contributors

| Name | Role | Contact |
|------|------|--------|
| 🧑‍💻 [Your Name] | Project Lead | [email@example.com] |
| 👩‍💻 [Team Member 2] | Blockchain Developer | [email@example.com] |
| 🧑‍🎨 [Team Member 3] | Frontend Developer | [email@example.com] |
| 🧑‍🔧 [Team Member 4] | Backend Developer | [email@example.com] |

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments
- 🏫 Datta Meghe College of Engineering (DMCE)  
- 🎓 University of Mumbai  
- 🧱 OpenZeppelin for smart contract libraries  
- 🌐 Pinata (IPFS) for decentralized document storage  
- 💡 Faculty guides and mentors for their guidance  

⭐ **Star this repository** if you find it useful!  
💙 *Made with ❤️ by IT Department, DMCE.*

