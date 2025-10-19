// // // src/App.jsx
// // import React from 'react';
// // import { Routes, Route, Navigate } from 'react-router-dom';
// // import { useAuth } from './context/AuthContext';

// // import Header from './components/Header';
// // import ProtectedRoute from './components/ProtectedRoute';
// // import PublicRoute from './components/PublicRoute';

// // // Contexts
// // import { BuyerProvider } from './context/BuyerContext';

// // // Public Pages
// // import SignUpPage from './pages/auth/SignUpPage';
// // import LoginPage from './pages/auth/LoginPage';
// // import MainDashboard from './pages/Dashboard/MainDashboard';
// // import LandGalleryPage from './pages/marketplace/LandGalleryPage';
// // import AboutUsPage from './pages/AboutUsPage';
// // import FAQPage from './pages/FAQPage';
// // import ContactUsPage from './pages/ContactUsPage';
// // import GovernmentRegistryPage from './pages/government/GovernmentRegistryPage';

// // // Buyer Pages
// // import BuyerDashboard from './pages/Buyer/BuyerDashboard';
// // import BuyerVerification from './pages/Buyer/BuyerVerification';
// // import MarketplaceBrowse from './pages/Buyer/MarketplaceBrowse';
// // import PropertyDetails from './pages/Buyer/PropertyDetails';
// // import PurchaseHistory from './pages/Buyer/PurchaseHistory';
// // import BuyerProfile from './pages/Buyer/BuyerProfile';
// // import BuyerProperties from './pages/Buyer/BuyerProperties';

// // // Owner Pages
// // import OwnerDashboard from './pages/owner/OwnerDashboard';
// // import OwnerProfile from './pages/owner/OwnerProfile';
// // import AddLandPage from './pages/owner/AddLandPage';
// // import MyLandsPage from './pages/owner/MyLandsPage';
// // import RequestsPage from './pages/owner/RequestsPage';
// // // import ReceivedRequestsPage from './pages/owner/ReceivedRequestsPage';
// // // import SentRequestsPage from './pages/owner/SentRequestsPage';

// // // LDR Page

// // import LdrLayout from './components/LdrLayout';
// // import RegisterProperty from './pages/LDR/RegisterProperty';
// // import VerifiedUsers from './pages/LDR/VerifiedUsers';


// // // Other
// // import TaskDetailsPage from './pages/TaskDetailsPage';

// // const HomeRedirect = () => {
// //   const { isAuthenticated, user } = useAuth();

// //   if (isAuthenticated && user?.role) {
// //     const roleLower = user.role.toLowerCase();
// //     if (roleLower.includes('buyer')) return <Navigate to="/buyer-dashboard" replace />;
// //     if (roleLower.includes('owner') || roleLower.includes('land owner')) return <Navigate to="/owner-dashboard" replace />;
// //     if (roleLower.includes('verifier')) return <Navigate to="/ldr-dashboard" replace />;
// //   }

// //   return <MainDashboard />;
// // };

// // const LandDetailsPage = () => (
// //   <div className="py-24 text-center">Land Details Page Coming Soon!</div>
// // );

// // function App() {
// //   return (
// //     <BuyerProvider>
// //       <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
// //         <Header />
// //         <div className="flex-grow">
// //           <Routes>
// //             {/* Public Routes */}
// //             <Route element={<PublicRoute />}>
// //               <Route path="/register" element={<SignUpPage />} />
// //               <Route path="/login" element={<LoginPage />} />
// //             </Route>

// //             {/* General Public Pages */}
// //             <Route path="/" element={<HomeRedirect />} />
// //             <Route path="/about-us" element={<AboutUsPage />} />
// //             <Route path="/faq" element={<FAQPage />} />
// //             <Route path="/contact-us" element={<ContactUsPage />} />
// //             <Route path="/marketplace" element={<LandGalleryPage />} />
// //             <Route path="/land/:id" element={<LandDetailsPage />} />
// //             <Route path="/government-registry" element={<GovernmentRegistryPage />} />

// //             {/* Protected Routes */}
// //             <Route element={<ProtectedRoute />}>
// //               {/* Buyer Routes */}
// //               <Route path="/buyer-dashboard" element={<BuyerDashboard />}>
// //                 <Route index element={<BuyerProfile />} />
// //                 <Route path="profile" element={<BuyerProfile />} />
// //                 <Route path="verification" element={<BuyerVerification />} />
// //                 <Route path="browse" element={<MarketplaceBrowse />} />
// //                 <Route path="property/:id" element={<PropertyDetails />} />
// //                 <Route path="purchase-history" element={<PurchaseHistory />} />
// //                 <Route path="properties" element={<BuyerProperties />} />
// //               </Route>

// //               {/* Owner Routes */}
// //               <Route path="/owner-dashboard" element={<OwnerDashboard />}>
// //                 <Route index element={<OwnerProfile />} />
// //                 <Route path="profile" element={<OwnerProfile />} />
// //                 <Route path="add-land" element={<AddLandPage />} />
// //                 <Route path="my-lands" element={<MyLandsPage />} />
// //                 <Route path="requests" element={<RequestsPage />} />
             
                
// //               </Route>

// //               {/* LDR Routes */}
// //               <Route path="/ldr-dashboard" element={
// //   <LdrLayout activeTab="register">
// //     <RegisterProperty />
// //   </LdrLayout>
// // } />
// // <Route path="/ldr/verified-users" element={
// //   <LdrLayout activeTab="verified">
// //     <VerifiedUsers />
// //   </LdrLayout>
// // } />
    


// //               {/* Task Details */}
// //               <Route path="/task/:taskId" element={<TaskDetailsPage />} />
// //             </Route>
// //           </Routes>
// //         </div>
// //       </div>
// //     </BuyerProvider>
// //   );
// // }

// // export default App;
// // src/App.jsx
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';

// import Header from './components/Header';
// import ProtectedRoute from './components/ProtectedRoute';
// import PublicRoute from './components/PublicRoute';

// // Contexts
// import { BuyerProvider } from './context/BuyerContext';

// // Public Pages
// import SignUpPage from './pages/auth/SignUpPage';
// import LoginPage from './pages/auth/LoginPage';
// import MainDashboard from './pages/Dashboard/MainDashboard';
// import LandGalleryPage from './pages/marketplace/LandGalleryPage';
// import AboutUsPage from './pages/AboutUsPage';
// import FAQPage from './pages/FAQPage';
// import ContactUsPage from './pages/ContactUsPage';
// import GovernmentRegistryPage from './pages/government/GovernmentRegistryPage';

// // Buyer Pages
// import BuyerDashboard from './pages/Buyer/BuyerDashboard';
// import BuyerVerification from './pages/Buyer/BuyerVerification';
// import MarketplaceBrowse from './pages/Buyer/MarketplaceBrowse';
// import PropertyDetails from './pages/Buyer/PropertyDetails';
// import PurchaseHistory from './pages/Buyer/PurchaseHistory';
// import BuyerProfile from './pages/Buyer/BuyerProfile';
// import BuyerProperties from './pages/Buyer/BuyerProperties';

// // Owner Pages
// import OwnerDashboard from './pages/owner/OwnerDashboard';
// import OwnerProfile from './pages/owner/OwnerProfile';
// import AddLandPage from './pages/owner/AddLandPage';
// import MyLandsPage from './pages/owner/MyLandsPage';
// import RequestsPage from './pages/owner/RequestsPage';

// // Verifier/LDR Pages
// import LdrLayout from './components/LdrLayout';
// import RegisterProperty from './pages/LDR/RegisterProperty';
// import VerifiedUsers from './pages/LDR/VerifiedUsers';
// import VerifierDashboardPage from './pages/verifier/VerifierDashboardPage';
// import VerifyUsersPage from './pages/auth/VerifyUsersPage';
// import VerifyLandsPage from './pages/verifier/VerifyLandsPage';
// import TransferOwnershipPage from './pages/owner/TransferOwnershipPage';

// // Other
// import TaskDetailsPage from './pages/TaskDetailsPage';
// import PendingVerificationPage from './pages/common/PendingVerificationPage';
// import VerifierSetupPage from './pages/auth/VerifierSetupPage';

// const HomeRedirect = () => {
//   const { isAuthenticated, user } = useAuth();

//   if (isAuthenticated && user?.role) {
//     const role = user.role.toLowerCase();
//     if (role.includes('buyer')) return <Navigate to="/buyer-dashboard" replace />;
//     if (role.includes('owner') || role.includes('land owner')) return <Navigate to="/owner-dashboard" replace />;
//     if (role.includes('verifier')) return <Navigate to="/ldr-dashboard" replace />;
//   }

//   return <MainDashboard />;
// };

// const LandDetailsPage = () => (
//   <div className="py-24 text-center">Land Details Page Coming Soon!</div>
// );

// function App() {
//   return (
//     <BuyerProvider>
//       <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
//         <Header />
//         <div className="flex-grow">
//           <Routes>
//             {/* Public Routes with PublicRoute wrapper */}
//             <Route element={<PublicRoute />}>
//               <Route path="/register" element={<SignUpPage />} />
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/pending-verification" element={<PendingVerificationPage />} />
//               <Route path="/setup-verifier" element={<VerifierSetupPage />} />
//             </Route>

//             {/* General Public Routes */}
//             <Route path="/" element={<HomeRedirect />} />
//             <Route path="/about-us" element={<AboutUsPage />} />
//             <Route path="/faq" element={<FAQPage />} />
//             <Route path="/contact-us" element={<ContactUsPage />} />
//             <Route path="/marketplace" element={<LandGalleryPage />} />
//             <Route path="/land/:id" element={<LandDetailsPage />} />
//             <Route path="/government-registry" element={<GovernmentRegistryPage />} />

//             {/* Protected Routes */}
//             <Route element={<ProtectedRoute />}>
//               {/* Buyer Routes */}
//               <Route path="/buyer-dashboard" element={<BuyerDashboard />}>
//                 <Route index element={<BuyerProfile />} />
//                 <Route path="profile" element={<BuyerProfile />} />
//                 <Route path="verification" element={<BuyerVerification />} />
//                 <Route path="browse" element={<MarketplaceBrowse />} />
//                 <Route path="property/:id" element={<PropertyDetails />} />
//                 <Route path="purchase-history" element={<PurchaseHistory />} />
//                 <Route path="properties" element={<BuyerProperties />} />
//               </Route>

//               {/* Owner Routes */}
//               <Route path="/owner-dashboard" element={<OwnerDashboard />}>
//                 <Route index element={<OwnerProfile />} />
//                 <Route path="profile" element={<OwnerProfile />} />
//                 <Route path="add-land" element={<AddLandPage />} />
//                 <Route path="my-lands" element={<MyLandsPage />} />
//                 <Route path="requests" element={<RequestsPage />} />
//               </Route>

//               {/* LDR/Verifier Routes - Using LdrLayout from second file */}
//               <Route path="/ldr-dashboard" element={
//                 <LdrLayout activeTab="register">
//                   <RegisterProperty />
//                 </LdrLayout>
//               } />
//               <Route path="/ldr/verified-users" element={
//                 <LdrLayout activeTab="verified">
//                   <VerifiedUsers />
//                 </LdrLayout>
//               } />

//               {/* Additional Verifier Routes from first file */}
//               <Route path="/verifier-dashboard" element={<VerifierDashboardPage />} />
//               <Route path="/verifier/users" element={<VerifyUsersPage />} />
//               <Route path="/verifier/lands" element={<VerifyLandsPage />} />
//               <Route path="/verifier/transfers" element={<TransferOwnershipPage />} />

//               {/* Task Details */}
//               <Route path="/task/:taskId" element={<TaskDetailsPage />} />
//             </Route>
//           </Routes>
//         </div>
//       </div>
//     </BuyerProvider>
//   );
// }

// export default App;








  // src/App.jsx
  import React from 'react';
  import { Routes, Route, Navigate } from 'react-router-dom';
  import { useAuth } from './context/AuthContext';

  import Header from './components/Header';
  import ProtectedRoute from './components/ProtectedRoute';
  import PublicRoute from './components/PublicRoute';

  // Contexts
  import { BuyerProvider } from './context/BuyerContext';

  // Public Pages
  import SignUpPage from './pages/auth/SignUpPage';
  import LoginPage from './pages/auth/LoginPage';
  import MainDashboard from './pages/Dashboard/MainDashboard';
  import LandGalleryPage from './pages/marketplace/LandGalleryPage';
  import AboutUsPage from './pages/AboutUsPage';
  import FAQPage from './pages/FAQPage';
  import ContactUsPage from './pages/ContactUsPage';
  import GovernmentRegistryPage from './pages/government/GovernmentRegistryPage';

  // Buyer Pages
  import BuyerDashboard from './pages/Buyer/BuyerDashboard';
  import BuyerVerification from './pages/Buyer/BuyerVerification';
  import MarketplaceBrowse from './pages/Buyer/MarketplaceBrowse';
  import PropertyDetails from './pages/Buyer/PropertyDetails';
  import PurchaseHistory from './pages/Buyer/PurchaseHistory';
  import BuyerProfile from './pages/Buyer/BuyerProfile';
  import BuyerProperties from './pages/Buyer/BuyerProperties';

  // Owner Pages
  import OwnerDashboard from './pages/owner/OwnerDashboard';
  import OwnerProfile from './pages/owner/OwnerProfile';
  import AddLandPage from './pages/owner/AddLandPage';
  import MyLandsPage from './pages/owner/MyLandsPage';
  import ReceivedRequestsPage from './pages/verifier/ReceivedRequestsPage';
  import SentRequestsPage from './pages/verifier/SentRequestsPage';
  import TransferOwnershipPage from './pages/owner/TransferOwnershipPage';

  // Verifier Pages
  import VerifierDashboardPage from './pages/verifier/VerifierDashboardPage';
  import VerifyUsersPage from './pages/auth/VerifyUsersPage';
  import VerifyLandsPage from './pages/verifier/VerifyLandsPage';

  // LDR Pages (wrapped with LdrLayout)
  import LdrLayout from './components/LdrLayout';
  import RegisterProperty from './pages/LDR/RegisterProperty';
  import VerifiedUsers from './pages/LDR/VerifiedUsers';

  // Other
  import TaskDetailsPage from './pages/TaskDetailsPage';
  import PendingVerificationPage from './pages/common/PendingVerificationPage';
  import VerifierSetupPage from './pages/auth/VerifierSetupPage';

  const HomeRedirect = () => {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated && user?.role) {
      const role = user.role.toLowerCase();
      if (role.includes('buyer')) return <Navigate to="/buyer-dashboard" replace />;
      if (role.includes('owner') || role.includes('land owner')) return <Navigate to="/owner-dashboard" replace />;
      if (role.includes('verifier')) return <Navigate to="/verifier-dashboard" replace />;
    }

    return <MainDashboard />;
  };

  const LandDetailsPage = () => (
    <div className="py-24 text-center">Land Details Page Coming Soon!</div>
  );

  function App() {
    return (
      <BuyerProvider>
        <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
          <Header />
          <div className="flex-grow">
            <Routes>
              {/* Public Routes with PublicRoute wrapper */}
              <Route element={<PublicRoute />}>
                <Route path="/register" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/pending-verification" element={<PendingVerificationPage />} />
                <Route path="/setup-verifier" element={<VerifierSetupPage />} />
              </Route>

              {/* General Public Routes */}
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/marketplace" element={<LandGalleryPage />} />
              <Route path="/land/:id" element={<LandDetailsPage />} />
              <Route path="/government-registry" element={<GovernmentRegistryPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Buyer Routes */}
                <Route path="/buyer-dashboard" element={<BuyerDashboard />}>
                  <Route index element={<BuyerProfile />} />
                  <Route path="profile" element={<BuyerProfile />} />
                  <Route path="verification" element={<BuyerVerification />} />
                  <Route path="browse" element={<MarketplaceBrowse />} />
                  <Route path="property/:id" element={<PropertyDetails />} />
                  <Route path="purchase-history" element={<PurchaseHistory />} />
                  <Route path="properties" element={<BuyerProperties />} />
                </Route>

                {/* Owner Routes */}
                <Route path="/owner-dashboard" element={<OwnerDashboard />}>
                  <Route index element={<OwnerProfile />} />
                  <Route path="profile" element={<OwnerProfile />} />
                  <Route path="add-land" element={<AddLandPage />} />
                  <Route path="my-lands" element={<MyLandsPage />} />
                  <Route path="received-requests" element={<ReceivedRequestsPage />} />
                  <Route path="sent-requests" element={<SentRequestsPage />} />
                </Route>

                {/* Verifier/LDR Routes - All 4 pages with consistent header */}
                <Route path="/verifier-dashboard" element={
                  <LdrLayout>
                    <VerifierDashboardPage />
                  </LdrLayout>
                } />
                
                <Route path="/verifier/users" element={
                  <LdrLayout>
                    <VerifyUsersPage />
                  </LdrLayout>
                } />
                
                <Route path="/register-property" element={
                  <LdrLayout>
                    <RegisterProperty />
                  </LdrLayout>
                } />
                
                <Route path="/ldr/verified-users" element={
                  <LdrLayout>
                    <VerifiedUsers />
                  </LdrLayout>
                } />

                {/* Old Verifier Routes (if you still need them) */}
                <Route path="/verifier/lands" element={<VerifyLandsPage />} />
                <Route path="/verifier/transfers" element={<TransferOwnershipPage />} />

                <Route path="/task/:taskId" element={<TaskDetailsPage />} />
              </Route>
            </Routes>
          </div>
        </div>
      </BuyerProvider>
    );
  }

  export default App;