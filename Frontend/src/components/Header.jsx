import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// --- IMPORT HOOKS ---
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";

// Apply Poppins font globally for this component
const headerStyle = {
  fontFamily: "'Poppins', sans-serif",
};

import {
  User,
  PlusCircle,
  Map,
  MessageSquare,
  Send,
  LogOut,
  CheckCircle,
  Search,
  Home,
  History,
  FileText,
} from "lucide-react";

// Helper to shorten wallet address
const truncateAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const Header = () => {
  const { logout, user, updateUser } = useAuth();
  const { connectWallet } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  // Save wallet to DB
  const saveWalletAddressToDB = async (address) => {
    try {
      if (user.walletAddress === address) {
        console.log("Wallet already saved to user profile.");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/wallet", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ walletAddress: address }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to save wallet address.");
      }
      if (updateUser) updateUser(data);
      alert("Wallet connected and saved to your profile successfully!");
    } catch (error) {
      console.error("API Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Connect and save wallet
  const handleConnectAndSave = async () => {
    try {
      const newAccount = await connectWallet("user");
      if (newAccount) {
        await saveWalletAddressToDB(newAccount);
      }
    } catch (error) {
      console.error("Error during wallet connection:", error);
      alert("An error occurred during the connection process.");
    }
  };

  // --- PAGE DETECTION ---
  const isVerifierPage = location.pathname.startsWith("/verifier");
  const isOwnerDashboard = location.pathname.startsWith("/owner-dashboard");
  const isBuyerDashboard = location.pathname.startsWith("/buyer-dashboard");
  const isGovernmentRegistry = location.pathname.startsWith(
    "/government-registry"
  );
  const isLDRDashboard =
    location.pathname.startsWith("/verifier") ||
    location.pathname.startsWith("/ldr") ||
    location.pathname.startsWith("/register-property");

  if (isGovernmentRegistry) return null;

  const isDashboardOrVerifier =
    isVerifierPage || isOwnerDashboard || isBuyerDashboard || isLDRDashboard;

  const headerClasses = isDashboardOrVerifier
    ? "bg-white text-gray-800 shadow-sm"
    : "bg-gray-900 text-white shadow-lg";
  const linkClasses = isDashboardOrVerifier
    ? "text-gray-600 hover:text-blue-600"
    : "text-gray-400 hover:text-blue-400";
  const logoColor = isDashboardOrVerifier ? "text-gray-900" : "text-white";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getNavLinkClass = (path) => {
    const isActive =
      location.pathname === path ||
      (location.pathname === "/owner-dashboard" &&
        path === "/owner-dashboard/profile");
    return `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
      isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
    }`;
  };

  // --- MODIFICATION: Helper function to determine logo link path ---
  const getLogoLinkPath = () => {
    // Only apply special routing if the user is logged in
    if (user) {
      if (isOwnerDashboard) {
        return "/owner-dashboard";
      }
      if (isBuyerDashboard) {
        return "/buyer-dashboard";
      }
      if (isLDRDashboard || isVerifierPage) {
        return "/verifier-dashboard";
      }
    }
    // Default path for logged-out users or non-dashboard pages
    return "/";
  };
  // --- END MODIFICATION ---

  const buyerNavItems = [
    {
      name: "Profile",
      path: "/buyer-dashboard/profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      name: "Browse",
      path: "/buyer-dashboard/browse",
      icon: <Search className="h-4 w-4" />,
    },
    {
      name: "My Properties",
      path: "/buyer-dashboard/properties",
      icon: <Home className="h-4 w-4" />,
    },
    {
      name: "History",
      path: "/buyer-dashboard/purchase-history",
      icon: <History className="h-4 w-4" />,
    },
  ];

  const ownerNavItems = [
    {
      name: "Dashboard",
      path: "/owner-dashboard/profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      name: "Verify Land",
      path: "/owner-dashboard/add-land",
      icon: <PlusCircle className="h-4 w-4" />,
    },
    {
      name: "My Lands",
      path: "/owner-dashboard/my-lands",
      icon: <Map className="h-4 w-4" />,
    },
    {
      name: "Sent",
      path: "/owner-dashboard/requests",
      icon: <Send className="h-4 w-4" />,
    },
  ];

  return (
    <header className={`${headerClasses} sticky top-0 z-50`} style={headerStyle}>
      <div className="container mx-auto">
        {/* Main Header */}
        <div className="flex justify-between items-center p-4">
          
          {/* --- MODIFICATION: Updated 'to' prop to be dynamic --- */}
          <Link
            to={getLogoLinkPath()}
            className={`text-xl md:text-2xl font-bold ${logoColor}`}
          >
            Land Registry
          </Link>
          {/* --- END MODIFICATION --- */}


          {/* Owner Dashboard - Show nav in main header */}
          {isOwnerDashboard && (
            <nav className="hidden lg:flex items-center gap-1">
              {ownerNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getNavLinkClass(item.path)}
                >
                  {item.icon} <span>{item.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors text-sm"
              >
                <LogOut className="h-4 w-4" /> <span>Logout</span>
              </button>
            </nav>
          )}

          {/* Buyer Dashboard - Show nav in main header */}
          {isBuyerDashboard && (
            <nav className="hidden lg:flex items-center gap-1">
              {buyerNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getNavLinkClass(item.path)}
                >
                  {item.icon} <span>{item.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors text-sm"
              >
                <LogOut className="h-4 w-4" /> <span>Logout</span>
              </button>
            </nav>
          )}

          {/* Other Navigation */}
          {!isOwnerDashboard && !isBuyerDashboard && (
            <nav className="hidden md:flex items-center space-x-6">
              {isLDRDashboard ? (
                <>
                  <Link
                    to="/verifier-dashboard"
                    className={`${linkClasses} font-medium`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/verifier/users"
                    className={`${linkClasses} font-medium`}
                  >
                    Verify Users
                  </Link>
                  <Link
                    to="/register-property"
                    className={`${linkClasses} font-medium`}
                  >
                    Register Property
                  </Link>
                  <Link
                    to="/ldr/verified-users"
                    className={`${linkClasses} font-medium`}
                  >
                    Verification Registry
                  </Link>
                  <Link
                    to="/ldr/registered-properties"
                    className={`${linkClasses} font-medium`}
                  >
                    Registered Properties
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> <span>Logout</span>
                  </button>
                </>
              ) : isVerifierPage ? (
                <>
                  <Link
                    to="/verifier-dashboard"
                    className={`${linkClasses} font-medium`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/verifier/users"
                    className={`${linkClasses} font-medium`}
                  >
                    Verify User
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/" className={`${linkClasses} font-medium`}>
                    HOME
                  </Link>
                  <Link
                    to="/about-us"
                    className={`${linkClasses} font-medium`}
                  >
                    ABOUT US
                  </Link>
                  <Link to="/faq" className={`${linkClasses} font-medium`}>
                    FAQ
                  </Link>
                  <Link
                    to="/contact-us"
                    className={`${linkClasses} font-medium`}
                  >
                    CONTACT US
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Right Side - User Info & Wallet */}
          <div className="flex items-center gap-4">
            {(isOwnerDashboard || isBuyerDashboard) && user && (
              <div className="hidden md:flex items-center gap-3 border-r pr-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-800">
                    {isOwnerDashboard ? "Land Owner" : "Property Buyer"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {user.name || "User"}
                  </p>
                </div>
              </div>
            )}

            {/* Wallet Section */}
            {!isLDRDashboard && user && user.kycStatus === "verified" && (
              user.walletAddress ? (
                <div className="bg-green-100 text-green-800 px-3 py-2 font-semibold rounded-lg text-sm">
                  {truncateAddress(user.walletAddress)}
                </div>
              ) : (
                <button
                  onClick={handleConnectAndSave}
                  className="bg-blue-600 text-white px-4 py-2 font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Connect Wallet
                </button>
              )
            )}
          </div>
        </div>

        {/* Owner Dashboard Mobile Sub Navigation */}
        {isOwnerDashboard && (
          <nav className="lg:hidden border-t border-gray-200 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {ownerNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getNavLinkClass(item.path)}
                >
                  {item.icon}{" "}
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors text-sm"
              >
                <LogOut className="h-4 w-4" />{" "}
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </nav>
        )}

        {/* Buyer Dashboard Mobile Sub Navigation */}
        {isBuyerDashboard && (
          <nav className="lg:hidden border-t border-gray-200 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {buyerNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getNavLinkClass(item.path)}
                >
                  {item.icon}{" "}
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors text-sm"
              >
                <LogOut className="h-4 w-4" />{" "}
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;