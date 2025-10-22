// // Frontend/src/pages/owner/ReceivedRequestsPage.jsx
// // This file replaces the previous incorrect one or the one in the verifier folder.

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { ethers } from 'ethers';
// // Import your Marketplace contract ABI (Make sure the path is correct)
// import MarketplaceABI from '../../abis/Marketplace.json'; // Adjust path if needed
// import { Loader2 } from 'lucide-react'; // Import Loader icon

// const ReceivedRequestsPage = () => { // Renamed component
//     const { user } = useAuth(); // Get logged-in user info (including token)
//     const [requests, setRequests] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [processingId, setProcessingId] = useState(null); // Track which request is being processed

//     // Fetch pending requests from the backend
//     useEffect(() => {
//         const fetchRequests = async () => {
//             if (!user || !user.token) {
//                 setError("Please log in to view requests.");
//                 setLoading(false);
//                 return;
//             }
//             setLoading(true);
//             setError(null);
//             try {
//                 // Call the backend endpoint to get properties pending seller verification
//                 const response = await fetch('http://localhost:5000/api/requests/seller', {
//                     headers: {
//                         'Authorization': `Bearer ${user.token}` // Send auth token
//                     }
//                 });
//                 const data = await response.json();
//                 if (!response.ok) {
//                     throw new Error(data.message || 'Failed to fetch purchase requests');
//                 }
//                 // Ensure data.data is an array before setting state
//                 setRequests(Array.isArray(data.data) ? data.data : []);
//             } catch (err) {
//                 console.error("Fetch Requests Error:", err);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchRequests();
//     }, [user]); // Re-fetch if user changes

//     // --- Handle Approval ---
//     const handleApprove = async (propertyId, buyerAddress, tokenId, price) => {
//         if (!window.ethereum) {
//             alert('MetaMask is required to approve blockchain transactions.');
//             return;
//         }
//         if (!buyerAddress || !tokenId) {
//              alert('Missing buyer or property information for blockchain transaction.');
//              return;
//         }

//         setProcessingId(propertyId);
//         setError(null);

//         try {
//             // --- 1. SMART CONTRACT INTERACTION ---
//             console.log("Connecting to MetaMask...");
//             const provider = new ethers.BrowserProvider(window.ethereum);
//             await provider.send("eth_requestAccounts", []); // Ensure wallet is connected
//             const signer = await provider.getSigner();
//             const sellerAddress = await signer.getAddress();

//             console.log(`Seller: ${sellerAddress}, Buyer: ${buyerAddress}, TokenID: ${tokenId}, Price: ${price} ETH`);

//             const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS;
//             if (!marketplaceAddress) throw new Error("Marketplace address not configured in .env (VITE_MARKETPLACE_ADDRESS)");

//             const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketplaceABI.abi, signer);

//             console.log("Calling smart contract 'approveSale' function..."); // Or your contract's equivalent

//             // --- !!! IMPORTANT: ADAPT THIS CALL TO YOUR CONTRACT !!! ---
//             // Replace 'approveSale' and arguments (tokenId, buyerAddress?) as needed.
//             const tx = await marketplaceContract.approveSale(tokenId);
//             // --- !!! END OF CONTRACT CALL ADAPTATION !!! ---

//             console.log("Transaction sent:", tx.hash);
//             alert("Transaction sent to MetaMask. Please confirm...");

//             const receipt = await tx.wait();
//             console.log("Blockchain transaction successful:", receipt.hash);
//             // --- END OF SMART CONTRACT INTERACTION ---

//             // --- 2. Update Backend Database ---
//             console.log("Updating backend database...");
//             const backendResponse = await fetch(`http://localhost:5000/api/requests/${propertyId}/approve`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${user.token}`
//                 },
//                 body: JSON.stringify({ transactionHash: receipt.hash })
//             });

//             const backendData = await backendResponse.json();
//             if (!backendResponse.ok) {
//                 throw new Error(backendData.message || `Backend update failed after blockchain success (Tx: ${receipt.hash}). Please contact support.`);
//             }

//             // 3. Update UI
//             setRequests(prev => prev.filter(req => req._id !== propertyId));
//             alert('Sale approved successfully on blockchain and database updated!');

//         } catch (err) {
//             console.error("Approval Error:", err);
//             let userMessage = `Approval failed: ${err.message}`;
//             if (err.code === 4001) userMessage = "Transaction rejected in MetaMask.";
//             else if (err.message.includes("insufficient funds")) userMessage = "Approval failed: Insufficient funds for transaction gas.";
//             setError(userMessage);
//             alert(userMessage);
//         } finally {
//             setProcessingId(null);
//         }
//     };

//     // --- Handle Rejection ---
//     const handleReject = async (propertyId) => {
//         if (!window.confirm("Are you sure you want to reject this purchase request?")) {
//             return;
//         }

//         setProcessingId(propertyId);
//         setError(null);
//         try {
//             // Optional: Call smart contract reject function FIRST if necessary (e.g., refund escrow)
//             // console.log("Calling smart contract 'rejectSale' function (if applicable)...");
//             // ... contract interaction ...

//             console.log("Calling backend to reject...");
//             const response = await fetch(`http://localhost:5000/api/requests/${propertyId}/reject`, {
//                 method: 'POST',
//                 headers: { 'Authorization': `Bearer ${user.token}` }
//             });
//             const data = await response.json();
//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to reject request on backend');
//             }

//             // Update UI
//             setRequests(prev => prev.filter(req => req._id !== propertyId));
//             alert('Purchase request rejected successfully.');

//         } catch (err) {
//             console.error("Rejection Error:", err);
//             let userMessage = `Rejection failed: ${err.message}`;
//             if (err.code === 4001) userMessage = "Transaction rejected in MetaMask.";
//             setError(userMessage);
//             alert(userMessage);
//         } finally {
//             setProcessingId(null);
//         }
//     };

//     // --- Render Logic ---
//     if (loading) return <div className="p-4 text-center">Loading requests...</div>;

//     return (
//         <div className="container mx-auto p-4 md:p-8">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Received Purchase Requests</h1>

//             {error && (
//                 <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
//                     <span className="font-medium">Error:</span> {error}
//                 </div>
//             )}

//             {requests.length === 0 ? (
//                  <div className="text-center py-12 bg-white rounded-lg shadow border">
//                      {/* Empty state SVG and text */}
//                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
//                      <h3 className="mt-2 text-sm font-semibold text-gray-900">No pending requests</h3>
//                      <p className="mt-1 text-sm text-gray-500">When a buyer requests to purchase your listed property, it will appear here.</p>
//                  </div>
//             ) : (
//                 <div className="space-y-4">
//                     {requests.map(req => (
//                         req && ( // Render only if req object is valid
//                             <div key={req._id} className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow duration-200">
//                                 {/* Property Info */}
//                                 <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3">
//                                     <div>
//                                         <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
//                                             Property ID: <span className="font-mono text-blue-600">{req.propertyId}</span>
//                                         </h2>
//                                         <p className="text-sm text-gray-600">{req.propertyAddress}</p>
//                                         <p className="text-sm text-gray-600">Token ID: <span className="font-mono">{req.tokenId}</span></p>
//                                         <p className="text-sm font-bold text-green-600 mt-1">Offered Price: {req.price} ETH</p>
//                                     </div>
//                                     <span className="mt-2 sm:mt-0 text-xs font-medium bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full">
//                                         Pending Your Approval
//                                     </span>
//                                 </div>

//                                 {/* Buyer Info */}
//                                 <div className="mt-4 pt-4 border-t border-gray-200">
//                                     <h3 className="text-base font-medium text-gray-700 mb-2">Buyer Information:</h3>
//                                     {req.buyer ? (
//                                         <div className="text-sm space-y-1">
//                                             <p><span className="font-medium text-gray-600">Name:</span> {req.buyer.name || 'N/A'}</p>
//                                             <p><span className="font-medium text-gray-600">Email:</span> {req.buyer.email || 'N/A'}</p>
//                                             <p><span className="font-medium text-gray-600">Phone:</span> {req.buyer.phone || 'N/A'}</p>
//                                             <p><span className="font-medium text-gray-600">Wallet:</span>
//                                                 <span className="font-mono text-xs ml-1" title={req.buyer.walletAddress}>
//                                                     {req.buyer.walletAddress ? `${req.buyer.walletAddress.substring(0, 6)}...${req.buyer.walletAddress.substring(req.buyer.walletAddress.length - 4)}` : 'N/A'}
//                                                 </span>
//                                             </p>
//                                         </div>
//                                     ) : (
//                                          <p className="text-sm text-gray-500">Buyer details could not be loaded.</p>
//                                     )}
//                                 </div>

//                                 {/* Action Buttons */}
//                                 <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
//                                     <button
//                                         onClick={() => handleApprove(req._id, req.buyer?.walletAddress, req.tokenId, req.price)}
//                                         disabled={processingId === req._id || !req.buyer?.walletAddress}
//                                         title={!req.buyer?.walletAddress ? "Cannot approve without buyer wallet address" : ""}
//                                         className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                                     >
//                                         {processingId === req._id ? <Loader2 className="w-4 h-4 mr-2 inline animate-spin"/> : null}
//                                         Approve Sale
//                                     </button>
//                                     <button
//                                         onClick={() => handleReject(req._id)}
//                                         disabled={processingId === req._id}
//                                         className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                                     >
//                                         {processingId === req._id ? <Loader2 className="w-4 h-4 mr-2 inline animate-spin"/> : null}
//                                         Reject Request
//                                     </button>
//                                 </div>
//                             </div>
//                         )
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ReceivedRequestsPage; // Renamed export


// Frontend/src/pages/owner/ReceivedRequestsPage.jsx
// ESCROW FLOW: Seller approves/rejects purchase requests with funds in escrow

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ethers } from 'ethers';
import MarketplaceABI from '../../abis/Marketplace.json';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ReceivedRequestsPage = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Fetch pending requests from backend
    useEffect(() => {
        const fetchRequests = async () => {
            if (!user || !user.token) {
                setError("Please log in to view requests.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:5000/api/requests/seller', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch purchase requests');
                }
                setRequests(Array.isArray(data.data) ? data.data : []);
            } catch (err) {
                console.error("Fetch Requests Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [user]);

    // ===== APPROVE SALE: Release escrow and transfer NFT =====
    const handleApprove = async (propertyId, buyerAddress, tokenId, price) => {
        if (!window.ethereum) {
            alert('MetaMask is required to approve blockchain transactions.');
            return;
        }
        if (!buyerAddress || !tokenId) {
            alert('Missing buyer or property information for blockchain transaction.');
            return;
        }

        if (!window.confirm(`Are you sure you want to approve this sale for ${price} ETH?\n\nThis will:\n1. Transfer the NFT to the buyer\n2. Release ${price} ETH from escrow to your pending withdrawals`)) {
            return;
        }

        setProcessingId(propertyId);
        setError(null);
        setSuccessMessage(null);

        try {
            // Step 1: Connect to blockchain
            console.log("Connecting to MetaMask...");
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const sellerAddress = await signer.getAddress();

            console.log(`Seller: ${sellerAddress}, Buyer: ${buyerAddress}, TokenID: ${tokenId}, Price: ${price} ETH`);

            const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS;
            if (!marketplaceAddress) throw new Error("Marketplace address not configured in .env (VITE_MARKETPLACE_ADDRESS)");

            const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketplaceABI.abi, signer);

            // Step 2: Call smart contract approval function
            console.log("Calling smart contract 'approveSale' function...");
            
            // IMPORTANT: Replace 'approveSale' with your actual contract function name
            // Common alternatives: completeSale, releaseFunds, executeTransaction, etc.
            // If your function requires buyer address as parameter: approveSale(tokenId, buyerAddress)
            const tx = await marketplaceContract.approveSale(tokenId);

            console.log("Transaction sent:", tx.hash);
            alert("Transaction sent to MetaMask. Waiting for confirmation...");

            const receipt = await tx.wait();
            
            if (receipt.status !== 1) {
                throw new Error('Blockchain transaction failed');
            }

            console.log("✅ Blockchain transaction successful:", receipt.hash);

            // Step 3: Update backend database
            console.log("Updating backend database...");
            const backendResponse = await fetch(`http://localhost:5000/api/requests/${propertyId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ transactionHash: receipt.hash })
            });

            const backendData = await backendResponse.json();
            if (!backendResponse.ok) {
                throw new Error(backendData.message || `Backend update failed after blockchain success (Tx: ${receipt.hash}). Please contact support.`);
            }

            // Step 4: Update UI
            setRequests(prev => prev.filter(req => req._id !== propertyId));
            setSuccessMessage(`✅ Sale approved successfully! ${price} ETH added to your pending withdrawals.`);
            alert(`✅ Sale approved! Transaction: ${receipt.hash}\n\nThe buyer now owns the NFT and ${price} ETH is available for withdrawal.`);

        } catch (err) {
            console.error("Approval Error:", err);
            let userMessage = `Approval failed: ${err.message}`;
            
            if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
                userMessage = "Transaction rejected in MetaMask.";
            } else if (err.message?.includes("insufficient funds")) {
                userMessage = "Approval failed: Insufficient funds for transaction gas.";
            } else if (err.message?.includes("not the seller")) {
                userMessage = "You are not authorized to approve this sale.";
            } else if (err.message?.includes("no escrow")) {
                userMessage = "No funds in escrow for this property. The buyer may not have completed payment.";
            }
            
            setError(userMessage);
            alert('❌ ' + userMessage);
        } finally {
            setProcessingId(null);
        }
    };

    // ===== REJECT SALE: Refund escrow to buyer =====
    const handleReject = async (propertyId, buyerAddress, tokenId) => {
        if (!window.confirm("Are you sure you want to reject this purchase request?\n\nThis will refund the buyer's escrowed funds.")) {
            return;
        }

        setProcessingId(propertyId);
        setError(null);
        setSuccessMessage(null);

        try {
            // Optional: If your contract requires calling rejectSale to refund escrow
            if (window.ethereum && tokenId && buyerAddress) {
                console.log("Calling smart contract 'rejectSale' to refund escrow...");
                
                const provider = new ethers.BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                
                const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS;
                const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketplaceABI.abi, signer);
                
                // IMPORTANT: Only uncomment if your contract has a rejectSale function
                // If your contract automatically refunds on backend status change, remove this block
                // const tx = await marketplaceContract.rejectSale(tokenId);
                // await tx.wait();
                // console.log("✅ Escrow refunded on blockchain");
            }

            // Update backend
            console.log("Calling backend to reject request...");
            const response = await fetch(`http://localhost:5000/api/requests/${propertyId}/reject`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to reject request on backend');
            }

            // Update UI
            setRequests(prev => prev.filter(req => req._id !== propertyId));
            setSuccessMessage('✅ Purchase request rejected. Funds refunded to buyer.');
            alert('✅ Purchase request rejected successfully.');

        } catch (err) {
            console.error("Rejection Error:", err);
            let userMessage = `Rejection failed: ${err.message}`;
            if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
                userMessage = "Transaction rejected in MetaMask.";
            }
            setError(userMessage);
            alert('❌ ' + userMessage);
        } finally {
            setProcessingId(null);
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                <span className="text-gray-600">Loading requests...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Received Purchase Requests</h1>
                <p className="text-gray-600 mt-2">Approve or reject purchase requests from buyers with funds in escrow</p>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-green-800 font-medium">{successMessage}</p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-red-800 font-medium">Error</p>
                        <p className="text-red-700 text-sm mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {requests.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow border">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending requests</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        When a buyer deposits funds into escrow for your property, their request will appear here for your approval.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {requests.map(req => (
                        req && (
                            <div key={req._id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4 pb-4 border-b">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-xl font-semibold text-gray-800">
                                                    {req.propertyAddress || 'Property Address'}
                                                </h2>
                                                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    Pending Approval
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p>
                                                    <span className="font-medium">Property ID:</span>{' '}
                                                    <span className="font-mono text-blue-600">{req.propertyId}</span>
                                                </p>
                                                <p>
                                                    <span className="font-medium">Token ID:</span>{' '}
                                                    <span className="font-mono">{req.tokenId}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3 sm:mt-0 sm:ml-4 text-right">
                                            <div className="text-2xl font-bold text-green-600">
                                                {req.price} ETH
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                In Escrow
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buyer Information */}
                                    <div className="mb-4 pb-4 border-b">
                                        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Buyer Information
                                        </h3>
                                        {req.buyer ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-600">Name:</span>
                                                    <p className="text-gray-800 mt-0.5">{req.buyer.name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Email:</span>
                                                    <p className="text-gray-800 mt-0.5">{req.buyer.email || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Phone:</span>
                                                    <p className="text-gray-800 mt-0.5">{req.buyer.phone || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Wallet Address:</span>
                                                    <p className="text-gray-800 font-mono text-xs mt-0.5" title={req.buyer.walletAddress}>
                                                        {req.buyer.walletAddress ? 
                                                            `${req.buyer.walletAddress.substring(0, 6)}...${req.buyer.walletAddress.substring(req.buyer.walletAddress.length - 4)}` 
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">Buyer details could not be loaded.</p>
                                        )}
                                    </div>

                                    {/* Escrow Status */}
                                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-blue-900">Funds Secured in Escrow</p>
                                                <p className="text-xs text-blue-700 mt-1">
                                                    {req.price} ETH is locked in the smart contract. Approve to transfer NFT and release funds to your account.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => handleApprove(req._id, req.buyer?.walletAddress, req.tokenId, req.price)}
                                            disabled={processingId === req._id || !req.buyer?.walletAddress}
                                            className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                            title={!req.buyer?.walletAddress ? "Cannot approve without buyer wallet address" : "Approve sale and release funds"}
                                        >
                                            {processingId === req._id ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5 mr-2" />
                                                    Approve Sale
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleReject(req._id, req.buyer?.walletAddress, req.tokenId)}
                                            disabled={processingId === req._id}
                                            className="flex-1 flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {processingId === req._id ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-5 h-5 mr-2" />
                                                    Reject Request
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}

            {/* Info Box */}
            <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    How it works
                </h3>
                <ul className="text-xs text-gray-600 space-y-1 ml-6 list-disc">
                    <li>Buyer deposits full payment into smart contract escrow</li>
                    <li>You review the request and buyer details</li>
                    <li><strong>Approve:</strong> NFT transfers to buyer, funds move to your pending withdrawals</li>
                    <li><strong>Reject:</strong> Funds are refunded to buyer, property remains listed</li>
                    <li>After approval, withdraw your funds from the dashboard</li>
                </ul>
            </div>
        </div>
    );
};

export default ReceivedRequestsPage;