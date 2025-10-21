import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables first
dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import kycRoutes from './routes/kycRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import verifierRoutes from './routes/verifierRoutes.js';
import requestsRoutes from './routes/requests.js';

// Connect to the database
connectDB();
const app = express();

// --- Fix for __dirname in ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Email Credentials Check ---
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ FATAL ERROR: Email credentials not loaded from .env file.');
  process.exit(1);
}

// =======================================================
// === CRITICAL FIX: SINGLE, CORRECT CORS CONFIGURATION ===
// =======================================================
// This is the only CORS configuration your server should have.
const corsOptions = {
  origin: 'http://localhost:3000', // <-- Allows your React app
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
// =======================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Static File Serving ---

// This serves the 'uploads' folder for KYC documents
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- THIS IS THE NEW LINE ---
// This serves your entire project directory as static.
// It allows requests like 'http://localhost:5000/Backend/landphotos/image.png'
// to find the file at '[project_root]/Backend/landphotos/image.png'
app.use(express.static(__dirname));
// ----------------------------

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