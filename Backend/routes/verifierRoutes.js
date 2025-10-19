import express from 'express';
const router = express.Router();

// Import controller functions, ensuring you add getVerifiedUsers
import { 
    getPendingUsers, 
    verifyUser, 
    rejectUser, 
    getVerifierStats,
    getVerifiedUsers // <--- 1. IMPORT THE NEW FUNCTION
} from '../controllers/verifierController.js';

import { protect, isVerifier } from '../middlewares/authMiddleware.js';
 

// Get all users with 'pending' status
router.get('/pending-users', protect, isVerifier, getPendingUsers);

// =======================================================
// === 2. ADD THIS MISSING ROUTE DEFINITION ===
// Get all users with 'verified' status


router.get('/verified-users', protect, isVerifier, getVerifiedUsers);
// =======================================================

// Get verifier dashboard stats
router.get('/stats', protect, isVerifier, getVerifierStats);

// Verify or reject a specific user by their ID
router.put('/verify-user/:userId', protect, isVerifier, verifyUser);
router.put('/reject-user/:userId', protect, isVerifier, rejectUser);

export default router;