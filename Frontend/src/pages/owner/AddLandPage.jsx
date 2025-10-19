// // // // import React from 'react';
// // // // import AddLandListingForm from '../../components/AddLandListingForm';

// // // // const AddLandPage = () => {
// // // //   return (
// // // //     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
// // // //       <AddLandListingForm />
// // // //     </div>
// // // //   );
// // // // };

// // // // export default AddLandPage;


// // // import React, { useState } from 'react';
// // // import AddLandListingForm from '../../components/AddLandListingForm';
// // // import LandMapSelector from '../../components/LandMapSelector';

// // // // Import Leaflet's CSS
// // // import 'leaflet/dist/leaflet.css';
// // // import 'leaflet-draw/dist/leaflet.draw.css';

// // // const AddLandPage = () => {
// // //   // State to hold the coordinates selected from the map
// // //   const [selectedCoords, setSelectedCoords] = useState({ lat: null, lng: null });

// // //   // Handler to update the coordinates from the map component
// // //   const handleMapSelect = (coords) => {
// // //     setSelectedCoords(coords);
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
// // //       <div className="max-w-4xl mx-auto space-y-8">
// // //         {/* Pass the selected coordinates and a descriptive title down to the form */}
// // //         <AddLandListingForm 
// // //           selectedCoords={selectedCoords} 
// // //           title="1. Fill Property Details"
// // //         />

// // //         {/* The map component that will update the parent's state */}
// // //         <LandMapSelector 
// // //           onAreaSelect={handleMapSelect}
// // //           title="2. Select Property Location on Map"
// // //         />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AddLandPage;

// // import React, { useState } from 'react';
// // import AddLandListingForm from '../../components/AddLandListingForm';
// // import LandMapSelector from '../../components/LandMapSelector';

// // // Import Leaflet's CSS
// // import 'leaflet/dist/leaflet.css';
// // import 'leaflet-draw/dist/leaflet.draw.css';

// // const AddLandPage = () => {
// //   // State to hold the coordinates selected from the map
// //   const [selectedCoords, setSelectedCoords] = useState({ lat: null, lng: null });
  
// //   // State to manage current step
// //   const [currentStep, setCurrentStep] = useState(1);
  
// //   // State to track if step 1 is verified
// //   const [isStep1Verified, setIsStep1Verified] = useState(false);

// //   // Handler to update the coordinates from the map component
// //   const handleMapSelect = (coords) => {
// //     setSelectedCoords(coords);
// //   };

// //   // Handler when form verification is complete
// //   const handleFormVerified = () => {
// //     setIsStep1Verified(true);
// //     setTimeout(() => {
// //       setCurrentStep(2);
// //     }, 500);
// //   };

// //   // Handler to go back to step 1
// //   const handleBackToStep1 = () => {
// //     setCurrentStep(1);
// //   };

// //   // Handler to click on step indicator
// //   const handleStepClick = (stepNumber) => {
// //     if (stepNumber === 1) {
// //       setCurrentStep(1);
// //     } else if (stepNumber === 2 && isStep1Verified) {
// //       setCurrentStep(2);
// //     }
// //   };

// //   const steps = [
// //     { number: 1, title: 'Fill Property Details' },
// //     { number: 2, title: 'Select Property Location on Map' }
// //   ];

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
// //       <div className="max-w-4xl mx-auto">
// //         {/* Stepper Navigation - Show only on step 2 */}
// //         {currentStep === 2 && (
// //           <div className="mb-8 flex items-center justify-between">
// //             {steps.map((step, index) => (
// //               <div key={step.number} className="flex items-center flex-1">
// //                 {/* Step Dot */}
// //                 <button
// //                   onClick={() => handleStepClick(step.number)}
// //                   disabled={step.number > currentStep}
// //                   className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
// //                     step.number <= currentStep
// //                       ? 'bg-blue-600 text-white cursor-pointer'
// //                       : 'bg-gray-300 text-gray-600 cursor-not-allowed'
// //                   }`}
// //                   title={step.title}
// //                 >
// //                   {step.number}
// //                 </button>

// //                 {/* Step Label */}
// //                 <div className="ml-3 hidden sm:block flex-1">
// //                   <p className="text-sm font-medium text-gray-700">{step.title}</p>
// //                 </div>

// //                 {/* Connector Line */}
// //                 {index < steps.length - 1 && (
// //                   <div className={`h-1 mx-2 flex-1 ${
// //                     step.number < currentStep ? 'bg-blue-600' : 'bg-gray-300'
// //                   }`} />
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* Content Area with Animation */}
// //         <div className="relative overflow-hidden">
// //           {/* Step 1: Fill Property Details */}
// //           <div
// //             className={`transition-all duration-500 ease-in-out ${
// //               currentStep === 1
// //                 ? 'opacity-100 translate-x-0'
// //                 : 'opacity-0 translate-x-full absolute'
// //             }`}
// //           >
// //             <AddLandListingForm 
// //               selectedCoords={selectedCoords} 
// //               title="1. Fill Property Details"
// //               onFormVerified={handleFormVerified}
// //               isVerifying={isStep1Verified}
// //             />
// //           </div>

// //           {/* Step 2: Select Property Location on Map */}
// //           <div
// //             className={`transition-all duration-500 ease-in-out ${
// //               currentStep === 2
// //                 ? 'opacity-100 translate-x-0'
// //                 : 'opacity-0 -translate-x-full absolute'
// //             }`}
// //           >
// //             <div className="space-y-4">
// //               <LandMapSelector 
// //                 onAreaSelect={handleMapSelect}
// //                 title="2. Select Property Location on Map"
// //               />
              
// //               {/* Back Button for Step 2 */}
// //               <div className="flex justify-start pt-4">
// //                 <button
// //                   onClick={handleBackToStep1}
// //                   className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition"
// //                 >
// //                   ← Back to Step 1
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddLandPage;







// import React, { useState, useEffect } from 'react';
// import AddLandListingForm from '../../components/AddLandListingForm';
// import LandMapSelector from '../../components/LandMapSelector';
// import { Loader2 } from 'lucide-react';

// // Import Leaflet's CSS
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-draw/dist/leaflet.draw.css';

// const AddLandPage = () => {
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
              
//               {/* Back Button for Step 2 */}
//               <div className="flex justify-start pt-4">
//                 <button
//                   onClick={handleBackToStep1}
//                   className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition"
//                 >
//                   ← Back to Step 1
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
import AddLandListingForm from '../../components/AddLandListingForm';
import LandMapSelector from '../../components/LandMapSelector';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; {/* --- ADD THIS --- */}

// Import Leaflet's CSS
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const AddLandPage = () => {
  const navigate = useNavigate(); {/* --- ADD THIS --- */}

  // State to hold the coordinates selected from the map
  const [selectedCoords, setSelectedCoords] = useState({ lat: null, lng: null });
  
  // State to manage current step
  const [currentStep, setCurrentStep] = useState(1);
  
  // State to track if step 1 is verified
  const [isStep1Verified, setIsStep1Verified] = useState(false);
  
  // State to track if property is already verified
  const [isPropertyVerified, setIsPropertyVerified] = useState(false);
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  
  // State for error
  const [error, setError] = useState(null);

  // Fetch verification status on page load
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'http://localhost:5000/api/properties/verification-status',
          {
            credentials: 'include',
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsPropertyVerified(data.isVerified || false);
          if (data.isVerified) {
            setCurrentStep(2);
          }
        }
      } catch (err) {
        console.error('Error fetching verification status:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerificationStatus();
  }, []);

  // Handler to update the coordinates from the map component
  const handleMapSelect = (coords) => {
    setSelectedCoords(coords);
  };

  // Handler when form verification is complete
  const handleFormVerified = () => {
    setIsStep1Verified(true);
    setTimeout(() => {
      setCurrentStep(2);
      setIsPropertyVerified(true);
    }, 500);
  };

  // Handler to go back to step 1
  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  // Handler to click on step indicator
  const handleStepClick = (stepNumber) => {
    if (stepNumber === 1) {
      setCurrentStep(1);
    } else if (stepNumber === 2 && (isStep1Verified || isPropertyVerified)) {
      setCurrentStep(2);
    }
  };

  // {/* --- ADD THIS HANDLER --- */}
  const handleFinishAndNavigate = () => {
    // Here you could add any final save logic (e.g., save the selectedCoords)
    // For now, just navigate
    navigate('/owner-dashboard/my-lands');
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
        {/* Stepper Navigation - Show only on step 2 */}
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

        {/* Content Area with Animation */}
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
              selectedCoords={selectedCoords} 
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
                onAreaSelect={handleMapSelect}
                title="2. Select Property Location on Map"
              />
              
              {/* --- MODIFIED THIS SECTION --- */}
              {/* Button Container for Step 2 */}
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={handleBackToStep1}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition"
                >
                  ← Back to Step 1
                </button>

                {/* --- THIS IS THE NEW BUTTON --- */}
                <button
                  onClick={handleFinishAndNavigate}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Finish & View My Lands →
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