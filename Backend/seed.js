import mongoose from 'mongoose';
import User from './models/userModel.js';

import dotenv from 'dotenv';

dotenv.config();

const adminAccount = [
  {
    name: "Sahil Patil",
    email: "sahil@gmail.com",
    phone: "1234567890",
    password: "123456", // Will be hashed by pre-save hook
    role: "Verifier",
    kycStatus: "verified",
    walletAddress: "0x8acc619627aB72E728ae18D494b965238E23f803",
  },
];

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected');

    // Remove old Verifier/admin accounts
    await User.deleteMany({ role: 'Verifier' });
    console.log('Old Verifier/Admin accounts cleared');

    // Create new admin account(s) - pre-save hook will hash the password
    for (const admin of adminAccount) {
      await User.create(admin);
    }

    console.log('✅ Admin account seeded successfully!');

  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
  }
};

// Run the seeding script
seedDB();
