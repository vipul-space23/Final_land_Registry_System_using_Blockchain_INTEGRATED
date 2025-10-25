// // import express from 'express';
// // import multer from 'multer';

// // // --- CORRECTED IMPORTS ---
// // import { 
// //   preparePropertyRegistration,
// //   finalizePropertyRegistration,
// //   verifyPropertyDocuments,
// //   prepareListingForSale,
// //   finalizeListingForSale,
// //   listPropertySimple,     
// //   withdrawListing,   
// //   requestPurchase,
// //   getMarketplaceProperties,
// //   confirmSale,
// //   getMyProperties,
// //   getPropertyById,
// //   getAllProperties
// // } from '../controllers/propertyController.js';

// // import { protect, isVerifier } from '../middlewares/authMiddleware.js';
// // import uploadPhoto from '../middlewares/photoUploadMiddleware.js'; // <-- 2. IMPORT THE NEW MIDDLEWARE

// // const router = express.Router();

// // // --- Multer Configurations ---
// // const adminUpload = multer({ dest: 'uploads/' });
// // const userUpload = multer({ storage: multer.memoryStorage() });


// // // --- Admin/Verifier Routes ---
// // router.post(
// //   '/prepare',
// //   protect,
// //   isVerifier,
// //   adminUpload.fields([
// //     { name: 'motherDeed', maxCount: 1 },
// //     { name: 'encumbranceCertificate', maxCount: 1 },
// //   ]),
// //   preparePropertyRegistration
// // );

// // router.route('/:id/request-purchase').put(protect, requestPurchase);
// // router.post('/finalize', protect, isVerifier, finalizePropertyRegistration);

// // // This is the route for the "Registered Properties" page
// // router.get('/all', protect, isVerifier, getAllProperties);


// // // --- User and Public Routes ---
// // router.post(
// //   '/verify-documents',
// //   userUpload.fields([
// //     { name: 'motherDeed', maxCount: 1 },
// //     { name: 'encumbranceCertificate', maxCount: 1 },
// //   ]),
// //   verifyPropertyDocuments
// // );

// // // Routes for the secure listing workflow
// // router.post('/:id/prepare-listing', protect, prepareListingForSale);
// // router.post('/:id/finalize-listing', protect, finalizeListingForSale);

// // // --- IMPORTANT: SPECIFIC ROUTES MUST COME BEFORE GENERIC :id ROUTES ---

// // // Get user's own properties (MUST be before /:id)
// // router.get('/my', protect, getMyProperties);
// // router.get('/my-properties', protect, getMyProperties); // Alias for backward compatibility

// // router.put(
// //   '/list/:id', 
// //   protect, 
// //   uploadPhoto.single('image'), 
// //   listPropertySimple 
// // );

// // // --- 2. ADD THE NEW WITHDRAW ROUTE ---
// // router.put(
// //   '/withdraw/:id',
// //   protect,
// //   withdrawListing
// // );

// // // Marketplace routes
// // router.get('/marketplace', getMarketplaceProperties);

// // // Confirm sale
// // router.post('/:id/confirm-sale', protect, confirmSale);

// // // Generic property by ID route (MUST be last)
// // router.get('/:id', getPropertyById);

// // export default router;

// // Backend/routes/propertyRoutes.js

// import express from 'express';
// import multer from 'multer';

// // --- CORRECTED IMPORTS ---
// import {
//     preparePropertyRegistration,
//     finalizePropertyRegistration,
//     verifyPropertyDocuments,
//     prepareListingForSale,
//     finalizeListingForSale,
//     listPropertySimple,
//     withdrawListing,
//     requestPurchase, // <--- THE FIX IS HERE
//     getMarketplaceProperties,
//     confirmSale,
//     getMyProperties,
//     getPropertyById,
//     getMySoldProperties,
//     getAllProperties,
//     updatePropertyMapData,
// } from '../controllers/propertyController.js';

// import { protect, isVerifier } from '../middlewares/authMiddleware.js'; // isVerifier is imported correctly here
// import uploadPhoto from '../middlewares/photoUploadMiddleware.js';

// const router = express.Router();

// // --- Multer Configurations ---
// const adminUpload = multer({ dest: 'uploads/' }); // For Verifier PDF uploads
// const userUpload = multer({ storage: multer.memoryStorage() }); // For User PDF verification (in memory)

// // --- Admin/Verifier Routes ---
// router.post(
//     '/prepare',
//     protect,
//     isVerifier,
//     adminUpload.fields([
//         { name: 'motherDeed', maxCount: 1 },
//         { name: 'encumbranceCertificate', maxCount: 1 },
//     ]),
//     preparePropertyRegistration
// );

// router.post('/finalize', protect, isVerifier, finalizePropertyRegistration);

// router.get('/all', protect, isVerifier, getAllProperties); // For "Registered Properties" page

// // --- User and Public Routes ---
// router.post(
//     '/verify-documents', // User verifies their own docs against stored hashes
//     userUpload.fields([
//         { name: 'motherDeed', maxCount: 1 },
//         { name: 'encumbranceCertificate', maxCount: 1 },
//     ]),
//     verifyPropertyDocuments // Should this route be protected? Depends on your flow.
// );

// router.get('/my-sold', protect, getMySoldProperties);

// // Routes for the secure blockchain listing workflow (if you still need it)
// router.post('/:id/prepare-listing', protect, prepareListingForSale);
// router.post('/:id/finalize-listing', protect, finalizeListingForSale);

// // --- SPECIFIC ROUTES BEFORE GENERIC :id ROUTES ---

// // Get user's own properties
// router.get('/my', protect, getMyProperties);
// // Alias for backward compatibility if needed
// // router.get('/my-properties', protect, getMyProperties);

// // List/Edit property for sale (simple DB update + image upload)
// router.put(
//     '/list/:id',
//     protect,
//     uploadPhoto.single('image'), // Uses photo upload middleware
//     listPropertySimple
// );

// // Withdraw property from sale (simple DB update)
// router.put(
//     '/withdraw/:id',
//     protect,
//     withdrawListing
// );

// // Buyer requests to purchase property (simple DB update)
// router.put( // Changed from route() to put() as it's a single method
//     '/:id/request-purchase',
//     protect, // Any logged-in user can request
//     requestPurchase
// );

// // ✅ --- ADD NEW ROUTE FOR MAP DATA ---
// router.put(
//     '/:id/map-data',
//     protect,
//     updatePropertyMapData
// );

// // --- Public Marketplace Route ---
// router.get('/marketplace', getMarketplaceProperties);

// // --- Protected Routes (Potentially Buyer or Seller depending on context) ---

// // Confirm sale after blockchain transaction (likely called by Buyer after successful tx)
// router.post('/:id/confirm-sale', protect, confirmSale);

// // --- Generic :id Route (MUST BE LAST) ---
// router.get('/:id', getPropertyById); // Publicly view property details

// export default router;
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
    withdrawListing,
    requestPurchase,
    getMarketplaceProperties,
    confirmSale,
    getMyProperties,
    getPropertyById,
    getMySoldProperties,
    getAllProperties,
    updatePropertyMapData, // <-- 1. Import new controller
} from '../controllers/propertyController.js';

import { protect, isVerifier } from '../middlewares/authMiddleware.js';
import uploadPhoto from '../middlewares/photoUploadMiddleware.js';

const router = express.Router();

// --- Multer Configurations ---
const adminUpload = multer({ dest: 'uploads/' }); // For Verifier PDF uploads
const userUpload = multer({ storage: multer.memoryStorage() }); // For User PDF verification (in memory)

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

router.get('/all', protect, isVerifier, getAllProperties); // For "Registered Properties" page

// --- User and Public Routes ---
router.post(
    '/verify-documents', // User verifies their own docs against stored hashes
    userUpload.fields([
        { name: 'motherDeed', maxCount: 1 },
        { name: 'encumbranceCertificate', maxCount: 1 },
    ]),
    verifyPropertyDocuments
);

router.get('/my-sold', protect, getMySoldProperties);

// Routes for the secure blockchain listing workflow (if you still need it)
router.post('/:id/prepare-listing', protect, prepareListingForSale);
router.post('/:id/finalize-listing', protect, finalizeListingForSale);

// --- SPECIFIC ROUTES BEFORE GENERIC :id ROUTES ---

// Get user's own properties
router.get('/my', protect, getMyProperties);

// List/Edit property for sale (simple DB update + image upload)
router.put(
    '/list/:id',
    protect,
    uploadPhoto.single('image'), // Uses photo upload middleware
    listPropertySimple
);

// Withdraw property from sale (simple DB update)
router.put(
    '/withdraw/:id',
    protect,
    withdrawListing
);

// Buyer requests to purchase property (simple DB update)
router.put(
    '/:id/request-purchase',
    protect, // Any logged-in user can request
    requestPurchase
);

// ✅ --- 2. ADD NEW ROUTE FOR MAP DATA ---
// This route must be BEFORE the final '/:id' GET route
router.put(
    '/:id/map-data',
    protect,
    updatePropertyMapData
);

// --- Public Marketplace Route ---
router.get('/marketplace', getMarketplaceProperties);

// --- Protected Routes (Potentially Buyer or Seller depending on context) ---

// Confirm sale after blockchain transaction (likely called by Buyer after successful tx)
router.post('/:id/confirm-sale', protect, confirmSale);

// --- Generic :id Route (MUST BE LAST) ---
router.get('/:id', getPropertyById); // Publicly view property details

export default router;