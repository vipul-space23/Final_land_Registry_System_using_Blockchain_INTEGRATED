import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getKycStatus, uploadAadhaar } from '../controllers/kycController.js'; // Include upload if needed

const router = express.Router();

// GET /api/kyc/status - Fetch current user's KYC status
router.route('/status').get(protect, getKycStatus);

// Optional: Upload Aadhaar document
router.route('/upload').post(protect, uploadAadhaar);

export default router;
