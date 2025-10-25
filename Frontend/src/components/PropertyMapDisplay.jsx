import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react'; // Import an icon

// --- Fix for default Leaflet icon ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * A component to fit the map bounds to the displayed geometry.
 */
const FitBounds = ({ geometry }) => {
  const map = useMap();
  useEffect(() => {
    if (geometry) {
      try {
        const geoJsonLayer = L.geoJSON(geometry);
        map.fitBounds(geoJsonLayer.getBounds());
      } catch (error) {
        console.error("Error fitting bounds:", error);
      }
    }
  }, [geometry, map]);
  return null;
};

const PropertyMapDisplay = ({ latitude, longitude, address, geometry }) => {  
  const lat = latitude || 20.5937; // Default to India if no lat
  const lng = longitude || 78.9629; // Default to India if no lng
  const position = [lat, lng];

  // Style for the GeoJSON shape
  const shapeStyle = {
    color: '#3b82f6',       // Blue border
    weight: 3,
    opacity: 0.8,
    fillColor: '#60a5fa', // Lighter blue fill
    fillOpacity: 0.3,
  };

  return (
    <div className="w-full">
      <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-300 z-0">
        <MapContainer
          center={position}
          zoom={geometry ? 15 : (latitude ? 13 : 5)} 
          style={{ height: '100%', width: '100%' }}
          dragging={true}
          zoomControl={true}
          scrollWheelZoom={true} 
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* 1. Show the drawn shape (polygon/rectangle) */}
          {geometry && (
            <GeoJSON data={geometry} style={shapeStyle} />
          )}

          {/* ✅ --- FIX --- */}
          {/* 2. Show the marker if latitude and longitude exist (regardless of geometry) */}
          {latitude && longitude && (
            <Marker position={position}>
              <Popup>{address || `Center: ${lat.toFixed(6)}, ${lng.toFixed(6)}`}</Popup>
            </Marker>
          )}
          {/* ✅ --- END OF FIX --- */}

          {/* 3. Automatically zoom to fit the shape if it exists */}
          {geometry && <FitBounds geometry={geometry} />}
          
        </MapContainer>
      </div>

      {/* Display Coordinates Below Map */}
      {latitude && longitude && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-indigo-600" />
            <span className="font-semibold">Center Coordinates:</span>
            <span className="ml-2 font-mono text-gray-900">{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMapDisplay;