// import User from '../models/userModel.js';
// import Property from '../models/propertyModel.js';
// import path from 'path';
// import fs from 'fs';

// // @desc    Get all users pending KYC verification
// // @route   GET /api/verifier/pending-users
// // @access  Private/Verifier
// export const getPendingUsers = async (req, res) => {
//     try {
//         const pendingUsers = await User.find({ kycStatus: 'review_pending' }).select('-password');
//         res.json(pendingUsers);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };
// export const getVerifiedUsers = async (req, res) => {
//   try {
//     const verifiedUsers = await User.find({
//       kycStatus: 'verified',
//       role: { $in: ['Owner'] } // <-- filter here
//     })
//       .select('-password')
//       .sort({ updatedAt: -1 }); // most recently updated first

//     res.json({
//       success: true,
//       count: verifiedUsers.length,
//       data: verifiedUsers
//     });
//   } catch (error) {
//     console.error('Error fetching verified users:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching verified users'
//     });
//   }
// };
// // @desc    View a specific user's Aadhaar document
// // @route   GET /api/verifier/users/:id/document
// // @access  Private/Verifier
// export const viewAadhaarDocument = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user || !user.aadhaarDocumentPath) {
//             return res.status(404).json({ message: 'Document not found for this user.' });
//         }
//         const filePath = path.resolve(user.aadhaarDocumentPath);
//         res.sendFile(filePath, (err) => {
//             if (err) {
//                 console.error('Error sending file:', err);
//                 res.status(404).json({ message: 'File not found on server disk.' });
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Get all properties pending verification
// // @route   GET /api/verifier/pending-properties
// // @access  Private/Verifier
// export const getPendingProperties = async (req, res) => {
//     try {
//         const properties = await Property.find({ status: 'pending_verification' })
//             .populate('owner', 'name email');
//         res.json(properties);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Update a user's KYC status (and delete doc if verified)
// // @route   PUT /api/verifier/users/:id/status
// // @access  Private/Verifier
// export const updateUserKycStatus = async (req, res) => {
//     const { status } = req.body;

//     if (!status || !['verified', 'rejected'].includes(status)) {
//         return res.status(400).json({ message: 'Invalid status provided.' });
//     }

//     try {
//         const user = await User.findById(req.params.id);
//         if (user) {
//             const documentPath = user.aadhaarDocumentPath; // Get the path before updating

//             user.kycStatus = status;

//             // If the user is being verified, clear the path and delete the file
//             if (status === 'verified') {
//                 user.aadhaarDocumentPath = undefined; // Clear the path for privacy
//             }

//             const updatedUser = await user.save();

//             // After successfully saving, delete the file if the user was verified
//             if (status === 'verified' && documentPath) {
//                 fs.unlink(documentPath, (err) => {
//                     if (err) {
//                         console.error('Error deleting Aadhaar file:', err);
//                     } else {
//                         console.log('Successfully deleted Aadhaar file:', documentPath);
//                     }
//                 });
//             }

//             res.json(updatedUser);
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

import User from '../models/userModel.js';
import Property from '../models/propertyModel.js'; // Make sure you have a property model
import { sendVerificationSuccessEmail, sendVerificationRejectionEmail } from '../utils/emailService.js';

/**
 * Gets the list of all users with 'pending' status.
 */
export const getPendingUsers = async (req, res, next) => {
    try {
        const pendingUsers = await User.find({ kycStatus: 'pending' });
        res.status(200).json(pendingUsers);
    } catch (error) {
        next(error);
    }
};

/**
 * Approves a user, updates their status in MongoDB, and sends an approval email.
 */
export const verifyUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        user.kycStatus = 'verified';
        await user.save();
        
        // Send the approval email
        await sendVerificationSuccessEmail(user.email, user.name); 

        res.status(200).json({ message: `${user.name} has been approved successfully.` });
    } catch (error) {
        next(error);
    }
};

/**
 * Rejects a user, updates their status in MongoDB, and sends a rejection email.
 */
export const rejectUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        user.kycStatus = 'rejected';
        await user.save();
        
        // CRITICAL FIX: Send the rejection email
        await sendVerificationRejectionEmail(user.email, user.name);
        
        res.status(200).json({ message: `${user.name} has been rejected.` });
    } catch (error) {
        next(error);
    }
};

export const getVerifiedUsers = async (req, res, next) => {
    try {
        // Find all users where the kycStatus is 'verified'
        // We exclude the 'Verifier' role itself from this list
        const users = await User.find({ 
            kycStatus: 'verified',
            role: { $ne: 'Verifier' } // $ne means 'not equal'
        }).select('-password'); // Exclude password from the result

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        // Pass any errors to the global error handler
        next(error);
    }
};
/**
 * Gets the statistics for the main Verifier Dashboard page.
 */
export const getVerifierStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const pendingUsers = await User.countDocuments({ kycStatus: 'pending' });
        const totalProperties = await Property.countDocuments(); // Ensure you have a Property model for this to work
        
        res.status(200).json({
            totalUsers,
            pendingUsers,
            totalProperties,
        });
    } catch (error) {
        next(error);
    }
};