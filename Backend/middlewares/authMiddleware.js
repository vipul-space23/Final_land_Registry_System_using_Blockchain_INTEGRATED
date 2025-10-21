import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Property from '../models/propertyModel.js';

// Protect routes by verifying the JWT from the Authorization header
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check for the Authorization header and that it starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get the token from the header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user from the token's payload using 'userId'
      //    and attach them to the request object (excluding the password)
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user) {
          res.status(401);
          throw new Error('Not authorized, user not found for this token');
      }

      // 5. If all is good, proceed to the next middleware or the route's controller
      next(); 
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // If there's no token at all, deny access
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware to check if the authenticated user is a 'Verifier'
export const isVerifier = (req, res, next) => {
  if (req.user && req.user.role === 'Verifier') {
    next(); // User is a verifier, proceed
  } else {
    res.status(403); // 403 Forbidden
    throw new Error('Forbidden: Verifier access required.');
  }
};

// Middleware to check if the user is a KYC-verified 'Owner'
export const isVerifiedSeller = (req, res, next) => {
    const isAuthorizedRole = req.user && (req.user.role === 'Owner');

    if (isAuthorizedRole && req.user.kycStatus === 'verified') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Action requires a KYC-verified Owner.' });
    }
};

// Middleware to check if a user owns a specific property
export const isOwner = asyncHandler(async (req, res, next) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
        return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'User not authorized for this property' });
    }
    
    req.property = property; 
    next();
});

