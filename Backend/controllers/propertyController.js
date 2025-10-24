import asyncHandler from 'express-async-handler';
import { ethers } from 'ethers';
import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import { fileURLToPath } from 'url';
import User from '../models/userModel.js';
import Property from '../models/propertyModel.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const propertyTitleABIFile = fs.readFileSync(path.join(__dirname, '../abis/PropertyTitle.json'), 'utf-8');
const PropertyTitleABI = JSON.parse(propertyTitleABIFile);

const marketplaceABIFile = fs.readFileSync(path.join(__dirname, '../abis/MarketPlace.json'), 'utf-8');
const marketplaceABI = JSON.parse(marketplaceABIFile).abi;

// --- Admin Registration Workflow ---
export const preparePropertyRegistration = asyncHandler(async (req, res) => {
  const { propertyId } = req.body;
  const tempDir = path.join(__dirname, '../uploads', propertyId);

  try {
    const {
      ownerWalletAddress, ownerName, surveyNumber, propertyAddress, district, area,
    } = req.body;

    if (!ownerWalletAddress || !ownerName || !surveyNumber || !propertyId || !propertyAddress || !district || !area) {
      return res.status(400).json({ success: false, message: 'Missing required property data fields.' });
    }
    if (!ethers.isAddress(ownerWalletAddress)) {
      return res.status(400).json({ success: false, message: 'Invalid owner wallet address format.' });
    }
    if (!req.files || !req.files.motherDeed || !req.files.encumbranceCertificate) {
      return res.status(400).json({ success: false, message: 'Both document files are required.' });
    }

    const existingProperty = await Property.findOne({ propertyId });
    if (existingProperty) {
      return res.status(400).json({ success: false, message: 'A property with this ID already exists.' });
    }
    
    fse.ensureDirSync(tempDir);
    const motherDeedFile = req.files.motherDeed[0];
    const encumbranceCertFile = req.files.encumbranceCertificate[0];
    const newMotherDeedPath = path.join(tempDir, 'motherDeed.pdf');
    const newEncumbrancePath = path.join(tempDir, 'encumbrance.pdf');
    fs.renameSync(motherDeedFile.path, newMotherDeedPath);
    fs.renameSync(encumbranceCertFile.path, newEncumbrancePath);

    let documentHashes;
    try {
      const uploadFile = async (filePath, docType) => {
        const fileStream = fs.createReadStream(filePath);
        const formData = new FormData();
        formData.append('file', fileStream, {
          filename: path.basename(filePath),
          contentType: 'application/pdf',
        });
        formData.append('pinataMetadata', JSON.stringify({
          name: `${propertyId}_${docType}`,
          keyvalues: { propertyId, documentType: docType, verifier: req.user.walletAddress }
        }));
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            'pinata_api_key': process.env.PINATA_API_KEY,
            'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
          },
          body: formData,
        });
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Failed to upload ${docType} to IPFS: ${response.statusText} - ${errorBody}`);
        }
        const result = await response.json();
        return result.IpfsHash;
      };
      const motherDeedHash = await uploadFile(newMotherDeedPath, 'mother_deed');
      const encumbranceCertHash = await uploadFile(newEncumbrancePath, 'encumbrance_certificate');
      documentHashes = [motherDeedHash, encumbranceCertHash];
    } finally {
      if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
    
    const contractInterface = new ethers.Interface(PropertyTitleABI.abi);
    const encodedFunctionCall = contractInterface.encodeFunctionData('mintTitle', [
      ownerWalletAddress,
      surveyNumber,
      propertyId,
      propertyAddress,
      district,
      parseInt(area),
      ownerName,
      documentHashes
    ]);

    const transactionData = {
      to: process.env.PROPERTYTITLE_ADDRESS,
      data: encodedFunctionCall,
    };

    res.status(200).json({
      success: true,
      message: 'Transaction data prepared. Please sign with your wallet.',
      transactionData,
      propertyData: { 
        ownerWalletAddress, ownerName, surveyNumber, propertyId, propertyAddress, district, area, documentHashes
      }
    });

  } catch (error) {
    console.error('Error preparing property registration:', error);
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
    res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
});

// export const finalizePropertyRegistration = asyncHandler(async (req, res) => {
//   const { transactionHash, propertyData } = req.body;

//   if (!transactionHash || !propertyData) {
//     return res.status(400).json({ success: false, message: 'Missing transactionHash or propertyData.' });
//   }

//   const provider = new ethers.JsonRpcProvider(process.env.GANACHE_URL || process.env.RPC_URL);
  
//   const receipt = await provider.waitForTransaction(transactionHash);
  
//   if (receipt.status === 0) {
//     throw new Error('Blockchain transaction failed.');
//   }

//   let tokenId;
//   const contractInterface = new ethers.Interface(PropertyTitleABI.abi);
  
//   for (const log of receipt.logs) {
//     try {
//       const parsedLog = contractInterface.parseLog({
//         topics: [...log.topics],
//         data: log.data
//       });
      
//       if (parsedLog && parsedLog.name === 'TitleMinted') {
//         tokenId = parsedLog.args.tokenId.toString();
//         break;
//       }
//     } catch (e) {
//       // Ignore logs that don't match the ABI
//     }
//   }

//   if (!tokenId) {
//     throw new Error('Could not find TitleMinted event in the transaction receipt.');
//   }

//   const propertyOwner = await User.findOne({ walletAddress: propertyData.ownerWalletAddress });
//   if (!propertyOwner) {
//     return res.status(404).json({ success: false, message: 'Property owner not found.' });
//   }

//   const newProperty = new Property({
//     tokenId,
//     transactionHash,
//     surveyNumber: propertyData.surveyNumber,
//     propertyId: propertyData.propertyId, // This should be propertyPID
//     propertyAddress: propertyData.propertyAddress,
//     district: propertyData.district,
//     area: parseInt(propertyData.area),
//     ownerWalletAddress: propertyData.ownerWalletAddress,
//     ownerName: propertyData.ownerName,
//     documentHashes: propertyData.documentHashes,
//     status: 'pending',
//     owner: propertyOwner._id,
//     verifier: req.user._id,
//   });

//   await newProperty.save();

//   res.status(201).json({
//     success: true,
//     message: 'Property registration finalized and saved to database!',
//     data: { tokenId, propertyId: propertyData.propertyId, transactionHash }
//   });
// });
export const finalizePropertyRegistration = asyncHandler(async (req, res) => {
  const { transactionHash, propertyData } = req.body;

  if (!transactionHash || !propertyData) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing transactionHash or propertyData.' 
    });
  }

  try {
    const provider = new ethers.JsonRpcProvider(
      process.env.GANACHE_URL || process.env.RPC_URL
    );
    
    // Wait for transaction with timeout
    const receipt = await Promise.race([
      provider.waitForTransaction(transactionHash),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transaction timeout')), 60000)
      )
    ]);
    
    if (!receipt) {
      return res.status(400).json({ 
        success: false, 
        message: 'Transaction receipt not found. Please check the transaction hash.' 
      });
    }
    
    if (receipt.status === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Transaction failed on blockchain. Please try again.' 
      });
    }

    let tokenId;
    const contractInterface = new ethers.Interface(PropertyTitleABI.abi);
    
    // Try to find the TitleMinted event
    for (const log of receipt.logs) {
      try {
        const parsedLog = contractInterface.parseLog({
          topics: [...log.topics],
          data: log.data
        });
        
        if (parsedLog && parsedLog.name === 'TitleMinted') {
          tokenId = parsedLog.args.tokenId.toString();
          break;
        }
      } catch (e) {
        // Continue checking other logs
        continue;
      }
    }

    // Better error handling when tokenId is not found
    if (!tokenId) {
      console.error('Transaction receipt logs:', JSON.stringify(receipt.logs, null, 2));
      return res.status(400).json({ 
        success: false, 
        message: 'Could not verify property minting. The transaction completed but the TitleMinted event was not found. Please contact support with transaction hash: ' + transactionHash,
        transactionHash,
        debugInfo: {
          logsCount: receipt.logs.length,
          contractAddress: process.env.PROPERTYTITLE_ADDRESS
        }
      });
    }

    // Check if property owner exists
    const propertyOwner = await User.findOne({ 
      walletAddress: propertyData.ownerWalletAddress 
    });
    
    if (!propertyOwner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Property owner not found in database. Please ensure the owner is registered.' 
      });
    }

    // Create new property record
    const newProperty = new Property({
      tokenId,
      transactionHash,
      surveyNumber: propertyData.surveyNumber,
      propertyId: propertyData.propertyId,
      propertyAddress: propertyData.propertyAddress,
      district: propertyData.district,
      area: parseInt(propertyData.area),
      ownerWalletAddress: propertyData.ownerWalletAddress,
      ownerName: propertyData.ownerName,
      documentHashes: propertyData.documentHashes,
      status: 'pending',
      owner: propertyOwner._id,
      verifier: req.user._id,
    });

    await newProperty.save();

    res.status(201).json({
      success: true,
      message: 'Property registration finalized and saved to database!',
      data: { 
        tokenId, 
        propertyId: propertyData.propertyId, 
        transactionHash 
      }
    });

  } catch (error) {
    console.error('Error finalizing property registration:', error);
    
    // Send user-friendly error messages
    let errorMessage = 'Failed to finalize property registration. ';
    
    if (error.message.includes('timeout')) {
      errorMessage += 'The transaction is taking too long. Please check your blockchain connection.';
    } else if (error.message.includes('network')) {
      errorMessage += 'Network error. Please check your internet connection.';
    } else {
      errorMessage += error.message;
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// --- User Document Verification Workflow ---
export const verifyPropertyDocuments = asyncHandler(async (req, res) => {
  const tempDir = path.join(__dirname, '../Uploads', `verify-${Date.now()}`);
  try {
    const { district, surveyNumber } = req.body;
    const files = req.files;
    const requesterAddress = req.body.walletAddress;

    if (!district || !surveyNumber) {
      return res.status(400).json({ message: 'District and survey number are required.' });
    }
    if (!files || !files.motherDeed || !files.motherDeed[0] || !files.encumbranceCertificate || !files.encumbranceCertificate[0]) {
      return res.status(400).json({ message: 'Both Mother Deed and Encumbrance Certificate files are required.' });
    }

    const property = await Property.findOne({ district, surveyNumber });
    if (!property) {
      return res.status(404).json({ message: 'Property not found with the provided district and survey number.' });
    }

    if (property.status === 'verified') {
      return res.status(400).json({ message: 'This property has already been verified.' });
    }
    if (property.ownerWalletAddress.toLowerCase() !== requesterAddress.toLowerCase()) {
      return res.status(403).json({ message: 'Forbidden: You are not the owner of this property.' });
    }

    if (!property.documentHashes || !Array.isArray(property.documentHashes) || property.documentHashes.length < 2) {
      return res.status(500).json({ message: 'Invalid document hashes in database.' });
    }

    fse.ensureDirSync(tempDir);
    const motherDeedFile = files.motherDeed[0];
    const encumbranceCertFile = files.encumbranceCertificate[0];
    const newMotherDeedPath = path.join(tempDir, 'motherDeed.pdf');
    const newEncumbrancePath = path.join(tempDir, 'encumbrance.pdf');
    
    fs.writeFileSync(newMotherDeedPath, motherDeedFile.buffer);
    fs.writeFileSync(newEncumbrancePath, encumbranceCertFile.buffer);

    const uploadFile = async (filePath, docType) => {
      const fileStream = fs.createReadStream(filePath);
      const formData = new FormData();
      formData.append('file', fileStream, {
        filename: path.basename(filePath),
        contentType: 'application/pdf',
      });
      formData.append('pinataMetadata', JSON.stringify({
        name: `${property.propertyId}_${docType}`,
        keyvalues: { propertyId: property.propertyId, documentType: docType, verifier: req.user?.walletAddress || 'unknown' }
      }));
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': process.env.PINATA_API_KEY,
          'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to upload ${docType} to IPFS: ${response.statusText} - ${errorBody}`);
      }
      const result = await response.json();
      return result.IpfsHash;
    };

    let uploadedMotherDeedHash, uploadedEncumbranceCertHash;
    try {
      uploadedMotherDeedHash = await uploadFile(newMotherDeedPath, 'mother_deed');
      uploadedEncumbranceCertHash = await uploadFile(newEncumbrancePath, 'encumbrance_certificate');
    } finally {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }

    if (uploadedMotherDeedHash !== property.documentHashes[0]) {
      return res.status(400).json({ message: 'Verification failed. Mother Deed does not match the official record.' });
    }
    if (uploadedEncumbranceCertHash !== property.documentHashes[1]) {
      return res.status(400).json({ message: 'Verification failed. Encumbrance Certificate does not match the official record.' });
    }

    property.status = 'verified';
    await property.save();
    return res.status(200).json({ success: true, message: 'Verification successful! The land is now confirmed.' });
  } catch (error) {
    console.error('Error during document verification:', error);
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    return res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
});

// ... (keep all your other controller functions like preparePropertyRegistration, etc.)

/**
 * @desc    List or EDIT a verified property for sale (Simple version)
 * @route   PUT /api/properties/list/:id
 * @access  Private (Owner)
 */
export const listPropertySimple = asyncHandler(async (req, res) => {
  // 1. Get price from the form body
  const { price } = req.body;

  // --- MODIFIED: Image is now optional ---
  const imagePath = req.file ? req.file.path : null;

  // 3. Validation
  if (!price) {
    res.status(400);
    throw new Error('Price is required');
  }

  const numericPrice = Number(price);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    res.status(400);
    throw new Error('A valid, positive price is required.');
  }

  // 4. Find the property
  const property = await Property.findById(req.params.id);

  // 5. Check ownership
  if (!property || property.owner.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Property not found or user not authorized');
  }

  // 6. Check status (can be 'verified' OR 'listed_for_sale')
  if (property.status !== 'verified' && property.status !== 'listed_for_sale') {
    res.status(400);
    throw new Error('Only verified or listed properties can be edited.');
  }

  // 7. Update the property
  property.price = numericPrice;
  property.status = 'listed_for_sale';
  
  // --- MODIFIED: Only update image if a new one was uploaded ---
if (req.file) {
    // req.file.filename is 'image-12345.png'
    // We build the correct URL path: 'landphotos/image-12345.png'
    // We must use forward slashes for URLs
    const imagePath = `landphotos/${req.file.filename}`;
    property.image = imagePath; // Save this clean path
  } else if (property.status === 'verified') {
    // This is the first time listing, and they didn't upload an image
    res.status(400);
    throw new Error('An image is required when listing for the first time.');
  }
  
  const updatedProperty = await property.save();
  
  res.status(200).json(updatedProperty);
});


// --- NEW FUNCTION ---
/**
 * @desc    Withdraw a property from the marketplace
 * @route   PUT /api/properties/withdraw/:id
 * @access  Private (Owner)
 */
export const withdrawListing = asyncHandler(async (req, res) => {
  // 1. Find the property
  const property = await Property.findById(req.params.id);

  // 2. Check ownership
  if (!property || property.owner.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Property not found or user not authorized');
  }

  // 3. Check status
  if (property.status !== 'listed_for_sale') {
    res.status(400);
    throw new Error('Only listed properties can be withdrawn.');
  }

  // 4. Update status back to 'verified'
  property.status = 'verified';
  // You could also reset the price if you want
  // property.price = 0; 
  
  const updatedProperty = await property.save();
  
  res.status(200).json(updatedProperty);
});

// ... (keep all your other controller functions like getMyProperties, etc.)

// --- User Property Listing Workflow (Complex Blockchain version) ---
export const prepareListingForSale = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'User not authorized' });

    const { price } = req.body;
    if (!price || isNaN(price) || Number(price) <= 0)
      return res.status(400).json({ message: 'Valid price is required' });

    const contractInterface = new ethers.Interface(PropertyTitleABI.abi);

    const encodedFunctionCall = contractInterface.encodeFunctionData('approve', [
      process.env.MARKETPLACE_ADDRESS,
      property.tokenId,
    ]);

    const transactionData = {
      to: process.env.PROPERTYTITLE_ADDRESS,
      data: encodedFunctionCall,
    };

    res.status(200).json({
      success: true,
      message: 'Approval transaction prepared. Please sign with your wallet.',
      transactionData,
    });
});

export const finalizeListingForSale = asyncHandler(async (req, res) => {
    const { approveTxHash, listTxHash, price } = req.body;
    if (!approveTxHash || !listTxHash || !price)
      return res.status(400).json({ message: 'Transaction hashes and price are required' });

    if (isNaN(price) || Number(price) <= 0)
      return res.status(400).json({ message: 'Invalid price' });

    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'User not authorized' });

    const provider = new ethers.JsonRpcProvider(process.env.GANACHE_URL);

    const approveReceipt = await provider.waitForTransaction(approveTxHash);
    if (!approveReceipt || approveReceipt.status === 0)
      throw new Error('Approval transaction failed');

    const listReceipt = await provider.waitForTransaction(listTxHash);
    if (!listReceipt || listReceipt.status === 0)
      throw new Error('Listing transaction failed');

    property.status = 'listed_for_sale';
    property.price = Number(price);
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property successfully listed for sale!',
      data: property,
    });
});

export const getMyProperties = asyncHandler(async (req, res) => {
  // --- START OF DEBUGGING LOGS ---

  console.log('--- Debugging /api/properties/my-properties ---');

  // 1. Log the ID of the user making the request.
  // This comes from the JWT token after the 'protect' middleware verifies it.
  const loggedInUserId = req.user ? req.user.id : 'No user found on request';
  console.log('Logged-in user ID from token:', loggedInUserId);

  // 2. We can add a check to see if they match right here.
  if (req.user && loggedInUserId.toString() === '68f4f450e5f755dc77b9d2cd') {
    console.log('✅ SUCCESS: The logged-in user ID matches the property owner ID.');
  } else {
    console.log('❌ MISMATCH: The logged-in user ID does NOT match the known property owner ID.');
  }
  
  // --- END OF DEBUGGING LOGS ---

  // It correctly looks for properties where the 'owner' field
  // matches the ID of the logged-in user from the token (req.user.id).
  const properties = await Property.find({ owner: req.user.id })
    .select('-documentHashes')
    .populate('previousOwner', 'name email walletAddress phone') 
  
  // 3. Log the result of the database query.
  console.log(`Database query found ${properties.length} properties for this user.`);
  console.log('--------------------------------------------------');
    
  res.json(properties);
});


export const getMarketplaceProperties = asyncHandler(async (req, res) => {
    const properties = await Property.find({ status: 'listed_for_sale' })
        .populate('owner', 'name email');
    res.json(properties);
});

export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate('owner', 'name email phone');
  if (property) {
    res.json(property);
  } else {
    res.status(404).json({ message: 'Property not found' });
  }
});

// export const confirmSale = asyncHandler(async (req, res) => {
//     const { buyerWalletAddress, transactionHash } = req.body;

//     if (!buyerWalletAddress || !transactionHash) {
//         return res.status(400).json({ message: 'Buyer wallet and transaction hash are required.' });
//     }

//     if (!req.user || !req.user.walletAddress) {
//         return res.status(401).json({ message: 'User not properly authenticated.' });
//     }

//     const userWallet = req.user.walletAddress.toLowerCase();
//     const buyerWallet = buyerWalletAddress.toLowerCase();
//     if (userWallet !== buyerWallet) {
//         return res.status(403).json({ message: 'Wallet address does not match authenticated user.' });
//     }

//     const property = await Property.findById(req.params.id);
//     if (!property) {
//         return res.status(404).json({ message: 'Property not found' });
//     }

//     property.previousOwner = property.owner;
//     property.owner = req.user._id;
//     property.status = 'verified';
//     property.transactionHash = transactionHash;
//     property.soldAt = new Date();

//     const updatedProperty = await property.save();

//     res.json({
//         message: 'Sale confirmed and property updated successfully.',
//         property: updatedProperty
//     });
// });
export const confirmSale = asyncHandler(async (req, res) => {
    const { buyerWalletAddress, transactionHash } = req.body;

    console.log('🔍 confirmSale called with:', { buyerWalletAddress, transactionHash, propertyId: req.params.id });

    if (!buyerWalletAddress || !transactionHash) {
        return res.status(400).json({ 
            success: false,
            message: 'Buyer wallet and transaction hash are required.' 
        });
    }

    if (!req.user || !req.user.walletAddress) {
        return res.status(401).json({ 
            success: false,
            message: 'User not properly authenticated.' 
        });
    }

    // Verify buyer wallet matches logged-in user
    const userWallet = req.user.walletAddress.toLowerCase();
    const buyerWallet = buyerWalletAddress.toLowerCase();
    
    if (userWallet !== buyerWallet) {
        return res.status(403).json({ 
            success: false,
            message: 'Wallet address does not match authenticated user.' 
        });
    }

    const property = await Property.findById(req.params.id);
    
    if (!property) {
        return res.status(404).json({ 
            success: false,
            message: 'Property not found' 
        });
    }

    console.log('📋 Property before update:', {
        id: property._id,
        status: property.status,
        currentOwner: property.ownerWalletAddress
    });

    // Must be listed for sale
    if (property.status !== 'listed_for_sale') {
        return res.status(400).json({ 
            success: false,
            message: `Property is not available for purchase. Current status: ${property.status}` 
        });
    }

    // ✅ UPDATE ALL FIELDS INCLUDING STATUS
    property.previousOwner = property.owner; // Save previous owner ID
    property.owner = req.user._id; // New owner ID
    property.ownerWalletAddress = buyerWalletAddress; // Update wallet
    property.ownerName = req.user.name; // Update owner name
    property.status = 'sold'; // ⚠️ THIS IS THE KEY LINE
    property.transactionHash = transactionHash;
    property.soldAt = new Date();
    property.soldPrice = property.price;

    // Save to database
    const updatedProperty = await property.save();

    console.log('✅ Property after update:', {
        id: updatedProperty._id,
        status: updatedProperty.status,
        newOwner: updatedProperty.ownerWalletAddress,
        soldAt: updatedProperty.soldAt
    });

    res.status(200).json({
        success: true,
        message: 'Sale confirmed and property ownership transferred successfully.',
        property: updatedProperty
    });
});
// @desc    Get all registered properties
// @route   GET /api/properties/all
// @access  Private/Verifier
export const getAllProperties = asyncHandler(async (req, res) => {
    const properties = await Property.find({}).sort({ createdAt: -1 });

    if (properties) {
        res.status(200).json(properties);
    } else {
        res.status(404);
        throw new Error('No properties found.');
    }
});

// ... (keep all your other functions like getMyProperties, listPropertySimple, etc.)

/**
 * @desc    Buyer requests to purchase a property
 * @route   PUT /api/properties/:id/request-purchase
 * @access  Private (Buyer)
 */
export const requestPurchase = asyncHandler(async (req, res) => {
  // 1. Find the property being requested
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // 2. Check if it's for sale
  if (property.status !== 'listed_for_sale') {
    res.status(400);
    throw new Error('This property is not currently listed for sale.');
  }

  // 3. Make sure the buyer isn't the owner
  if (property.owner.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot buy your own property.');
  }

  // 4. Update the property to show a pending request
  property.status = 'pending_seller_verification';
  property.buyer = req.user._id; // Assign the logged-in buyer's ID
  
  const updatedProperty = await property.save();

  res.status(200).json({
    message: 'Purchase request sent to seller successfully!',
    data: updatedProperty,
  });
});