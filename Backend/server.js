import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// =======================================================
// === CRITICAL FIX: Load environment variables FIRST ===
dotenv.config();
// =======================================================

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import kycRoutes from './routes/kycRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import verifierRoutes from './routes/verifierRoutes.js';
import requestsRoutes from './routes/requests.js';

connectDB(); // Now this can safely use the MONGO_URI
const app = express();

// --- Fix for __dirname in ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Email Credentials Check ---
// If the variables are missing, stop the server with a clear error
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ FATAL ERROR: Email credentials not loaded from .env file.');
  console.error('Please check that your .env file is in the same directory as your server.js and is named correctly.');
  process.exit(1); // This will stop the server from running further
}

// --- Middleware ---
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Static File Serving ---
// This serves your uploaded KYC documents.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/verifier', verifierRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/requests', requestsRoutes);

// --- Error Handling Middleware ---
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

app.use(notFound);
app.use(errorHandler);

// --- Server Listening ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));