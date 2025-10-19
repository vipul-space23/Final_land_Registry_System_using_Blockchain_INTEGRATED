// import React from 'react';
// import AddLandListingForm from '../../components/AddLandListingForm';

// const AddLandPage = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <AddLandListingForm />
//     </div>
//   );
// };

// export default AddLandPage;


import React, { useState } from 'react';
import AddLandListingForm from '../../components/AddLandListingForm';
import LandMapSelector from '../../components/LandMapSelector';

// Import Leaflet's CSS
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const AddLandPage = () => {
  // State to hold the coordinates selected from the map
  const [selectedCoords, setSelectedCoords] = useState({ lat: null, lng: null });

  // Handler to update the coordinates from the map component
  const handleMapSelect = (coords) => {
    setSelectedCoords(coords);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Pass the selected coordinates and a descriptive title down to the form */}
        <AddLandListingForm 
          selectedCoords={selectedCoords} 
          title="1. Fill Property Details"
        />

        {/* The map component that will update the parent's state */}
        <LandMapSelector 
          onAreaSelect={handleMapSelect}
          title="2. Select Property Location on Map"
        />
      </div>
    </div>
  );
};

export default AddLandPage;