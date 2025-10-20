// import jwt from 'jsonwebtoken';
// import User from '../models/userModel.js';
// import Property from '../models/propertyModel.js';
// import {ethers} from 'ethers';
// // Protect routes (check JWT)
// export const protect = async (req, res, next) => {
//   let token = req.cookies.jwt;

//   // Check Authorization header if cookie not present
//   if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) return res.status(401).json({ message: "Not authorized, no token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Not authorized, token failed" });
//   }
// };


// // Middleware to check if user is a KYC-verified Seller/Owner
// export const isVerifiedSeller = (req, res, next) => {
//     const isAuthorizedRole = req.user && (req.user.role === 'Seller' || req.user.role === 'Owner');

//     if (isAuthorizedRole && req.user.kycStatus === 'verified') {
//         next();
//     } else {
//         res.status(403).json({ message: 'Forbidden: Action requires a KYC-verified Seller or Owner.' });
//     }
// };

// // Middleware to check if user is a Verifier
// export const isVerifier = (req, res, next) => {
//     if (req.user && req.user.role === 'Verifier') {
//         next();
//     } else {
//         res.status(403).json({ message: 'Forbidden: Verifier access required.' });
//     }
// };
// // In /middlewares/authMiddleware.js
// export const isOwner = async (req, res, next) => {
//     const property = await Property.findById(req.params.id);

//     if (!property) {
//         return res.status(404).json({ message: 'Property not found' });
//     }

//     if (property.owner.toString() !== req.user.id) {
//         return res.status(403).json({ message: 'User not authorized for this property' });
//     }
    
//     // If the checks pass, attach the property to the request and continue
//     req.property = property; 
//     next();
// };
// export const authMiddleware = (req, res, next) => {
//   try {
//     const { walletAddress, signature, signedMessage } = req.body;
//     if (!walletAddress || !signature || !signedMessage) {
//       return res.status(401).json({ message: 'Authentication details missing.' });
//     }

//     // Recover the address that signed the message
//     const recoveredAddress = ethers.utils.verifyMessage(signedMessage, signature);

//     // Check if the recovered address matches the one provided
//     if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
//       return res.status(401).json({ message: 'Invalid signature.' });
//     }

//     // If valid, attach the user's address to the request object for later use
//     req.user = { walletAddress: recoveredAddress.toLowerCase() };
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Authentication failed.' });
//   }
// };

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Property from '../models/propertyModel.js';
import {ethers} from 'ethers';

// Middleware to protect routes by verifying the token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // --- FIX 1: Read the correct cookie name ('token') ---
  token = req.cookies.token;

  // Fallback for Authorization header (this part is good)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // --- FIX 2: Use the correct payload property ('userId') ---
    req.user = await User.findById(decoded.userId).select("-password");
    
    // Safety check in case the user was deleted after the token was issued
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
    }

    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});


// Middleware to check if user is a KYC-verified Seller/Owner
export const isVerifiedSeller = (req, res, next) => {
    // Changed role to 'Owner' to match your user data
    const isAuthorizedRole = req.user && (req.user.role === 'Owner' || req.user.role === 'Buyer');

    if (isAuthorizedRole && req.user.kycStatus === 'verified') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Action requires a KYC-verified Seller or Owner.' });
    }
};

// Middleware to check if user is a Verifier
export const isVerifier = (req, res, next) => {
    if (req.user && req.user.role === 'Verifier') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Verifier access required.' });
    }
};

// Middleware to check if a user owns a specific property
export const isOwner = async (req, res, next) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
        return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'User not authorized for this property' });
    }
    
    req.property = property; 
    next();
};

// Middleware for signature-based auth (if needed elsewhere)
export const authMiddleware = (req, res, next) => {
  try {
    const { walletAddress, signature, signedMessage } = req.body;
    if (!walletAddress || !signature || !signedMessage) {
      return res.status(401).json({ message: 'Authentication details missing.' });
    }

    const recoveredAddress = ethers.utils.verifyMessage(signedMessage, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid signature.' });
    }

    req.user = { walletAddress: recoveredAddress.toLowerCase() };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

