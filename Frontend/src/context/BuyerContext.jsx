// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import { useAuth } from "./AuthContext";

// const BuyerContext = createContext(null);

// export const BuyerProvider = ({ children }) => {
//   const { user, isAuthenticated, token } = useAuth();
//   const [isVerified, setIsVerified] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const getUserId = (userObj) => userObj?.id || userObj?._id || null;
//   const getLocalKycStatus = (userObj) => userObj?.kycStatus === "verified";

//   const fetchKycStatus = useCallback(async () => {
//     const userId = getUserId(user);
//     if (!isAuthenticated || !userId || !token) {
//       setIsVerified(getLocalKycStatus(user));
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("http://localhost:5000/api/kyc/status", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) {
//         const errorText = await response.json();
//         throw new Error(errorText.message || `Status: ${response.status}`);
//       }
//       const data = await response.json();
//       setIsVerified(data.kycStatus === "verified");
//     } catch (err) {
//       console.error("KYC fetch error:", err);
//       setError("Could not fetch KYC status. Using local fallback.");
//       setIsVerified(getLocalKycStatus(user));
//     } finally {
//       setLoading(false);
//     }
//   }, [isAuthenticated, user, token]);

//   useEffect(() => {
//     fetchKycStatus();
//   }, [fetchKycStatus]);

//   return (
//     <BuyerContext.Provider value={{ isVerified, loading, error, refreshKycStatus: fetchKycStatus }}>
//       {children}
//     </BuyerContext.Provider>
//   );
// };

// export const useBuyer = () => {
//   const context = useContext(BuyerContext);
//   if (!context) throw new Error("useBuyer must be used within BuyerProvider");
//   return context;
// };
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const BuyerContext = createContext(null);

export const BuyerProvider = ({ children }) => {
  const { user, isAuthenticated, token } = useAuth(); // Use token from AuthContext

  // --- State for KYC (Existing) ---
  const [isKycVerified, setIsKycVerified] = useState(false);
  const [kycLoading, setKycLoading] = useState(true);
  const [kycError, setKycError] = useState(null);

  // --- State for Purchase History (NEW) ---
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false); // Separate loading state
  const [purchaseError, setPurchaseError] = useState(null); // Separate error state
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalPropertiesOwned, setTotalPropertiesOwned] = useState(0);
  // --- End New State ---

  const getUserId = (userObj) => userObj?.id || userObj?._id || null;
  const getLocalKycStatus = (userObj) => userObj?.kycStatus === "verified";

  // --- Fetch KYC Status (Existing, renamed state) ---
  const fetchKycStatus = useCallback(async () => {
    const userId = getUserId(user);
    if (!isAuthenticated || !userId || !token) {
      setIsKycVerified(getLocalKycStatus(user)); // Use new state name
      setKycLoading(false); // Use new state name
      setKycError(null); // Clear KYC error on logout
      return;
    }

    setKycLoading(true); // Use new state name
    setKycError(null);

    try {
      const response = await fetch("http://localhost:5000/api/kyc/status", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message || `Status: ${response.status}`);
      }
      const data = await response.json();
      setIsKycVerified(data.kycStatus === "verified"); // Use new state name
    } catch (err) {
      console.error("KYC fetch error:", err);
      setKycError("Could not fetch KYC status. Using local fallback."); // Use new state name
      setIsKycVerified(getLocalKycStatus(user)); // Use new state name
    } finally {
      setKycLoading(false); // Use new state name
    }
  }, [isAuthenticated, user, token]);

  // --- Fetch Purchase History (NEW) ---
  const fetchPurchaseHistory = useCallback(async () => {
    if (!isAuthenticated || !token) {
      // Clear purchase data if user logs out or isn't authenticated
      setPurchaseHistory([]);
      setTotalPropertiesOwned(0);
      setTotalSpent(0);
      setPurchaseLoading(false);
      setPurchaseError(null); // Clear error on logout
      return;
    }

    setPurchaseLoading(true);
    setPurchaseError(null);

    try {
      const response = await fetch('http://localhost:5000/api/properties/my-purchases', {
          headers: {
              'Authorization': `Bearer ${token}` // Use token from AuthContext
          }
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch purchase history');
      }

      const data = await response.json();
      const purchases = Array.isArray(data) ? data : []; // Ensure it's an array

      setPurchaseHistory(purchases);

      // --- Calculate Stats ---
      setTotalPropertiesOwned(purchases.length);
      const spent = purchases.reduce((sum, prop) => {
          const price = parseFloat(prop.price || 0); // Use price from fetched data
          return sum + (isNaN(price) ? 0 : price);
      }, 0);
      setTotalSpent(spent.toFixed(4)); // Format ETH value (adjust decimals if needed)

    } catch (err) {
      console.error("Error fetching purchase history:", err);
      setPurchaseError(err.message);
      // Reset state on error
      setPurchaseHistory([]);
      setTotalPropertiesOwned(0);
      setTotalSpent(0);
    } finally {
      setPurchaseLoading(false);
    }
  }, [isAuthenticated, token]); // Depend on auth status and token
  // --- End New Fetch Function ---

  // --- Run fetch functions on mount and when auth state changes ---
  useEffect(() => {
    fetchKycStatus();
    fetchPurchaseHistory(); // Call the new fetch function
  }, [fetchKycStatus, fetchPurchaseHistory]); // Add new function to dependency array

  // --- Context Value ---
  const value = {
    // KYC stuff
    isVerified: isKycVerified, // Use renamed state
    loading: kycLoading, // Use renamed state
    error: kycError, // Use renamed state
    refreshKycStatus: fetchKycStatus,

    // Purchase History stuff (NEW)
    purchaseHistory,
    purchaseLoading,
    purchaseError,
    totalSpent,
    totalPropertiesOwned,
    refreshPurchaseHistory: fetchPurchaseHistory // Provide function to manually refresh
  };

  return (
    <BuyerContext.Provider value={value}>
      {children}
    </BuyerContext.Provider>
  );
};

// --- Custom Hook ---
export const useBuyer = () => {
  const context = useContext(BuyerContext);
  if (!context) throw new Error("useBuyer must be used within BuyerProvider");
  return context;
};