// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { ethers } from "ethers";
// import { MapPin, DollarSign, Ruler, Calendar, ExternalLink, Copy } from 'lucide-react';
// import MarketplaceABI from "../../abis/Marketplace.json";

// const PurchaseHistory = () => {
//   const { isAuthenticated } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [purchasedProperties, setPurchasedProperties] = useState([]);
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [totalSpent, setTotalSpent] = useState("0");

//   useEffect(() => {
//     if (!isAuthenticated) {
//       setLoading(false);
//       return;
//     }

//     const fetchPurchaseHistory = async () => {
//       try {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await provider.getSigner();
//         const buyerAddress = await signer.getAddress();

//         const marketplace = new ethers.Contract(
//           import.meta.env.VITE_MARKETPLACE_ADDRESS,
//           MarketplaceABI.abi,
//           provider
//         );

//         // Fetch purchased properties using PropertySold events where buyer is the current user
//         const filter = marketplace.filters.PropertySold(null, buyerAddress, null, null);
//         const events = await marketplace.queryFilter(filter);
        
//         setDetailsLoading(true);
        
//         // Get basic event data first
//         const purchasedPropsWithoutDetails = events.map(ev => ({
//           tokenId: ev.args.tokenId.toString(),
//           seller: ev.args.seller,
//           price: ethers.formatEther(ev.args.price),
//           blockNumber: ev.blockNumber,
//           transactionHash: ev.transactionHash,
//           timestamp: null,
//           sellerDetails: null,
//           propertyDetails: null
//         }));

//         setPurchasedProperties(purchasedPropsWithoutDetails);

//         // Calculate total spent
//         const total = purchasedPropsWithoutDetails.reduce((sum, prop) => sum + parseFloat(prop.price), 0);
//         setTotalSpent(total.toFixed(4));

//         // Fetch seller and property details for each purchased property
//         const enrichedProperties = await Promise.all(
//           purchasedPropsWithoutDetails.map(async (prop) => {
//             try {
//               // Fetch block timestamp
//               let timestamp = null;
//               try {
//                 const block = await provider.getBlock(prop.blockNumber);
//                 timestamp = new Date(block.timestamp * 1000);
//               } catch (blockError) {
//                 console.error(`Error fetching block ${prop.blockNumber}:`, blockError);
//               }

//               // Fetch seller details
//               const sellerResponse = await fetch(`http://localhost:5000/api/auth/by-wallet/${prop.seller}`, {
//                 credentials: 'include',
//               });
              
//               let sellerDetails = null;
//               if (sellerResponse.ok) {
//                 sellerDetails = await sellerResponse.json();
//               }

//               // Fetch property details by tokenId
//               const propertyResponse = await fetch(`http://localhost:5000/api/requests/by-token/${prop.tokenId}`, {
//                 credentials: 'include',
//               });
              
//               let propertyDetails = null;
//               if (propertyResponse.ok) {
//                 propertyDetails = await propertyResponse.json();
//               }

//               return {
//                 ...prop,
//                 timestamp,
//                 sellerDetails,
//                 propertyDetails
//               };
//             } catch (error) {
//               console.error(`Error fetching details for property ${prop.tokenId}:`, error);
//               return prop;
//             }
//           })
//         );

//         // Sort by block number (most recent first)
//         enrichedProperties.sort((a, b) => b.blockNumber - a.blockNumber);
        
//         setPurchasedProperties(enrichedProperties);
//         setDetailsLoading(false);

//       } catch (err) {
//         console.error("Error fetching purchase history:", err);
//         setError("Failed to fetch purchase history.");
//         setDetailsLoading(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPurchaseHistory();
//   }, [isAuthenticated]);

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp) return "Unknown date";
//     return timestamp.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getEtherscanUrl = (txHash) => {
//     // You might want to adjust this based on your network (mainnet, testnet, etc.)
//     return `https://etherscan.io/tx/${txHash}`;
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="container mx-auto p-4">
//         <div className="text-center py-12">
//           <h2 className="text-2xl font-semibold text-gray-600 mb-4">Authentication Required</h2>
//           <p className="text-gray-500">Please log in to view your purchase history.</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto p-4">
//         <div className="text-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your purchase history...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Purchase History</h1>

//       {error && (
//         <div className="p-4 mb-6 text-sm text-red-800 bg-red-100 rounded-lg border border-red-200">
//           {error}
//         </div>
//       )}

//       {/* Summary Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <h3 className="text-sm font-medium text-gray-500 mb-2">Total Purchases</h3>
//           <p className="text-2xl font-bold text-gray-900">{purchasedProperties.length}</p>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <h3 className="text-sm font-medium text-gray-500 mb-2">Total Spent</h3>
//           <p className="text-2xl font-bold text-blue-600">{totalSpent} ETH</p>
//           <p className="text-xs text-gray-500 mt-1">
//             ~${(parseFloat(totalSpent) * 2000).toLocaleString()} USD
//           </p>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <h3 className="text-sm font-medium text-gray-500 mb-2">Average Property Value</h3>
//           <p className="text-2xl font-bold text-green-600">
//             {purchasedProperties.length > 0 ? (parseFloat(totalSpent) / purchasedProperties.length).toFixed(4) : "0"} ETH
//           </p>
//         </div>
//       </div>

//       {/* Purchase History */}
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-gray-800">Your Properties</h2>
//             {detailsLoading && (
//               <div className="flex items-center text-sm text-blue-600">
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
//                 Loading property details...
//               </div>
//             )}
//           </div>
//         </div>

//         {purchasedProperties.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-lg mb-2">No purchases yet</div>
//             <p className="text-gray-500">Your purchased properties will appear here</p>
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-200">
//             {purchasedProperties.map((prop, index) => (
//               <div key={`${prop.tokenId}-${index}`} className="p-6 hover:bg-gray-50 transition-colors">
//                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  
//                   {/* Property Info */}
//                   <div className="flex-1 lg:pr-6">
//                     <div className="flex items-start space-x-4">
//                       {/* Property Image Placeholder */}
//                       <div className="flex-shrink-0">
//                         {prop.propertyDetails?.images?.[0] ? (
//                           <img 
//                             src={prop.propertyDetails.images[0]} 
//                             alt="Property"
//                             className="w-16 h-16 rounded-lg object-cover"
//                           />
//                         ) : (
//                           <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
//                             <MapPin className="w-6 h-6 text-gray-400" />
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Property Details */}
//                       <div className="flex-1 min-w-0">
//                         <h3 className="text-lg font-semibold text-gray-900 truncate">
//                           {prop.propertyDetails?.title || `Property #${prop.tokenId}`}
//                         </h3>
                        
//                         {prop.propertyDetails && (
//                           <div className="mt-1 space-y-1">
//                             {prop.propertyDetails.location && (
//                               <p className="flex items-center text-sm text-gray-600">
//                                 <MapPin className="w-4 h-4 mr-1" />
//                                 {prop.propertyDetails.location}
//                               </p>
//                             )}
//                             {prop.propertyDetails.size && (
//                               <p className="flex items-center text-sm text-gray-600">
//                                 <Ruler className="w-4 h-4 mr-1" />
//                                 {prop.propertyDetails.size}
//                               </p>
//                             )}
//                           </div>
//                         )}

//                         {/* Seller Info */}
//                         <div className="mt-2 text-sm text-gray-500">
//                           <span>Seller: </span>
//                           {prop.sellerDetails ? (
//                             <span className="font-medium">
//                               {prop.sellerDetails.name || 'Unknown'}
//                             </span>
//                           ) : (
//                             <span 
//                               className="font-mono cursor-pointer hover:text-blue-600"
//                               onClick={() => copyToClipboard(prop.seller)}
//                               title="Click to copy seller address"
//                             >
//                               {prop.seller.slice(0, 6)}...{prop.seller.slice(-4)}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Purchase Details */}
//                   <div className="lg:text-right space-y-2">
//                     <div className="flex items-center lg:justify-end space-x-2">
//                       <DollarSign className="w-5 h-5 text-green-600" />
//                       <span className="text-xl font-bold text-green-600">{prop.price} ETH</span>
//                     </div>
                    
//                     <div className="flex items-center lg:justify-end space-x-2 text-sm text-gray-500">
//                       <Calendar className="w-4 h-4" />
//                       <span>{formatDate(prop.timestamp)}</span>
//                     </div>

//                     <div className="flex items-center lg:justify-end space-x-4 text-sm">
//                       <span className="text-gray-500">Token #{prop.tokenId}</span>
                      
//                       <a
//                         href={getEtherscanUrl(prop.transactionHash)}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center text-blue-600 hover:text-blue-800"
//                       >
//                         <ExternalLink className="w-4 h-4 mr-1" />
//                         Etherscan
//                       </a>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Property Description */}
//                 {prop.propertyDetails?.description && (
//                   <div className="mt-4 pt-4 border-t border-gray-100">
//                     <p className="text-sm text-gray-600 line-clamp-2">
//                       {prop.propertyDetails.description}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Additional Actions */}
//       {purchasedProperties.length > 0 && (
//         <div className="mt-8 bg-blue-50 rounded-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Your Properties</h3>
//           <p className="text-gray-600 mb-4">
//             You now own {purchasedProperties.length} propert{purchasedProperties.length === 1 ? 'y' : 'ies'}. 
//             All transactions are secured by blockchain technology and your ownership is permanently recorded.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4">
//             {/* <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//               View Property Details
//             </button>
//             <button className="px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
//               Download Ownership Certificate
//             </button> */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PurchaseHistory;

import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'; // Import Link
import { useAuth } from "../../context/AuthContext";
import { ethers } from "ethers";
import { MapPin, DollarSign, Ruler, Calendar, ExternalLink, Copy, Hash, Loader2 } from 'lucide-react'; // Removed User icon, not used directly here
import MarketplaceABI from "../../abis/Marketplace.json"; // Ensure path is correct

const PurchaseHistory = () => {
    const { user, isAuthenticated } = useAuth(); // Get user object for token and auth status
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchasedProperties, setPurchasedProperties] = useState([]);
    const [detailsLoading, setDetailsLoading] = useState({}); // Track loading state per property
    const [totalSpent, setTotalSpent] = useState("0");

    useEffect(() => {
        const fetchPurchaseEventsAndDetails = async () => {
            // Ensure user is authenticated and wallet address is available
            if (!isAuthenticated || !user?.token || !user?.walletAddress) {
                setError("Please log in and ensure your wallet address is available to view purchase history.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);

            try {
                if (!window.ethereum) throw new Error("MetaMask is required to fetch blockchain history.");

                const provider = new ethers.BrowserProvider(window.ethereum);
                const buyerAddress = user.walletAddress; // Use address from auth context

                const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS;
                if (!marketplaceAddress) throw new Error("Marketplace address configuration missing (VITE_MARKETPLACE_ADDRESS in .env).");

                const marketplace = new ethers.Contract(
                    marketplaceAddress,
                    MarketplaceABI.abi,
                    provider // Use provider for read-only event fetching
                );

                console.log(`Fetching PropertySold events for buyer: ${buyerAddress} on contract ${marketplaceAddress}`);
                // Fetch purchased properties using PropertySold events where 'buyer' is indexed and matches user's address
                // Ensure your event signature is: event PropertySold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);
                const filter = marketplace.filters.PropertySold(null, buyerAddress, null, null);
                const events = await marketplace.queryFilter(filter);
                console.log(`Found ${events.length} PropertySold events.`);

                if (events.length === 0) {
                    setPurchasedProperties([]);
                    setTotalSpent("0");
                    setLoading(false);
                    return; // No purchases found
                }

                // Initial state with event data, sorted by block number (most recent first)
                const initialProps = events
                    .map(ev => {
                        // Basic validation of event arguments
                        const args = ev.args;
                        if (!args || args.tokenId === undefined || args.seller === undefined || args.price === undefined) {
                            console.warn("Skipping malformed PropertySold event:", ev);
                            return null; // Skip invalid events
                        }
                        return {
                            tokenId: args.tokenId.toString(),
                            seller: args.seller,
                            price: ethers.formatEther(args.price),
                            blockNumber: ev.blockNumber,
                            transactionHash: ev.transactionHash,
                            timestamp: null, sellerDetails: null, propertyDetails: null
                        };
                    })
                    .filter(prop => prop !== null) // Remove skipped events
                    .sort((a, b) => b.blockNumber - a.blockNumber);

                setPurchasedProperties(initialProps); // Show basic info immediately

                // Calculate total spent from valid events
                const total = initialProps.reduce((sum, prop) => sum + parseFloat(prop.price || 0), 0);
                setTotalSpent(total.toFixed(4));

                // Start loading indicators for details
                setDetailsLoading(initialProps.reduce((acc, prop) => ({ ...acc, [prop.transactionHash]: true }), {}));

                // Fetch details for each property sequentially or in batches
                const enrichedProperties = [];
                for (const prop of initialProps) {
                    try {
                        let timestamp = prop.timestamp; // Keep existing if already fetched (unlikely here)
                        let sellerDetails = prop.sellerDetails;
                        let propertyDetails = prop.propertyDetails;

                        // Fetch block timestamp if not already present
                        if (!timestamp) {
                            try {
                                const block = await provider.getBlock(prop.blockNumber);
                                timestamp = block ? new Date(block.timestamp * 1000) : null;
                            } catch (blockError) { console.error(`Err fetching block ${prop.blockNumber}:`, blockError); }
                        }

                        // Fetch seller details if not already present
                        if (!sellerDetails) {
                            try {
                                // --- Added Authorization Header ---
                                const sellerResponse = await fetch(`http://localhost:5000/api/users/wallet/${prop.seller}`, {
                                    headers: { 'Authorization': `Bearer ${user.token}` }
                                });
                                if (sellerResponse.ok) sellerDetails = await sellerResponse.json();
                                else console.warn(`Seller details fetch failed (${sellerResponse.status}) for wallet: ${prop.seller}`);
                            } catch (sellerErr) { console.error(`Error fetching seller ${prop.seller}:`, sellerErr); }
                        }

                        // Fetch property details if not already present
                        if (!propertyDetails) {
                            try {
                                // --- Added Authorization Header ---
                                // Endpoint to get property by Token ID
                                const propertyResponse = await fetch(`http://localhost:5000/api/properties/token/${prop.tokenId}`, { // UPDATED ENDPOINT
                                    headers: { 'Authorization': `Bearer ${user.token}` }
                                });
                                if (propertyResponse.ok) propertyDetails = await propertyResponse.json();
                                else console.warn(`Property details fetch failed (${propertyResponse.status}) for token: ${prop.tokenId}`);
                            } catch (propErr) { console.error(`Error fetching property ${prop.tokenId}:`, propErr); }
                        }

                        enrichedProperties.push({ ...prop, timestamp, sellerDetails, propertyDetails });

                        // Update state incrementally to show details as they load
                        setPurchasedProperties(currentProps =>
                           currentProps.map(p => p.transactionHash === prop.transactionHash ? enrichedProperties[enrichedProperties.length - 1] : p)
                        );
                        setDetailsLoading(prev => ({ ...prev, [prop.transactionHash]: false })); // Mark as done

                    } catch (detailError) {
                        console.error(`Error fetching full details for purchase ${prop.transactionHash}:`, detailError);
                        enrichedProperties.push(prop); // Keep basic info on error
                         setPurchasedProperties(currentProps =>
                           currentProps.map(p => p.transactionHash === prop.transactionHash ? prop : p) // Update with basic info
                        );
                        setDetailsLoading(prev => ({ ...prev, [prop.transactionHash]: false }));
                    }
                }
                // Ensure final state has all enriched properties (in case incremental failed somehow)
                // setPurchasedProperties(enrichedProperties); // This might cause a re-sort flicker, incremental is often better UX


            } catch (err) {
                console.error("Error fetching purchase history:", err);
                let message = `Failed to fetch purchase history: ${err.message}`;
                // More specific errors
                if (err.message.includes("User wallet address not found")) message = err.message;
                else if (err.message.includes("configuration missing")) message = err.message;
                setError(message);
            } finally {
                setLoading(false); // Overall loading done
                // Keep individual detail loading states until each is finished
            }
        };

        fetchPurchaseEventsAndDetails();
    }, [user, isAuthenticated]); // Rerun if user or auth status changes

    // Helper functions
    const copyToClipboard = (text) => { /* ... (same as before) ... */ };
    const formatDate = (timestamp) => { /* ... (same as before) ... */ };
    const getEtherscanUrl = (txHash) => `${etherscanBaseUrl}/tx/${txHash}`;
    const etherscanBaseUrl = "https://etherscan.io"; // TODO: Adjust if using Testnet/Ganache

    // --- Render Logic ---
    if (loading) { /* ... Loading spinner ... */ }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Purchase History</h1>


            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                 {/* Total Purchases Card */}
                 <div className="bg-white shadow rounded-lg p-4 md:p-6 text-center md:text-left">
                     <h3 className="text-sm font-medium text-gray-500 mb-1">Total Properties Owned</h3>
                     <p className="text-2xl font-bold text-gray-900">{purchasedProperties.length}</p>
                 </div>
                 {/* Total Spent Card */}
                 <div className="bg-white shadow rounded-lg p-4 md:p-6 text-center md:text-left">
                     <h3 className="text-sm font-medium text-gray-500 mb-1">Total Spent</h3>
                     <p className="text-2xl font-bold text-blue-600">{totalSpent} ETH</p>
                 </div>
                 {/* Average Price Card */}
                 <div className="bg-white shadow rounded-lg p-4 md:p-6 text-center md:text-left">
                     <h3 className="text-sm font-medium text-gray-500 mb-1">Average Purchase Price</h3>
                     <p className="text-2xl font-bold text-green-600">
                         {purchasedProperties.length > 0 ? (parseFloat(totalSpent) / purchasedProperties.length).toFixed(4) : "0"} ETH
                     </p>
                 </div>
            </div>

            {/* Purchase History List */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Your Purchased Properties</h2>
                </div>

                {/* Show only if logged in and finished loading */}
                {isAuthenticated && !loading && purchasedProperties.length === 0 ? (
                     <div className="text-center py-12 px-6"> {/* Empty state */} </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {purchasedProperties.map((prop) => (
                            <li key={prop.transactionHash} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                                    {/* Left Side: Property & Seller Info */}
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-start space-x-3">
                                            {/* Image */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-12 w-12 rounded-md object-cover border"
                                                    src={prop.propertyDetails?.image ? `http://localhost:5000/${prop.propertyDetails.image}` : 'https://via.placeholder.com/64?text=...?'}
                                                    alt={prop.propertyDetails?.propertyAddress || `Token #${prop.tokenId}`}
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=Img'; }}
                                                />
                                            </div>
                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                {/* Property Address or ID */}
                                                <p className="text-sm font-semibold text-indigo-700 truncate">
                                                     {/* Link to details page if available */}
                                                     {prop.propertyDetails?._id ? (
                                                         <Link to={`/buyer-dashboard/property/${prop.propertyDetails._id}`} className="hover:underline">
                                                             {prop.propertyDetails.propertyAddress || `Property (Token #${prop.tokenId})`}
                                                         </Link>
                                                     ) : (
                                                         prop.propertyDetails?.propertyAddress || `Property (Token #${prop.tokenId})`
                                                     )}
                                                </p>
                                                {/* District & Area */}
                                                {prop.propertyDetails ? (
                                                    <p className="text-xs text-gray-500 flex items-center mt-0.5 flex-wrap">
                                                        <span className="flex items-center mr-2"><MapPin className="w-3 h-3 mr-1"/> {prop.propertyDetails.district || 'N/A'}</span>
                                                        <span className="flex items-center"><Ruler className="w-3 h-3 mr-1"/> {prop.propertyDetails.area} {prop.propertyDetails.areaUnit || 'sq m'}</span>
                                                    </p>
                                                ) : detailsLoading[prop.transactionHash] ? (
                                                     <p className="text-xs text-blue-500 mt-1 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin"/> Loading details...</p>
                                                 ) : ( <p className="text-xs text-gray-400 mt-1">Details unavailable</p> )}
                                                {/* Seller Info */}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Purchased from: <span className="font-medium text-gray-700">{prop.sellerDetails?.name || 'Unknown Seller'}</span>
                                                    <span className="font-mono ml-1" title={prop.seller}>
                                                        ({prop.seller.substring(0,5)}...{prop.seller.substring(prop.seller.length - 3)})
                                                        <button onClick={() => copyToClipboard(prop.seller)} title="Copy Seller Address" className="ml-1 text-gray-400 hover:text-gray-600 inline-block align-middle"><Copy className="w-3 h-3"/></button>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Purchase Info */}
                                    <div className="flex-shrink-0 sm:text-right space-y-1">
                                         <p className="flex items-center sm:justify-end text-lg font-bold text-green-600">
                                             <DollarSign className="w-4 h-4 mr-1"/> {prop.price} ETH
                                         </p>
                                         <p className="flex items-center sm:justify-end text-xs text-gray-500">
                                             <Calendar className="w-3 h-3 mr-1"/> {formatDate(prop.timestamp)}
                                         </p>
                                         <div className="flex items-center sm:justify-end space-x-3 text-xs">
                                              <span className="text-gray-500 font-mono">Token #{prop.tokenId}</span>
                                              <a href={getEtherscanUrl(prop.transactionHash)} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 hover:underline" title="View transaction on Etherscan">
                                                  <ExternalLink className="w-3 h-3 mr-0.5" /> Etherscan
                                              </a>
                                               <button onClick={() => copyToClipboard(prop.transactionHash)} title="Copy Transaction Hash" className="text-gray-400 hover:text-gray-600"> <Copy className="w-3 h-3"/> </button>
                                         </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default PurchaseHistory;

