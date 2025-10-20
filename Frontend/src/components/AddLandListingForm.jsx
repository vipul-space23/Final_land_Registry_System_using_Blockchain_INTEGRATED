// // // import { useState } from "react";
// // // import { FileCheck2, Loader2, ShieldCheck, ShieldX } from "lucide-react";
// // // import { BrowserProvider } from "ethers"; // ✅ v6 import

// // // export default function AddLandListingForm() {
// // //   const [district, setDistrict] = useState("");
// // //   const [surveyNumber, setSurveyNumber] = useState("");
// // //   const [motherDeed, setMotherDeed] = useState(null);
// // //   const [encumbranceCert, setEncumbranceCert] = useState(null);
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const [feedback, setFeedback] = useState({ type: "", message: "" });

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     if (!district || !surveyNumber || !motherDeed || !encumbranceCert) {
// // //       setFeedback({
// // //         type: "error",
// // //         message: "Please fill in all fields and upload both documents.",
// // //       });
// // //       return;
// // //     }

// // //     setIsLoading(true);
// // //     setFeedback({ type: "", message: "" });

// // //     try {
// // //       if (!window.ethereum) throw new Error("MetaMask is not installed.");

// // //       // ✅ Ethers v6 way
// // //       const provider = new BrowserProvider(window.ethereum);
// // //       await provider.send("eth_requestAccounts", []);
// // //       const signer = await provider.getSigner();
// // //       const walletAddress = await signer.getAddress();

// // //       const messageToSign = `I am verifying the property with Survey Number: ${surveyNumber}.`;
// // //       const signature = await signer.signMessage(messageToSign);

// // //       const formData = new FormData();
// // //       formData.append("district", district);
// // //       formData.append("surveyNumber", surveyNumber);
// // //       formData.append("motherDeed", motherDeed);
// // //       formData.append("encumbranceCertificate", encumbranceCert);
// // //       formData.append("walletAddress", walletAddress);
// // //       formData.append("signature", signature);
// // //       formData.append("signedMessage", messageToSign);

// // //       const response = await fetch(
// // //         "http://localhost:5000/api/properties/verify-documents",
// // //         {
// // //           method: "POST",
// // //           body: formData,
// // //           credentials: "include",
// // //         }
// // //       );

// // //       const result = await response.json();
// // //       if (!response.ok)
// // //         throw new Error(result.message || "Verification failed.");

// // //       setFeedback({ type: "success", message: result.message });
// // //     } catch (error) {
// // //       setFeedback({ type: "error", message: error.message });
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const FeedbackMessage = () => {
// // //     if (!feedback.message) return null;
// // //     const isSuccess = feedback.type === "success";
// // //     return (
// // //       <div
// // //         className={`p-4 mb-4 border rounded-md flex items-center space-x-3 ${
// // //           isSuccess
// // //             ? "bg-green-100 border-green-400 text-green-800"
// // //             : "bg-red-100 border-red-400 text-red-800"
// // //         }`}
// // //       >
// // //         {isSuccess ? (
// // //           <ShieldCheck className="h-5 w-5" />
// // //         ) : (
// // //           <ShieldX className="h-5 w-5" />
// // //         )}
// // //         <span>{feedback.message}</span>
// // //       </div>
// // //     );
// // //   };

// // //   return (
// // //     <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md my-12">
// // //       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
// // //         <FileCheck2 className="inline-block h-8 w-8 mr-2" />
// // //         Verify Your Property Documents
// // //       </h2>
// // //       <form onSubmit={handleSubmit} className="space-y-6">
// // //         <FeedbackMessage />

// // //         <div>
// // //           <label
// // //             htmlFor="district"
// // //             className="block text-sm font-medium text-gray-700"
// // //           >
// // //             District *
// // //           </label>
// // //           <input
// // //             type="text"
// // //             id="district"
// // //             value={district}
// // //             onChange={(e) => setDistrict(e.target.value)}
// // //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //             required
// // //           />
// // //         </div>

// // //         <div>
// // //           <label
// // //             htmlFor="surveyNumber"
// // //             className="block text-sm font-medium text-gray-700"
// // //           >
// // //             Survey Number *
// // //           </label>
// // //           <input
// // //             type="text"
// // //             id="surveyNumber"
// // //             value={surveyNumber}
// // //             onChange={(e) => setSurveyNumber(e.target.value)}
// // //             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //             required
// // //           />
// // //         </div>

// // //         <div>
// // //           <label
// // //             htmlFor="motherDeed"
// // //             className="block text-sm font-medium text-gray-700"
// // //           >
// // //             Mother Deed (PDF) *
// // //           </label>
// // //           <input
// // //             type="file"
// // //             id="motherDeed"
// // //             accept=".pdf"
// // //             onChange={(e) => setMotherDeed(e.target.files[0])}
// // //             className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
// // //             required
// // //           />
// // //         </div>

// // //         <div>
// // //           <label
// // //             htmlFor="encumbranceCert"
// // //             className="block text-sm font-medium text-gray-700"
// // //           >
// // //             Encumbrance Certificate (PDF) *
// // //           </label>
// // //           <input
// // //             type="file"
// // //             id="encumbranceCert"
// // //             accept=".pdf"
// // //             onChange={(e) => setEncumbranceCert(e.target.files[0])}
// // //             className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
// // //             required
// // //           />
// // //         </div>

// // //         <button
// // //           type="submit"
// // //           disabled={isLoading}
// // //           className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
// // //         >
// // //           {isLoading ? (
// // //             <Loader2 className="animate-spin" />
// // //           ) : (
// // //             "Confirm & Verify Documents"
// // //           )}
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // }

// // import { useState } from "react";
// // import { FileCheck2, Loader2, ShieldCheck, ShieldX } from "lucide-react";
// // import { BrowserProvider } from "ethers";

// // // Accept selectedCoords and title as props
// // export default function AddLandListingForm({ selectedCoords, title }) {
// //   const [district, setDistrict] = useState("");
// //   const [surveyNumber, setSurveyNumber] = useState("");
// //   const [motherDeed, setMotherDeed] = useState(null);
// //   const [encumbranceCert, setEncumbranceCert] = useState(null);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [feedback, setFeedback] = useState({ type: "", message: "" });

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!district || !surveyNumber || !motherDeed || !encumbranceCert) {
// //       setFeedback({
// //         type: "error",
// //         message: "Please fill in all fields and upload both documents.",
// //       });
// //       return;
// //     }
    
// //     // Add validation for map selection
// //     if (!selectedCoords || !selectedCoords.lat || !selectedCoords.lng) {
// //       setFeedback({
// //         type: "error",
// //         message: "Please select the property area on the map below.",
// //       });
// //       return;
// //     }

// //     setIsLoading(true);
// //     setFeedback({ type: "", message: "" });

// //     try {
// //       if (!window.ethereum) throw new Error("MetaMask is not installed.");

// //       const provider = new BrowserProvider(window.ethereum);
// //       await provider.send("eth_requestAccounts", []);
// //       const signer = await provider.getSigner();
// //       const walletAddress = await signer.getAddress();

// //       const messageToSign = `I am verifying the property with Survey Number: ${surveyNumber}.`;
// //       const signature = await signer.signMessage(messageToSign);

// //       const formData = new FormData();
// //       formData.append("district", district);
// //       formData.append("surveyNumber", surveyNumber);
// //       formData.append("motherDeed", motherDeed);
// //       formData.append("encumbranceCertificate", encumbranceCert);
// //       formData.append("walletAddress", walletAddress);
// //       formData.append("signature", signature);
// //       formData.append("signedMessage", messageToSign);
// //       // Append coordinates to the form data
// //       formData.append("latitude", selectedCoords.lat);
// //       formData.append("longitude", selectedCoords.lng);


// //       const response = await fetch(
// //         "http://localhost:5000/api/properties/verify-documents",
// //         {
// //           method: "POST",
// //           body: formData,
// //           credentials: "include",
// //         }
// //       );

// //       const result = await response.json();
// //       if (!response.ok)
// //         throw new Error(result.message || "Verification failed.");

// //       setFeedback({ type: "success", message: result.message });
// //     } catch (error) {
// //       setFeedback({ type: "error", message: error.message });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const FeedbackMessage = () => {
// //     if (!feedback.message) return null;
// //     const isSuccess = feedback.type === "success";
// //     return (
// //       <div
// //         className={`p-4 mb-4 border rounded-md flex items-center space-x-3 ${
// //           isSuccess
// //             ? "bg-green-100 border-green-400 text-green-800"
// //             : "bg-red-100 border-red-400 text-red-800"
// //         }`}
// //       >
// //         {isSuccess ? (
// //           <ShieldCheck className="h-5 w-5" />
// //         ) : (
// //           <ShieldX className="h-5 w-5" />
// //         )}
// //         <span>{feedback.message}</span>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="max-w-4xl w-full mx-auto p-8 bg-white rounded-lg shadow-md">
// //       <h2 className="text-2xl font-bold text-gray-800 mb-6">
// //         <FileCheck2 className="inline-block h-8 w-8 mr-2 text-indigo-600" />
// //         {title || "Verify Your Property Documents"}
// //       </h2>
// //       <form onSubmit={handleSubmit} className="space-y-6">
// //         <FeedbackMessage />

// //         {/* Text Inputs */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           <div>
// //             <label htmlFor="district" className="block text-sm font-medium text-gray-700">
// //               District *
// //             </label>
// //             <input
// //               type="text" id="district" value={district} onChange={(e) => setDistrict(e.target.value)}
// //               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required
// //             />
// //           </div>
// //           <div>
// //             <label htmlFor="surveyNumber" className="block text-sm font-medium text-gray-700">
// //               Survey Number *
// //             </label>
// //             <input
// //               type="text" id="surveyNumber" value={surveyNumber} onChange={(e) => setSurveyNumber(e.target.value)}
// //               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required
// //             />
// //           </div>
// //         </div>

// //         {/* File Inputs */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div>
// //               <label htmlFor="motherDeed" className="block text-sm font-medium text-gray-700">
// //                 Mother Deed (PDF) *
// //               </label>
// //               <input
// //                 type="file" id="motherDeed" accept=".pdf" onChange={(e) => setMotherDeed(e.target.files[0])}
// //                 className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required
// //               />
// //             </div>
// //             <div>
// //               <label htmlFor="encumbranceCert" className="block text-sm font-medium text-gray-700">
// //                 Encumbrance Certificate (PDF) *
// //               </label>
// //               <input
// //                 type="file" id="encumbranceCert" accept=".pdf" onChange={(e) => setEncumbranceCert(e.target.files[0])}
// //                 className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required
// //               />
// //             </div>
// //         </div>

// //          {/* NEW: Coordinate Display Fields */}
// //         <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
// //              <h4 className="text-md font-semibold text-gray-700 mb-2">Property Coordinates</h4>
// //              <p className="text-sm text-gray-500 mb-4">These values are automatically filled when you select an area on the map below.</p>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div>
// //                     <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
// //                         Latitude
// //                     </label>
// //                     <input
// //                         type="text" id="latitude" value={selectedCoords?.lat || "Pending map selection..."} readOnly
// //                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
// //                     />
// //                 </div>
// //                 <div>
// //                     <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
// //                         Longitude
// //                     </label>
// //                     <input
// //                         type="text" id="longitude" value={selectedCoords?.lng || "Pending map selection..."} readOnly
// //                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
// //                     />
// //                 </div>
// //             </div>
// //         </div>

// //         <button
// //           type="submit" disabled={isLoading}
// //           className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
// //         >
// //           {isLoading ? (
// //             <Loader2 className="animate-spin" />
// //           ) : (
// //             "Confirm & Verify Documents"
// //           )}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }









// import { useState } from "react";
// import { FileCheck2, Loader2, ShieldCheck, ShieldX } from "lucide-react";
// import { BrowserProvider } from "ethers";

// // Accept selectedCoords, title, onFormVerified, isVerifying, and isAlreadyVerified as props
// export default function AddLandListingForm({ selectedCoords, title, onFormVerified, isVerifying, isAlreadyVerified }) {
//   const [district, setDistrict] = useState("");
//   const [surveyNumber, setSurveyNumber] = useState("");
//   const [motherDeed, setMotherDeed] = useState(null);
//   const [encumbranceCert, setEncumbranceCert] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [feedback, setFeedback] = useState({ type: "", message: "" });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!district || !surveyNumber || !motherDeed || !encumbranceCert) {
//       setFeedback({
//         type: "error",
//         message: "Please fill in all fields and upload both documents.",
//       });
//       return;
//     }

//     setIsLoading(true);
//     setFeedback({ type: "", message: "" });

//     try {
//       if (!window.ethereum) throw new Error("MetaMask is not installed.");

//       const provider = new BrowserProvider(window.ethereum);
//       await provider.send("eth_requestAccounts", []);
//       const signer = await provider.getSigner();
//       const walletAddress = await signer.getAddress();

//       const messageToSign = `I am verifying the property with Survey Number: ${surveyNumber}.`;
//       const signature = await signer.signMessage(messageToSign);

//       const formData = new FormData();
//       formData.append("district", district);
//       formData.append("surveyNumber", surveyNumber);
//       formData.append("motherDeed", motherDeed);
//       formData.append("encumbranceCertificate", encumbranceCert);
//       formData.append("walletAddress", walletAddress);
//       formData.append("signature", signature);
//       formData.append("signedMessage", messageToSign);

//       const response = await fetch(
//         "http://localhost:5000/api/properties/verify-documents",
//         {
//           method: "POST",
//           body: formData,
//           credentials: "include",
//         }
//       );

//       const result = await response.json();
//       if (!response.ok)
//         throw new Error(result.message || "Verification failed.");

//       setFeedback({ type: "success", message: result.message });
      
//       // Call the callback to trigger step transition
//       if (onFormVerified) {
//         onFormVerified();
//       }
//     } catch (error) {
//       setFeedback({ type: "error", message: error.message });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const FeedbackMessage = () => {
//     if (!feedback.message) return null;
//     const isSuccess = feedback.type === "success";
//     return (
//       <div
//         className={`p-4 mb-4 border rounded-md flex items-center space-x-3 ${
//           isSuccess
//             ? "bg-green-100 border-green-400 text-green-800"
//             : "bg-red-100 border-red-400 text-red-800"
//         }`}
//       >
//         {isSuccess ? (
//           <ShieldCheck className="h-5 w-5" />
//         ) : (
//           <ShieldX className="h-5 w-5" />
//         )}
//         <span>{feedback.message}</span>
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-4xl w-full mx-auto p-8 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">
//         <FileCheck2 className="inline-block h-8 w-8 mr-2 text-indigo-600" />
//         {title || "Verify Your Property Documents"}
//       </h2>

//       {/* Already Verified Message - Show instead of form */}
//       {isAlreadyVerified ? (
//         <div className="space-y-6">
//           <div className="p-6 border rounded-lg flex items-start space-x-4 bg-green-50 border-green-400">
//             <ShieldCheck className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
//             <div>
//               <p className="font-semibold text-green-800 text-lg">Property Already Verified ✓</p>
//               <p className="text-green-700 text-sm mt-1">Great! Your property documents have been successfully verified. Now proceed to select the property location on the map to complete the registration.</p>
//             </div>
//           </div>

//           <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
//             <p className="text-blue-800 text-sm">
//               <span className="font-semibold">Next Step:</span> Select your property location on the map below to mark the exact coordinates of your land.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => onFormVerified && onFormVerified()}
//             className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md shadow-sm text-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
//           >
//             Select Location on Map →
//           </button>
//         </div>
//       ) : (
//         /* Original Form - Show when not verified */
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <FeedbackMessage />

//           {/* Text Inputs */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label htmlFor="district" className="block text-sm font-medium text-gray-700">
//                 District *
//               </label>
//               <input
//                 type="text" id="district" value={district} onChange={(e) => setDistrict(e.target.value)}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required
//               />
//             </div>
//             <div>
//               <label htmlFor="surveyNumber" className="block text-sm font-medium text-gray-700">
//                 Survey Number *
//               </label>
//               <input
//                 type="text" id="surveyNumber" value={surveyNumber} onChange={(e) => setSurveyNumber(e.target.value)}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required
//               />
//             </div>
//           </div>

//           {/* File Inputs */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="motherDeed" className="block text-sm font-medium text-gray-700">
//                   Mother Deed (PDF) *
//                 </label>
//                 <input
//                   type="file" id="motherDeed" accept=".pdf" onChange={(e) => setMotherDeed(e.target.files[0])}
//                   className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="encumbranceCert" className="block text-sm font-medium text-gray-700">
//                   Encumbrance Certificate (PDF) *
//                 </label>
//                 <input
//                   type="file" id="encumbranceCert" accept=".pdf" onChange={(e) => setEncumbranceCert(e.target.files[0])}
//                   className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required
//                 />
//               </div>
//           </div>

//           <div className="flex gap-4">
//             <button
//               type="button"
//               onClick={() => onFormVerified && onFormVerified()}
//               className="flex-1 py-3 px-4 border-2 border-indigo-600 rounded-md shadow-sm text-lg font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Next →
//             </button>
//             <button
//               type="submit" 
//               disabled={isLoading || isVerifying}
//               className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading || isVerifying ? (
//                 <Loader2 className="animate-spin" />
//               ) : (
//                 "Confirm & Verify Documents"
//               )}
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }





import { useState } from "react";
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { FileCheck2, Loader2, ShieldCheck, ShieldX } from "lucide-react";
import { BrowserProvider } from "ethers";

// Accept selectedCoords, title, onFormVerified, isVerifying, and isAlreadyVerified as props
export default function AddLandListingForm({ selectedCoords, title, onFormVerified, isVerifying, isAlreadyVerified }) {
  const { user } = useAuth(); // Use context to get user info and token
  const [district, setDistrict] = useState("");
  const [surveyNumber, setSurveyNumber] = useState("");
  const [motherDeed, setMotherDeed] = useState(null);
  const [encumbranceCert, setEncumbranceCert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!district || !surveyNumber || !motherDeed || !encumbranceCert) {
      setFeedback({
        type: "error",
        message: "Please fill in all fields and upload both documents.",
      });
      return;
    }

    setIsLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed.");

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      const messageToSign = `I am verifying the property with Survey Number: ${surveyNumber}.`;
      const signature = await signer.signMessage(messageToSign);

      const formData = new FormData();
      formData.append("district", district);
      formData.append("surveyNumber", surveyNumber);
      formData.append("motherDeed", motherDeed);
      formData.append("encumbranceCertificate", encumbranceCert);
      formData.append("walletAddress", walletAddress);
      formData.append("signature", signature);
      formData.append("signedMessage", messageToSign);
      
      // --- FIX: Get token from AuthContext ---
      const token = user?.token;
      if (!token) throw new Error("Authentication token not found. Please log in again.");

      const response = await fetch(
        "http://localhost:5000/api/properties/verify-documents",
        {
          method: "POST",
          body: formData,
          // --- FIX: Send token in Authorization header ---
          headers: {
            'Authorization': `Bearer ${token}`
          }
          // credentials: "include", // <-- REMOVE THIS
        }
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Verification failed.");

      setFeedback({ type: "success", message: result.message });
      
      // Call the callback to trigger step transition
      if (onFormVerified) {
        onFormVerified();
      }
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const FeedbackMessage = () => {
    if (!feedback.message) return null;
    const isSuccess = feedback.type === "success";
    return (
      <div
        className={`p-4 mb-4 border rounded-md flex items-center space-x-3 ${
          isSuccess
            ? "bg-green-100 border-green-400 text-green-800"
            : "bg-red-100 border-red-400 text-red-800"
        }`}
      >
        {isSuccess ? (
          <ShieldCheck className="h-5 w-5" />
        ) : (
          <ShieldX className="h-5 w-5" />
        )}
        <span>{feedback.message}</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        <FileCheck2 className="inline-block h-8 w-8 mr-2 text-indigo-600" />
        {title || "Verify Your Property Documents"}
      </h2>

      {/* Already Verified Message - Show instead of form */}
      {isAlreadyVerified ? (
        <div className="space-y-6">
          <div className="p-6 border rounded-lg flex items-start space-x-4 bg-green-50 border-green-400">
            <ShieldCheck className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-green-800 text-lg">Property Already Verified ✓</p>
              <p className="text-green-700 text-sm mt-1">Great! Your property documents have been successfully verified. Now proceed to select the property location on the map to complete the registration.</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">Next Step:</span> Select your property location on the map below to mark the exact coordinates of your land.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onFormVerified && onFormVerified()}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md shadow-sm text-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            Select Location on Map →
          </button>
        </div>
      ) : (
        /* Original Form - Show when not verified */
        <form onSubmit={handleSubmit} className="space-y-6">
          <FeedbackMessage />

          {/* Text Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                District *
              </label>
              <input
                type="text" id="district" value={district} onChange={(e) => setDistrict(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required
              />
            </div>
            <div>
              <label htmlFor="surveyNumber" className="block text-sm font-medium text-gray-700">
                Survey Number *
              </label>
              <input
                type="text" id="surveyNumber" value={surveyNumber} onChange={(e) => setSurveyNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required
              />
            </div>
          </div>

          {/* File Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="motherDeed" className="block text-sm font-medium text-gray-700">
                  Mother Deed (PDF) *
                </label>
                <input
                  type="file" id="motherDeed" accept=".pdf" onChange={(e) => setMotherDeed(e.target.files[0])}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required
                />
              </div>
              <div>
                <label htmlFor="encumbranceCert" className="block text-sm font-medium text-gray-700">
                  Encumbrance Certificate (PDF) *
                </label>
                <input
                  type="file" id="encumbranceCert" accept=".pdf" onChange={(e) => setEncumbranceCert(e.target.files[0])}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required
                />
              </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onFormVerified && onFormVerified()}
              className="flex-1 py-3 px-4 border-2 border-indigo-600 rounded-md shadow-sm text-lg font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Next →
            </button>
            <button
              type="submit" 
              disabled={isLoading || isVerifying}
              className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || isVerifying ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Confirm & Verify Documents"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
