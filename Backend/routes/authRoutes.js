// import express from 'express';
// import { registerUser, loginUser, logoutUser,updateUserWallet,loginWithWallet,getUserByWallet } from '../controllers/authController.js';
// import { protect, isVerifier } from '../middlewares/authMiddleware.js';
// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.post('/logout', logoutUser);
// router.patch('/wallet', protect, updateUserWallet);
// router.post("/wallet-login", loginWithWallet);
// router.get('/by-wallet/:walletAddress', getUserByWallet);

// export default router;
import express from 'express';
const router = express.Router();
// THE CORRECT WAY
import { 
    registerUser, 
    setupVerifier, 
    getNonceForSignature, 
    loginWithSignature 
} from '../controllers/authController.js';

import { uploadKycDocument } from '../middlewares/uploadMiddleware.js'; // Import the KYC middleware





// Add the 'uploadKycDocument' middleware to the register route
router.post('/register', uploadKycDocument, registerUser);

// This route is for the one-time verifier setup
router.post('/setup-verifier', setupVerifier);

// ... (keep any existing routes like /register)
router.post('/register', registerUser);

// Routes for MetaMask login
router.post('/get-nonce', getNonceForSignature);    

router.post('/login-signature', loginWithSignature);

export default router;