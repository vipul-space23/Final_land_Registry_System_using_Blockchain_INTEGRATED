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