// // // Frontend/src/pages/Buyer/PropertyDetails.jsx
// // // (Full code with corrected 'buyProperty' escrow function and enhanced error handling)

// // import React, { useState, useEffect } from 'react';
// // import { useParams, Link } from 'react-router-dom';
// // import {
// //     ArrowLeft, MapPin, Hash, Ruler, User, Mail, Phone,
// //     FileText, CheckCircle, LinkIcon, ClipboardList, Loader2, DollarSign
// // } from 'lucide-react';
// // import { useAuth } from '../../context/AuthContext';
// // import PropertyMapDisplay from '../../components/PropertyMapDisplay';

// // // --- Import ethers and your Marketplace ABI ---
// // import { ethers } from 'ethers';
// // import MarketplaceABI from '../../abis/Marketplace.json'; // Ensure this path is correct

// // const PropertyDetails = () => {
// //     const { id } = useParams();
// //     const { user } = useAuth(); // Get user for token and authentication
// //     const [property, setProperty] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);

// //     // State for purchase flow
// //     const [purchaseLoading, setPurchaseLoading] = useState(false);
// //     const [purchaseStatus, setPurchaseStatus] = useState(''); 
    
// //     // State for connected wallet
// //     const [userWallet, setUserWallet] = useState(null);

// //     useEffect(() => {
// //         const fetchPropertyDetails = async () => {
// //             setLoading(true);
// //             setError(null);
// //             try {
// //                 // Fetch property details from YOUR backend API
// //                 const response = await fetch(`http://localhost:5000/api/properties/${id}`);
// //                 if (!response.ok) {
// //                     let errorMsg = `HTTP ${response.status}: Failed to fetch property details`;
// //                     try {
// //                         const errorData = await response.json();
// //                         errorMsg = errorData.message || errorMsg;
// //                     } catch (parseError) {/* Ignore */}
// //                     throw new Error(errorMsg);
// //                 }
// //                 const data = await response.json();
// //                 setProperty(data);
// //             } catch (err) {
// //                 console.error("Fetch property error:", err);
// //                 setError(err.message);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchPropertyDetails();
// //         checkWalletConnection(); // Check for connected wallet on load
// //     }, [id]); // Re-run effect if ID changes

// //     // Checks if MetaMask is already connected
// //     const checkWalletConnection = async () => {
// //         if (window.ethereum) {
// //             try {
// //                 const accounts = await window.ethereum.request({ method: 'eth_accounts' });
// //                 if (accounts.length > 0) {
// //                     setUserWallet(accounts[0]);
// //                 }
// //             } catch (error) {
// //                 console.error('Error checking wallet connection:', error);
// //             }
// //         }
// //     };

// //     // Prompts user to connect MetaMask
// //     const connectWallet = async () => {
// //         if (!window.ethereum) {
// //             alert('Please install MetaMask to purchase properties');
// //             return null; // Return null on failure
// //         }
// //         try {
// //             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
// //             const account = accounts[0];
// //             setUserWallet(account);
// //             return account; // Return the account
// //         } catch (error) {
// //             console.error('Error connecting wallet:', error);
// //             alert('Failed to connect wallet');
// //             return null; // Return null on failure
// //         }
// //     };

// //     // --- THIS FUNCTION HANDLES THE FULL 2-STEP PURCHASE INITIATION ---
// //     const handleInitiatePurchase = async () => {
// //         if (!property || !property.tokenId || Number(property.tokenId) === 0) {
// //             console.error("CRITICAL ERROR: property.tokenId is missing or zero.", property);
// //             alert("Purchase failed: This property is not correctly linked to the blockchain. Its Token ID is missing.");
// //             return;
// //         }

// //         if (!user || !user.token) {
// //             alert('Please log in to initiate a purchase.');
// //             return;
// //         }

// //         let currentWallet = userWallet;
// //         if (!currentWallet) {
// //             currentWallet = await connectWallet();
// //             if (!currentWallet) return;
// //         }

// //         setPurchaseLoading(true);
// //         setPurchaseStatus('Connecting to smart contract...');
// //         setError(null);

// //         const tokenId = Number(property.tokenId); 
// //         console.log("🔍 PURCHASE ATTEMPT - Token ID:", tokenId, "| Contract:", import.meta.env.VITE_MARKETPLACE_ADDRESS);

// //         try {
// //             const provider = new ethers.BrowserProvider(window.ethereum);
// //             const signer = await provider.getSigner();
// //             const network = await provider.getNetwork();
// //             console.log("🌐 Connected to network:", network.name, "Chain ID:", network.chainId);
            
// //             const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS;
// //             if (!marketplaceAddress) throw new Error("Marketplace address not configured in .env (VITE_MARKETPLACE_ADDRESS)");

// //             const marketplaceContract = new ethers.Contract(
// //                 marketplaceAddress,
// //                 MarketplaceABI.abi, 
// //                 signer
// //             );

// //             const priceInWei = ethers.parseEther(property.price.toString());
            
// //             setPurchaseStatus('Checking listing details on blockchain...');
// //             console.log("📋 Calling listings() for tokenId:", tokenId);
            
// //             // Check if listing exists with better error handling
// //             let listing;
// //             try {
// //                 listing = await marketplaceContract.listings(tokenId);
// //                 console.log("✅ Listing data retrieved:", listing);
// //             } catch (listingError) {
// //                 console.error("❌ Failed to retrieve listing:", listingError);
                
// //                 // Check if it's a decoding error (empty return = listing doesn't exist)
// //                 if (listingError.code === 'BAD_DATA' || listingError.message?.includes('could not decode')) {
// //                     throw new Error(`This property (Token ID: ${tokenId}) is not listed on the blockchain. The seller may not have completed the listing process yet.`);
// //                 }
// //                 throw listingError;
// //             }

// //             // Validate listing data
// //             if (!listing || listing.seller === ethers.ZeroAddress) {
// //                 throw new Error(`Invalid listing data for Token ID ${tokenId}. The property may not be properly registered on the blockchain.`);
// //             }

// //             if (!listing.active) {
// //                 throw new Error('This property is no longer listed for sale on the blockchain.');
// //             }
            
// //             if (BigInt(listing.price) !== priceInWei) {
// //                 console.warn("⚠️ Price mismatch - Contract:", ethers.formatEther(listing.price), "ETH | Website:", property.price, "ETH");
// //                 throw new Error(`Price mismatch detected. Contract shows ${ethers.formatEther(listing.price)} ETH but website shows ${property.price} ETH. Please refresh the page.`);
// //             }
            
// //             const signerAddress = await signer.getAddress();
// //             if (listing.seller.toLowerCase() === signerAddress.toLowerCase()) {
// //                 throw new Error('You cannot buy your own property.');
// //             }
            
// //             console.log("✅ All checks passed. Initiating purchase...");
// //             setPurchaseStatus('Please confirm in MetaMask to send funds to escrow...');
            
// //             const tx = await marketplaceContract.buyProperty(tokenId, {
// //                 value: priceInWei
// //             });
            
// //             console.log("📤 Transaction sent:", tx.hash);
// //             setPurchaseStatus('Transaction sent. Waiting for blockchain confirmation...');
// //             const receipt = await tx.wait();

// //             if (receipt.status !== 1) {
// //                 throw new Error('Blockchain transaction failed.');
// //             }
            
// //             console.log("✅ Transaction confirmed:", receipt.hash);
// //             setPurchaseStatus('Funds secured in escrow! Sending request to seller...');

// //             const response = await fetch(`http://localhost:5000/api/properties/${id}/request-purchase`, {
// //                 method: 'PUT',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                     'Authorization': `Bearer ${user.token}`
// //                 },
// //                 body: JSON.stringify({
// //                     transactionHash: tx.hash, 
// //                     buyerWallet: currentWallet 
// //                 })
// //             });

// //             const data = await response.json();
// //             if (!response.ok) {
// //                 throw new Error(data.message || `Funds are in escrow (Tx: ${tx.hash}), but we failed to notify the seller. Please contact support.`);
// //             }

// //             setPurchaseStatus('Purchase request sent! Waiting for seller approval.');
// //             alert('✅ Success! Your funds are in escrow and the seller has been notified.');
// //             setProperty(prev => ({ ...prev, status: 'pending_seller_verification' }));

// //         } catch (err) {
// //             console.error('❌ Purchase Initiation Error:', err);
// //             let userMessage = 'Request failed. ';

// //             if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
// //                 userMessage = 'Transaction was rejected in MetaMask.';
// //             } else if (err.message?.includes('insufficient funds')) {
// //                 userMessage = 'Insufficient funds for purchase + gas fees.';
// //             } else if (err.code === 'BAD_DATA' || err.message?.includes('could not decode')) {
// //                 userMessage = `This property is not yet listed on the blockchain. Token ID ${tokenId} was not found in the smart contract.`;
// //             } else if (err.message?.includes('not listed on the blockchain')) {
// //                 userMessage = err.message;
// //             } else {
// //                 userMessage = err.message || 'An unknown error occurred.';
// //             }
            
// //             setPurchaseStatus(userMessage);
// //             setError(userMessage);
// //             alert('❌ ' + userMessage); 
// //         } finally {
// //             setPurchaseLoading(false);
// //             setTimeout(() => setPurchaseStatus(''), 10000);
// //         }
// //     };
// //     // --- END OF PURCHASE FUNCTION ---






// //     // Add this function RIGHT BEFORE handleInitiatePurchase in PropertyDetails.jsx

// // const debugListing = async () => {
// //     if (!property || !property.tokenId) {
// //         console.error("❌ No property or tokenId");
// //         return;
// //     }

// //     const tokenId = Number(property.tokenId);
// //     console.log("\n🔍 ===== DEBUG LISTING CHECK =====");
// //     console.log("Token ID:", tokenId);
// //     console.log("Database Status:", property.status);
// //     console.log("Database Price:", property.price, "ETH");
// //     console.log("Marketplace Address:", import.meta.env.VITE_MARKETPLACE_ADDRESS);

// //     try {
// //         const provider = new ethers.BrowserProvider(window.ethereum);
// //         const signer = await provider.getSigner();
// //         const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS;
        
// //         const marketplaceContract = new ethers.Contract(
// //             marketplaceAddress,
// //             MarketplaceABI.abi,
// //             signer
// //         );

// //         console.log("\n📋 Checking blockchain listing...");
        
// //         // Try to get listing
// //         try {
// //             const listing = await marketplaceContract.listings(tokenId);
// //             console.log("✅ Listing found!");
// //             console.log("   Seller:", listing.seller);
// //             console.log("   Price:", ethers.formatEther(listing.price), "ETH");
// //             console.log("   Active:", listing.active);
// //             console.log("   TokenId:", listing.tokenId.toString());
            
// //             if (listing.seller === ethers.ZeroAddress) {
// //                 console.error("❌ Listing exists but seller is zero address (not properly initialized)");
// //             }
// //         } catch (error) {
// //             console.error("❌ Listing NOT FOUND on blockchain");
// //             console.error("   Error code:", error.code);
// //             console.error("   This means listProperty() was never called for this tokenId");
// //         }

// //         // Check if property was minted
// //         console.log("\n🎨 Checking if NFT was minted...");
// //         try {
// //             const propertyNFTAddress = await marketplaceContract.propertyNFT();
// //             console.log("   PropertyNFT Address:", propertyNFTAddress);
            
// //             const PropertyNFTABI = [
// //                 "function ownerOf(uint256 tokenId) view returns (address)",
// //                 "function tokenURI(uint256 tokenId) view returns (string)"
// //             ];
            
// //             const nftContract = new ethers.Contract(
// //                 propertyNFTAddress,
// //                 PropertyNFTABI,
// //                 provider
// //             );
            
// //             try {
// //                 const owner = await nftContract.ownerOf(tokenId);
// //                 console.log("✅ NFT minted! Owner:", owner);
                
// //                 const tokenURI = await nftContract.tokenURI(tokenId);
// //                 console.log("   Token URI:", tokenURI);
// //             } catch (nftError) {
// //                 console.error("❌ NFT NOT MINTED for this tokenId");
// //                 console.error("   The seller needs to mint the NFT first");
// //             }
// //         } catch (error) {
// //             console.error("❌ Could not check NFT:", error.message);
// //         }

// //         console.log("\n💡 DIAGNOSIS:");
// //         if (property.status === 'listed_for_sale') {
// //             console.log("   Database says: LISTED");
// //             console.log("   Blockchain says: NOT LISTED");
// //             console.log("   ⚠️ MISMATCH! Seller did not complete blockchain listing.");
// //             console.log("\n🔧 SOLUTION:");
// //             console.log("   1. Seller must call registerProperty() to mint NFT");
// //             console.log("   2. Then seller must call listProperty() to list on marketplace");
// //             console.log("   3. Both transactions must succeed before buyers can purchase");
// //         }
        
// //         console.log("===== DEBUG END =====\n");
        
// //     } catch (error) {
// //         console.error("Debug function error:", error);
// //     }
// // };

// // // Add a button to trigger this debug in your render section:
// // // <button onClick={debugListing} className="mt-2 w-full py-2 bg-purple-600 text-white rounded">
// // //   🔍 Debug Blockchain Listing
// // // </button>


// //     // --- Helper Functions ---
// //     const formatAddress = (prop) => prop?.propertyAddress || 'N/A';

// //     const getDocumentsArray = (hashes) => {
// //         if (!hashes || !Array.isArray(hashes)) return [];
// //         const docNames = ['Mother Deed', 'Encumbrance Certificate'];
// //         return hashes.map((hash, index) => ({
// //             name: docNames[index] || `Document ${index + 1}`,
// //             ipfsHash: hash,
// //             status: 'verified'
// //         }));
// //     };

// //     // --- Render Logic ---
// //     if (loading) {
// //         return <div className="text-center py-12 flex justify-center items-center"><Loader2 className="w-8 h-8 mr-2 animate-spin" /> Loading Property Details...</div>;
// //     }

// //     if (error) {
// //         return <div className="text-center py-12 text-red-600">Error loading property: {error}</div>;
// //     }

// //     if (!property) {
// //         return <div className="text-center py-12">Property not found.</div>;
// //     }

// //     const documents = getDocumentsArray(property.documentHashes);
// //     const ownerName = property.owner?.name || property.ownerName || 'N/A';
// //     const ownerEmail = property.owner?.email || 'N/A';
// //     const ownerPhone = property.owner?.phone || 'Not Provided';

// //     const fallbackImage = 'https://via.placeholder.com/1200x600?text=Image+Not+Available';
// //     const imageUrl = property.image ? `http://localhost:5000/${property.image}` : fallbackImage;

// //     return (
// //         <div className="bg-gray-50 min-h-screen py-8">
// //             <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
// //                 <Link
// //                     to="/buyer-dashboard/browse"
// //                     className="inline-flex items-center text-gray-700 hover:text-blue-600 font-semibold mb-4"
// //                 >
// //                     {/* Add this debug button in the Actions section */}
// // {property.status === 'listed_for_sale' && (
// //     <button
// //         onClick={debugListing}
// //         className="w-full mt-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors"
// //     >
// //         🔍 Debug Blockchain Listing
// //     </button>
// // )}
// //                     <ArrowLeft className="w-5 h-5 mr-2" />
// //                     Back to Browse
// //                 </Link>

// //                 <div className="bg-white rounded-xl shadow-lg overflow-hidden">
// //                     {/* Image Section */}
// //                     <div className="relative">
// //                         <img
// //                             src={imageUrl}
// //                             alt={property.propertyAddress}
// //                             className="w-full h-64 md:h-96 object-cover"
// //                             onError={(e) => { e.target.src = fallbackImage; }}
// //                         />
// //                         <div className="absolute bottom-0 left-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/70 to-transparent w-full">
// //                             <h1 className="text-2xl md:text-3xl font-bold text-white">{property.propertyAddress}</h1>
// //                             <p className="flex items-center text-lg text-gray-200 mt-1">
// //                                 <MapPin className="w-5 h-5 mr-2" />
// //                                 {property.district || 'N/A'}
// //                             </p>
// //                         </div>
// //                         <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
// //                             property.status === 'listed_for_sale' ? 'bg-green-500 text-white' :
// //                             property.status === 'pending_seller_verification' ? 'bg-yellow-500 text-black' :
// //                             property.status === 'sold' ? 'bg-red-500 text-white' :
// //                             'bg-gray-500 text-white'
// //                         }`}>
// //                             {property.status.replace(/_/g, ' ').toUpperCase()}
// //                         </span>
// //                     </div>

// //                     {/* Details Grid */}
// //                     <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
// //                         {/* Left Column (Details) */}
// //                         <div className="md:col-span-2 space-y-6">
// //                             <Section title="Summary">
// //                                 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
// //                                     <span className="flex items-center text-2xl font-bold text-green-600">
// //                                         <DollarSign className="w-6 h-6 mr-2" /> {property.price || 'N/A'} ETH
// //                                     </span>
// //                                     <span className="flex items-center text-lg text-gray-600">
// //                                         <Ruler className="w-5 h-5 mr-2" /> {property.area || 'N/A'} {property.areaUnit || 'sq m'}
// //                                     </span>
// //                                 </div>
// //                             </Section>

// //                             <Section title="Property Details">
// //                                 <ul className="space-y-3 text-gray-700">
// //                                     <DetailItem icon={Hash} label="Property ID" value={property.propertyId} />
// //                                     <DetailItem icon={ClipboardList} label="Survey No" value={property.surveyNumber} />
// //                                     <DetailItem icon={MapPin} label="District" value={property.district} />
// //                                     <DetailItem icon={MapPin} label="Full Address" value={formatAddress(property)} />
// //                                 </ul>
// //                             </Section>
                            
// //                             <Section title="Location on Map">
// //                                 <PropertyMapDisplay
// //                                     latitude={property.latitude}
// //                                     longitude={property.longitude}
// //                                     address={property.propertyAddress}
// //                                 />
// //                             </Section>

// //                             <Section title="Verifiable Documents" icon={<FileText className="w-6 h-6 mr-2 text-blue-600" />}>
// //                                 {documents.length > 0 ? (
// //                                     <ul className="space-y-3">
// //                                         {documents.map((doc, index) => (
// //                                             <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
// //                                                 <span className="font-semibold text-gray-700 flex items-center">
// //                                                     <CheckCircle className={`w-5 h-5 mr-2 ${index === 0 ? 'text-purple-500' : 'text-orange-500'}`} /> {doc.name}
// //                                                 </span>
// //                                                 <a
// //                                                     href={`https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`}
// //                                                     target="_blank"
// //                                                     rel="noopener noreferrer"
// //                                                     className="flex items-center text-blue-600 hover:underline text-sm"
// //                                                 >
// //                                                     View on IPFS <LinkIcon className="w-4 h-4 ml-1" />
// //                                                 </a>
// //                                             </li>
// //                                         ))}
// //                                     </ul>
// //                                 ) : (
// //                                     <p className="text-gray-500">No documents available for this property.</p>
// //                                 )}
// //                             </Section>
// //                         </div>

// //                         {/* Right Column (Actions & Owner Info) */}
// //                         <div className="md:col-span-1 space-y-6">
// //                             <div className="bg-gray-50 rounded-lg p-6 border sticky top-24">
// //                                 <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>

// //                                 {/* Wallet Connection Status */}
// //                                 {!userWallet && property.status === 'listed_for_sale' && (
// //                                     <div className="p-3 bg-yellow-100 border border-yellow-200 rounded-lg mb-4">
// //                                         <p className="text-yellow-800 text-sm">Connect your wallet to purchase.</p>
// //                                     </div>
// //                                 )}
// //                                 {userWallet && (
// //                                     <div className="p-3 bg-green-100 border border-green-200 rounded-lg mb-4">
// //                                         <p className="text-green-800 text-sm font-mono truncate" title={userWallet}>Wallet: {userWallet}</p>
// //                                     </div>
// //                                 )}

// //                                 {/* Purchase Status */}
// //                                 {purchaseStatus && (
// //                                     <div className={`p-3 rounded-lg mb-4 text-sm ${
// //                                         purchaseStatus.includes('successfully') || purchaseStatus.includes('escrow') ? 'bg-green-100 border border-green-200 text-green-800' :
// //                                         purchaseStatus.includes('failed') || purchaseStatus.includes('Error') ? 'bg-red-100 border border-red-200 text-red-800' :
// //                                         'bg-blue-100 border border-blue-200 text-blue-800'
// //                                     }`}>
// //                                         {purchaseStatus}
// //                                     </div>
// //                                 )}

// //                                 {/* Purchase Button */}
// //                                 {property.status === 'listed_for_sale' && (
// //                                     <button
// //                                         onClick={handleInitiatePurchase}
// //                                         disabled={purchaseLoading || !user || !userWallet}
// //                                         className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
// //                                         title={!user ? "Please log in" : !userWallet ? "Please connect your wallet" : "Initiate Purchase"}
// //                                     >
// //                                         {purchaseLoading ? (
// //                                             <> <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing... </>
// //                                         ) : (
// //                                             `Initiate Purchase (${property.price} ETH)`
// //                                         )}
// //                                     </button>
// //                                 )}
// //                                 {property.status === 'pending_seller_verification' && (
// //                                     <div className="w-full py-3 bg-yellow-500 text-black rounded-lg font-semibold text-center text-sm">
// //                                         Purchase Request Sent
// //                                     </div>
// //                                 )}
// //                                 {property.status === 'sold' && (
// //                                     <div className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold text-center">
// //                                         Property Sold
// //                                     </div>
// //                                 )}
// //                                 {property.status !== 'listed_for_sale' && property.status !== 'pending_seller_verification' && property.status !== 'sold' && (
// //                                     <div className="w-full py-3 bg-gray-400 text-white rounded-lg font-semibold text-center">
// //                                         Not Available for Purchase
// //                                     </div>
// //                                 )}

// //                                 {/* Login / Connect Wallet Buttons */}
// //                                 {!user && property.status === 'listed_for_sale' && (
// //                                     <p className="text-xs text-center text-red-600 mt-2">
// //                                         You must be <Link to="/login" className="underline">logged in</Link> to purchase.
// //                                     </p>
// //                                 )}
// //                                 {user && !userWallet && property.status === 'listed_for_sale' && (
// //                                     <button
// //                                         onClick={connectWallet}
// //                                         disabled={purchaseLoading}
// //                                         className="w-full mt-2 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors flex items-center justify-center disabled:bg-gray-400"
// //                                     >
// //                                         Connect Wallet
// //                                     </button>
// //                                 )}
// //                             </div>

// //                             {/* Owner Info */}
// //                             <div className="bg-white rounded-lg border p-6">
// //                                 <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
// //                                     <User className="w-6 h-6 mr-2 text-gray-600" /> Owner Information
// //                                 </h2>
// //                                 <div className="space-y-3 text-gray-700">
// //                                     <InfoRow icon={User} label="Name" value={ownerName} />
// //                                     <InfoRow icon={Mail} label="Email" value={ownerEmail} />
// //                                     <InfoRow icon={Phone} label="Phone" value={ownerPhone} />
// //                                 </div>
// //                             </div>

// //                             {/* Quick Info */}
// //                             <div className="bg-white rounded-lg border p-6 text-sm text-gray-600 space-y-2">
// //                                 <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Info</h3>
// //                                 <div className="flex justify-between"><span>Listed:</span> <span>{new Date(property.createdAt).toLocaleDateString()}</span></div>
// //                                 <div className="flex justify-between"><span>Updated:</span> <span>{new Date(property.updatedAt).toLocaleDateString()}</span></div>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // // --- Helper Components ---
// // const Section = ({ title, icon, children }) => (
// //     <div className="p-6 bg-white rounded-lg border border-gray-200">
// //         <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
// //             {icon} {title}
// //         </h2>
// //         {children}
// //     </div>
// // );

// // const DetailItem = ({ icon: Icon, label, value }) => (
// //     <li className="flex items-center">
// //         {Icon && <Icon className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />}
// //         <span className="font-semibold mr-2">{label}:</span>
// //         <span className="truncate" title={value || 'N/A'}>{value || 'N/A'}</span>
// //     </li>
// // );

// // const InfoRow = ({ icon: Icon, label, value }) => (
// //     <div className="flex items-center">
// //         {Icon && <Icon className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />}
// //         <div>
// //             <p className="font-semibold text-gray-800">{value}</p>
// //         </div>
// //     </div>
// // );

// // export default PropertyDetails;

// // Frontend/src/pages/Buyer/PropertyDetails.jsx
// // DIRECT PURCHASE FLOW: Buyer pays and receives NFT instantly

// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import {
//     ArrowLeft, MapPin, Hash, Ruler, User, Mail, Phone,
//     FileText, CheckCircle, LinkIcon, ClipboardList, Loader2, DollarSign
// } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
// import PropertyMapDisplay from '../../components/PropertyMapDisplay';
// import { ethers } from 'ethers';
// import MarketplaceABI from '../../abis/Marketplace.json';

// const PropertyDetails = () => {
//     const { id } = useParams();
//     const { user } = useAuth();
//     const [property, setProperty] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [purchaseLoading, setPurchaseLoading] = useState(false);
//     const [purchaseStatus, setPurchaseStatus] = useState('');
//     const [userWallet, setUserWallet] = useState(null);

//     useEffect(() => {
//         const fetchPropertyDetails = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const response = await fetch(`http://localhost:5000/api/properties/${id}`);
//                 if (!response.ok) {
//                     let errorMsg = `HTTP ${response.status}: Failed to fetch property details`;
//                     try {
//                         const errorData = await response.json();
//                         errorMsg = errorData.message || errorMsg;
//                     } catch (parseError) {/* Ignore */}
//                     throw new Error(errorMsg);
//                 }
//                 const data = await response.json();
//                 setProperty(data);
//             } catch (err) {
//                 console.error("Fetch property error:", err);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPropertyDetails();
//         checkWalletConnection();
//     }, [id]);

//     const checkWalletConnection = async () => {
//         if (window.ethereum) {
//             try {
//                 const accounts = await window.ethereum.request({ method: 'eth_accounts' });
//                 if (accounts.length > 0) {
//                     setUserWallet(accounts[0]);
//                 }
//             } catch (error) {
//                 console.error('Error checking wallet connection:', error);
//             }
//         }
//     };

//     const connectWallet = async () => {
//         if (!window.ethereum) {
//             alert('Please install MetaMask to purchase properties');
//             return null;
//         }
//         try {
//             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//             const account = accounts[0];
//             setUserWallet(account);
//             return account;
//         } catch (error) {
//             console.error('Error connecting wallet:', error);
//             alert('Failed to connect wallet');
//             return null;
//         }
//     };

//     // ===== DIRECT PURCHASE: Buy property instantly with buyProperty() =====
//     const handleBuyProperty = async () => {
//         // Validation checks
//         if (!property || !property.tokenId || Number(property.tokenId) === 0) {
//             console.error("CRITICAL ERROR: property.tokenId is missing or zero.", property);
//             alert("Purchase failed: This property is not correctly linked to the blockchain. Its Token ID is missing.");
//             return;
//         }

//         if (!user || !user.token) {
//             alert('Please log in to purchase this property.');
//             return;
//         }

//         let currentWallet = userWallet;
//         if (!currentWallet) {
//             currentWallet = await connectWallet();
//             if (!currentWallet) return;
//         }

//         if (!window.confirm(`Confirm Purchase:\n\nProperty: ${property.propertyAddress}\nPrice: ${property.price} ETH\n\nThis will instantly transfer the NFT to your wallet and send payment to the seller.`)) {
//             return;
//         }

//         setPurchaseLoading(true);
//         setPurchaseStatus('Preparing transaction...');
//         setError(null);

//         const tokenId = Number(property.tokenId);
//         console.log("🔍 DIRECT PURCHASE - Token ID:", tokenId, "| Contract:", import.meta.env.VITE_MARKETPLACE_ADDRESS);

//         try {
//             // Step 1: Connect to blockchain
//             const provider = new ethers.BrowserProvider(window.ethereum);
//             const signer = await provider.getSigner();
//             const network = await provider.getNetwork();
//             console.log("🌐 Connected to network:", network.name, "Chain ID:", network.chainId);

//             const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS;
//             if (!marketplaceAddress) throw new Error("Marketplace address not configured in .env (VITE_MARKETPLACE_ADDRESS)");

//             const marketplaceContract = new ethers.Contract(
//                 marketplaceAddress,
//                 MarketplaceABI.abi,
//                 signer
//             );

//             const priceInWei = ethers.parseEther(property.price.toString());

//             // Step 2: Verify listing exists on blockchain
//             setPurchaseStatus('Verifying listing on blockchain...');
//             console.log("📋 Checking listing for tokenId:", tokenId);

//             let listing;
//             try {
//                 listing = await marketplaceContract.listings(tokenId);
//                 console.log("✅ Listing data:", listing);
//             } catch (listingError) {
//                 console.error("❌ Failed to retrieve listing:", listingError);
//                 if (listingError.code === 'BAD_DATA' || listingError.message?.includes('could not decode')) {
//                     throw new Error(`This property (Token ID: ${tokenId}) is not listed on the blockchain. The seller may not have completed the listing process yet.`);
//                 }
//                 throw listingError;
//             }

//             // Validate listing
//             if (!listing || listing.seller === ethers.ZeroAddress) {
//                 throw new Error(`Invalid listing data for Token ID ${tokenId}. The property may not be properly registered on the blockchain.`);
//             }

//             if (!listing.active) {
//                 throw new Error('This property is no longer listed for sale on the blockchain.');
//             }

//             if (BigInt(listing.price) !== priceInWei) {
//                 console.warn("⚠️ Price mismatch - Contract:", ethers.formatEther(listing.price), "ETH | Website:", property.price, "ETH");
//                 throw new Error(`Price mismatch detected. Contract shows ${ethers.formatEther(listing.price)} ETH but website shows ${property.price} ETH. Please refresh the page.`);
//             }

//             const signerAddress = await signer.getAddress();
//             if (listing.seller.toLowerCase() === signerAddress.toLowerCase()) {
//                 throw new Error('You cannot buy your own property.');
//             }

//             // Step 3: Execute direct purchase on blockchain
//             console.log("✅ All checks passed. Executing purchase...");
//             setPurchaseStatus('Please confirm in MetaMask to complete purchase...');

//             // DIRECT PURCHASE: buyProperty sends ETH and immediately transfers NFT
//             const tx = await marketplaceContract.buyProperty(tokenId, {
//                 value: priceInWei
//             });

//             console.log("📤 Purchase transaction sent:", tx.hash);
//             setPurchaseStatus('Transaction sent. Waiting for blockchain confirmation...');
//             const receipt = await tx.wait();

//             if (receipt.status !== 1) {
//                 throw new Error('Blockchain transaction failed.');
//             }

//             console.log("✅ Transaction confirmed:", receipt.hash);
//             setPurchaseStatus('Purchase successful! Updating database...');

//             // Step 4: Update backend database (mark as sold, change owner)
//             const response = await fetch(`http://localhost:5000/api/properties/${id}/complete-purchase`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${user.token}`
//                 },
//                 body: JSON.stringify({
//                     transactionHash: tx.hash,
//                     buyerWallet: currentWallet
//                 })
//             });

//             const data = await response.json();
//             if (!response.ok) {
//                 // Property was purchased on blockchain but database update failed
//                 throw new Error(data.message || `Purchase successful on blockchain (Tx: ${tx.hash}), but database update failed. Please contact support with this transaction hash. You now own the NFT.`);
//             }

//             setPurchaseStatus('✅ Purchase complete! You now own this property.');
//             alert(`✅ Purchase Successful!\n\nTransaction: ${tx.hash}\n\nYou now own this property NFT. The seller can withdraw their funds.`);
//             setProperty(prev => ({ ...prev, status: 'sold', owner: user._id }));

//         } catch (err) {
//             console.error('❌ Purchase Error:', err);
//             let userMessage = 'Purchase failed. ';

//             if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
//                 userMessage = 'Transaction was rejected in MetaMask.';
//             } else if (err.message?.includes('insufficient funds')) {
//                 userMessage = 'Insufficient funds for purchase + gas fees.';
//             } else if (err.code === 'BAD_DATA' || err.message?.includes('could not decode')) {
//                 userMessage = `This property is not yet listed on the blockchain. Token ID ${tokenId} was not found in the smart contract.`;
//             } else if (err.message?.includes('not listed on the blockchain')) {
//                 userMessage = err.message;
//             } else if (err.message?.includes('not active')) {
//                 userMessage = 'This property is no longer available for sale.';
//             } else {
//                 userMessage = err.message || 'An unknown error occurred.';
//             }

//             setPurchaseStatus(userMessage);
//             setError(userMessage);
//             alert('❌ ' + userMessage);
//         } finally {
//             setPurchaseLoading(false);
//             setTimeout(() => setPurchaseStatus(''), 10000);
//         }
//     };

//     // Helper Functions
//     const formatAddress = (prop) => prop?.propertyAddress || 'N/A';

//     const getDocumentsArray = (hashes) => {
//         if (!hashes || !Array.isArray(hashes)) return [];
//         const docNames = ['Mother Deed', 'Encumbrance Certificate'];
//         return hashes.map((hash, index) => ({
//             name: docNames[index] || `Document ${index + 1}`,
//             ipfsHash: hash,
//             status: 'verified'
//         }));
//     };

//     // Render Logic
//     if (loading) {
//         return <div className="text-center py-12 flex justify-center items-center"><Loader2 className="w-8 h-8 mr-2 animate-spin" /> Loading Property Details...</div>;
//     }

//     if (error) {
//         return <div className="text-center py-12 text-red-600">Error loading property: {error}</div>;
//     }

//     if (!property) {
//         return <div className="text-center py-12">Property not found.</div>;
//     }

//     const documents = getDocumentsArray(property.documentHashes);
//     const ownerName = property.owner?.name || property.ownerName || 'N/A';
//     const ownerEmail = property.owner?.email || 'N/A';
//     const ownerPhone = property.owner?.phone || 'Not Provided';

//     const fallbackImage = 'https://via.placeholder.com/1200x600?text=Image+Not+Available';
//     const imageUrl = property.image ? `http://localhost:5000/${property.image}` : fallbackImage;

//     return (
//         <div className="bg-gray-50 min-h-screen py-8">
//             <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
//                 <Link
//                     to="/buyer-dashboard/browse"
//                     className="inline-flex items-center text-gray-700 hover:text-blue-600 font-semibold mb-4"
//                 >
//                     <ArrowLeft className="w-5 h-5 mr-2" />
//                     Back to Browse
//                 </Link>

//                 <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                     {/* Image Section */}
//                     <div className="relative">
//                         <img
//                             src={imageUrl}
//                             alt={property.propertyAddress}
//                             className="w-full h-64 md:h-96 object-cover"
//                             onError={(e) => { e.target.src = fallbackImage; }}
//                         />
//                         <div className="absolute bottom-0 left-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/70 to-transparent w-full">
//                             <h1 className="text-2xl md:text-3xl font-bold text-white">{property.propertyAddress}</h1>
//                             <p className="flex items-center text-lg text-gray-200 mt-1">
//                                 <MapPin className="w-5 h-5 mr-2" />
//                                 {property.district || 'N/A'}
//                             </p>
//                         </div>
//                         <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
//                             property.status === 'listed_for_sale' ? 'bg-green-500 text-white' :
//                             property.status === 'sold' ? 'bg-red-500 text-white' :
//                             'bg-gray-500 text-white'
//                         }`}>
//                             {property.status.replace(/_/g, ' ').toUpperCase()}
//                         </span>
//                     </div>

//                     {/* Details Grid */}
//                     <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
//                         {/* Left Column (Details) */}
//                         <div className="md:col-span-2 space-y-6">
//                             <Section title="Summary">
//                                 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
//                                     <span className="flex items-center text-2xl font-bold text-green-600">
//                                         <DollarSign className="w-6 h-6 mr-2" /> {property.price || 'N/A'} ETH
//                                     </span>
//                                     <span className="flex items-center text-lg text-gray-600">
//                                         <Ruler className="w-5 h-5 mr-2" /> {property.area || 'N/A'} {property.areaUnit || 'sq m'}
//                                     </span>
//                                 </div>
//                             </Section>

//                             <Section title="Property Details">
//                                 <ul className="space-y-3 text-gray-700">
//                                     <DetailItem icon={Hash} label="Property ID" value={property.propertyId} />
//                                     <DetailItem icon={ClipboardList} label="Survey No" value={property.surveyNumber} />
//                                     <DetailItem icon={MapPin} label="District" value={property.district} />
//                                     <DetailItem icon={MapPin} label="Full Address" value={formatAddress(property)} />
//                                     <DetailItem icon={Hash} label="Token ID" value={property.tokenId} />
//                                 </ul>
//                             </Section>

//                             <Section title="Location on Map">
//                                 <PropertyMapDisplay
//                                     latitude={property.latitude}
//                                     longitude={property.longitude}
//                                     address={property.propertyAddress}
//                                 />
//                             </Section>

//                             <Section title="Verifiable Documents" icon={<FileText className="w-6 h-6 mr-2 text-blue-600" />}>
//                                 {documents.length > 0 ? (
//                                     <ul className="space-y-3">
//                                         {documents.map((doc, index) => (
//                                             <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
//                                                 <span className="font-semibold text-gray-700 flex items-center">
//                                                     <CheckCircle className={`w-5 h-5 mr-2 ${index === 0 ? 'text-purple-500' : 'text-orange-500'}`} /> {doc.name}
//                                                 </span>
//                                                 <a
//                                                     href={`https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     className="flex items-center text-blue-600 hover:underline text-sm"
//                                                 >
//                                                     View on IPFS <LinkIcon className="w-4 h-4 ml-1" />
//                                                 </a>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <p className="text-gray-500">No documents available for this property.</p>
//                                 )}
//                             </Section>
//                         </div>

//                         {/* Right Column (Actions & Owner Info) */}
//                         <div className="md:col-span-1 space-y-6">
//                             <div className="bg-gray-50 rounded-lg p-6 border sticky top-24">
//                                 <h2 className="text-xl font-bold text-gray-900 mb-4">Purchase</h2>

//                                 {/* Wallet Connection Status */}
//                                 {!userWallet && property.status === 'listed_for_sale' && (
//                                     <div className="p-3 bg-yellow-100 border border-yellow-200 rounded-lg mb-4">
//                                         <p className="text-yellow-800 text-sm">Connect your wallet to purchase.</p>
//                                     </div>
//                                 )}
//                                 {userWallet && (
//                                     <div className="p-3 bg-green-100 border border-green-200 rounded-lg mb-4">
//                                         <p className="text-green-800 text-sm font-mono truncate" title={userWallet}>Wallet: {userWallet}</p>
//                                     </div>
//                                 )}

//                                 {/* Purchase Status */}
//                                 {purchaseStatus && (
//                                     <div className={`p-3 rounded-lg mb-4 text-sm ${
//                                         purchaseStatus.includes('✅') || purchaseStatus.includes('successful') ? 'bg-green-100 border border-green-200 text-green-800' :
//                                         purchaseStatus.includes('failed') || purchaseStatus.includes('❌') ? 'bg-red-100 border border-red-200 text-red-800' :
//                                         'bg-blue-100 border border-blue-200 text-blue-800'
//                                     }`}>
//                                         {purchaseStatus}
//                                     </div>
//                                 )}

//                                 {/* Info Box - Direct Purchase */}
//                                 {property.status === 'listed_for_sale' && (
//                                     <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
//                                         <p className="text-blue-900 text-xs font-medium mb-1">⚡ Instant Purchase</p>
//                                         <p className="text-blue-700 text-xs">
//                                             Click to buy instantly. Payment and NFT transfer happen in one transaction.
//                                         </p>
//                                     </div>
//                                 )}

//                                 {/* Purchase Button */}
//                                 {property.status === 'listed_for_sale' && (
//                                     <button
//                                         onClick={handleBuyProperty}
//                                         disabled={purchaseLoading || !user || !userWallet}
//                                         className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
//                                         title={!user ? "Please log in" : !userWallet ? "Please connect your wallet" : "Buy property instantly"}
//                                     >
//                                         {purchaseLoading ? (
//                                             <> <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing... </>
//                                         ) : (
//                                             `Buy Now - ${property.price} ETH`
//                                         )}
//                                     </button>
//                                 )}
//                                 {property.status === 'sold' && (
//                                     <div className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold text-center">
//                                         ✅ Property Sold
//                                     </div>
//                                 )}
//                                 {property.status !== 'listed_for_sale' && property.status !== 'sold' && (
//                                     <div className="w-full py-3 bg-gray-400 text-white rounded-lg font-semibold text-center">
//                                         Not Available for Purchase
//                                     </div>
//                                 )}

//                                 {/* Login / Connect Wallet Buttons */}
//                                 {!user && property.status === 'listed_for_sale' && (
//                                     <p className="text-xs text-center text-red-600 mt-2">
//                                         You must be <Link to="/login" className="underline">logged in</Link> to purchase.
//                                     </p>
//                                 )}
//                                 {user && !userWallet && property.status === 'listed_for_sale' && (
//                                     <button
//                                         onClick={connectWallet}
//                                         disabled={purchaseLoading}
//                                         className="w-full mt-2 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors flex items-center justify-center disabled:bg-gray-400"
//                                     >
//                                         Connect Wallet
//                                     </button>
//                                 )}
//                             </div>

//                             {/* Owner Info */}
//                             <div className="bg-white rounded-lg border p-6">
//                                 <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
//                                     <User className="w-6 h-6 mr-2 text-gray-600" /> Owner Information
//                                 </h2>
//                                 <div className="space-y-3 text-gray-700">
//                                     <InfoRow icon={User} label="Name" value={ownerName} />
//                                     <InfoRow icon={Mail} label="Email" value={ownerEmail} />
//                                     <InfoRow icon={Phone} label="Phone" value={ownerPhone} />
//                                 </div>
//                             </div>

//                             {/* Quick Info */}
//                             <div className="bg-white rounded-lg border p-6 text-sm text-gray-600 space-y-2">
//                                 <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Info</h3>
//                                 <div className="flex justify-between"><span>Listed:</span> <span>{new Date(property.createdAt).toLocaleDateString()}</span></div>
//                                 <div className="flex justify-between"><span>Updated:</span> <span>{new Date(property.updatedAt).toLocaleDateString()}</span></div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Helper Components
// const Section = ({ title, icon, children }) => (
//     <div className="p-6 bg-white rounded-lg border border-gray-200">
//         <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
//             {icon} {title}
//         </h2>
//         {children}
//     </div>
// );

// const DetailItem = ({ icon: Icon, label, value }) => (
//     <li className="flex items-center">
//         {Icon && <Icon className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />}
//         <span className="font-semibold mr-2">{label}:</span>
//         <span className="truncate" title={value || 'N/A'}>{value || 'N/A'}</span>
//     </li>
// );

// const InfoRow = ({ icon: Icon, label, value }) => (
//     <div className="flex items-center">
//         {Icon && <Icon className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />}
//         <div>
//             <p className="font-semibold text-gray-800">{value}</p>
//         </div>
//     </div>
// );

// export default PropertyDetails;









// Frontend/src/pages/Buyer/PropertyDetails.jsx (Corrected for Direct Purchase Flow)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Hash, Ruler, User, Mail, Phone, ExternalLink,
    FileText, CheckCircle, LinkIcon, ClipboardList, Loader2, DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import PropertyMapDisplay from '../../components/PropertyMapDisplay'; // Import map display

// --- Re-added Ethers and ABI ---
import { ethers } from 'ethers';
import MarketplaceABI from '../../abis/Marketplace.json'; // Ensure this path is correct

const PropertyDetails = () => { // Renamed component
    const { id } = useParams(); // MongoDB ID
    const { user } = useAuth(); // Get user for token
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true); // Page loading
    const [error, setError] = useState(null); // Page level errors/status

    // State for purchase flow
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState(''); // Purchase status messages
    // State to store connected wallet
    const [userWallet, setUserWallet] = useState(null);

     // Check wallet connection on load
     useEffect(() => {
        checkWalletConnection();
     }, []);

    // Fetch property details from backend
    useEffect(() => {
        const fetchPropertyDetails = async () => {
             setLoading(true); setError(null);
            try {
                const response = await fetch(`http://localhost:5000/api/properties/${id}`);
                if (!response.ok) {
                    let errorMsg = `HTTP ${response.status}: Failed to fetch details`;
                    try { const d = await response.json(); errorMsg = d.message || errorMsg; } catch (e) {/*ignore*/}
                    throw new Error(errorMsg);
                }
                const data = await response.json();
                setProperty(data);
            } catch (err) { console.error("Fetch Err:", err); setError(err.message);
            } finally { setLoading(false); }
        };
        fetchPropertyDetails();
    }, [id]);

    // --- Wallet Connection Logic ---
    const checkWalletConnection = async () => {
         if (window.ethereum) {
            try {
                // Use eth_accounts which returns array or empty array
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setUserWallet(accounts[0]);
                    console.log("Wallet already connected:", accounts[0]);
                } else { setUserWallet(null); console.log("Wallet not connected."); }
            } catch (error) { console.error('Err checking wallet:', error); setUserWallet(null); }
        } else { setUserWallet(null); console.log("MetaMask not detected."); }
     };
    const connectWallet = async () => {
         if (!window.ethereum) {
             setPurchaseStatus('MetaMask not detected. Please install it.'); return null;
         }
        try {
            // Use eth_requestAccounts to prompt connection
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                const account = accounts[0];
                setUserWallet(account); console.log("Wallet connected:", account);
                setPurchaseStatus(''); // Clear prompt
                return account;
            }
             setPurchaseStatus('Wallet connection failed.'); return null;
        } catch (error) {
            console.error('Err connecting wallet:', error);
             let msg = 'Failed to connect wallet.';
             if (error.code === 4001) msg = 'Connection rejected in MetaMask.';
             setPurchaseStatus(msg);
            return null;
        }
     };
    // --- End Wallet Connection Logic ---

    // --- THIS FUNCTION HANDLES THE DIRECT PURCHASE (NO ESCROW) ---
    const handleDirectPurchase = async () => {
        let currentWallet = userWallet;
        if (!currentWallet) {
            currentWallet = await connectWallet();
            if (!currentWallet) return; // Stop if wallet connection fails/rejected
        }

        if (!user || !user.token) { setPurchaseStatus('Error: Please log in first.'); return; }
        if (!property || property.status !== 'listed_for_sale' || !property.tokenId) {
            setPurchaseStatus('Error: Property not available or Token ID missing.');
            console.error("Purchase Pre-check Failed:", property); return;
        }

        setPurchaseLoading(true);
        setPurchaseStatus('Preparing purchase...');
        setError(null); // Clear page errors

        const tokenId = Number(property.tokenId);

        try {
            // --- 1. Blockchain Interaction (Direct Buy) ---
            setPurchaseStatus("Connecting to contract...");
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();
            console.log("🌐 Connected to network:", network.name, "Chain ID:", network.chainId);

            const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS;
            if (!marketplaceAddress) throw new Error("Marketplace address missing in .env");

            const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketplaceABI.abi, signer);
            const priceInWei = ethers.parseEther(property.price.toString());

            console.log(`Attempting purchase for Token ID: ${tokenId}, Price: ${property.price} ETH`);
            setPurchaseStatus('Action Required: Confirm purchase in MetaMask...');

            // --- CALL buyProperty (IMMEDIATE TRANSFER) ---
            // Ensure this function name and arguments match your deployed contract
            const tx = await marketplaceContract.buyProperty(tokenId, {
                value: priceInWei
            });
            // --- END OF CONTRACT CALL ---

            console.log("Purchase TX Sent:", tx.hash);
            setPurchaseStatus('Transaction sent. Waiting for confirmation...');
            const receipt = await tx.wait(1);
            console.log("Purchase TX Confirmed:", receipt);

            if (receipt.status !== 1) { // Check if transaction succeeded on-chain
                throw new Error('Blockchain transaction failed. Check block explorer.');
            }
            // --- End Blockchain Interaction ---

            // --- 2. Update Backend Database ---
            setPurchaseStatus('Purchase successful! Updating server record...');
            console.log("Calling backend /confirm-sale...");

            // Use the '/confirm-sale' endpoint
            const backendResponse = await fetch(`http://localhost:5000/api/properties/${id}/confirm-sale`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` // Send JWT token
                },
                body: JSON.stringify({
                    transactionHash: receipt.hash,
                    buyerWalletAddress: currentWallet // Send buyer wallet
                 })
            });

            const backendData = await backendResponse.json();
            if (!backendResponse.ok) {
                // Important: Blockchain succeeded, DB failed. Needs manual fix/support message.
                throw new Error(backendData.message || `Blockchain purchase successful (Tx: ${receipt.hash}), but backend update failed. Contact support.`);
            }

            // --- 3. Full Success: Update UI ---
            setPurchaseStatus('Purchase completed successfully!');
            // Update local state to reflect the sale
            setProperty(prev => ({
                 ...prev,
                 status: 'sold',
                 owner: user._id, // Update owner ID if available in user context
                 ownerName: user?.name || 'New Owner (You)', // Update owner name
                 ownerWalletAddress: currentWallet // Update wallet
             }));

        } catch (err) {
            console.error('Direct Purchase Error:', err);
            let userMessage = `Purchase failed: ${err.message || 'Unknown error'}`;
             if (err.code === 4001 || err.code === 'ACTION_REJECTED') userMessage = "Transaction rejected in MetaMask.";
             else if (err.reason) userMessage = `Transaction failed: ${err.reason}`; // Contract revert reason
             else if (err.message?.includes("insufficient funds")) userMessage = "Purchase failed: Insufficient funds.";
             else if (err.code === 'CALL_EXCEPTION') {
                 // Try to provide a more specific reason for call exceptions
                 if (err.message?.includes("not listed") || err.message?.includes("listing is not active")) {
                     userMessage = `Purchase failed: Property (Token ID ${tokenId}) is not actively listed on the blockchain. The seller may need to list it, or it might have been sold.`;
                 } else if (err.message?.includes("caller is not owner")) {
                      userMessage = `Purchase failed: You cannot buy your own property.`; // Example
                 } else if (err.message?.includes("already sold")) {
                      userMessage = `Purchase failed: This property has already been sold.`; // Example
                 } else {
                     userMessage = `Transaction simulation failed. Possible contract issue or incorrect state. Details: ${err.shortMessage || err.message}`;
                 }
             }
            setError(userMessage); // Set page error
            setPurchaseStatus(`Error: ${userMessage}`); // Set status message
            // No alert needed, status message shows error
        } finally {
            setPurchaseLoading(false);
            // Keep status message visible longer on error
            const delay = error ? 10000 : 5000;
            setTimeout(() => setPurchaseStatus(''), delay);
        }
    };
    // --- END OF DIRECT PURCHASE FUNCTION ---

    // --- Helper Functions ---
    const formatAddress = (prop) => prop?.propertyAddress || 'N/A';
    const getDocumentsArray = (hashes) => {
         if (!hashes || !Array.isArray(hashes)) return [];
         const docNames = ['Mother Deed', 'Encumbrance Certificate'];
         return hashes.map((hash, index) => ({
            name: docNames[index] || `Document ${index + 1}`,
            ipfsHash: hash,
            status: 'verified'
         }));
     };

    // --- Render Logic ---
    if (loading && !error) { return <div className="text-center py-12 flex justify-center items-center"><Loader2 className="w-8 h-8 mr-2 animate-spin" /> Loading Property Details...</div>; }
    if (error && !property && !loading) { return <div className="text-center py-12 text-red-600">Error loading property: {error}</div>; }
    if (!property && !loading && !error) { return <div className="text-center py-12">Property not found.</div>; }

    // Prepare data (only if property exists)
    const documents = property ? getDocumentsArray(property.documentHashes) : [];
    const ownerName = property?.owner?.name || property?.ownerName || 'N/A';
    const ownerEmail = property?.owner?.email || 'N/A';
    const ownerPhone = property?.owner?.phone || 'Not Provided';
    const fallbackImage = 'https://via.placeholder.com/1200x600?text=Image+Not+Available';
    const imageUrl = property?.image ? `http://localhost:5000/${property.image}` : fallbackImage;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                <Link to="/buyer-dashboard/browse" className="inline-flex items-center text-gray-700 hover:text-blue-600 font-semibold mb-4">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Browse
                </Link>

                {/* Display page level errors if any (like fetch errors) */}
                {error && (
                     <div className="p-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
                         <span className="font-medium">Error:</span> {error}
                     </div>
                 )}

                {property && ( // Render details only if property loaded
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Image Section */}
                        <div className="relative">
                           <img src={imageUrl} alt={property.propertyAddress} className="w-full h-64 md:h-96 object-cover" onError={(e) => { e.target.src = fallbackImage; }}/>
                            <div className="absolute bottom-0 left-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/70 to-transparent w-full">
                               <h1 className="text-2xl md:text-3xl font-bold text-white">{property.propertyAddress}</h1>
                               <p className="flex items-center text-lg text-gray-200 mt-1"><MapPin className="w-5 h-5 mr-2" /> {property.district || 'N/A'}</p>
                            </div>
                            {/* Status Badge */}
                            <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
                                 property.status === 'listed_for_sale' ? 'bg-green-500 text-white' :
                                 property.status === 'sold' ? 'bg-red-500 text-white' :
                                 'bg-gray-500 text-white' // Covers pending, verified, minted
                             }`}>
                                {property.status.replace(/_/g, ' ').toUpperCase()}
                            </span>
                        </div>

                        {/* Details Grid */}
                        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Left Column */}
                            <div className="md:col-span-2 space-y-6">
                                <Section title="Summary">
                                     <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                                         <span className="flex items-center text-2xl font-bold text-green-600">
                                             <DollarSign className="w-6 h-6 mr-2" /> {property.price || 'N/A'} ETH
                                         </span>
                                         <span className="flex items-center text-lg text-gray-600">
                                             <Ruler className="w-5 h-5 mr-2" /> {property.area || 'N/A'} {property.areaUnit || 'sq m'}
                                         </span>
                                     </div>
                                </Section>
                                <Section title="Property Details">
                                     <ul className="space-y-3 text-gray-700">
                                         <DetailItem icon={Hash} label="Property ID" value={property.propertyId} />
                                         <DetailItem icon={ClipboardList} label="Survey No" value={property.surveyNumber} />
                                         <DetailItem icon={MapPin} label="District" value={property.district} />
                                         <DetailItem icon={MapPin} label="Full Address" value={formatAddress(property)} />
                                     </ul>
                                </Section>
                                <Section title="Location on Map">
                                     <PropertyMapDisplay
                                         latitude={property.latitude}
                                         longitude={property.longitude}
                                         address={property.propertyAddress}
                                     />
                                </Section>
                                <Section title="Verifiable Documents" icon={<FileText className="w-6 h-6 mr-2 text-blue-600" />}>
                                     {documents.length > 0 ? (
                                         <ul className="space-y-3">
                                             {documents.map((doc, index) => (
                                                 <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                                     <span className="font-semibold text-gray-700 flex items-center">
                                                         <CheckCircle className={`w-5 h-5 mr-2 ${index === 0 ? 'text-purple-500' : 'text-orange-500'}`} /> {doc.name}
                                                     </span>
                                                     <a href={`https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline text-sm">
                                                         View on IPFS <LinkIcon className="w-4 h-4 ml-1" />
                                                     </a>
                                                 </li>
                                             ))}
                                         </ul>
                                     ) : ( <p className="text-gray-500">No documents available.</p> )}
                                </Section>
                            </div>

                            {/* Right Column */}
                            <div className="md:col-span-1 space-y-6">
                                <div className="bg-gray-50 rounded-lg p-6 border sticky top-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>

                                    {/* Purchase Status Message */}
                                    {purchaseStatus && (
                                         <div className={`p-3 rounded-lg mb-4 text-sm ${
                                            purchaseStatus.includes('successfully') || purchaseStatus.includes('confirmed') ? 'bg-green-100 border border-green-200 text-green-800' :
                                            purchaseStatus.includes('Error') || purchaseStatus.includes('failed') ? 'bg-red-100 border border-red-200 text-red-800' :
                                            'bg-blue-100 border border-blue-200 text-blue-800' // Pending/Info
                                        }`}>
                                             {purchaseStatus.includes("Action Required:") || purchaseLoading ? <Loader2 className="w-4 h-4 mr-2 inline animate-spin"/> : null}
                                             {purchaseStatus}
                                         </div>
                                    )}

                                    {/* Wallet Connection */}
                                    {!userWallet && property.status === 'listed_for_sale' && (
                                         <button onClick={connectWallet} disabled={purchaseLoading} className="w-full mb-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors flex items-center justify-center disabled:opacity-50">
                                            🦊 Connect Wallet to Buy
                                         </button>
                                     )}
                                     {userWallet && (
                                          <div className="p-2 mb-4 bg-green-100 border border-green-200 rounded-lg text-center">
                                             <p className="text-green-800 text-xs font-mono truncate" title={userWallet}>Wallet Connected: {userWallet}</p>
                                         </div>
                                     )}

                                    {/* Purchase Button Logic */}
                                    {property.status === 'listed_for_sale' && (
                                        <button
                                            onClick={handleDirectPurchase} // CALLS DIRECT PURCHASE
                                            disabled={purchaseLoading || !user || !userWallet}
                                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                                            title={!user ? "Please log in first" : !userWallet ? "Please connect your wallet first" : `Buy now for ${property.price} ETH`}
                                        >
                                            {purchaseLoading ? (
                                                <> <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing Purchase... </>
                                            ) : (
                                                `Buy Now for ${property.price} ETH`
                                            )}
                                        </button>
                                    )}
                                     {/* Removed 'pending_seller_verification' state */}
                                    {property.status === 'sold' && (
                                        <div className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold text-center"> Property Sold </div>
                                    )}
                                     {/* Covers pending, verified, minted */}
                                    {property.status !== 'listed_for_sale' && property.status !== 'sold' && (
                                         <div className="w-full py-3 bg-gray-400 text-white rounded-lg font-semibold text-center"> Not Available for Purchase </div>
                                     )}

                                    {/* Login/Wallet Prompts */}
                                    {!user && property.status === 'listed_for_sale' && ( <p className="text-xs text-center text-red-600 mt-2">You must be <Link to="/login" className="underline">logged in</Link> to purchase.</p> )}
                                </div>
                                <div className="bg-white rounded-lg border p-6">
                                     <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><User className="w-6 h-6 mr-2 text-gray-600" /> Owner Information</h2>
                                     <div className="space-y-3 text-gray-700">
                                         <InfoRow icon={User} label="Name" value={ownerName} />
                                         <InfoRow icon={Mail} label="Email" value={ownerEmail} />
                                         <InfoRow icon={Phone} label="Phone" value={ownerPhone} />
                                     </div>
                                </div>
                                <div className="bg-white rounded-lg border p-6 text-sm text-gray-600 space-y-2">
                                     <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Info</h3>
                                     <div className="flex justify-between"><span>Listed:</span> <span>{new Date(property.createdAt).toLocaleDateString()}</span></div>
                                     <div className="flex justify-between"><span>Updated:</span> <span>{new Date(property.updatedAt).toLocaleDateString()}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Helper Components ---
const Section = ({ title, icon, children }) => ( <div className="p-4 bg-white rounded-lg border border-gray-200"><h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">{icon}{title}</h2>{children}</div> );
const DetailItem = ({ icon: Icon, label, value }) => ( <li className="flex items-center text-sm"><Icon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" /><strong className="mr-1">{label}:</strong> <span className="text-gray-700 truncate" title={value || 'N/A'}>{value || 'N/A'}</span></li> );
const InfoRow = ({ icon: Icon, label, value }) => ( <div className="flex items-center text-sm"><Icon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" /><p className="font-medium text-gray-800">{value}</p></div> );

export default PropertyDetails;

