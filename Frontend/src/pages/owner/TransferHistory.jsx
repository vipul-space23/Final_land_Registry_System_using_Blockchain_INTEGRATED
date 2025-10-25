// Frontend/src/pages/Owner/TransferHistory.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Calendar, DollarSign, Hash, User, ExternalLink, Loader2 } from 'lucide-react';

const TransferHistory = () => {
    const { user } = useAuth();
    const [soldProperties, setSoldProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSoldProperties = async () => {
            if (!user || !user.token) {
                setError("Please log in to view transfer history.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:5000/api/properties/my-sold', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch sold properties');
                }

                setSoldProperties(data.data || []);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSoldProperties();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading transfer history...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Land Transfer History</h1>
                <p className="text-gray-600 mt-2">Properties you have sold to other buyers</p>
            </div>

            {error && (
                <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
                    <span className="font-medium">Error:</span> {error}
                </div>
            )}

            {soldProperties.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow border">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No transfers yet</h3>
                    <p className="mt-1 text-sm text-gray-500">When you sell a property, it will appear here with full transfer details.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {soldProperties.map(property => (
                        <div key={property._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold">Property ID: {property.propertyId}</h2>
                                        <p className="text-sm text-blue-100 mt-1">{property.propertyAddress}</p>
                                    </div>
                                    <span className="mt-2 sm:mt-0 text-xs font-medium bg-green-500 px-3 py-1 rounded-full">
                                        ✓ Sold
                                    </span>
                                </div>
                            </div>

                            {/* Transfer Details */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column - Sale Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">
                                            Sale Details
                                        </h3>
                                        
                                        <div className="flex items-start">
                                            <DollarSign className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500">Sale Price</p>
                                                <p className="text-lg font-bold text-green-600">{property.soldPrice || property.price} ETH</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Calendar className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500">Transfer Date</p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {new Date(property.soldAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Hash className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                                            <div className="w-full">
                                                <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                                                <div className="flex items-center">
                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all">
                                                        {property.transactionHash}
                                                    </code>
                                                    <a 
                                                        href={`https://etherscan.io/tx/${property.transactionHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                                        title="View on Etherscan"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Transfer Flow */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">
                                            Ownership Transfer
                                        </h3>

                                        {/* From (You) */}
                                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                            <p className="text-xs text-red-600 font-semibold mb-2">FROM (Previous Owner)</p>
                                            <div className="flex items-start">
                                                <User className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">You</p>
                                                    <p className="text-xs text-gray-600 font-mono break-all">
                                                        {user.walletAddress}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="flex justify-center">
                                            <ArrowRight className="w-8 h-8 text-gray-400" />
                                        </div>

                                        {/* To (Buyer) */}
                                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                            <p className="text-xs text-green-600 font-semibold mb-2">TO (New Owner)</p>
                                            <div className="flex items-start">
                                                <User className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {property.owner?.name || property.ownerName || 'New Owner'}
                                                    </p>
                                                    {property.owner?.email && (
                                                        <p className="text-xs text-gray-600">{property.owner.email}</p>
                                                    )}
                                                    <p className="text-xs text-gray-600 font-mono break-all">
                                                        {property.ownerWalletAddress}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransferHistory;