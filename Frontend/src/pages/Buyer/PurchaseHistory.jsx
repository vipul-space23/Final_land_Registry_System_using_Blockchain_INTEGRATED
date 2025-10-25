// src/pages/Buyer/PurchaseHistory.jsx
import React from "react";
import { Link } from 'react-router-dom';
import { useBuyer } from "../../context/BuyerContext"; // ✅ IMPORT YOUR HOOK
import { MapPin, DollarSign, Ruler, Calendar, ExternalLink, Copy, Hash, Loader2 } from 'lucide-react';

const PurchaseHistory = () => {
    // ✅ GET ALL STATE FROM THE CONTEXT
    const { 
        purchaseLoading, 
        purchaseError, 
        purchaseHistory: purchasedProperties=[], // Rename for consistency
        totalSpent, 
        totalPropertiesOwned
    } = useBuyer();

    // ❌ NO MORE useState or useEffect for fetching!

    // Helper functions (can stay here or move to a utils file)
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };
    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        return new Date(timestamp).toLocaleString();
    };
    const etherscanBaseUrl = "https://etherscan.io"; // TODO: Adjust if using Testnet
    const getEtherscanUrl = (txHash) => `${etherscanBaseUrl}/tx/${txHash}`;


    // --- Render Logic ---
    if (purchaseLoading && purchasedProperties.length === 0) { // Show loading only on initial fetch
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <span className="ml-4 text-lg text-gray-600">Loading purchase history...</span>
            </div>
        );
    }
    
    if (purchaseError) {
         return (
             <div className="container mx-auto p-4 md:p-8">
                 <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
                    <span className="font-medium">Error:</span> {purchaseError}
                </div>
             </div>
         );
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Purchase History</h1>

            {/* ✅ Summary Stats (Now reads directly from context) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="bg-white shadow rounded-lg p-4 md:p-6 text-center md:text-left">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Properties Owned</h3>
                    <p className="text-2xl font-bold text-gray-900">{totalPropertiesOwned}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4 md:p-6 text-center md:text-left">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Spent</h3>
                    <p className="text-2xl font-bold text-blue-600">{totalSpent} ETH</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4 md:p-6 text-center md:text-left">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Average Purchase Price</h3>
                    <p className="text-2xl font-bold text-green-600">
                        {totalPropertiesOwned > 0 ? (parseFloat(totalSpent) / totalPropertiesOwned).toFixed(4) : "0"} ETH
                    </p>
                </div>
            </div>

            {/* Purchase History List */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Your Purchased Properties</h2>
                </div>

                {!purchaseLoading && purchasedProperties.length === 0 ? (
                    <div className="text-center py-12 px-6"> {/* ✅ Better Empty state */}
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No purchases found</h3>
                        <p className="mt-1 text-sm text-gray-500">When you buy a property, it will appear here.</p>
                        <Link to="/buyer-dashboard/browse" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            Browse Marketplace
                        </Link>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {purchasedProperties.map((prop) => (
                            <li key={prop.transactionHash} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                {/* This is your original, correct rendering logic. No changes needed. */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-12 w-12 rounded-md object-cover border"
                                                    src={prop.propertyDetails?.image ? `http://localhost:5000/${prop.propertyDetails.image}` : 'https://via.placeholder.com/64?text=...?'}
                                                    alt={prop.propertyDetails?.propertyAddress || `Token #${prop.tokenId}`}
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=Img'; }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-indigo-700 truncate">
                                                    {prop.propertyDetails?._id ? (
                                                        <Link to={`/buyer-dashboard/property/${prop.propertyDetails._id}`} className="hover:underline">
                                                            {prop.propertyDetails.propertyAddress || `Property (Token #${prop.tokenId})`}
                                                        </Link>
                                                    ) : (
                                                        prop.propertyDetails?.propertyAddress || `Property (Token #${prop.tokenId})`
                                                    )}
                                                </p>
                                                {prop.propertyDetails ? (
                                                    <p className="text-xs text-gray-500 flex items-center mt-0.5 flex-wrap">
                                                        <span className="flex items-center mr-2"><MapPin className="w-3 h-3 mr-1"/> {prop.propertyDetails.district || 'N/A'}</span>
                                                        <span className="flex items-center"><Ruler className="w-3 h-3 mr-1"/> {prop.propertyDetails.area} {prop.propertyDetails.areaUnit || 'sq m'}</span>
                                                    </p>
                                                ) : !prop.timestamp ? ( // Use timestamp as proxy for details loading
                                                    <p className="text-xs text-blue-500 mt-1 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin"/> Loading details...</p>
                                                ) : ( <p className="text-xs text-gray-400 mt-1">Details unavailable</p> )}
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