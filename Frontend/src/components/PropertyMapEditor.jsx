import React, { useState, useMemo, useEffect } from 'react';
// Make sure you have installed react-leaflet and leaflet
// npm install react-leaflet leaflet
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapClickHandler({ onMapClick, position }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return position ? <Marker position={position}></Marker> : null;
}

const PropertyMapEditor = ({ onCoordsChange, initialCoords = null }) => {
  const [position, setPosition] = useState(
    initialCoords ? { lat: initialCoords.lat, lng: initialCoords.lng } : null
  );

  // Update position if initialCoords change (e.g., opening modal for different properties)
  useEffect(() => {
     setPosition(initialCoords ? { lat: initialCoords.lat, lng: initialCoords.lng } : null);
  }, [initialCoords]);


  const handleMapClick = (latlng) => {
    setPosition(latlng);
    onCoordsChange(latlng);
  };

  const center = useMemo(() => {
    return position || [20.5937, 78.9629]; // Default India
  }, [position]);

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={position ? 13 : 5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        // Add a key to force re-render if center changes drastically
        key={center.toString()}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onMapClick={handleMapClick} position={position} />
      </MapContainer>
      <p className="text-xs text-gray-500 mt-1">Click on the map to set the property location.</p>
    </div>
  );
};

export default PropertyMapEditor;