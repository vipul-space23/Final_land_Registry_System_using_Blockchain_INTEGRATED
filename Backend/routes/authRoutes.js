// import express from 'express';
// // import { registerUser, loginUser, logoutUser,updateUserWallet,loginWithWallet,getUserByWallet } from '../controllers/authController.js';
// // import { protect, isVerifier } from '../middlewares/authMiddleware.js';
// // const router = express.Router();

// // router.post('/register', registerUser);
// // router.post('/login', loginUser);
// // router.post('/logout', logoutUser);
// // router.patch('/wallet', protect, updateUserWallet);
// // router.post("/wallet-login", loginWithWallet);
// // router.get('/by-wallet/:walletAddress', getUserByWallet);

// // export default router;
// import express from 'express';
// const router = express.Router();
// // THE CORRECT WAY
// import { 
//     registerUser, 
//     setupVerifier, 
//     getNonceForSignature, 
//     loginWithSignature 
// } from '../controllers/authController.js';

// import { uploadKycDocument } from '../middlewares/uploadMiddleware.js'; // Import the KYC middleware





// // Add the 'uploadKycDocument' middleware to the register route
// router.post('/register', uploadKycDocument, registerUser);

// // This route is for the one-time verifier setup
// router.post('/setup-verifier', setupVerifier);

// // ... (keep any existing routes like /register)
// router.post('/register', registerUser);

// // Routes for MetaMask login
// router.post('/get-nonce', getNonceForSignature);    

// router.post('/login-signature', loginWithSignature);

// export default router;












import express from 'express';
const router = express.Router();

// Import all necessary controller functions
import { 
    registerUser, 
    setupVerifier, 
    getNonceForSignature, 
    loginWithSignature,
    logoutUser,
    updateWalletAddress
} from '../controllers/authController.js';

// Import the KYC middleware
import { uploadKycDocument } from '../middlewares/uploadMiddleware.js';

// =======================================================
// === CRITICAL FIX: IMPORT THE 'protect' MIDDLEWARE ===
// =======================================================
import { protect } from '../middlewares/authMiddleware.js';
// =======================================================


// --- User Registration ---
router.post('/register', uploadKycDocument, registerUser);

// --- Verifier Setup ---
router.post('/setup-verifier', setupVerifier);

// --- MetaMask Signature-Based Login ---
router.post('/get-nonce', getNonceForSignature);
router.post('/login-signature', loginWithSignature);

// --- User Logout ---
router.post('/logout', logoutUser);

// --- Wallet Update (Protected) ---
// Now 'protect' is defined and this route will work correctly
router.patch('/wallet', protect, updateWalletAddress);

export default router;

