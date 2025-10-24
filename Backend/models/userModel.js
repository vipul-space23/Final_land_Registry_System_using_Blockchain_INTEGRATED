import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  walletAddress: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['Buyer', 'Owner', 'Verifier'], 
    default: 'Buyer' 
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  // This field being required is often the cause of the error.
  kycDocument: { 
    type: String, 
    required: [true, 'Please upload a KYC document.'] // Add a custom error message
  },
  nonce: {
    type: String,
    default: () => Math.floor(Math.random() * 1000000).toString()
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;