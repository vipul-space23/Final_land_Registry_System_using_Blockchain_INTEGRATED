// /controllers/kycController.js
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// @desc    Get current user's KYC status
// @route   GET /api/kyc/status
// @access  Private (requires authentication)
export const getKycStatus = async (req, res) => {
  try {
    console.log('--- Fetching KYC Status ---');
    console.log('User ID from auth:', req.user ? req.user.id : 'No user in req');

    if (!req.user) {
      console.log('Error: No authenticated user.');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.user.id).select('kycStatus role');

    if (!user) {
      console.log('Error: User not found.');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`KYC Status for ${user._id}: ${user.kycStatus}`);
    res.json({ 
      kycStatus: user.kycStatus,
      role: user.role 
    });
  } catch (error) {
    console.error('Error fetching KYC status:', error);
    res.status(500).json({ message: 'Server error while fetching KYC status' });
  }
};

// @desc    Upload Aadhaar for KYC
// @route   POST /api/kyc/upload
// @access  Private
export const uploadAadhaar = async (req, res) => {
  console.log('--- KYC Upload Process Started ---');
  
  if (!req.file) {
    console.log('Error: req.file is undefined. Upload failed.');
    return res.status(400).json({ message: 'No file uploaded or multer failed.' });
  }

  try {
    const user = await User.findById(req.user.id);
    console.log('User found in DB:', user?.email);

    if (user) {
      user.kycStatus = 'review_pending';
      user.aadhaarDocumentPath = req.file.path;
      console.log('Attempting to save with path:', user.aadhaarDocumentPath);

      const updatedUser = await user.save();
      console.log('User object after save:', updatedUser);

      res.json({
        message: 'KYC document uploaded. Awaiting verification.',
        user: updatedUser,
      });
    } else {
      console.log('Error: User not found in database.');
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('!!! ERROR during KYC upload process:', error);
    res.status(400).json({ 
      message: 'Error saving to database.',
      error: error.message 
    });
  }
};

