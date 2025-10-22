// import express from 'express';
// import { protect, isVerifiedSeller } from '../middlewares/authMiddleware.js';
// import {
//   getSellerRequests,
//   withdrawFunds,
//   rejectTrade,
//   getSellerSales,
//   getPropertyByTokenId
// } from '../controllers/requestsController.js';

// // --- FIX: Import the model you are using ---

// const router = express.Router();

// // All routes require the user to be logged in and a verified seller
// router.use(protect, isVerifiedSeller);

// // GET all requests for seller
// router.get('/seller', getSellerRequests);

// // POST withdraw funds for a sold property
// router.post('/:id/withdraw', withdrawFunds);

// // POST reject a trade
// router.post('/:id/reject', rejectTrade);
// router.get('/by-token/:tokenId', getPropertyByTokenId);
// router.get('/my-sales', getSellerSales); // The 'protect' middleware is already applied with router.use()

// // --- FIX: Changed 'app.get' to 'router.get' and corrected the path ---
// router.get('/pending-offers/:sellerAddress', async (req, res) => {
//   try {
//     const { sellerAddress } = req.params;
    
//     // Query your database for pending purchase requests
//     const pendingOffers = await PurchaseRequest.find({
//       seller: sellerAddress,
//       status: 'pending' // or whatever status indicates active offers
//     });
    
//     res.json(pendingOffers);
//   } catch (error) {
//     console.error("Failed to fetch pending offers:", error); // It's good practice to log the error
//     res.status(500).json({ error: 'Failed to fetch pending offers' });
//   }
// });

// export default router;

import express from 'express';
import { protect, isVerifiedSeller } from '../middlewares/authMiddleware.js';
import {
  getSellerRequests,
  withdrawFunds,
  rejectTrade,
  getSellerSales,
  approveSale,
  getPropertyByTokenId
} from '../controllers/requestsController.js';
// The 'approveSale' controller is in 'requestController.js', but you are not
// importing or using it here. You should add it if you need it.

const router = express.Router();

// All routes require the user to be logged in and a verified seller
router.use(protect, isVerifiedSeller);

// GET all requests for seller
router.get('/seller', getSellerRequests);

// This is the route your seller's "Approve" button will call
router.post('/:id/approve', approveSale);

router.post('/:id/withdraw', withdrawFunds);
router.post('/:id/reject', rejectTrade);
router.get('/by-token/:tokenId', getPropertyByTokenId);
router.get('/my-sales', getSellerSales);

// --- FIX: REMOVED THE BROKEN /pending-offers ROUTE ---
// The 'getSellerRequests' controller already handles this logic
// by finding properties with status: 'pending_seller_verification'.

export default router;