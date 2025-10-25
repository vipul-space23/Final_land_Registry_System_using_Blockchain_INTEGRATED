// // Frontend/src/pages/Buyer/PropertyDetails.jsx (Corrected for Direct Purchase Flow)

// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import {
//     ArrowLeft, MapPin, Hash, Ruler, User, Mail, Phone, ExternalLink,
//     FileText, CheckCircle, LinkIcon, ClipboardList, Loader2, DollarSign
// } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext'; // Import useAuth
// import PropertyMapDisplay from '../../components/PropertyMapDisplay'; // Import map display

// // --- Re-added Ethers and ABI ---
// import { ethers } from 'ethers';
// import MarketplaceABI from '../../abis/Marketplace.json'; // Ensure this path is correct

// const PropertyDetails = () => { // Renamed component
//     const { id } = useParams(); // MongoDB ID
//     const { user } = useAuth(); // Get user for token
//     const [property, setProperty] = useState(null);
//     const [loading, setLoading] = useState(true); // Page loading
//     const [error, setError] = useState(null); // Page level errors/status

//     // State for purchase flow
//     const [purchaseLoading, setPurchaseLoading] = useState(false);
//     const [purchaseStatus, setPurchaseStatus] = useState(''); // Purchase status messages
//     // State to store connected wallet
//     const [userWallet, setUserWallet] = useState(null);

//      // Check wallet connection on load
//      useEffect(() => {
//         checkWalletConnection();
//      }, []);

//     // Fetch property details from backend
//     useEffect(() => {
//         const fetchPropertyDetails = async () => {
//              setLoading(true); setError(null);
//             try {
//                 const response = await fetch(`http://localhost:5000/api/properties/${id}`);
//                 if (!response.ok) {
//                     let errorMsg = `HTTP ${response.status}: Failed to fetch details`;
//                     try { const d = await response.json(); errorMsg = d.message || errorMsg; } catch (e) {/*ignore*/}
//                     throw new Error(errorMsg);
//                 }
//                 const data = await response.json();
//                 setProperty(data);
//             } catch (err) { console.error("Fetch Err:", err); setError(err.message);
//             } finally { setLoading(false); }
//         };
//         fetchPropertyDetails();
//     }, [id]);

//     // --- Wallet Connection Logic ---
//     const checkWalletConnection = async () => {
//          if (window.ethereum) {
//             try {
//                 // Use eth_accounts which returns array or empty array
//                 const accounts = await window.ethereum.request({ method: 'eth_accounts' });
//                 if (accounts.length > 0) {
//                     setUserWallet(accounts[0]);
//                     console.log("Wallet already connected:", accounts[0]);
//                 } else { setUserWallet(null); console.log("Wallet not connected."); }
//             } catch (error) { console.error('Err checking wallet:', error); setUserWallet(null); }
//         } else { setUserWallet(null); console.log("MetaMask not detected."); }
//      };
//     const connectWallet = async () => {
//          if (!window.ethereum) {
//              setPurchaseStatus('MetaMask not detected. Please install it.'); return null;
//          }
//         try {
//             // Use eth_requestAccounts to prompt connection
//             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//             if (accounts.length > 0) {
//                 const account = accounts[0];
//                 setUserWallet(account); console.log("Wallet connected:", account);
//                 setPurchaseStatus(''); // Clear prompt
//                 return account;
//             }
//              setPurchaseStatus('Wallet connection failed.'); return null;
//         } catch (error) {
//             console.error('Err connecting wallet:', error);
//              let msg = 'Failed to connect wallet.';
//              if (error.code === 4001) msg = 'Connection rejected in MetaMask.';
//              setPurchaseStatus(msg);
//             return null;
//         }
//      };
//     // --- End Wallet Connection Logic ---

//     // --- THIS FUNCTION HANDLES THE DIRECT PURCHASE (NO ESCROW) ---
// // --- DIRECT PURCHASE: Database listed_for_sale → Pay with MetaMask → Sold ---
// const handleDirectPurchase = async () => {
//     let currentWallet = userWallet;
//     if (!currentWallet) {
//         currentWallet = await connectWallet();
//         if (!currentWallet) return;
//     }

//     if (!user || !user.token) {
//         setPurchaseStatus('Error: Please log in first.');
//         return;
//     }

//     if (!property || property.status !== 'listed_for_sale') {
//         setPurchaseStatus('Error: Property not available for purchase.');
//         return;
//     }

//     if (!property.tokenId) {
//         setPurchaseStatus('Error: Property Token ID is missing.');
//         return;
//     }

//     setPurchaseLoading(true);
//     setPurchaseStatus('Preparing purchase...');
//     setError(null);

//     try {
//         // --- 1. Connect to Blockchain ---
//         setPurchaseStatus("Connecting to blockchain...");
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await provider.getSigner();
        
//         console.log("📋 Purchase Details:");
//         console.log("  Token ID:", property.tokenId);
//         console.log("  Price:", property.price, "ETH");
//         console.log("  Seller:", property.ownerWalletAddress);
//         console.log("  Buyer:", currentWallet);

//         // --- 2. Send Payment to Seller ---
//         setPurchaseStatus('Action Required: Confirm payment in MetaMask...');
        
//         const priceInWei = ethers.parseEther(property.price.toString());
        
//         // Simple ETH transfer to seller
//         const tx = await signer.sendTransaction({
//             to: property.ownerWalletAddress, // Send money to current owner
//             value: priceInWei,
//             gasLimit: 21000 // Standard gas for ETH transfer
//         });

//         console.log("✅ Payment TX Sent:", tx.hash);
//         setPurchaseStatus('Payment sent! Waiting for confirmation...');

//         const receipt = await tx.wait(1);
//         console.log("✅ Payment TX Confirmed:", receipt);

//         if (receipt.status !== 1) {
//             throw new Error('Payment transaction failed on blockchain.');
//         }

//         // --- 3. Update Backend Database (listed_for_sale → sold) ---
//         setPurchaseStatus('Payment successful! Updating ownership...');
//         console.log("🔄 Calling backend /confirm-sale...");

//         const backendResponse = await fetch(
//             `http://localhost:5000/api/properties/${id}/confirm-sale`,
//             {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${user.token}`
//                 },
//                 body: JSON.stringify({
//                     transactionHash: receipt.hash,
//                     buyerWalletAddress: currentWallet
//                 })
//             }
//         );

//         const backendData = await backendResponse.json();

//         if (!backendResponse.ok) {
//             console.error("Backend update failed:", backendData);
//             throw new Error(
//                 `Payment successful (TX: ${receipt.hash}), but database update failed: ${backendData.message || 'Unknown error'}. Please contact support with this transaction hash.`
//             );
//         }

//         // --- 4. Success! Update UI ---
//         console.log("✅ Purchase completed successfully!");
//         setPurchaseStatus('🎉 Purchase completed! You are now the owner!');
        
//         setProperty(prev => ({
//             ...prev,
//             status: 'sold',
//             owner: user._id,
//             ownerName: user?.name || 'You',
//             ownerWalletAddress: currentWallet,
//             soldAt: new Date(),
//             soldPrice: property.price,
//             previousOwner: prev.owner // Keep track of previous owner
//         }));

//     } catch (err) {
//         console.error('❌ Purchase Error:', err);

//         let userMessage = 'Purchase failed: ';

//         // User-friendly error messages
//         if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
//             userMessage = "Transaction cancelled in MetaMask.";
//         } else if (err.message?.includes("insufficient funds")) {
//             userMessage = `Insufficient funds. You need ${property.price} ETH plus gas fees.`;
//         } else if (err.code === 'NETWORK_ERROR') {
//             userMessage = "Network error. Please check your internet connection.";
//         } else if (err.message?.includes("database update failed")) {
//             userMessage = err.message; // Show our custom backend error
//         } else if (err.shortMessage) {
//             userMessage += err.shortMessage;
//         } else {
//             userMessage += err.message || 'Unknown error occurred.';
//         }

//         setError(userMessage);
//         setPurchaseStatus(`❌ ${userMessage}`);

//     } finally {
//         setPurchaseLoading(false);
        
//         // Clear status after delay (longer if error)
//         setTimeout(() => {
//             setPurchaseStatus('');
//         }, error ? 10000 : 6000);
//     }
// };

    
//     // --- END OF DIRECT PURCHASE FUNCTION ---

//     // --- Helper Functions ---
//     const formatAddress = (prop) => prop?.propertyAddress || 'N/A';
//     const getDocumentsArray = (hashes) => {
//          if (!hashes || !Array.isArray(hashes)) return [];
//          const docNames = ['Mother Deed', 'Encumbrance Certificate'];
//          return hashes.map((hash, index) => ({
//             name: docNames[index] || `Document ${index + 1}`,
//             ipfsHash: hash,
//             status: 'verified'
//          }));
//      };

//     // --- Render Logic ---
//     if (loading && !error) { return <div className="text-center py-12 flex justify-center items-center"><Loader2 className="w-8 h-8 mr-2 animate-spin" /> Loading Property Details...</div>; }
//     if (error && !property && !loading) { return <div className="text-center py-12 text-red-600">Error loading property: {error}</div>; }
//     if (!property && !loading && !error) { return <div className="text-center py-12">Property not found.</div>; }

//     // Prepare data (only if property exists)
//     const documents = property ? getDocumentsArray(property.documentHashes) : [];
//     const ownerName = property?.owner?.name || property?.ownerName || 'N/A';
//     const ownerEmail = property?.owner?.email || 'N/A';
//     const ownerPhone = property?.owner?.phone || 'Not Provided';
//     const fallbackImage = 'https://via.placeholder.com/1200x600?text=Image+Not+Available';
//     const imageUrl = property?.image ? `http://localhost:5000/${property.image}` : fallbackImage;

//     return (
//         <div className="bg-gray-50 min-h-screen py-8">
//             <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
//                 <Link to="/buyer-dashboard/browse" className="inline-flex items-center text-gray-700 hover:text-blue-600 font-semibold mb-4">
//                     <ArrowLeft className="w-5 h-5 mr-2" /> Back to Browse
//                 </Link>

//                 {/* Display page level errors if any (like fetch errors) */}
//                 {error && (
//                      <div className="p-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
//                          <span className="font-medium">Error:</span> {error}
//                      </div>
//                  )}

//                 {property && ( // Render details only if property loaded
//                     <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                         {/* Image Section */}
//                         <div className="relative">
//                            <img src={imageUrl} alt={property.propertyAddress} className="w-full h-64 md:h-96 object-cover" onError={(e) => { e.target.src = fallbackImage; }}/>
//                             <div className="absolute bottom-0 left-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/70 to-transparent w-full">
//                                <h1 className="text-2xl md:text-3xl font-bold text-white">{property.propertyAddress}</h1>
//                                <p className="flex items-center text-lg text-gray-200 mt-1"><MapPin className="w-5 h-5 mr-2" /> {property.district || 'N/A'}</p>
//                             </div>
//                             {/* Status Badge */}
//                             <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
//                                  property.status === 'listed_for_sale' ? 'bg-green-500 text-white' :
//                                  property.status === 'sold' ? 'bg-red-500 text-white' :
//                                  'bg-gray-500 text-white' // Covers pending, verified, minted
//                              }`}>
//                                 {property.status.replace(/_/g, ' ').toUpperCase()}
//                             </span>
//                         </div>

//                         {/* Details Grid */}
//                         <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
//                             {/* Left Column */}
//                             <div className="md:col-span-2 space-y-6">
//                                 <Section title="Summary">
//                                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
//                                          <span className="flex items-center text-2xl font-bold text-green-600">
//                                              <DollarSign className="w-6 h-6 mr-2" /> {property.price || 'N/A'} ETH
//                                          </span>
//                                          <span className="flex items-center text-lg text-gray-600">
//                                              <Ruler className="w-5 h-5 mr-2" /> {property.area || 'N/A'} {property.areaUnit || 'sq m'}
//                                          </span>
//                                      </div>
//                                 </Section>
//                                 <Section title="Property Details">
//                                      <ul className="space-y-3 text-gray-700">
//                                          <DetailItem icon={Hash} label="Property ID" value={property.propertyId} />
//                                          <DetailItem icon={ClipboardList} label="Survey No" value={property.surveyNumber} />
//                                          <DetailItem icon={MapPin} label="District" value={property.district} />
//                                          <DetailItem icon={MapPin} label="Full Address" value={formatAddress(property)} />
//                                      </ul>
//                                 </Section>
//                                 <Section title="Location on Map">
//                                      <PropertyMapDisplay
//                                          latitude={property.latitude}
//                                          longitude={property.longitude}
//                                          address={property.propertyAddress}
//                                          geometry={property.geometry}
//                                      />
//                                 </Section>
//                                 <Section title="Verifiable Documents" icon={<FileText className="w-6 h-6 mr-2 text-blue-600" />}>
//                                      {documents.length > 0 ? (
//                                          <ul className="space-y-3">
//                                              {documents.map((doc, index) => (
//                                                  <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
//                                                      <span className="font-semibold text-gray-700 flex items-center">
//                                                          <CheckCircle className={`w-5 h-5 mr-2 ${index === 0 ? 'text-purple-500' : 'text-orange-500'}`} /> {doc.name}
//                                                      </span>
//                                                      <a href={`https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline text-sm">
//                                                          View on IPFS <LinkIcon className="w-4 h-4 ml-1" />
//                                                      </a>
//                                                  </li>
//                                              ))}
//                                          </ul>
//                                      ) : ( <p className="text-gray-500">No documents available.</p> )}
//                                 </Section>
//                             </div>

//                             {/* Right Column */}
//                             <div className="md:col-span-1 space-y-6">
//                                 <div className="bg-gray-50 rounded-lg p-6 border sticky top-24">
//                                     <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>

//                                     {/* Purchase Status Message */}
//                                     {purchaseStatus && (
//                                          <div className={`p-3 rounded-lg mb-4 text-sm ${
//                                             purchaseStatus.includes('successfully') || purchaseStatus.includes('confirmed') ? 'bg-green-100 border border-green-200 text-green-800' :
//                                             purchaseStatus.includes('Error') || purchaseStatus.includes('failed') ? 'bg-red-100 border border-red-200 text-red-800' :
//                                             'bg-blue-100 border border-blue-200 text-blue-800' // Pending/Info
//                                         }`}>
//                                              {purchaseStatus.includes("Action Required:") || purchaseLoading ? <Loader2 className="w-4 h-4 mr-2 inline animate-spin"/> : null}
//                                              {purchaseStatus}
//                                          </div>
//                                     )}

//                                     {/* Wallet Connection */}
//                                     {!userWallet && property.status === 'listed_for_sale' && (
//                                          <button onClick={connectWallet} disabled={purchaseLoading} className="w-full mb-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors flex items-center justify-center disabled:opacity-50">
//                                             🦊 Connect Wallet to Buy
//                                          </button>
//                                      )}
//                                      {userWallet && (
//                                           <div className="p-2 mb-4 bg-green-100 border border-green-200 rounded-lg text-center">
//                                              <p className="text-green-800 text-xs font-mono truncate" title={userWallet}>Wallet Connected: {userWallet}</p>
//                                          </div>
//                                      )}

//                                     {/* Purchase Button Logic */}
//                                     {property.status === 'listed_for_sale' && (
//                                         <button
//                                             onClick={handleDirectPurchase} // CALLS DIRECT PURCHASE
//                                             disabled={purchaseLoading || !user || !userWallet}
//                                             className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
//                                             title={!user ? "Please log in first" : !userWallet ? "Please connect your wallet first" : `Buy now for ${property.price} ETH`}
//                                         >
//                                             {purchaseLoading ? (
//                                                 <> <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing Purchase... </>
//                                             ) : (
//                                                 `Buy Now for ${property.price} ETH`
//                                             )}
//                                         </button>
//                                     )}
//                                      {/* Removed 'pending_seller_verification' state */}
//                                     {property.status === 'sold' && (
//                                         <div className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold text-center"> Property Sold </div>
//                                     )}
//                                      {/* Covers pending, verified, minted */}
//                                     {property.status !== 'listed_for_sale' && property.status !== 'sold' && (
//                                          <div className="w-full py-3 bg-gray-400 text-white rounded-lg font-semibold text-center"> Not Available for Purchase </div>
//                                      )}

//                                     {/* Login/Wallet Prompts */}
//                                     {!user && property.status === 'listed_for_sale' && ( <p className="text-xs text-center text-red-600 mt-2">You must be <Link to="/login" className="underline">logged in</Link> to purchase.</p> )}
//                                 </div>
//                                 <div className="bg-white rounded-lg border p-6">
//                                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><User className="w-6 h-6 mr-2 text-gray-600" /> Owner Information</h2>
//                                      <div className="space-y-3 text-gray-700">
//                                          <InfoRow icon={User} label="Name" value={ownerName} />
//                                          <InfoRow icon={Mail} label="Email" value={ownerEmail} />
//                                          <InfoRow icon={Phone} label="Phone" value={ownerPhone} />
//                                      </div>
//                                 </div>
//                                 <div className="bg-white rounded-lg border p-6 text-sm text-gray-600 space-y-2">
//                                      <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Info</h3>
//                                      <div className="flex justify-between"><span>Listed:</span> <span>{new Date(property.createdAt).toLocaleDateString()}</span></div>
//                                      <div className="flex justify-between"><span>Updated:</span> <span>{new Date(property.updatedAt).toLocaleDateString()}</span></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// // --- Helper Components ---
// const Section = ({ title, icon, children }) => ( <div className="p-4 bg-white rounded-lg border border-gray-200"><h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">{icon}{title}</h2>{children}</div> );
// const DetailItem = ({ icon: Icon, label, value }) => ( <li className="flex items-center text-sm"><Icon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" /><strong className="mr-1">{label}:</strong> <span className="text-gray-700 truncate" title={value || 'N/A'}>{value || 'N/A'}</span></li> );
// const InfoRow = ({ icon: Icon, label, value }) => ( <div className="flex items-center text-sm"><Icon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" /><p className="font-medium text-gray-800">{value}</p></div> );

// export default PropertyDetails;

// Frontend/src/pages/Buyer/PropertyDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Hash, Ruler, User, Mail, Phone, ExternalLink,
    FileText, CheckCircle, LinkIcon, ClipboardList, Loader2, DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PropertyMapDisplay from '../../components/PropertyMapDisplay';
import { ethers } from 'ethers';
// Note: MarketplaceABI is not directly used in this version for direct ETH transfer
// import MarketplaceABI from '../../abis/Marketplace.json';

const PropertyDetails = () => {
    const { id } = useParams(); // Property MongoDB ID from URL
    const { user } = useAuth(); // Logged-in user context
    const [property, setProperty] = useState(null); // State for property data
    const [loading, setLoading] = useState(true); // State for page loading
    const [error, setError] = useState(null); // State for fetch/general errors
    const [purchaseLoading, setPurchaseLoading] = useState(false); // State for purchase button loading
    const [purchaseStatus, setPurchaseStatus] = useState(''); // State for purchase feedback messages
    const [userWallet, setUserWallet] = useState(null); // State for connected wallet address

    // Check connected wallet on component mount
    useEffect(() => {
        checkWalletConnection();
    }, []);

    // Fetch property details when component mounts or ID changes
    useEffect(() => {
        const fetchPropertyDetails = async () => {
            setLoading(true); setError(null);
            try {
                const response = await fetch(`http://localhost:5000/api/properties/${id}`);
                if (!response.ok) {
                    let errorMsg = `HTTP ${response.status}: Failed to fetch details`;
                    try { const d = await response.json(); errorMsg = d.message || errorMsg; } catch (e) {/*ignore JSON parsing error*/}
                    throw new Error(errorMsg);
                }
                const data = await response.json();
                setProperty(data); // Set property data in state
            } catch (err) {
                console.error("Fetch Property Details Error:", err);
                setError(err.message);
            } finally {
                setLoading(false); // Stop loading indicator
            }
        };
        fetchPropertyDetails();
    }, [id]); // Dependency array ensures fetch runs when ID changes

    // Function to check if MetaMask is connected
    const checkWalletConnection = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' }); // Check for existing accounts
                if (accounts.length > 0) setUserWallet(accounts[0]); // Set wallet if connected
                else setUserWallet(null);
            } catch (error) { console.error('Error checking wallet connection:', error); setUserWallet(null); }
        } else { setUserWallet(null); console.log("MetaMask not detected."); }
    };

    // Function to prompt MetaMask connection
    const connectWallet = async () => {
        if (!window.ethereum) { setPurchaseStatus('MetaMask not detected. Please install it.'); return null; }
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request accounts
            if (accounts.length > 0) {
                setUserWallet(accounts[0]); setPurchaseStatus(''); return accounts[0]; // Set wallet on success
            }
            setPurchaseStatus('Wallet connection failed.'); return null;
        } catch (error) {
            let msg = 'Failed to connect wallet.';
            if (error.code === 4001) msg = 'Connection rejected in MetaMask.'; // User rejected connection
            setPurchaseStatus(msg); return null;
        }
    };

    // --- Direct Purchase Handler ---
    // Handles ETH transfer and backend confirmation
    const handleDirectPurchase = async () => {
        let currentWallet = userWallet || await connectWallet(); // Connect if not already
        if (!currentWallet) return; // Stop if connection failed or was rejected
        if (!user || !user.token) { setPurchaseStatus('Error: Please log in first.'); return; } // Check login
        if (!property || property.status !== 'listed_for_sale') { setPurchaseStatus('Error: Property not available.'); return; } // Check property status
        if (!property.tokenId) { setPurchaseStatus('Error: Property Token ID missing.'); return; } // Check for essential data

        setPurchaseLoading(true); setPurchaseStatus('Preparing purchase...'); setError(null);

        try {
            // --- 1. Blockchain Interaction: Send ETH ---
            setPurchaseStatus("Connecting to blockchain...");
            const provider = new ethers.BrowserProvider(window.ethereum); // Connect via MetaMask
            const signer = await provider.getSigner(); // Get user's signer object
            setPurchaseStatus('Action Required: Confirm payment in MetaMask...');
            const priceInWei = ethers.parseEther(property.price.toString()); // Convert ETH price to Wei

            // Initiate the ETH transfer transaction
            const tx = await signer.sendTransaction({
                to: property.ownerWalletAddress, // Send to the seller's address
                value: priceInWei,
                gasLimit: 21000 // Standard gas limit for ETH transfer
            });
            setPurchaseStatus('Payment sent! Waiting for confirmation...');
            const receipt = await tx.wait(1); // Wait for 1 block confirmation

            // Check if the transaction was successful on the blockchain
            if (receipt.status !== 1) throw new Error('Payment transaction failed on blockchain.');

            // --- 2. Backend Interaction: Confirm Sale ---
            setPurchaseStatus('Payment successful! Updating ownership...');
            const backendResponse = await fetch(`http://localhost:5000/api/properties/${id}/confirm-sale`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` }, // Include auth token
                body: JSON.stringify({
                    transactionHash: receipt.hash, // Send the confirmed transaction hash
                    buyerWalletAddress: currentWallet // Send the buyer's wallet address
                })
            });
            const backendData = await backendResponse.json();

            // Check if backend update was successful
            if (!backendResponse.ok) throw new Error(`Database update failed: ${backendData.message || 'Unknown error'}. TX Hash: ${receipt.hash}`);

            // --- 3. UI Update on Success ---
            setPurchaseStatus('🎉 Purchase completed! You are now the owner!');
            // Update local state to reflect the purchase immediately
            setProperty(prev => ({
                ...prev,
                status: 'sold',
                owner: user._id, // Update owner ID to current user
                ownerName: user?.name || 'You', // Update owner name
                ownerWalletAddress: currentWallet, // Update owner wallet
                soldAt: new Date(), // Set sold date
                soldPrice: property.price, // Record sold price
                previousOwner: prev.owner // Keep reference to the previous owner object
            }));
        } catch (err) { // --- Error Handling ---
            console.error('❌ Purchase Error:', err);
            let userMessage = 'Purchase failed: ';
            // Provide more user-friendly messages for common errors
            if (err.code === 4001 || err.code === 'ACTION_REJECTED') userMessage = "Transaction cancelled in MetaMask.";
            else if (err.message?.includes("insufficient funds")) userMessage = `Insufficient funds (${property.price} ETH + gas).`;
            else if (err.code === 'NETWORK_ERROR') userMessage = "Network error. Please check your internet connection.";
            else userMessage += err.message || 'Unknown error occurred.';
            setError(userMessage); setPurchaseStatus(`❌ ${userMessage}`);
        } finally { // --- Cleanup ---
            setPurchaseLoading(false); // Stop loading indicator
            // Clear status message after a delay
            setTimeout(() => setPurchaseStatus(''), error ? 10000 : 6000); // Longer delay if there was an error
        }
    };


    // --- Helper Functions for Display ---
    const formatAddress = (prop) => prop?.propertyAddress || 'N/A';
    const getDocumentsArray = (hashes) => {
        if (!hashes || !Array.isArray(hashes)) return [];
        const docNames = ['Mother Deed', 'Encumbrance Certificate'];
        return hashes.map((hash, index) => ({ name: docNames[index] || `Doc ${index + 1}`, ipfsHash: hash, status: 'verified' }));
    };

    // --- Loading and Error States ---
    if (loading && !error) { return <div className="text-center py-12 flex justify-center items-center"><Loader2 className="w-8 h-8 mr-2 animate-spin text-blue-600" /> Loading Property Details...</div>; }
    if (error && !property && !loading) { return <div className="text-center py-12 text-red-600">Error loading property: {error}</div>; }
    if (!property && !loading && !error) { return <div className="text-center py-12">Property not found.</div>; }

    // --- Prepare Display Data ---
    const documents = property ? getDocumentsArray(property.documentHashes) : [];
    const fallbackImage = 'https://via.placeholder.com/1200x600?text=Image+Not+Available';
    const imageUrl = property?.image ? `http://localhost:5000/${property.image}` : fallbackImage;

    // --- Dynamic Owner/Seller Info (FIX 1) ---
    let displayOwner = { name: 'N/A', email: 'N/A', phone: 'Not Provided' };
    if (property) {
        if (property.status === 'sold') {
            // If sold, display the CURRENT owner (buyer)
            if (user && property.owner?._id === user._id) { // Check if logged-in user is the owner
                displayOwner = { name: "You", email: user.email || 'Your Email', phone: user.phone || 'Your Phone' };
            } else if (property.owner) { // Otherwise, show owner data populated from backend
                displayOwner = { name: property.owner.name || 'N/A', email: property.owner.email || 'N/A', phone: property.owner.phone || 'Not Provided' };
            } else { // Fallback if owner data isn't available
                displayOwner = { name: property.ownerName || 'N/A', email: 'N/A', phone: 'Not Provided' };
            }
        } else { // If listed_for_sale, pending, verified, etc., display the SELLER
            if (property.owner) {
                displayOwner = { name: property.owner.name || 'N/A', email: property.owner.email || 'N/A', phone: property.owner.phone || 'Not Provided' };
            } else { // Fallback
                displayOwner = { name: property.ownerName || 'N/A', email: 'N/A', phone: 'Not Provided' };
            }
        }
    }

    // --- Dynamic Back Button (FIX 2) ---
    const backLink = property?.status === 'sold' ? "/buyer-dashboard/properties" : "/buyer-dashboard/browse";
    const backLinkText = property?.status === 'sold' ? "Back to Properties" : "Back to Browse";

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                {/* Back Button with dynamic link and text */}
                <Link to={backLink} className="inline-flex items-center text-gray-700 hover:text-blue-600 font-semibold mb-4">
                    <ArrowLeft className="w-5 h-5 mr-2" /> {backLinkText}
                </Link>

                {/* General Error Display */}
                {error && (
                    <div className="p-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
                        <span className="font-medium">Error:</span> {error}
                    </div>
                )}

                {/* Main Property Details Card */}
                {property && (
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
                                'bg-gray-500 text-white'
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
                                        {/* Dynamic Price Display */}
                                        <span className={`flex items-center text-2xl font-bold ${property.status === 'sold' ? 'text-gray-700' : 'text-green-600'}`}>
                                            <DollarSign className="w-6 h-6 mr-2" />
                                            {property.status === 'sold' ? `${property.soldPrice || property.price || 'N/A'} ETH (Sold Price)` : `${property.price || 'N/A'} ETH`}
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
                                        geometry={property.geometry} // Pass geometry to display highlighted area
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
                                            purchaseStatus.includes('🎉') ? 'bg-green-100 border border-green-200 text-green-800' :
                                            purchaseStatus.includes('❌') ? 'bg-red-100 border border-red-200 text-red-800' :
                                            'bg-blue-100 border border-blue-200 text-blue-800'
                                        }`}>
                                            {purchaseStatus.includes("Action Required:") || purchaseLoading ? <Loader2 className="w-4 h-4 mr-2 inline animate-spin"/> : null}
                                            {purchaseStatus}
                                        </div>
                                    )}
                                    {/* Wallet Connection Button */}
                                    {!userWallet && property.status === 'listed_for_sale' && (
                                        <button onClick={connectWallet} disabled={purchaseLoading} className="w-full mb-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors flex items-center justify-center disabled:opacity-50">
                                            🦊 Connect Wallet to Buy
                                        </button>
                                    )}
                                    {/* Wallet Connected Indicator */}
                                    {userWallet && (
                                        <div className="p-2 mb-4 bg-green-100 border border-green-200 rounded-lg text-center">
                                            <p className="text-green-800 text-xs font-mono truncate" title={userWallet}>Wallet Connected: {userWallet}</p>
                                        </div>
                                    )}
                                    {/* Purchase Button */}
                                    {property.status === 'listed_for_sale' && (
                                        <button
                                            onClick={handleDirectPurchase}
                                            disabled={purchaseLoading || !user || !userWallet}
                                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                                            title={!user ? "Please log in first" : !userWallet ? "Please connect your wallet first" : `Buy now for ${property.price} ETH`}
                                        >
                                            {purchaseLoading ? (
                                                <> <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing Purchase... </>
                                            ) : ( `Buy Now for ${property.price} ETH` )}
                                        </button>
                                    )}
                                    {/* Sold Badge */}
                                    {property.status === 'sold' && (
                                        <div className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold text-center"> Property Sold </div>
                                    )}
                                    {/* Not Available Badge */}
                                    {property.status !== 'listed_for_sale' && property.status !== 'sold' && (
                                        <div className="w-full py-3 bg-gray-400 text-white rounded-lg font-semibold text-center"> Not Available for Purchase </div>
                                    )}
                                    {/* Login Prompt */}
                                    {!user && property.status === 'listed_for_sale' && ( <p className="text-xs text-center text-red-600 mt-2">You must be <Link to="/login" className="underline">logged in</Link> to purchase.</p> )}
                                </div>

                                {/* Dynamic Owner Info Box */}
                                <div className="bg-white rounded-lg border p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <User className="w-6 h-6 mr-2 text-gray-600" />
                                        {/* Title changes based on status */}
                                        {property.status === 'sold' ? 'Current Owner Information' : 'Seller Information'}
                                    </h2>
                                    <div className="space-y-3 text-gray-700">
                                        {/* Uses the dynamically determined displayOwner */}
                                        <InfoRow icon={User} label="Name" value={displayOwner.name} />
                                        <InfoRow icon={Mail} label="Email" value={displayOwner.email} />
                                        <InfoRow icon={Phone} label="Phone" value={displayOwner.phone} />
                                    </div>
                                </div>

                                {/* Quick Info Box */}
                                <div className="bg-white rounded-lg border p-6 text-sm text-gray-600 space-y-2">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Info</h3>
                                    <div className="flex justify-between"><span>Registered:</span> <span>{new Date(property.createdAt).toLocaleDateString()}</span></div>
                                    <div className="flex justify-between"><span>Last Updated:</span> <span>{new Date(property.updatedAt).toLocaleDateString()}</span></div>
                                    {/* Show Sold Date if available */}
                                    {property.status === 'sold' && property.soldAt && (
                                        <div className="flex justify-between"><span>Sold On:</span> <span>{new Date(property.soldAt).toLocaleDateString()}</span></div>
                                    )}
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
const InfoRow = ({ icon: Icon, label, value }) => ( <div className="flex items-center text-sm"><Icon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" /><p className="font-medium text-gray-800">{value || 'Not Provided'}</p></div> );

export default PropertyDetails;