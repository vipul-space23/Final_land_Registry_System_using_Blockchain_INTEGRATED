// /* This code snippet defines a React functional component called `PropertyCard`. This component takes a
// `property` object as a prop and renders a card displaying information about the property. */
// // import React from 'react';
// // import { Link } from 'react-router-dom';
// // import { MapPin, DollarSign, Ruler, CircleUser } from 'lucide-react';

// // const PropertyCard = ({ property }) => {
// //     if (!property) {
// //         return null;
// //     }

// //     const ownerName = property?.owner?.name || 'N/A';
// //     const ownerEmail = property?.owner?.email || 'N/A';
// //     const displayAddress = `${property.propertyAddress}${property.district ? `, ${property.district}` : ''}`;

// //     // --- THIS IS THE NEW, CLEANER FIX ---
// //     // property.image is now "landphotos/image-123.png"
// //     // We just prepend the backend server URL
// //     const imageUrl = property.image
// //         ? `http://localhost:5000/landphotos/${property.image}`
// //         : null; // No fallback image
// //     // --- END OF FIX ---

// //     return (
// //         <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
// //             {/* Property Image */}
// //             <div className="h-48 w-full">
// //                 {imageUrl && (
// //                     <img
// //                         src={imageUrl} // <-- This will now be the correct URL
// //                         alt={displayAddress || 'Property Image'}
// //                         className="w-full h-full object-cover"
// //                         onError={(e) => {
// //                             e.target.src = ''; // Clear the image if it fails to load
// //                         }}
// //                     />
// //                 )}
// //             </div>

// //             <div className="p-6 flex flex-col flex-grow">
// //                 {/* Property Address */}
// //                 <h3 className="text-2xl font-bold text-gray-900 truncate mb-2" title={displayAddress}>
// //                     {displayAddress}
// //                 </h3>
// //                 <div className="flex items-center justify-between mb-4 text-gray-700">
// //                     <p className="flex items-center text-xl font-semibold text-green-600">
// //                         <DollarSign className="w-5 h-5 mr-1.5" />
// //                         {property.price} ETH
// //                     </p>
// //                     <p className="flex items-center text-md">
// //                         <Ruler className="w-5 h-5 mr-1.5" />
// //                         {property.area} {property.areaUnit ? property.areaUnit.replace('_', ' ') : 'sq m'}
// //                     </p>
// //                 </div>
// //                 <hr className="my-4" />
// //                 <div className="mb-5">
// //                     <h4 className="text-sm font-semibold text-gray-500 mb-2">OWNED BY</h4>
// //                     <div className="flex items-center space-x-3">
// //                         <CircleUser className="w-10 h-10 text-gray-400" />
// //                         <div>
// //                             <p className="font-bold text-gray-800">{ownerName}</p>
// //                             <p className="text-sm text-gray-500">{ownerEmail}</p>
// //                         </div>
// //                     </div>
// //                 </div>
// //                 <div className="mt-auto">
// //                     <Link
// //                         to={`/buyer-dashboard/property/${property._id}`}
// //                         className="w-full mt-4 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors block text-center"
// //                     >
// //                         View Details
// //                     </Link>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default PropertyCard;




// import React from 'react';
// import { Link } from 'react-router-dom';
// import { MapPin, DollarSign, Ruler, User, Landmark, History, Hash, FileText, LinkIcon, Copy } from 'lucide-react'; // Added Copy icon
// import { useAuth } from '../context/AuthContext'; // Import useAuth to check current user

// // Accepts an 'isOwnedView' prop to change display for buyer's owned properties
// const PropertyCard = ({ property, isOwnedView = false }) => {
//     const { user } = useAuth(); // Get current logged-in user

//     // Guard clause
//     if (!property) {
//         return null;
//     }

//     // --- Determine Owner/Seller Display ---
//     let currentOwnerDisplay = { name: 'N/A', email: 'N/A' };
//     let previousOwnerDisplay = null; // Initialize previous owner display
//     let isOwnedByCurrentUser = isOwnedView && user && property.owner?._id === user._id;

//     if (isOwnedByCurrentUser) {
//         // --- OWNED VIEW ---
//         currentOwnerDisplay = { name: "Owned by You", email: user?.email || 'Your Email' }; // Use logged-in user's email
//         // Check if previousOwner details are populated from backend
//         if (property.previousOwner) {
//             previousOwnerDisplay = {
//                 name: property.previousOwner.name || 'Unknown Seller',
//                 wallet: property.previousOwner.walletAddress || 'N/A' // Get wallet from populated data
//             };
//         } else {
//              // Fallback if previousOwner isn't populated (maybe older record)
//              previousOwnerDisplay = { name: 'Previous Owner details unavailable', wallet: '' };
//         }

//     } else if (property.owner) {
//         // --- MARKETPLACE VIEW ---
//         currentOwnerDisplay = { name: property.owner.name || 'N/A', email: property.owner.email || 'N/A' };
//     } else { // Fallback
//          currentOwnerDisplay = { name: property.ownerName || 'N/A', email: 'No email available'};
//     }
//     // --- End Owner Display Logic ---

//     const displayAddress = `${property.propertyAddress}${property.district ? `, ${property.district}` : ''}`;
//     const fallbackImage = 'https://via.placeholder.com/800x400?text=No+Image+Available';
//     const imageUrl = property.image ? `http://localhost:5000/${property.image}` : fallbackImage;

//     // --- Etherscan Link (adjust base URL for testnets if needed) ---
//     const etherscanBaseUrl = "https://etherscan.io"; // TODO: Adjust if using Sepolia, Goerli, or local Ganache explorer
//     const transactionUrl = property.transactionHash ? `${etherscanBaseUrl}/tx/${property.transactionHash}` : '#';

//     // Helper to copy text
//     const copyToClipboard = (text, type) => {
//         navigator.clipboard.writeText(text).then(() => {
//              console.log(`${type} copied:`, text);
//              // Maybe show a small temporary success message?
//         }, (err) => {
//              console.error(`Failed to copy ${type}:`, err);
//         });
//     };


//     // Wrapper component to make card clickable in owned view
//     // It prevents navigation if the click target was interactive (button, link, copy icon)
//     const CardWrapper = ({ children }) => {
//         const handleClick = (e) => {
//              // Check if the click target or its parent is a button or link or has stopPropagation class
//              if (e.target.closest('a, button, .copy-icon')) {
//                  return; // Don't navigate if clicking on interactive elements
//              }
//              // Navigate handled by the Link component itself
//          };

//         if (isOwnedByCurrentUser && property._id) {
//             return (
//                 <Link
//                     to={`/buyer-dashboard/property/${property._id}`}
//                     className="block h-full cursor-pointer group" // Added group for hover effects
//                     onClick={handleClick}
//                 >
//                     {children}
//                 </Link>
//             );
//         }
//         // For marketplace view or if _id is missing, just render children
//         return <div className="group h-full flex flex-col">{children}</div>; // Add group and flex structure for consistency
//     };


//     return (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-lg border border-gray-200 h-full">
//              <CardWrapper>
//                 {/* Property Image */}
//                 <div className="h-48 w-full relative overflow-hidden">
//                     <img
//                         src={imageUrl}
//                         alt={displayAddress}
//                         className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Zoom effect
//                         onError={(e) => { e.target.src = fallbackImage; }}
//                     />
//                     {/* Status Badge */}
//                     <span className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize shadow-sm border ${
//                         isOwnedByCurrentUser ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
//                         property.status === 'listed_for_sale' ? 'bg-green-100 text-green-800 border-green-200' :
//                         property.status === 'sold' ? 'bg-blue-100 text-blue-800 border-blue-200' :
//                         property.status === 'verified' || property.status === 'minted' ? 'bg-gray-100 text-gray-800 border-gray-200' :
//                         'bg-yellow-100 text-yellow-800 border-yellow-200'
//                     }`}>
//                         {isOwnedByCurrentUser ? 'Owned by You' : property.status.replace(/_/g, ' ')}
//                     </span>
//                 </div>

//                 <div className="p-4 flex flex-col flex-grow">
//                     {/* Address and Basic Info */}
//                     <h3 className="text-md font-semibold text-gray-800 truncate mb-1 group-hover:text-blue-600" title={displayAddress}>
//                         {displayAddress}
//                     </h3>
//                     <p className="flex items-center text-xs text-gray-500 mb-3">
//                         <MapPin className="w-3 h-3 mr-1" /> {property.district || 'District N/A'}
//                     </p>

//                     {/* Price/Area or Purchase Info */}
//                     <div className="flex items-center justify-between mb-3 text-sm">
//                         <p className={`flex items-center font-semibold ${isOwnedByCurrentUser ? 'text-indigo-700' : 'text-green-700'}`}>
//                             <DollarSign className="w-4 h-4 mr-1" />
//                             {isOwnedByCurrentUser && property.soldPrice ? `${property.soldPrice} ETH (Purchase Price)` :
//                              property.price > 0 ? `${property.price} ETH` : 'Price N/A'}
//                         </p>
//                         <p className="flex items-center text-gray-600">
//                             <Ruler className="w-4 h-4 mr-1" />
//                             {property.area} {property.areaUnit || 'sq m'}
//                         </p>
//                     </div>

//                     {/* Property Identifiers (Shown for Owned View) */}
//                      {isOwnedByCurrentUser && (
//                         <div className="text-xs text-gray-600 space-y-1 mb-3 font-mono border bg-gray-50 p-2 rounded">
//                             <p className="flex items-center truncate" title={`Token ID: ${property.tokenId || 'N/A'}`}><strong className="mr-1 text-gray-500 font-sans flex-shrink-0">Token ID:</strong> #{property.tokenId || 'N/A'}</p>
//                             <p><strong className="mr-1 text-gray-500 font-sans">Survey No:</strong> {property.surveyNumber || 'N/A'}</p>
//                             <p><strong className="mr-1 text-gray-500 font-sans">Property ID:</strong> {property.propertyId || 'N/A'}</p>
//                         </div>
//                      )}

//                     <hr className="my-3 border-gray-200" />

//                     {/* Ownership/Listing Info */}
//                     <div className="mb-4 text-xs">
//                         <h4 className="font-semibold text-gray-400 uppercase tracking-wider mb-2">
//                             {isOwnedByCurrentUser ? "Transaction History" : "Listed By"}
//                         </h4>
//                         {/* Owned View: Transaction Details */}
//                         {isOwnedByCurrentUser && (
//                             <div className="space-y-1.5 text-gray-700">
//                                 {/* Purchase Date */}
//                                 {property.soldAt && (
//                                      <p className="flex items-center text-gray-600">
//                                          <History className="w-4 h-4 mr-2 text-gray-500"/> Purchased: {new Date(property.soldAt).toLocaleDateString()}
//                                      </p>
//                                  )}
//                                  {/* Purchase Transaction */}
//                                 {property.transactionHash && (
//                                      <p className="flex items-center text-gray-600">
//                                          <Hash className="w-4 h-4 mr-2 text-gray-500"/> Tx:&nbsp;
//                                          <a
//                                              href={transactionUrl}
//                                              target="_blank" rel="noopener noreferrer"
//                                              onClick={(e) => e.stopPropagation()} // Prevent card link
//                                              className="text-blue-600 hover:underline truncate font-mono"
//                                              title="View Purchase Transaction on Etherscan"
//                                          >
//                                              {property.transactionHash.substring(0, 8)}...{property.transactionHash.substring(property.transactionHash.length - 6)}
//                                          </a>
//                                           <button onClick={(e) => { e.stopPropagation(); copyToClipboard(property.transactionHash, 'Transaction Hash'); }} title="Copy Transaction Hash" className="ml-1 text-gray-400 hover:text-gray-600 copy-icon"><Copy className="w-3 h-3"/></button>
//                                      </p>
//                                  )}
//                                  {/* Previous Owner (Seller) */}
//                                 {previousOwnerDisplay && (
//                                     <p className="flex items-center text-gray-600 pt-1 border-t border-dashed mt-2">
//                                         <Landmark className="w-4 h-4 mr-2 text-gray-400"/> Purchased From: {previousOwnerDisplay.name}
//                                          {previousOwnerDisplay.wallet !== 'N/A' && (
//                                              <span className="ml-1 font-mono text-gray-500" title={previousOwnerDisplay.wallet}>
//                                                  ({previousOwnerDisplay.wallet.substring(0,5)}...{previousOwnerDisplay.wallet.substring(previousOwnerDisplay.wallet.length - 3)})
//                                                  <button onClick={(e) => { e.stopPropagation(); copyToClipboard(previousOwnerDisplay.wallet, 'Seller Wallet'); }} title="Copy Seller Address" className="ml-1 text-gray-400 hover:text-gray-600 copy-icon"><Copy className="w-3 h-3"/></button>
//                                              </span>
//                                          )}
//                                     </p>
//                                 )}
//                             </div>
//                         )}
//                         {/* Marketplace View: Listed By */}
//                         {!isOwnedByCurrentUser && (
//                             <div className="flex items-center space-x-2">
//                                 <Landmark className="w-6 h-6 text-gray-400 flex-shrink-0" />
//                                 <div>
//                                     <p className="font-semibold text-gray-800 text-sm">{currentOwnerDisplay.name}</p>
//                                     {currentOwnerDisplay.email !== 'N/A' && (
//                                         <p className="text-xs text-gray-500">{currentOwnerDisplay.email}</p>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Action Button Area - Modified */}
//                     <div className="mt-auto pt-3 border-t border-gray-200">
//                          {/* Marketplace View Button */}
//                         {!isOwnedByCurrentUser && property.status === 'listed_for_sale' && (
//                             <Link
//                                 to={`/buyer-dashboard/property/${property._id}`}
//                                 className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors block text-center shadow hover:shadow-md"
//                             >
//                                 View Details & Purchase
//                             </Link>
//                         )}
//                          {/* Owned View - No button needed as card is link */}
//                          {isOwnedByCurrentUser && (
//                              <div className="text-center text-xs text-indigo-600 group-hover:underline">Click card to view full details</div>
//                          )}
//                           {/* Not Listed/Sold (Marketplace View) */}
//                         {!isOwnedByCurrentUser && property.status !== 'listed_for_sale' && (
//                              <Link
//                                 to={`/buyer-dashboard/property/${property._id}`} // Link to details page
//                                 className={`w-full px-4 py-2 text-sm font-bold rounded-lg transition-colors block text-center shadow hover:shadow-md ${
//                                     property.status === 'sold' ? 'bg-gray-100 text-gray-500 cursor-default border border-gray-300' // Changed style for sold
//                                     : 'bg-gray-500 text-white hover:bg-gray-600' // Style for other non-listed states
//                                 }`}
//                                 // Prevent link follow if sold maybe? Or allow viewing history. Let's allow it.
//                                 // onClick={(e) => { if(property.status === 'sold') e.preventDefault(); }}
//                             >
//                                 {property.status === 'sold' ? 'View Details (Sold)' : 'View Details'}
//                             </Link>
//                          )}
//                     </div>
//                 </div>
//             </CardWrapper>
//         </div>
//     );
// };

// export default PropertyCard;

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Ruler, User, Landmark, History, Hash, FileText, LinkIcon, Copy, Eye, CheckCircle } from 'lucide-react'; // Added Eye, CheckCircle
import { useAuth } from '../context/AuthContext';

// Accepts an 'isOwnedView' prop and an 'onViewDetailsClick' handler
const PropertyCard = ({ property, isOwnedView = false, onViewDetailsClick }) => {
    const { user } = useAuth();

    if (!property) return null;

    // --- Owner Display Logic ---
    let currentOwnerDisplay = { name: 'N/A', email: 'N/A' };
    let previousOwnerDisplay = null;
    let isOwnedByCurrentUser = isOwnedView && user && property.owner?._id === user._id;

    if (isOwnedByCurrentUser) {
        // --- OWNED VIEW ---
        currentOwnerDisplay = { name: "Owned by You", email: user?.email || 'Your Email' };
        // This checks if the backend sent the previousOwner data
        if (property.previousOwner && property.previousOwner.name) {
            previousOwnerDisplay = {
                name: property.previousOwner.name || 'Unknown Seller',
                wallet: property.previousOwner.walletAddress || 'N/A'
            };
        } else {
             // This is the fallback if backend doesn't send previousOwner
             previousOwnerDisplay = { name: 'Previous Owner details missing', wallet: '' };
        }
    } else if (property.owner) { // Marketplace View
        currentOwnerDisplay = { name: property.owner.name || 'N/A', email: property.owner.email || 'N/A' };
    } else { // Fallback
         currentOwnerDisplay = { name: property.ownerName || 'N/A', email: 'No email'};
    }
    // --- End Owner Logic ---

    const displayAddress = `${property.propertyAddress}${property.district ? `, ${property.district}` : ''}`;
    const fallbackImage = 'https://via.placeholder.com/800x400?text=No+Image+Available';
    const imageUrl = property.image ? `http://localhost:5000/${property.image}` : fallbackImage;

    const etherscanBaseUrl = "https://etherscan.io"; // TODO: Adjust if needed
    const transactionUrl = property.transactionHash ? `${etherscanBaseUrl}/tx/${property.transactionHash}` : '#';
    const pinataGatewayUrl = "https://gateway.pinata.cloud/ipfs/"; // Or your preferred gateway

    // Helper to copy text
    const copyToClipboard = (text, type) => {
         navigator.clipboard.writeText(text).then(() => {
             console.log(`${type} copied:`, text);
        }, (err) => {
             console.error(`Failed to copy ${type}:`, err);
        });
     };

    // Card Wrapper - Renders a Link for marketplace, but a div for owned view
    const CardWrapper = ({ children }) => {
        // Prevent link navigation if clicking interactive elements inside the card
        const handleClick = (e) => {
             if (e.target.closest('a, button, .copy-icon')) {
                 e.preventDefault(); // Stop link navigation
             }
         };

        // Marketplace cards are links
        if (!isOwnedByCurrentUser && property._id && property.status === 'listed_for_sale') {
            return (
                 <Link to={`/buyer-dashboard/property/${property._id}`} className="block h-full group" onClick={handleClick}>
                    {children}
                 </Link>
            );
        }
         // Owned view card is just a div, interaction handled by the button
        return <div className="group h-full flex flex-col">{children}</div>;
    };


    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-lg border border-gray-200 h-full">
             <CardWrapper>
                {/* Property Image */}
                <div className="h-48 w-full relative overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={displayAddress}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.target.src = fallbackImage; }}
                    />
                    {/* Status Badge */}
                    <span className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize shadow-sm border ${
                        isOwnedByCurrentUser ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                        property.status === 'listed_for_sale' ? 'bg-green-100 text-green-800 border-green-200' :
                        property.status === 'sold' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                         property.status === 'verified' || property.status === 'minted' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                        {isOwnedByCurrentUser ? 'Owned by You' : property.status.replace(/_/g, ' ')}
                    </span>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    {/* Address and Basic Info */}
                    <h3 className="text-md font-semibold text-gray-800 truncate mb-1 group-hover:text-blue-600" title={displayAddress}>
                        {displayAddress}
                    </h3>
                    <p className="flex items-center text-xs text-gray-500 mb-3">
                        <MapPin className="w-3 h-3 mr-1" /> {property.district || 'District N/A'}
                    </p>

                    {/* Price/Area or Purchase Info */}
                    <div className="flex items-center justify-between mb-3 text-sm">
                         <p className={`flex items-center font-semibold ${isOwnedByCurrentUser ? 'text-indigo-700' : 'text-green-700'}`}>
                            <DollarSign className="w-4 h-4 mr-1" />
                            {isOwnedByCurrentUser && property.soldPrice ? `${property.soldPrice} ETH (Purchase Price)` :
                             property.price > 0 ? `${property.price} ETH` : 'Price N/A'}
                        </p>
                        <p className="flex items-center text-gray-600">
                            <Ruler className="w-4 h-4 mr-1" />
                            {property.area} {property.areaUnit || 'sq m'}
                        </p>
                    </div>

                    {/* Property Identifiers (Shown for Owned View) */}
                     {isOwnedByCurrentUser && (
                        <div className="text-xs text-gray-600 space-y-1 mb-3 font-mono border bg-gray-50 p-2 rounded">
                            <p className="flex items-center truncate" title={`Token ID: ${property.tokenId || 'N/A'}`}><strong className="mr-1 text-gray-500 font-sans flex-shrink-0">Token ID:</strong> #{property.tokenId || 'N/A'}</p>
                            <p><strong className="mr-1 text-gray-500 font-sans">Survey No:</strong> {property.surveyNumber || 'N/A'}</p>
                        </div>
                     )}

                    <hr className="my-3 border-gray-200" />

                    {/* Ownership/Listing Info */}
                    <div className="mb-4 text-xs">
                        <h4 className="font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            {isOwnedByCurrentUser ? "Transaction Details" : "Listed By"}
                        </h4>
                        {/* Owned View: Transaction Details */}
                        {isOwnedByCurrentUser && (
                            <div className="space-y-1.5 text-gray-700">
                                <p className="flex items-center font-medium text-sm">
                                    <User className="w-4 h-4 mr-2 text-indigo-500"/> {currentOwnerDisplay.name}
                                </p>
                                {property.soldAt && (
                                     <p className="flex items-center text-gray-600">
                                         <History className="w-4 h-4 mr-2"/> Purchased: {new Date(property.soldAt).toLocaleDateString()}
                                     </p>
                                 )}
                                {property.transactionHash && (
                                     <p className="flex items-center text-gray-600">
                                         <Hash className="w-4 h-4 mr-2"/> Tx:&nbsp;
                                         <a
                                             href={transactionUrl}
                                             target="_blank" rel="noopener noreferrer"
                                             onClick={(e) => e.stopPropagation()} // Prevent card link trigger
                                             className="text-blue-600 hover:underline truncate font-mono"
                                             title="View Purchase Transaction on Etherscan"
                                         >
                                             {property.transactionHash.substring(0, 8)}...{property.transactionHash.substring(property.transactionHash.length - 6)}
                                         </a>
                                          <button onClick={(e) => { e.stopPropagation(); copyToClipboard(property.transactionHash, 'Tx Hash'); }} title="Copy Transaction Hash" className="ml-1 text-gray-400 hover:text-gray-600 copy-icon"><Copy className="w-3 h-3"/></button>
                                     </p>
                                 )}
                                {previousOwnerDisplay && (
                                    <p className="flex items-center text-gray-600 pt-1 border-t border-dashed mt-2">
                                        <Landmark className="w-4 h-4 mr-2 text-gray-400"/> Purchased From: {previousOwnerDisplay.name}
                                         {previousOwnerDisplay.wallet !== 'N/A' && (
                                             <span className="ml-1 font-mono text-gray-500" title={previousOwnerDisplay.wallet}>
                                                 ({previousOwnerDisplay.wallet.substring(0,5)}...{previousOwnerDisplay.wallet.substring(previousOwnerDisplay.wallet.length - 3)})
                                                 <button onClick={(e) => { e.stopPropagation(); copyToClipboard(previousOwnerDisplay.wallet, 'Seller Wallet'); }} title="Copy Seller Address" className="ml-1 text-gray-400 hover:text-gray-600 copy-icon"><Copy className="w-3 h-3"/></button>
                                             </span>
                                         )}
                                    </p>
                                )}
                            </div>
                        )}
                        {/* Marketplace View: Listed By */}
                        {!isOwnedByCurrentUser && (
                            <div className="flex items-center space-x-2">
                                <Landmark className="w-6 h-6 text-gray-400 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{currentOwnerDisplay.name}</p>
                                    {currentOwnerDisplay.email !== 'N/A' && (
                                        <p className="text-xs text-gray-500">{currentOwnerDisplay.email}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- FIX: ADDED VERIFIABLE DOCUMENTS SECTION --- */}
                    {isOwnedByCurrentUser && property.documentHashes && property.documentHashes.length > 0 && (
                        <div className="mb-4 text-xs">
                            <hr className="my-3 border-gray-200" />
                            <h4 className="font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Verifiable Documents
                            </h4>
                            <div className="space-y-1.5">
                                {property.documentHashes.map((hash, index) => (
                                    <a
                                        key={index}
                                        href={`${pinataGatewayUrl}${hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()} // Stop card click
                                        className="flex items-center text-blue-600 hover:underline"
                                        title="View document on IPFS"
                                    >
                                        <CheckCircle className={`w-4 h-4 mr-2 ${index === 0 ? 'text-purple-500' : 'text-orange-500'}`}/>
                                        <span>{index === 0 ? 'Mother Deed' : 'Encumbrance Certificate'}</span>
                                        <LinkIcon className="w-3 h-3 ml-1"/>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* --- END OF FIX --- */}


                    {/* --- Action Button Area - MODIFIED --- */}
                    <div className="mt-auto pt-3 border-t border-gray-200">
                         {/* Marketplace View Button */}
                        {!isOwnedByCurrentUser && property.status === 'listed_for_sale' && (
                            <Link
                                to={`/buyer-dashboard/property/${property._id}`}
                                className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors block text-center shadow hover:shadow-md"
                            >
                                View Details & Purchase
                            </Link>
                        )}
                         {/* Owned View - BUTTON to open modal */}
                         {isOwnedByCurrentUser && property._id && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Stop any wrapper link
                                    if (onViewDetailsClick) {
                                         onViewDetailsClick(property); // Call handler from parent (BuyerProperties.jsx)
                                    } else {
                                         console.warn("onViewDetailsClick handler not provided to PropertyCard");
                                    }
                                }}
                                className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors block text-center shadow hover:shadow-md flex items-center justify-center"
                            >
                                <Eye className="w-4 h-4 mr-2"/> View Full Details
                            </button>
                         )}
                          {/* Not Listed/Sold (Marketplace View) */}
                        {!isOwnedByCurrentUser && property.status !== 'listed_for_sale' && (
                             <Link
                                to={`/buyer-dashboard/property/${property._id}`} // Still link to details page
                                className={`w-full px-4 py-2 text-sm font-bold rounded-lg transition-colors block text-center shadow hover:shadow-md ${
                                    property.status === 'sold' ? 'bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200' // Changed style for sold
                                    : 'bg-gray-500 text-white hover:bg-gray-600' // Style for other non-listed
                                }`}
                            >
                                {property.status === 'sold' ? 'View (Sold)' : 'View Details'}
                            </Link>
                         )}
                    </div>
                    {/* --- END MODIFICATION --- */}
                </div>
            </CardWrapper>
        </div>
    );
};

export default PropertyCard;