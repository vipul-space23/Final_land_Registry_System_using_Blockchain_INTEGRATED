import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const PropertyMapDisplay = ({ latitude, longitude, address }) => {
  if (latitude == null || longitude == null) { // Check for null or undefined explicitly
    return <div className="text-gray-500 text-sm">No location data provided.</div>;
  }

  const position = [latitude, longitude];

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false} // Disable zoom for display
        dragging={false}       // Disable dragging
        touchZoom={false}      // Disable touch zoom
        doubleClickZoom={false}// Disable double click zoom
        style={{ height: '100%', width: '100%' }}
        key={position.toString()} // Force re-render if position changes
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>{address || 'Property Location'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMapDisplay;