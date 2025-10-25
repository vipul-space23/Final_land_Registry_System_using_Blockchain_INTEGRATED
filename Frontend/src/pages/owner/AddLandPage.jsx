// import React, { useState, useEffect } from 'react';
// import AddLandListingForm from '../../components/AddLandListingForm';
// import LandMapSelector from '../../components/LandMapSelector';
// import { Loader2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom'; {/* --- ADD THIS --- */}

// // Import Leaflet's CSS
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-draw/dist/leaflet.draw.css';

// const AddLandPage = () => {
//   const navigate = useNavigate(); {/* --- ADD THIS --- */}

//   // State to hold the coordinates selected from the map
//   const [selectedCoords, setSelectedCoords] = useState({ lat: null, lng: null });
  
//   // State to manage current step
//   const [currentStep, setCurrentStep] = useState(1);
  
//   // State to track if step 1 is verified
//   const [isStep1Verified, setIsStep1Verified] = useState(false);
  
//   // State to track if property is already verified
//   const [isPropertyVerified, setIsPropertyVerified] = useState(false);
  
//   // State for loading
//   const [isLoading, setIsLoading] = useState(true);
  
//   // State for error
//   const [error, setError] = useState(null);

//   // Fetch verification status on page load
//   useEffect(() => {
//     const fetchVerificationStatus = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(
//           'http://localhost:5000/api/properties/verification-status',
//           {
//             credentials: 'include',
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           setIsPropertyVerified(data.isVerified || false);
//           if (data.isVerified) {
//             setCurrentStep(2);
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching verification status:', err);
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchVerificationStatus();
//   }, []);

//   // Handler to update the coordinates from the map component
//   const handleMapSelect = (coords) => {
//     setSelectedCoords(coords);
//   };

//   // Handler when form verification is complete
//   const handleFormVerified = () => {
//     setIsStep1Verified(true);
//     setTimeout(() => {
//       setCurrentStep(2);
//       setIsPropertyVerified(true);
//     }, 500);
//   };

//   // Handler to go back to step 1
//   const handleBackToStep1 = () => {
//     setCurrentStep(1);
//   };

//   // Handler to click on step indicator
//   const handleStepClick = (stepNumber) => {
//     if (stepNumber === 1) {
//       setCurrentStep(1);
//     } else if (stepNumber === 2 && (isStep1Verified || isPropertyVerified)) {
//       setCurrentStep(2);
//     }
//   };

//   // {/* --- ADD THIS HANDLER --- */}
//   const handleFinishAndNavigate = () => {
//     // Here you could add any final save logic (e.g., save the selectedCoords)
//     // For now, just navigate
//     navigate('/owner-dashboard/my-lands');
//   };

//   const steps = [
//     { number: 1, title: 'Fill Property Details' },
//     { number: 2, title: 'Select Property Location on Map' }
//   ];

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading your property information...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
//           <p className="text-red-600 font-semibold mb-4">Error Loading Page</p>
//           <p className="text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Stepper Navigation - Show only on step 2 */}
//         {currentStep === 2 && (
//           <div className="mb-8 flex items-center justify-between">
//             {steps.map((step, index) => (
//               <div key={step.number} className="flex items-center flex-1">
//                 {/* Step Dot */}
//                 <button
//                   onClick={() => handleStepClick(step.number)}
//                   disabled={step.number > currentStep}
//                   className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
//                     step.number <= currentStep
//                       ? 'bg-blue-600 text-white cursor-pointer'
//                       : 'bg-gray-300 text-gray-600 cursor-not-allowed'
//                   }`}
//                   title={step.title}
//                 >
//                   {step.number}
//                 </button>

//                 {/* Step Label */}
//                 <div className="ml-3 hidden sm:block flex-1">
//                   <p className="text-sm font-medium text-gray-700">{step.title}</p>
//                 </div>

//                 {/* Connector Line */}
//                 {index < steps.length - 1 && (
//                   <div className={`h-1 mx-2 flex-1 ${
//                     step.number < currentStep ? 'bg-blue-600' : 'bg-gray-300'
//                   }`} />
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Content Area with Animation */}
//         <div className="relative overflow-hidden">
//           {/* Step 1: Fill Property Details */}
//           <div
//             className={`transition-all duration-500 ease-in-out ${
//               currentStep === 1
//                 ? 'opacity-100 translate-x-0'
//                 : 'opacity-0 translate-x-full absolute'
//             }`}
//           >
//             <AddLandListingForm 
//               selectedCoords={selectedCoords} 
//               title="1. Fill Property Details"
//               onFormVerified={handleFormVerified}
//               isVerifying={isStep1Verified}
//               isAlreadyVerified={isPropertyVerified}
//             />
//           </div>

//           {/* Step 2: Select Property Location on Map */}
//           <div
//             className={`transition-all duration-500 ease-in-out ${
//               currentStep === 2
//                 ? 'opacity-100 translate-x-0'
//                 : 'opacity-0 -translate-x-full absolute'
//             }`}
//           >
//             <div className="space-y-4">
//               <LandMapSelector 
//                 onAreaSelect={handleMapSelect}
//                 title="2. Select Property Location on Map"
//               />
              
//               {/* --- MODIFIED THIS SECTION --- */}
//               {/* Button Container for Step 2 */}
//               <div className="flex justify-between items-center pt-4">
//                 <button
//                   onClick={handleBackToStep1}
//                   className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition"
//                 >
//                   ← Back to Step 1
//                 </button>

//                 {/* --- THIS IS THE NEW BUTTON --- */}
//                 <button
//                   onClick={handleFinishAndNavigate}
//                   className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
//                 >
//                   Finish & View My Lands →
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddLandPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AddLandListingForm from '../../components/AddLandListingForm';
import LandMapSelector from '../../components/LandMapSelector';
import { useAuth } from '../../context/AuthContext'; // ✅ 1. Import useAuth

// Import Leaflet's CSS
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const AddLandPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ 2. Get user from auth context

  // State to hold all data from the map
  const [shapeData, setShapeData] = useState({
    geometry: null,
    center: null,
    area: 0
  });

  // State for IDs and loading
  const [propertyId, setPropertyId] = useState(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [mapError, setMapError] = useState(null);

  // State for steps
  const [currentStep, setCurrentStep] = useState(1);
  const [isStep1Verified, setIsStep1Verified] = useState(false);
  const [isPropertyVerified, setIsPropertyVerified] = useState(false);
  
  // State for page loading/error
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch verification status on page load
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      // ✅ 3. Get token for this fetch request
      const token = user?.token;
      if (!token) {
        setIsLoading(false);
        // Not verified yet, just show step 1
        return; 
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          'http://localhost:5000/api/properties/verification-status',
          {
            headers: {
              'Authorization': `Bearer ${token}` // ✅ Add auth header
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsPropertyVerified(data.isVerified || false);
          if (data.isVerified) {
            setCurrentStep(2);
            // Get the ID of the already-verified property
            if (data.property) {
                setPropertyId(data.property._id);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching verification status:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.token) {
        fetchVerificationStatus();
    } else {
        setIsLoading(false); // No user, just show step 1
    }
  }, [user]); // Re-run if user logs in

  // Receives the data object from LandMapSelector
  const handleShapeDrawn = (data) => {
    setShapeData({
      geometry: data.geometry,
      center: data.center,
      area: data.area
    });
    setMapError(null);
  };

  // Receives the user's location from "My Location" button
  const handleCoordsFetched = (coords) => {
    console.log("User's current location fetched:", coords);
  };

  // Receives the new property's ID from AddLandListingForm
  const handleFormVerified = (newPropertyId) => {
    setPropertyId(newPropertyId); // <--- SAVE THE ID
    setIsStep1Verified(true);
    setTimeout(() => {
      setCurrentStep(2);
      setIsPropertyVerified(true);
    }, 500);
  };

  // The "Finish" button handler
  const handleFinishAndNavigate = async () => {
    setMapError(null);

    // ✅ 4. Get token for the API call
    const token = user?.token;
    if (!token) {
        setMapError("Authentication error. Please log in again.");
        return;
    }

    if (!propertyId) {
        setMapError("Could not find property ID. Please go back to Step 1.");
        return;
    }
    if (!shapeData.geometry || !shapeData.center) {
        setMapError("Please select your property area on the map before finishing.");
        return;
    }

    setIsFinishing(true);

    try {
        const response = await fetch(`http://localhost:5000/api/properties/${propertyId}/map-data`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // ✅ 5. ADD THE HEADER
            },
            body: JSON.stringify({
                geometry: shapeData.geometry,
                latitude: shapeData.center.lat,
                longitude: shapeData.center.lng
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Failed to save map data');
        }

        navigate('/owner-dashboard/my-lands');

    } catch (err) {
        console.error("Error saving map data:", err);
        setMapError(err.message);
    } finally {
        setIsFinishing(false);
    }
  };

  // --- Helper functions for navigation ---
  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber === 1) {
      setCurrentStep(1);
    } else if (stepNumber === 2 && (isStep1Verified || isPropertyVerified)) {
      setCurrentStep(2);
    }
  };

  const steps = [
    { number: 1, title: 'Fill Property Details' },
    { number: 2, title: 'Select Property Location on Map' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your property information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <p className="text-red-600 font-semibold mb-4">Error Loading Page</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Stepper Navigation */}
        {currentStep === 2 && (
          <div className="mb-8 flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                {/* Step Dot */}
                <button
                  onClick={() => handleStepClick(step.number)}
                  disabled={step.number > currentStep}
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                    step.number <= currentStep
                      ? 'bg-blue-600 text-white cursor-pointer'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                  title={step.title}
                >
                  {step.number}
                </button>
                {/* Step Label */}
                <div className="ml-3 hidden sm:block flex-1">
                  <p className="text-sm font-medium text-gray-700">{step.title}</p>
                </div>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`h-1 mx-2 flex-1 ${
                    step.number < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content Area */}
        <div className="relative overflow-hidden">
          {/* Step 1: Fill Property Details */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              currentStep === 1
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-full absolute'
            }`}
          >
            <AddLandListingForm 
              selectedCoords={shapeData.center} 
              title="1. Fill Property Details"
              onFormVerified={handleFormVerified}
              isVerifying={isStep1Verified}
              isAlreadyVerified={isPropertyVerified}
            />
          </div>

          {/* Step 2: Select Property Location on Map */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              currentStep === 2
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-full absolute'
            }`}
          >
            <div className="space-y-4">
              <LandMapSelector 
                onShapeDrawn={handleShapeDrawn}
                onCoordsFetched={handleCoordsFetched}
                title="2. Select Property Location on Map"
              />
              
              {mapError && (
                 <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
                     <strong>Error:</strong> {mapError}
                 </div>
              )}
              
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={handleBackToStep1}
                  disabled={isFinishing}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition"
                >
                  ← Back to Step 1
                </button>
                <button
                  onClick={handleFinishAndNavigate}
                  disabled={isFinishing}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center"
                >
                  {isFinishing ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                      'Finish & View My Lands →'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLandPage;