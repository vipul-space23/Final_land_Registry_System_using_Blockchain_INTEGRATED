/* This code snippet defines a React functional component called `PropertyCard`. This component takes a
`property` object as a prop and renders a card displaying information about the property. */
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { MapPin, DollarSign, Ruler, CircleUser } from 'lucide-react';

// const PropertyCard = ({ property }) => {
//     if (!property) {
//         return null;
//     }

//     const ownerName = property?.owner?.name || 'N/A';
//     const ownerEmail = property?.owner?.email || 'N/A';
//     const displayAddress = `${property.propertyAddress}${property.district ? `, ${property.district}` : ''}`;

//     // --- THIS IS THE NEW, CLEANER FIX ---
//     // property.image is now "landphotos/image-123.png"
//     // We just prepend the backend server URL
//     const imageUrl = property.image
//         ? `http://localhost:5000/landphotos/${property.image}`
//         : null; // No fallback image
//     // --- END OF FIX ---

//     return (
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
//             {/* Property Image */}
//             <div className="h-48 w-full">
//                 {imageUrl && (
//                     <img
//                         src={imageUrl} // <-- This will now be the correct URL
//                         alt={displayAddress || 'Property Image'}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                             e.target.src = ''; // Clear the image if it fails to load
//                         }}
//                     />
//                 )}
//             </div>

//             <div className="p-6 flex flex-col flex-grow">
//                 {/* Property Address */}
//                 <h3 className="text-2xl font-bold text-gray-900 truncate mb-2" title={displayAddress}>
//                     {displayAddress}
//                 </h3>
//                 <div className="flex items-center justify-between mb-4 text-gray-700">
//                     <p className="flex items-center text-xl font-semibold text-green-600">
//                         <DollarSign className="w-5 h-5 mr-1.5" />
//                         {property.price} ETH
//                     </p>
//                     <p className="flex items-center text-md">
//                         <Ruler className="w-5 h-5 mr-1.5" />
//                         {property.area} {property.areaUnit ? property.areaUnit.replace('_', ' ') : 'sq m'}
//                     </p>
//                 </div>
//                 <hr className="my-4" />
//                 <div className="mb-5">
//                     <h4 className="text-sm font-semibold text-gray-500 mb-2">OWNED BY</h4>
//                     <div className="flex items-center space-x-3">
//                         <CircleUser className="w-10 h-10 text-gray-400" />
//                         <div>
//                             <p className="font-bold text-gray-800">{ownerName}</p>
//                             <p className="text-sm text-gray-500">{ownerEmail}</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="mt-auto">
//                     <Link
//                         to={`/buyer-dashboard/property/${property._id}`}
//                         className="w-full mt-4 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors block text-center"
//                     >
//                         View Details
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PropertyCard;




import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Ruler, User, Landmark, History, Hash, FileText, LinkIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PropertyCard = ({ property, isOwnedView = false }) => {
    const { user } = useAuth();

    if (!property) return null;

    // --- Owner Display Logic ---
    let currentOwnerDisplay = { name: 'N/A', email: 'N/A' };
    let previousOwnerDisplay = null;
    let isOwnedByCurrentUser = isOwnedView && user && property.owner?._id === user._id;

    if (isOwnedByCurrentUser) {
        currentOwnerDisplay = { name: "Owned by You", email: user.email };
        if (property.previousOwner) {
            previousOwnerDisplay = {
                name: property.previousOwner.name || 'Unknown Seller',
                wallet: property.previousOwner.walletAddress || 'N/A'
            };
        } else {
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

    // --- Etherscan Link (adjust base URL for testnets if needed) ---
    const etherscanBaseUrl = "https://etherscan.io"; // or e.g., "https://sepolia.etherscan.io"
    const transactionUrl = property.transactionHash ? `${etherscanBaseUrl}/tx/${property.transactionHash}` : '#';

    // Wrapper component to make card clickable, but ignore clicks on interactive elements inside
    const CardWrapper = ({ children }) => {
        // Only wrap in a Link if it's the owned view
        if (isOwnedByCurrentUser) {
            return (
                <Link to={`/buyer-dashboard/property/${property._id}`} className="block h-full">
                    {children}
                </Link>
            );
        }
        // For marketplace view, the button inside handles navigation
        return <>{children}</>;
    };


    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-lg border border-gray-200 h-full group"> {/* Added group for hover effects if needed */}
             <CardWrapper>
                {/* Property Image */}
                <div className="h-48 w-full relative overflow-hidden"> {/* Added overflow hidden */}
                    <img
                        src={imageUrl}
                        alt={displayAddress}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Subtle zoom on hover
                        onError={(e) => { e.target.src = fallbackImage; }}
                    />
                    {/* Status Badge */}
                    <span className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize shadow-sm ${
                        isOwnedByCurrentUser ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                        property.status === 'listed_for_sale' ? 'bg-green-100 text-green-800 border border-green-200' :
                        property.status === 'sold' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        'bg-yellow-100 text-yellow-800 border border-yellow-200' // Default for others
                    }`}>
                        {isOwnedByCurrentUser ? 'Owned' : property.status.replace(/_/g, ' ')}
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
                            {isOwnedByCurrentUser && property.soldPrice ? `${property.soldPrice} ETH (Purchased)` :
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
                            <p className="flex items-center truncate"><strong className="mr-1 text-gray-500 font-sans">Token ID:</strong> #{property.tokenId || 'N/A'}</p>
                            <p><strong className="mr-1 text-gray-500 font-sans">Survey No:</strong> {property.surveyNumber || 'N/A'}</p>
                            <p><strong className="mr-1 text-gray-500 font-sans">Property ID:</strong> {property.propertyId || 'N/A'}</p>
                        </div>
                    )}

                    {!isOwnedByCurrentUser && <hr className="my-3 border-gray-200" />}

                    {/* Ownership/Listing Info */}
                    <div className="mb-4 text-xs">
                        <h4 className="font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            {isOwnedByCurrentUser ? "Transaction Details" : "Listed By"}
                        </h4>
                        {/* Current Owner (You) - Owned View */}
                        {isOwnedByCurrentUser && (
                            <div className="space-y-1.5 text-gray-700">
                                <p className="flex items-center font-medium">
                                    <User className="w-4 h-4 mr-2 text-indigo-500"/> {currentOwnerDisplay.name} ({currentOwnerDisplay.email})
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
                                     </p>
                                 )}
                                {previousOwnerDisplay && (
                                    <p className="flex items-center text-gray-600 pt-1 border-t border-dashed mt-2">
                                        <Landmark className="w-4 h-4 mr-2 text-gray-400"/> Seller: {previousOwnerDisplay.name}
                                         {previousOwnerDisplay.wallet !== 'N/A' && (
                                             <span className="ml-1 font-mono text-gray-500" title={previousOwnerDisplay.wallet}>
                                                 ({previousOwnerDisplay.wallet.substring(0,5)}...{previousOwnerDisplay.wallet.substring(previousOwnerDisplay.wallet.length - 3)})
                                             </span>
                                         )}
                                    </p>
                                )}
                            </div>
                        )}
                        {/* Listed By - Marketplace View */}
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

                    {/* Action Button Area */}
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
                        {/* Owned View Button - Links to same details page */}
                        {isOwnedByCurrentUser && (
                            // This button is inside the CardWrapper Link, so it also navigates
                            <div className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors block text-center shadow hover:shadow-md flex items-center justify-center cursor-pointer">
                                <FileText className="w-4 h-4 mr-2"/> View Details / Docs
                            </div>
                        )}
                        {/* Placeholder for Sold/Not Listed in Marketplace view */}
                        {!isOwnedByCurrentUser && property.status !== 'listed_for_sale' && (
                            <div className="w-full px-4 py-2 bg-gray-300 text-gray-600 text-sm font-bold rounded-lg block text-center cursor-not-allowed">
                                {property.status === 'sold' ? 'Sold' : 'Not Listed'}
                            </div>
                        )}
                    </div>
                </div>
            </CardWrapper>
        </div>
    );
};

export default PropertyCard;

