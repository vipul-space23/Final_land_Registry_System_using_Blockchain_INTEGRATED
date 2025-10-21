import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertCircle, Home, Search, ExternalLink } from 'lucide-react';

// A component for each row in the properties table
const PropertyRow = ({ property }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">{property.propertyId}</div>
      <div className="text-xs text-gray-500">{property.surveyNumber}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{property.ownerName}</div>
      <div className="text-xs text-gray-500 font-mono" title={property.ownerWalletAddress}>
        {`${property.ownerWalletAddress.substring(0, 6)}...${property.ownerWalletAddress.substring(38)}`}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
      {property.propertyAddress}, {property.district}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{property.area} sq ft</td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
        Registered
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
      <a href={`https://sepolia.etherscan.io/tx/${property.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 inline-flex items-center">
        View Tx <ExternalLink className="h-4 w-4 ml-1" />
      </a>
    </td>
  </tr>
);


export default function RegisteredPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user?.token) {
        setError("You are not authorized to view this page.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/properties/all', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch properties.');
        }

        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user]);

  // Handle search filtering
  useEffect(() => {
    const results = properties.filter(prop =>
      prop.propertyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.ownerWalletAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(results);
  }, [searchTerm, properties]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading Registered Properties...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-600 p-4">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p className="text-center font-semibold">Error loading properties</p>
        <p className="text-center text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center"><Home className="h-6 w-6 mr-3 text-blue-600"/>All Registered Properties</h1>
            <p className="text-gray-600 mt-1">A complete list of all properties registered on the blockchain.</p>
        </div>
         <div className="mt-4 sm:mt-0 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="text"
                placeholder="Search by ID, owner, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {filteredProperties.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
                <p>No properties found matching your search criteria.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <PropertyRow key={property._id} property={property} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
