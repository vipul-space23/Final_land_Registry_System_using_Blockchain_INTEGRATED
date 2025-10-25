import express from 'express';
const router = express.Router();

// Import all necessary controller functions
import { 
    registerUser, 
    setupVerifier, 
    getNonceForSignature, 
    loginWithSignature,
    logoutUser,
    updateWalletAddress,
    updateUserProfile
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

router.patch('/profile', protect, updateUserProfile);

export default router;

