import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LandPlot, Loader2, X, MapPin, DollarSign, Ruler, History, Hash, FileText, LinkIcon, User, Landmark, Copy, ExternalLink, CheckCircle } from 'lucide-react'; // Added icons for modal
import PropertyCard from '../../components/PropertyCard'; // Assuming this component is updated
import { useAuth } from '../../context/AuthContext';
import PropertyMapDisplay from '../../components/PropertyMapDisplay'; // Import map display for modal

const BuyerProperties = () => {
    const { user, isAuthenticated } = useAuth(); // Get user context for token and ID
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- State for Detail Modal ---
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPropertyForModal, setSelectedPropertyForModal] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            // Check if user is logged in before fetching
            if (!isAuthenticated || !user?.token) { // Check both auth status and token
                setError("Please log in to view your properties.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                // Fetch using the /my endpoint and include the Authorization header
                const response = await fetch(
                    "http://localhost:5000/api/properties/my", // Use the correct endpoint
                    {
                        headers: {
                            'Authorization': `Bearer ${user.token}` // Send the JWT token
                        }
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch properties");
                }

                const data = await response.json();

                // Backend already returns properties owned by the logged-in user
                // The filter inside MyLandsPage is NOT needed here if the backend is correct
                setProperties(data);

            } catch (err) {
                console.error("Fetch Buyer Properties Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
        // Re-fetch only when the user object changes (e.g., login/logout)
    }, [user, isAuthenticated]); // Added isAuthenticated dependency

    // --- Function to Open Detail Modal ---
    const openDetailModal = (property) => {
        console.log("Opening modal for:", property); // Debugging
        setSelectedPropertyForModal(property);
        setIsDetailModalOpen(true);
    };

    // --- Function to Close Detail Modal ---
    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedPropertyForModal(null);
    };

     // --- Helper functions for modal ---
    const formatAddressModal = (prop) => prop?.propertyAddress || 'N/A';
    const formatDateModal = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour:'2-digit', minute:'2-digit'}) : 'Date unavailable';
    const etherscanBaseUrl = "https://etherscan.io"; // TODO: Adjust if needed
    const copyToClipboardModal = (text, type) => {
         navigator.clipboard.writeText(text).then(() => {
             console.log(`${type} copied:`, text);
             // Maybe show a small temporary success message?
        }, (err) => {
             console.error(`Failed to copy ${type}:`, err);
        });
     };
    const getDocumentsArrayModal = (hashes) => {
        if (!hashes || !Array.isArray(hashes)) return [];
        const docNames = ['Mother Deed', 'Encumbrance Certificate'];
        return hashes.map((hash, index) => ({
            name: docNames[index] || `Document ${index + 1}`,
            ipfsHash: hash
        }));
    };
    // --- End Helper Functions ---


    if (loading) {
        return (
            <div className="text-center py-12 flex justify-center items-center">
                <Loader2 className="w-8 h-8 mr-2 animate-spin text-blue-600" />
                Loading your properties...
            </div>
        );
    }

    if (error) {
         // Provide guidance if logged out
        const errorMessage = error.includes("log in")
            ? <>Error: {error} <Link to="/login" className="text-blue-600 underline hover:text-blue-800">Login here</Link></>
            : `Error: ${error}`;
        return <div className="text-center text-red-600 py-8">{errorMessage}</div>;
    }

    const hasProperties = properties.length > 0;

    return (
        <div className="space-y-8 relative"> {/* Added relative for modal positioning */}
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">My Properties</h1>
                <p className="text-base md:text-lg text-gray-600">
                    A record of all the properties you currently own.
                </p>
            </div>

            {!hasProperties && !loading ? (
                // Empty state display
                <div className="bg-white rounded-xl shadow-lg p-8 text-center flex flex-col items-center justify-center min-h-[40vh] border border-gray-200">
                     <LandPlot className="w-16 h-16 md:w-20 md:h-20 text-blue-400 mb-6" strokeWidth={1.5} />
                    <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800">You don't own any properties yet.</h2>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto">
                        Browse the marketplace to find verified land listings and make your first secure purchase.
                    </p>
                    <Link
                        to="/buyer-dashboard/browse"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow hover:shadow-md"
                    >
                        Browse Marketplace
                    </Link>
                </div>
            ) : (
                // Grid display for owned properties
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {properties.map((property) => (
                        // --- Pass onViewDetailsClick handler ---
                        <PropertyCard
                            key={property._id || property.transactionHash} // Use MongoDB ID or TxHash as key
                            property={property}
                            isOwnedView={true} // <-- Pass this prop
                            onViewDetailsClick={openDetailModal} // <-- Pass the handler here
                        />
                        // --- End handler pass ---
                    ))}
                </div>
            )}

            {/* --- Detail Modal --- */}
            {isDetailModalOpen && selectedPropertyForModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75 px-4 py-8 backdrop-blur-sm transition-opacity duration-300">
                    {/* Modal Content */}
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col relative transition-transform duration-300 scale-100"> {/* Added flex */}
                        {/* Close Button */}
                        <button
                            onClick={closeDetailModal}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 z-10 p-1 rounded-full bg-white/50 hover:bg-gray-100"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>

                        {/* Modal Header (Image) */}
                         <div className="h-48 md:h-64 w-full relative flex-shrink-0"> {/* Adjusted height */}
                             <img
                                src={selectedPropertyForModal.image ? `http://localhost:5000/${selectedPropertyForModal.image}` : 'https://via.placeholder.com/800x400?text=No+Image'}
                                alt={selectedPropertyForModal.propertyAddress}
                                className="w-full h-full object-cover rounded-t-lg"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Error'; }}
                             />
                              <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent w-full">
                                <h2 className="text-lg md:text-xl font-bold text-white">{selectedPropertyForModal.propertyAddress}</h2>
                                <p className="flex items-center text-sm text-gray-200 mt-1">
                                    <MapPin className="w-4 h-4 mr-1" /> {selectedPropertyForModal.district || 'N/A'}
                                </p>
                            </div>
                         </div>

                         {/* Modal Body - SCROLLABLE */}
                        <div className="p-5 md:p-6 space-y-4 overflow-y-auto flex-grow"> {/* Added overflow */}
                             {/* Basic Details */}
                             <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm border-b pb-3">
                                <span className="flex items-center font-semibold text-indigo-700">
                                    <DollarSign className="w-4 h-4 mr-1" /> {selectedPropertyForModal.soldPrice || selectedPropertyForModal.price || 'N/A'} ETH (Purchase Price)
                                </span>
                                <span className="flex items-center text-gray-600">
                                    <Ruler className="w-4 h-4 mr-1" /> {selectedPropertyForModal.area} {selectedPropertyForModal.areaUnit || 'sq m'}
                                </span>
                                 <span className="flex items-center text-gray-600 font-mono text-xs">
                                     <Hash className="w-4 h-4 mr-1"/> Token ID: #{selectedPropertyForModal.tokenId || 'N/A'}
                                 </span>
                             </div>

                             {/* Transaction History */}
                             <div>
                                 <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Transaction History</h4>
                                 <div className="text-xs space-y-1.5 text-gray-700 bg-gray-50 p-3 rounded border">
                                     {selectedPropertyForModal.soldAt && (
                                         <p className="flex items-center"><History className="w-4 h-4 mr-2 text-gray-400"/> Purchased On: <span className="font-medium ml-1">{formatDateModal(selectedPropertyForModal.soldAt)}</span></p>
                                     )}
                                     {selectedPropertyForModal.transactionHash && (
                                         <p className="flex items-center flex-wrap">
                                             <Hash className="w-4 h-4 mr-2 text-gray-400"/> Purchase Tx:&nbsp;
                                             <a href={`${etherscanBaseUrl}/tx/${selectedPropertyForModal.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-mono break-all" title="View on Etherscan">
                                                 {selectedPropertyForModal.transactionHash}
                                             </a>
                                             <button onClick={() => copyToClipboardModal(selectedPropertyForModal.transactionHash, 'Tx Hash')} title="Copy Hash" className="ml-1 text-gray-400 hover:text-gray-600"><Copy className="w-3 h-3"/></button>
                                         </p>
                                     )}
                                     {/* Previous Owner (Seller) Info */}
                                     {selectedPropertyForModal.previousOwner && (
                                         <p className="flex items-center flex-wrap">
                                             <Landmark className="w-4 h-4 mr-2 text-gray-400"/> Purchased From: <span className="font-medium mr-1">{selectedPropertyForModal.previousOwner.name || 'Unknown Seller'}</span>
                                             {selectedPropertyForModal.previousOwner.walletAddress && (
                                                 <span className="ml-1 font-mono text-gray-500" title={selectedPropertyForModal.previousOwner.walletAddress}>
                                                     ({selectedPropertyForModal.previousOwner.walletAddress.substring(0,6)}...{selectedPropertyForModal.previousOwner.walletAddress.substring(selectedPropertyForModal.previousOwner.walletAddress.length - 4)})
                                                      <button onClick={() => copyToClipboardModal(selectedPropertyForModal.previousOwner.walletAddress, 'Seller Wallet')} title="Copy Seller Address" className="ml-1 text-gray-400 hover:text-gray-600"><Copy className="w-3 h-3"/></button>
                                                 </span>
                                             )}
                                         </p>
                                     )}
                                 </div>
                             </div>

                              {/* Property Specific Details */}
                              <div>
                                 <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Property Details</h4>
                                  <ul className="space-y-1 text-sm text-gray-800 bg-gray-50 p-3 rounded border">
                                      <li><strong className="text-gray-500 w-24 inline-block">Property ID:</strong> {selectedPropertyForModal.propertyId || 'N/A'}</li>
                                      <li><strong className="text-gray-500 w-24 inline-block">Survey No:</strong> {selectedPropertyForModal.surveyNumber || 'N/A'}</li>
                                      <li><strong className="text-gray-500 w-24 inline-block">Address:</strong> {formatAddressModal(selectedPropertyForModal)}</li>
                                      <li><strong className="text-gray-500 w-24 inline-block">District:</strong> {selectedPropertyForModal.district || 'N/A'}</li>
                                  </ul>
                              </div>

                              {/* Location Map */}
                              <div>
                                <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Location</h4>
                                <PropertyMapDisplay
                                    latitude={selectedPropertyForModal.latitude}
                                    longitude={selectedPropertyForModal.longitude}
                                    address={selectedPropertyForModal.propertyAddress}
                                />
                              </div>

                              {/* Documents */}
                               <div>
                                 <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center"><FileText className="w-4 h-4 mr-1"/> Verifiable Documents</h4>
                                 {(selectedPropertyForModal.documentHashes && selectedPropertyForModal.documentHashes.length > 0) ? (
                                    <ul className="space-y-2 text-sm">
                                         {getDocumentsArrayModal(selectedPropertyForModal.documentHashes).map((doc, index) => (
                                             <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                                 <span className="font-medium text-gray-700 flex items-center">
                                                     <CheckCircle className={`w-4 h-4 mr-2 ${index === 0 ? 'text-purple-500' : 'text-orange-500'}`} />
                                                     {doc.name}
                                                 </span>
                                                 <a href={`https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline text-xs">
                                                     View on IPFS <ExternalLink className="w-3 h-3 ml-1" /> {/* Changed Icon */}
                                                 </a>
                                             </li>
                                         ))}
                                     </ul>
                                  ) : ( <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded border">No documents found for this property.</p> )}
                               </div>
                        </div>
                         {/* Modal Footer */}
                         <div className="px-6 py-3 bg-gray-50 border-t rounded-b-lg text-right flex-shrink-0"> {/* Footer area */}
                             <button
                                 onClick={closeDetailModal}
                                 className="py-2 px-5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
                             >
                                 Close
                             </button>
                         </div>
                    </div>
                </div>
            )}
            {/* --- End Detail Modal --- */}
        </div>
    );
};

export default BuyerProperties;

