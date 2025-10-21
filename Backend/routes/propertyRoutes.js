import express from 'express';
import multer from 'multer';

// --- CORRECTED IMPORTS ---
import { 
  preparePropertyRegistration,
  finalizePropertyRegistration,
  verifyPropertyDocuments,
  prepareListingForSale,
  finalizeListingForSale,
  listPropertySimple,     
  withdrawListing,      // <-- 1. IMPORT THE NEW CONTROLLER
  getMarketplaceProperties,
  confirmSale,
  getMyProperties,
  getPropertyById,
  getAllProperties
} from '../controllers/propertyController.js';

import { protect, isVerifier } from '../middlewares/authMiddleware.js';
import uploadPhoto from '../middlewares/photoUploadMiddleware.js'; // <-- 2. IMPORT THE NEW MIDDLEWARE

const router = express.Router();

// --- Multer Configurations ---
const adminUpload = multer({ dest: 'uploads/' });
const userUpload = multer({ storage: multer.memoryStorage() });


// --- Admin/Verifier Routes ---
router.post(
  '/prepare',
  protect,
  isVerifier,
  adminUpload.fields([
    { name: 'motherDeed', maxCount: 1 },
    { name: 'encumbranceCertificate', maxCount: 1 },
  ]),
  preparePropertyRegistration
);

router.post('/finalize', protect, isVerifier, finalizePropertyRegistration);

// This is the route for the "Registered Properties" page
router.get('/all', protect, isVerifier, getAllProperties);


// --- User and Public Routes ---
router.post(
  '/verify-documents',
  userUpload.fields([
    { name: 'motherDeed', maxCount: 1 },
    { name: 'encumbranceCertificate', maxCount: 1 },
  ]),
  verifyPropertyDocuments
);

// Routes for the secure listing workflow
router.post('/:id/prepare-listing', protect, prepareListingForSale);
router.post('/:id/finalize-listing', protect, finalizeListingForSale);

// --- IMPORTANT: SPECIFIC ROUTES MUST COME BEFORE GENERIC :id ROUTES ---

// Get user's own properties (MUST be before /:id)
router.get('/my', protect, getMyProperties);
router.get('/my-properties', protect, getMyProperties); // Alias for backward compatibility

router.put(
  '/list/:id', 
  protect, 
  uploadPhoto.single('image'), 
  listPropertySimple 
);

// --- 2. ADD THE NEW WITHDRAW ROUTE ---
router.put(
  '/withdraw/:id',
  protect,
  withdrawListing
);

// Marketplace routes
router.get('/marketplace', getMarketplaceProperties);

// Confirm sale
router.post('/:id/confirm-sale', protect, confirmSale);

// Generic property by ID route (MUST be last)
router.get('/:id', getPropertyById);

export default router;