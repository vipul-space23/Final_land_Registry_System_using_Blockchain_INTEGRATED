// import React from 'react';

// const mockRequests = [
//   { id: 1, from: "0xbuyer...1234", land: "LND-101", status: "Pending" },
// ];

// const ReceivedRequestsPage = () => {
//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">My Received Requests</h1>
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Land ID</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {mockRequests.map(req => (
//             <tr key={req.id}>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.id}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.from}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.land}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.status}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                 <button className="text-green-600 hover:text-green-900 mr-2">Accept</button>
//                 <button className="text-red-600 hover:text-red-900">Reject</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ReceivedRequestsPage;
// Frontend/src/pages/owner/ReceivedRequestsPage.jsx
// This file replaces the previous incorrect one or the one in the verifier folder.

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ethers } from 'ethers';
// Import your Marketplace contract ABI (Make sure the path is correct)
import MarketplaceABI from '../../abis/Marketplace.json'; // Adjust path if needed
import { Loader2 } from 'lucide-react'; // Import Loader icon

const ReceivedRequestsPage = () => { // Renamed component
    const { user } = useAuth(); // Get logged-in user info (including token)
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null); // Track which request is being processed

    // Fetch pending requests from the backend
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
                // Call the backend endpoint to get properties pending seller verification
                const response = await fetch('http://localhost:5000/api/requests/seller', {
                    headers: {
                        'Authorization': `Bearer ${user.token}` // Send auth token
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch purchase requests');
                }
                // Ensure data.data is an array before setting state
                setRequests(Array.isArray(data.data) ? data.data : []);
            } catch (err) {
                console.error("Fetch Requests Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [user]); // Re-fetch if user changes

    // --- Handle Approval ---
    const handleApprove = async (propertyId, buyerAddress, tokenId, price) => {
        if (!window.ethereum) {
            alert('MetaMask is required to approve blockchain transactions.');
            return;
        }
        if (!buyerAddress || !tokenId) {
             alert('Missing buyer or property information for blockchain transaction.');
             return;
        }

        setProcessingId(propertyId);
        setError(null);

        try {
            // --- 1. SMART CONTRACT INTERACTION ---
            console.log("Connecting to MetaMask...");
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // Ensure wallet is connected
            const signer = await provider.getSigner();
            const sellerAddress = await signer.getAddress();

            console.log(`Seller: ${sellerAddress}, Buyer: ${buyerAddress}, TokenID: ${tokenId}, Price: ${price} ETH`);

            const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS;
            if (!marketplaceAddress) throw new Error("Marketplace address not configured in .env (VITE_MARKETPLACE_ADDRESS)");

            const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketplaceABI.abi, signer);

            console.log("Calling smart contract 'approveSale' function..."); // Or your contract's equivalent

            // --- !!! IMPORTANT: ADAPT THIS CALL TO YOUR CONTRACT !!! ---
            // Replace 'approveSale' and arguments (tokenId, buyerAddress?) as needed.
            const tx = await marketplaceContract.approveSale(tokenId);
            // --- !!! END OF CONTRACT CALL ADAPTATION !!! ---

            console.log("Transaction sent:", tx.hash);
            alert("Transaction sent to MetaMask. Please confirm...");

            const receipt = await tx.wait();
            console.log("Blockchain transaction successful:", receipt.hash);
            // --- END OF SMART CONTRACT INTERACTION ---

            // --- 2. Update Backend Database ---
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

            // 3. Update UI
            setRequests(prev => prev.filter(req => req._id !== propertyId));
            alert('Sale approved successfully on blockchain and database updated!');

        } catch (err) {
            console.error("Approval Error:", err);
            let userMessage = `Approval failed: ${err.message}`;
            if (err.code === 4001) userMessage = "Transaction rejected in MetaMask.";
            else if (err.message.includes("insufficient funds")) userMessage = "Approval failed: Insufficient funds for transaction gas.";
            setError(userMessage);
            alert(userMessage);
        } finally {
            setProcessingId(null);
        }
    };

    // --- Handle Rejection ---
    const handleReject = async (propertyId) => {
        if (!window.confirm("Are you sure you want to reject this purchase request?")) {
            return;
        }

        setProcessingId(propertyId);
        setError(null);
        try {
            // Optional: Call smart contract reject function FIRST if necessary (e.g., refund escrow)
            // console.log("Calling smart contract 'rejectSale' function (if applicable)...");
            // ... contract interaction ...

            console.log("Calling backend to reject...");
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
            alert('Purchase request rejected successfully.');

        } catch (err) {
            console.error("Rejection Error:", err);
            let userMessage = `Rejection failed: ${err.message}`;
            if (err.code === 4001) userMessage = "Transaction rejected in MetaMask.";
            setError(userMessage);
            alert(userMessage);
        } finally {
            setProcessingId(null);
        }
    };

    // --- Render Logic ---
    if (loading) return <div className="p-4 text-center">Loading requests...</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Received Purchase Requests</h1>

            {error && (
                <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
                    <span className="font-medium">Error:</span> {error}
                </div>
            )}

            {requests.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-lg shadow border">
                     {/* Empty state SVG and text */}
                     <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                     <h3 className="mt-2 text-sm font-semibold text-gray-900">No pending requests</h3>
                     <p className="mt-1 text-sm text-gray-500">When a buyer requests to purchase your listed property, it will appear here.</p>
                 </div>
            ) : (
                <div className="space-y-4">
                    {requests.map(req => (
                        req && ( // Render only if req object is valid
                            <div key={req._id} className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                {/* Property Info */}
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                            Property ID: <span className="font-mono text-blue-600">{req.propertyId}</span>
                                        </h2>
                                        <p className="text-sm text-gray-600">{req.propertyAddress}</p>
                                        <p className="text-sm text-gray-600">Token ID: <span className="font-mono">{req.tokenId}</span></p>
                                        <p className="text-sm font-bold text-green-600 mt-1">Offered Price: {req.price} ETH</p>
                                    </div>
                                    <span className="mt-2 sm:mt-0 text-xs font-medium bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full">
                                        Pending Your Approval
                                    </span>
                                </div>

                                {/* Buyer Info */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h3 className="text-base font-medium text-gray-700 mb-2">Buyer Information:</h3>
                                    {req.buyer ? (
                                        <div className="text-sm space-y-1">
                                            <p><span className="font-medium text-gray-600">Name:</span> {req.buyer.name || 'N/A'}</p>
                                            <p><span className="font-medium text-gray-600">Email:</span> {req.buyer.email || 'N/A'}</p>
                                            <p><span className="font-medium text-gray-600">Phone:</span> {req.buyer.phone || 'N/A'}</p>
                                            <p><span className="font-medium text-gray-600">Wallet:</span>
                                                <span className="font-mono text-xs ml-1" title={req.buyer.walletAddress}>
                                                    {req.buyer.walletAddress ? `${req.buyer.walletAddress.substring(0, 6)}...${req.buyer.walletAddress.substring(req.buyer.walletAddress.length - 4)}` : 'N/A'}
                                                </span>
                                            </p>
                                        </div>
                                    ) : (
                                         <p className="text-sm text-gray-500">Buyer details could not be loaded.</p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                                    <button
                                        onClick={() => handleApprove(req._id, req.buyer?.walletAddress, req.tokenId, req.price)}
                                        disabled={processingId === req._id || !req.buyer?.walletAddress}
                                        title={!req.buyer?.walletAddress ? "Cannot approve without buyer wallet address" : ""}
                                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {processingId === req._id ? <Loader2 className="w-4 h-4 mr-2 inline animate-spin"/> : null}
                                        Approve Sale
                                    </button>
                                    <button
                                        onClick={() => handleReject(req._id)}
                                        disabled={processingId === req._id}
                                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {processingId === req._id ? <Loader2 className="w-4 h-4 mr-2 inline animate-spin"/> : null}
                                        Reject Request
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReceivedRequestsPage; // Renamed export
