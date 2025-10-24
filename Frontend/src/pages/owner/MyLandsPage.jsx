import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Make sure this path is correct

const MyLandsPage = () => {
    const { user } = useAuth();
    const [myLands, setMyLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLand, setSelectedLand] = useState(null);
    const [listingPrice, setListingPrice] = useState('');
    const [propertyImage, setPropertyImage] = useState(null);
    const [listingError, setListingError] = useState(null);

    useEffect(() => {
        if (!user || !user.token) {
            setError('Please log in to view your lands.');
            setLoading(false);
            return;
        }

        const fetchMyLands = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/properties/my', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch your lands');
                }
                const data = await response.json();
                setMyLands(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMyLands();
    }, [user]);

    // --- MODIFIED: This now pre-fills the price if editing ---
    const openListingModal = (land) => {
        setSelectedLand(land);
        setListingPrice(land.price > 0 ? land.price : ''); // Pre-fill price
        setPropertyImage(null); // Always reset file input
        setListingError(null);
        setIsModalOpen(true);
    };

    // --- MODIFIED: Image is now optional ---
    const handleConfirmListing = async (e) => {
        e.preventDefault();
        
        if (!user || !user.token) {
            setListingError('You must be logged in.');
            return;
        }
        // Price is the only required field
        if (!listingPrice) {
            setListingError('Please provide a price.');
            return;
        }

        const formData = new FormData();
        formData.append('price', listingPrice);
        
        // --- MODIFIED: Only append image if one is selected ---
        if (propertyImage) {
            formData.append('image', propertyImage);
        }

        try {
            const response = await fetch(`http://localhost:5000/api/properties/list/${selectedLand._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update status');
            }
            
            const updatedLand = await response.json();

            setMyLands(prevLands => 
                prevLands.map(land => 
                    land._id === selectedLand._id ? updatedLand : land
                )
            );
            
            setIsModalOpen(false);
            setSelectedLand(null);

        } catch (err) {
            setListingError(err.message);
        }
    };

    // --- NEW FUNCTION: To withdraw a listing ---
    const handleWithdrawListing = async (landId) => {
        if (!window.confirm('Are you sure you want to withdraw this listing?')) {
            return;
        }

        if (!user || !user.token) {
            setError('You must be logged in.');
            return;
        }

        try {
            // We will create this new API route in the backend
            const response = await fetch(`http://localhost:5000/api/properties/withdraw/${landId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to withdraw listing');
            }

            const updatedLand = await response.json(); // Backend will return land with "verified" status

            // Update state to show the change
            setMyLands(prevLands =>
                prevLands.map(land =>
                    land._id === landId ? updatedLand : land
                )
            );
            setError(null);

        } catch (err) {
            setError(err.message);
        }
    };
    
    const formatAddress = (land) => {
        return land.propertyAddress; // Simplified
    };

    // ... (loading, !user, myLands.length checks are the same) ...
    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (!user) return <div className="text-center py-8">Please log in.</div>;
    if (myLands.length === 0 && !error) return <div className="text-center py-8">No lands registered.</div>;


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Lands</h1>
            
            {error && <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">{error}</div>}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Survey No.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {myLands.map((land) => (
                            <tr key={land._id}>
                                <td className="px-6 py-4">
                                  {land.image ? (
                                    <img 
                                      src={`http://localhost:5000/${land.image.replace(/\\/g, '/')}`} 
                                      alt="Land" 
                                      className="h-16 w-16 object-cover rounded"
                                    />
                                  ) : (
                                    <span className="text-gray-400 text-xs">No Image</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{land.propertyId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{land.surveyNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatAddress(land)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{land.area} {land.areaUnit || 'sq m'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {land.price > 0 ? `${land.price} ETH` : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        land.status === 'listed_for_sale' ? 'bg-green-100 text-green-800' :
                                        land.status === 'verified' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {land.status.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                
                                {/* --- MODIFIED: Actions Column --- */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {/* Show "List for Sale" when verified */}
                                    {land.status === 'verified' && (
                                        <button 
                                            onClick={() => openListingModal(land)}
                                            className="ml-4 text-green-600 hover:text-green-900"
                                        >
                                            List for Sale
                                        </button>
                                    )}

                                    {/* Show "Edit" and "Withdraw" when listed */}
                                    {land.status === 'listed_for_sale' && (
                                        <>
                                            <button 
                                                onClick={() => openListingModal(land)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleWithdrawListing(land._id)}
                                                className="ml-4 text-red-600 hover:text-red-900"
                                            >
                                                Withdraw
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODIFIED: Modal --- */}
            {isModalOpen && selectedLand && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <form onSubmit={handleConfirmListing}>
                            <h2 className="text-2xl font-bold mb-4">Edit Listing</h2>
                            <p className="mb-4">Listing: <span className="font-medium">{selectedLand.propertyId}</span></p>

                            {listingError && <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">{listingError}</div>}
                            
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (in ETH)</label>
                                <input
                                    type="number"
                                    id="price"
                                    step="0.01"
                                    min="0.01"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    value={listingPrice}
                                    onChange={(e) => setListingPrice(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="mb-6">
                                {/* --- MODIFIED: Image is now optional --- */}
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Property Image</label>
                                <p className="text-xs text-gray-500 mb-1">Leave blank to keep the current image.</p>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/png, image/jpeg"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) => setPropertyImage(e.target.files[0])}
                                    // 'required' is removed
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button typeB="button" onClick={() => setIsModalOpen(false)} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                    Cancel
                                </button>
                                <button type="submit" className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                    Confirm Listing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyLandsPage;
// // Frontend/src/pages/owner/MyLandsPage.jsx
// // Implements Path 2: Blockchain listing (Approve + List) BEFORE backend update

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import PropertyMapEditor from '../../components/PropertyMapEditor'; // Import map editor

// // --- Add Ethers and ABIs ---
// import { ethers } from 'ethers';
// import MarketplaceABI from '../../abis/Marketplace.json'; // Adjust path
// import PropertyTitleABI from '../../abis/PropertyTitle.json'; // Adjust path (Make sure this has the 'approve' function ABI)
// import { Loader2 } from 'lucide-react'; // For loading indicator

// const MyLandsPage = () => {
//     const { user } = useAuth();
//     const [myLands, setMyLands] = useState([]);
//     const [loading, setLoading] = useState(true); // Page loading
//     const [error, setError] = useState(null); // Page level errors/status

//     // Modal State
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedLand, setSelectedLand] = useState(null);
//     const [listingPrice, setListingPrice] = useState('');
//     const [propertyImage, setPropertyImage] = useState(null); // File object
//     const [coordinates, setCoordinates] = useState(null); // { lat: number, lng: number }
//     const [modalError, setModalError] = useState(null); // Errors/Status specific to the modal
//     const [blockchainLoading, setBlockchainLoading] = useState(false); // Loading state for modal actions

//     // Fetch user's lands from backend AND FILTER
//     useEffect(() => {
//         const fetchMyLands = async () => {
//             if (!user || !user.token) {
//                 setError("Please log in."); setLoading(false); return;
//             }
//             setLoading(true); setError(null);
//             try {
//                 const response = await fetch('http://localhost:5000/api/properties/my', {
//                     headers: { 'Authorization': `Bearer ${user.token}` }
//                 });
//                 const data = await response.json();
//                 if (!response.ok) throw new Error(data.message || 'Failed to fetch lands');

//                 // --- Filter results to only include properties where the logged-in user is the current owner ---
//                 // Note: Assumes backend populates 'owner' with user details including '_id'
//                 const currentlyOwnedLands = data.filter(land => land.owner?._id === user._id);
//                 // --- End Filter ---

//                 setMyLands(currentlyOwnedLands); // Set the filtered list

//             } catch (err) {
//                 console.error("Fetch Lands Error:", err); setError(err.message);
//             } finally { setLoading(false); }
//         };
//         fetchMyLands();
//     }, [user]); // Re-fetch if user changes (e.g., login/logout)

//     // Opens the modal and pre-fills data
//     const openListingModal = (land) => {
//         setSelectedLand(land);
//         setListingPrice(land.status === 'listed_for_sale' && land.price > 0 ? land.price.toString() : '');
//         setCoordinates(land.latitude != null && land.longitude != null ? { lat: land.latitude, lng: land.longitude } : null);
//         setPropertyImage(null); // Always clear file input on open
//         setModalError(null); // Clear previous modal status/error
//         setIsModalOpen(true);
//     };

//     // --- Handles Blockchain Listing/Editing (Approve + List) -> Backend Update ---
//     const handleConfirmListing = async (e) => {
//         e.preventDefault();
//         setModalError(null);

//         // --- Input Validations ---
//         if (!user || !user.token) { setModalError('Authentication error.'); return; }
//         const numericPrice = Number(listingPrice);
//         if (!listingPrice || isNaN(numericPrice) || numericPrice <= 0) { setModalError('Please enter a valid positive price.'); return; }
//         // Image required only if listing for the first time and no image already exists
//         if (!selectedLand.image && !propertyImage && selectedLand.status !== 'listed_for_sale') {
//              setModalError('An image is required when listing for the first time.'); return;
//         }
//         if (!selectedLand.tokenId) {
//              setModalError('Property Token ID missing. Cannot list on blockchain. Ensure it was minted by the verifier.'); return;
//         }
//         // --- End Validations ---

//         setBlockchainLoading(true); // Start loading indicator in modal

//         try {
//             // --- 1. Blockchain Interaction ---
//             setModalError("Connecting to wallet...");
//             if (!window.ethereum) throw new Error('MetaMask is not installed.');
//             const provider = new ethers.BrowserProvider(window.ethereum);
//             await provider.send("eth_requestAccounts", []); // Ensure wallet connected
//             const signer = await provider.getSigner();

//             const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS;
//             const propertyTitleAddress = import.meta.env.VITE_PROPERTY_TITLE_ADDRESS;
//             if (!marketplaceAddress || !propertyTitleAddress) throw new Error("Contract addresses missing in .env");

//             const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketplaceABI.abi, signer);
//             // Ensure PropertyTitleABI has the 'approve' function fragment
//             const propertyTitleContract = new ethers.Contract(propertyTitleAddress, PropertyTitleABI.abi, signer);

//             const tokenId = Number(selectedLand.tokenId);
//             const priceInWei = ethers.parseEther(listingPrice);

//             // --- Step A: Approve the Marketplace to manage this specific NFT ---
//             console.log(`Approving marketplace (${marketplaceAddress}) for Token ID ${tokenId}...`);
//             setModalError("Action Required: Approve marketplace in MetaMask (1/2)...");
//             const approveTx = await propertyTitleContract.approve(marketplaceAddress, tokenId);
//             console.log("Approval TX Sent:", approveTx.hash);
//             setModalError("Waiting for Approval confirmation...");
//             await approveTx.wait(1); // Wait for 1 confirmation
//             console.log("Approval TX Confirmed!");

//             // --- Step B: List the property on the Marketplace contract ---
//             console.log(`Listing Token ID ${tokenId} for ${listingPrice} ETH...`);
//             setModalError("Action Required: Confirm listing in MetaMask (2/2)...");
//             // Ensure 'listProperty' function exists and takes tokenId and priceInWei
//             const listTx = await marketplaceContract.listProperty(tokenId, priceInWei);
//             console.log("List TX Sent:", listTx.hash);
//             setModalError("Waiting for Listing confirmation...");
//             const listReceipt = await listTx.wait(1);
//             console.log("List TX Confirmed!", listReceipt);
//             if (listReceipt.status !== 1) throw new Error("Blockchain list transaction failed. Check Etherscan.");
//             // --- End Blockchain Interaction ---

//             // --- 2. Update Backend Database (Only after blockchain success) ---
//             console.log("Updating backend database...");
//             setModalError("Blockchain successful! Updating server record...");

//             const formData = new FormData();
//             formData.append('price', listingPrice);
//             if (propertyImage) formData.append('image', propertyImage); // Send new image file if selected
//             if (coordinates) { // Send coordinates if available
//                 formData.append('latitude', coordinates.lat.toString());
//                 formData.append('longitude', coordinates.lng.toString());
//             }
//             formData.append('approveTxHash', approveTx.hash); // Send transaction hashes
//             formData.append('listTxHash', listTx.hash);

//             // Calls listPropertySimple backend controller to update DB
//             const backendResponse = await fetch(`http://localhost:5000/api/properties/list/${selectedLand._id}`, {
//                 method: 'PUT',
//                 headers: { 'Authorization': `Bearer ${user.token}` },
//                 body: formData
//             });
//             const backendData = await backendResponse.json();
//             if (!backendResponse.ok) {
//                  // Provide specific error from backend if available
//                  throw new Error(backendData.message || `Backend update failed after listing (Tx: ${listTx.hash}). Contact support.`);
//             }

//             // --- 3. Update UI ---
//             setMyLands(prev => prev.map(land => land._id === selectedLand._id ? backendData : land)); // Update list with new data
//             setIsModalOpen(false); // Close modal on complete success
//             setError('Property listed successfully on blockchain and database!'); // Use main page feedback
//             setTimeout(() => setError(null), 5000); // Clear feedback message

//         } catch (err) {
//             console.error("Listing Error:", err);
//             let userMessage = `Listing failed: ${err.message || 'Unknown error'}`;
//             // Provide user-friendly messages for common errors
//             if (err.code === 4001 || err.code === 'ACTION_REJECTED') userMessage = "Transaction rejected in MetaMask.";
//             else if (err.reason) userMessage = `Transaction failed: ${err.reason}`; // Capture contract revert reason
//             else if (err.message?.includes("missing revert data")) userMessage = `Transaction failed: Possible contract error (check gas limit or contract logic). Details: ${err.shortMessage || err.message}`;
//             setModalError(userMessage); // Show error *in the modal*
//             // No alert needed, error stays in modal until closed/retried
//         } finally {
//             setBlockchainLoading(false); // Stop loading indicator in modal
//         }
//     };

//     // --- Handles Blockchain Withdrawal -> Backend Update ---
//     const handleWithdrawListing = async (landId, tokenId) => {
//          if (!window.confirm('Withdraw listing from blockchain marketplace? This requires a transaction.')) return;
//          if (!tokenId) { setError("Cannot withdraw: Property Token ID missing."); return; }

//          setBlockchainLoading(true); // Indicate processing on the page (reuse state)
//          setError("Processing withdrawal..."); // Use page level feedback

//          try {
//              // --- 1. Blockchain Interaction ---
//              if (!window.ethereum) throw new Error('MetaMask is not installed.');
//              const provider = new ethers.BrowserProvider(window.ethereum);
//              await provider.send("eth_requestAccounts", []);
//              const signer = await provider.getSigner();

//              const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS;
//              if (!marketplaceAddress) throw new Error("Marketplace address missing");

//              const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketplaceABI.abi, signer);

//              console.log(`Withdrawing Token ID ${tokenId}...`);
//              setError("Action Required: Confirm withdrawal in MetaMask...");

//              // --- !!! ADAPT THIS CALL TO YOUR CONTRACT !!! ---
//              // Replace 'unlistProperty' if your function has a different name
//              const unlistTx = await marketplaceContract.unlistProperty(Number(tokenId));
//              // --- END ADAPTATION ---

//              console.log("Unlist TX Sent:", unlistTx.hash);
//              setError("Waiting for Withdrawal confirmation...");
//              const unlistReceipt = await unlistTx.wait(1);
//              console.log("Unlist TX Confirmed!", unlistReceipt);
//               if (unlistReceipt.status !== 1) throw new Error("Blockchain unlist transaction failed.");
//              // --- End Blockchain Interaction ---

//              // --- 2. Update Backend ---
//              console.log("Updating backend database...");
//              setError("Blockchain withdrawal successful! Updating server...");

//              // Calls withdrawListing backend controller
//              const backendResponse = await fetch(`http://localhost:5000/api/properties/withdraw/${landId}`, {
//                  method: 'PUT',
//                  headers: { 'Authorization': `Bearer ${user.token}` }
//                  // Optionally send unlistTxHash in body
//              });
//              const backendData = await backendResponse.json();
//              if (!backendResponse.ok) throw new Error(backendData.message || `Backend update failed after unlisting (Tx: ${unlistTx.hash}).`);

//              // --- 3. Update UI ---
//              setMyLands(prev => prev.map(land => land._id === landId ? backendData : land));
//              setError('Property withdrawn successfully!'); // Use page feedback

//          } catch (err) {
//             console.error("Withdrawal Error:", err);
//             let userMessage = `Withdrawal failed: ${err.message || 'Unknown error'}`;
//             if (err.code === 4001 || err.code === 'ACTION_REJECTED') userMessage = "Transaction rejected in MetaMask.";
//             else if (err.reason) userMessage = `Transaction failed: ${err.reason}`;
//             setError(userMessage); // Show error on page
//          } finally {
//              setBlockchainLoading(false);
//              setTimeout(() => setError(null), 7000); // Clear feedback after delay
//          }
//     };

//     const formatAddress = (land) => land?.propertyAddress || 'N/A';

//     // --- Render Logic ---
//     return (
//         <div className="container mx-auto p-4 md:p-8">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">My Registered Lands</h1>

//             {/* Display general page errors/status here */}
//             {error && !isModalOpen && (
//                  <div className={`mb-4 p-4 text-sm rounded-lg border ${
//                     error.toLowerCase().includes('failed') || error.toLowerCase().includes('error') ?
//                     'text-red-800 bg-red-100 border-red-300' :
//                     'text-green-800 bg-green-100 border-green-300' // Green for success messages
//                 }`} role="alert">
//                      <span className="font-medium">{error.toLowerCase().includes('failed') || error.toLowerCase().includes('error') ? 'Error:' : 'Status:'}</span> {error}
//                  </div>
//              )}
//             {/* Show main loading spinner only if not processing blockchain tx */}
//             {loading && !blockchainLoading && <div className="text-center py-10"><Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600"/></div> }

//             {!loading && (
//                  <div className="overflow-x-auto bg-white rounded-lg shadow border">
//                      <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                              <tr>
//                                  {/* Table Headers */}
//                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property ID</th>
//                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token ID</th>
//                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Survey No.</th>
//                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
//                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
//                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                              {myLands.length === 0 ? (
//                                   <tr><td colSpan="9" className="text-center py-10 text-gray-500">You currently own no registered lands, or none have been minted.</td></tr>
//                              ) : (
//                                  myLands.map((land) => (
//                                     <tr key={land._id} className="hover:bg-gray-50">
//                                          {/* Image */}
//                                         <td className="px-4 py-4">
//                                             <img
//                                                 src={land.image ? `http://localhost:5000/${land.image}` : 'https://via.placeholder.com/64?text=No+Img'}
//                                                 alt="Land"
//                                                 className="h-10 w-10 object-cover rounded shadow"
//                                                 onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=Error'; }}
//                                             />
//                                         </td>
//                                          {/* Property ID */}
//                                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{land.propertyId}</td>
//                                          {/* Token ID */}
//                                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono" title={land.tokenId || 'Not Minted Yet'}>
//                                             {land.tokenId ? `#${land.tokenId}` : '-'}
//                                         </td>
//                                          {/* Survey No */}
//                                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{land.surveyNumber}</td>
//                                          {/* Address */}
//                                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={formatAddress(land)}>{formatAddress(land)}</td>
//                                          {/* Area */}
//                                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{land.area} {land.areaUnit || 'sq m'}</td>
//                                          {/* Price */}
//                                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             {land.price > 0 ? `${land.price} ETH` : 'N/A'}
//                                         </td>
//                                          {/* Status */}
//                                         <td className="px-4 py-4 whitespace-nowrap">
//                                              <span className={`inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
//                                                 land.status === 'listed_for_sale' ? 'bg-green-100 text-green-800' :
//                                                 land.status === 'verified' || land.status === 'minted' ? 'bg-blue-100 text-blue-800' :
//                                                 land.status === 'sold' ? 'bg-red-100 text-red-800' :
//                                                 'bg-yellow-100 text-yellow-800' // pending etc.
//                                              }`}>
//                                                  {land.status.replace(/_/g, ' ')}
//                                              </span>
//                                          </td>
//                                          {/* Actions */}
//                                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                                             {/* List/Edit Button */}
//                                             {(land.status === 'verified' || land.status === 'minted' || land.status === 'listed_for_sale') && (
//                                                 <button
//                                                     onClick={() => openListingModal(land)}
//                                                     disabled={!land.tokenId || blockchainLoading}
//                                                     title={!land.tokenId ? "Minting required" : (land.status === 'listed_for_sale' ? 'Edit listing details' : 'List property on blockchain')}
//                                                     className={` ${land.status === 'listed_for_sale' ? 'text-blue-600 hover:text-blue-900' : 'text-green-600 hover:text-green-900'} disabled:text-gray-400 disabled:cursor-not-allowed`}
//                                                 >
//                                                     {land.status === 'listed_for_sale' ? 'Edit Listing' : 'List for Sale'}
//                                                 </button>
//                                             )}
//                                             {/* Withdraw Button */}
//                                             {land.status === 'listed_for_sale' && (
//                                                 <button
//                                                     onClick={() => handleWithdrawListing(land._id, land.tokenId)}
//                                                     disabled={blockchainLoading}
//                                                     className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
//                                                 >
//                                                     Withdraw
//                                                 </button>
//                                             )}
//                                             {/* Add a View button maybe? */}
//                                             {/* <Link to={`/property/${land._id}`} className="text-indigo-600 hover:text-indigo-900">View</Link> */}
//                                         </td>
//                                     </tr>
//                                 ))
//                              )}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             {/* --- Listing/Editing Modal --- */}
//             {isModalOpen && selectedLand && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-8 backdrop-blur-sm">
//                     <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//                         <form onSubmit={handleConfirmListing}>
//                             <h2 className="text-xl font-semibold mb-4">{selectedLand.status === 'listed_for_sale' ? 'Edit Listing Details & Re-list' : 'List Property for Sale'}</h2>
//                             <p className="mb-4 text-sm text-gray-600">Property ID: <span className="font-medium font-mono">{selectedLand.propertyId}</span> | Token ID: <span className="font-medium font-mono">#{selectedLand.tokenId || 'N/A'}</span></p>

//                             {/* Modal Error/Status Display */}
//                             {modalError && (
//                                  <div className={`p-3 mb-4 text-sm rounded-lg border ${
//                                     modalError.toLowerCase().includes('failed') || modalError.toLowerCase().includes('error') ? 'text-red-700 bg-red-100 border-red-300' : 'text-blue-700 bg-blue-100 border-blue-300'
//                                 }`} role="alert">
//                                      {modalError.includes("Action Required:") || blockchainLoading ? <Loader2 className="w-4 h-4 mr-2 inline animate-spin"/> : null}
//                                      {modalError}
//                                  </div>
//                             )}

//                              {/* Price Input */}
//                             <div className="mb-4">
//                                 <label htmlFor="modal-price" className="block text-sm font-medium text-gray-700">Price (in ETH)</label>
//                                 <input type="number" id="modal-price" step="any" min="0.000001" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100" value={listingPrice} onChange={(e) => setListingPrice(e.target.value)} disabled={blockchainLoading} required />
//                             </div>

//                              {/* Image Input */}
//                             <div className="mb-4">
//                                 <label htmlFor="modal-image" className="block text-sm font-medium text-gray-700">Property Image</label>
//                                  {selectedLand.image && !propertyImage && selectedLand.status === 'listed_for_sale' && ( <div className="mt-1 text-xs text-gray-500">Current image shown. Choose new file to replace.</div> )}
//                                 <input type="file" id="modal-image" accept="image/png, image/jpeg" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50" onChange={(e) => setPropertyImage(e.target.files[0])} disabled={blockchainLoading} required={!selectedLand.image && selectedLand.status !== 'listed_for_sale'} />
//                                 {selectedLand.image && !propertyImage && ( <img src={`http://localhost:5000/${selectedLand.image}`} alt="Current" className="mt-2 h-20 w-auto rounded border"/> )}
//                             </div>

//                              {/* Map Editor */}
//                             <div className="mb-6">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Property Location</label>
//                                 <PropertyMapEditor onCoordsChange={(latlng) => setCoordinates(latlng)} initialCoords={coordinates} />
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="flex justify-end gap-3 pt-4 border-t mt-6">
//                                 <button type="button" onClick={() => setIsModalOpen(false)} disabled={blockchainLoading} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"> Cancel </button>
//                                 <button type="submit" disabled={blockchainLoading || !selectedLand.tokenId} title={!selectedLand.tokenId ? "Property needs minting first" : ""} className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]">
//                                     {blockchainLoading ? ( <> <Loader2 className="w-4 h-4 mr-2 animate-spin"/> Processing... </> ) : ( selectedLand.status === 'listed_for_sale' ? 'Update & Re-list' : 'Confirm & List' )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MyLandsPage;

