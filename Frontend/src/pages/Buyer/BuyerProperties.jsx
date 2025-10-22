import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LandPlot, Loader2 } from 'lucide-react'; // Import Loader2
import PropertyCard from '../../components/PropertyCard'; // Assuming this component is correct
import { useAuth } from '../../context/AuthContext'; // Import useAuth to get the token

const BuyerProperties = () => {
    const { user } = useAuth(); // Get user context for token and ID
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            // Check if user is logged in before fetching
            if (!user || !user.token) {
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
                        // Removed credentials: "include"
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch properties");
                }

                const data = await response.json();

                // No need to filter here, backend already returns properties owned by the logged-in user
                // The image URL construction happens inside PropertyCard now
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
    }, [user]);

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
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">My Properties</h1>
                <p className="text-base md:text-lg text-gray-600">
                    A record of all the properties you currently own.
                </p>
            </div>

            {!hasProperties ? (
                // Empty state display
                <div className="bg-white rounded-xl shadow-lg p-8 text-center flex flex-col items-center justify-center min-h-[40vh] border border-gray-200">
                    <LandPlot className="w-16 h-16 md:w-20 md:h-20 text-blue-400 mb-6" strokeWidth={1.5} />
                    <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800">You don't own any properties yet.</h2>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto">
                        Browse the marketplace to find verified land listings and make your first secure purchase using blockchain technology.
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
                        // Pass the property data directly to PropertyCard
                        // PropertyCard should handle displaying the correct image URL
                        <PropertyCard key={property._id} property={property} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BuyerProperties;
