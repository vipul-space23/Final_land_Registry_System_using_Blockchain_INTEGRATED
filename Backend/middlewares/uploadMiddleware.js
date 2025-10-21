import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    // This line tells multer to use the 'uploads/' directory.
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'kyc-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Allow images and PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// We already have one for property images, let's add one for KYC
export const uploadPropertyImage = upload.single('propertyImage');
export const uploadKycDocument = upload.single('kycDocument'); // The key 'kycDocument' is important