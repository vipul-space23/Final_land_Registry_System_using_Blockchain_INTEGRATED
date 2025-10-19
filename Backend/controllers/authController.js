import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import User from '../models/userModel.js';

// Helper function to generate a secure login token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- AUTHENTICATION CONTROLLER FUNCTIONS ---

/**
 * Handles the one-time setup for the Verifier/Admin account.
 */
export const setupVerifier = async (req, res, next) => {
    try {
        const { email, walletAddress } = req.body;
        const lowerCaseWalletAddress = walletAddress.toLowerCase();
        const verifierExists = await User.findOne({ role: 'Verifier' });
        if (verifierExists) {
            res.status(400);
            throw new Error('A Verifier account already exists.');
        }
        const verifier = await User.create({
            name: 'Land Inspector', email,
            walletAddress: lowerCaseWalletAddress,
            role: 'Verifier', kycStatus: 'verified', kycDocument: 'N/A'
        });
        res.status(201).json({ message: 'Verifier account created!', walletAddress: verifier.walletAddress });
    } catch (error) {
        next(error);
    }
};

/**
 * Handles registration for new Buyers and Owners (Sellers).
 */
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, walletAddress, role } = req.body;
        const lowerCaseWalletAddress = walletAddress.toLowerCase();

        if (!req.file) {
            res.status(400);
            throw new Error('KYC document is required.');
        }

        const userExists = await User.findOne({ walletAddress: lowerCaseWalletAddress });
        if (userExists) {
            res.status(400);
            throw new Error('A user with this wallet address already exists.');
        }
        const emailExists = await User.findOne({ email });
        if(emailExists){
            res.status(400);
            throw new Error('A user with this email address already exists.');
        }

        const user = await User.create({
            name, email,
            walletAddress: lowerCaseWalletAddress,
            role,
            kycDocument: req.file.path,
            kycStatus: 'pending',
        });

        if (user) {
            res.status(201).json({ message: 'Registration successful! Please wait for approval.' });
        } else {
            res.status(400);
            throw new Error('Invalid user data received.');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Provides a unique, one-time message for a user to sign.
 */
export const getNonceForSignature = async (req, res, next) => {
    try {
        const { walletAddress } = req.body;
        const lowerCaseWalletAddress = walletAddress.toLowerCase();
        const user = await User.findOne({ walletAddress: lowerCaseWalletAddress });
        if (!user) {
            res.status(404);
            throw new Error('User with this wallet not found. Please register first.');
        }
        user.nonce = Math.floor(Math.random() * 1000000).toString();
        await user.save();
        res.status(200).json({ message: `Please sign this message to log in: ${user.nonce}` });
    } catch (error) {
        next(error);
    }
};

/**
 * Verifies a user's signature and logs them in if they are approved.
 */
export const loginWithSignature = async (req, res, next) => {
    try {
        const { walletAddress, signature } = req.body;
        const lowerCaseWalletAddress = walletAddress.toLowerCase();

        const user = await User.findOne({ walletAddress: lowerCaseWalletAddress });
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        if (user.kycStatus !== 'verified') {
            res.status(403);
            throw new Error(`Your account is currently ${user.kycStatus}. Please wait for approval.`);
        }

        const message = `Please sign this message to log in: ${user.nonce}`;
        const recoveredAddress = ethers.verifyMessage(message, signature);

       if (recoveredAddress.toLowerCase() === lowerCaseWalletAddress) {
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
       kycStatus: user.kycStatus, // ✅ ADD THIS
        token: generateToken(user._id), // ✅ Just the token, no prefix
    });
} else {
    res.status(401);
    throw new Error('Invalid signature. Login failed.');
}
    } catch (error) {
        next(error);
    }
};