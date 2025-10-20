// // // import React, { useState, useEffect } from "react";
// // // import { useNavigate, Link } from "react-router-dom";
// // // import { useAuth } from "../../context/AuthContext";
// // // import { LogIn } from 'lucide-react';

// // // export default function LoginPage() {
// // //     const [form, setForm] = useState({ email: "", password: "" });
// // //     const [message, setMessage] = useState("");
// // //     const [loading, setLoading] = useState(false);


// // //     const navigate = useNavigate();
// // //     const { login, isAuthenticated, user } = useAuth();

// // //     const GANACHE_CHAIN_ID = "0x539"; // 1337 in hex

// // // useEffect(() => {
// // //     console.log("Login useEffect triggered", { isAuthenticated, user });
    
// // //     if (isAuthenticated && user?.role) {
// // //         const roleLower = user.role.toLowerCase();
// // //         console.log("User role (original):", user.role);
// // //         console.log("User role (lowercase):", roleLower);

// // //         if (roleLower.includes("buyer")) {
// // //             console.log("✅ Navigating to buyer dashboard");
// // //             navigate("/buyer-dashboard", { replace: true });
// // //         }
// // //         else if (roleLower.includes("owner") || roleLower.includes("land owner")) {
// // //             console.log("✅ Navigating to owner dashboard");
// // //             navigate("/owner-dashboard", { replace: true });
// // //         }
// // //         else if (roleLower.includes("verifier")) {
// // //             console.log("✅ Navigating to LDR dashboard");
// // //             navigate("/ldr-dashboard", { replace: true });
// // //         }
// // //         else {
// // //             console.log("❌ No matching role, navigating to home");
// // //             navigate("/", { replace: true });
// // //         }
// // //     }
// // // }, [isAuthenticated, user, navigate]);


// // //     const handleChange = (e) => {
// // //         const { name, value } = e.target;
// // //         setForm(prev => ({ ...prev, [name]: value }));
// // //     };

// // //     // Email/password login
// // //     const handleSubmit = async (e) => {
// // //         e.preventDefault();
// // //         setMessage("");
// // //         setLoading(true);
// // //         try {
// // //             const res = await fetch("http://localhost:5000/api/auth/login", {
// // //                 method: "POST",
// // //                 headers: { "Content-Type": "application/json" },
// // //                 credentials: "include",
// // //                 body: JSON.stringify(form),
// // //             });
// // //             const data = await res.json();
// // //             if (res.ok) {
// // //                 login(data); // save user in AuthContext
// // //             } else {
// // //                 setMessage(data.message || "Login failed");
// // //             }
// // //         } catch (error) {
// // //             console.error("Login error:", error);
// // //             setMessage("Server not reachable");
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     // MetaMask login
// // //     // Alternative approach - replace the handleWalletLogin function
// // // const handleWalletLogin = async () => {
// // //     if (!window.ethereum) {
// // //         setMessage("Please install MetaMask!");
// // //         return;
// // //     }

// // //     try {
// // //         setLoading(true);
// // //         setMessage("Opening MetaMask...");

// // //         // Method 1: Try wallet_requestPermissions first (forces account selection)
// // //         try {
// // //             const permissions = await window.ethereum.request({
// // //                 method: "wallet_requestPermissions",
// // //                 params: [
// // //                     {
// // //                         eth_accounts: {}
// // //                     }
// // //                 ]
// // //             });

// // //             // After permission is granted, get the accounts
// // //             const accounts = await window.ethereum.request({ method: "eth_accounts" });
            
// // //             if (accounts && accounts.length > 0) {
// // //                 const selectedAccount = accounts[0];
// // //                 console.log("User selected account:", selectedAccount);
// // //                 await loginWithSelectedAccount(selectedAccount);
// // //                 return;
// // //             }
// // //         } catch (permError) {
// // //             console.log("wallet_requestPermissions not supported or failed:", permError);
// // //         }

// // //         // Method 2: Fallback - disconnect first, then reconnect
// // //         try {
// // //             // Try to disconnect existing connections
// // //             await window.ethereum.request({
// // //                 method: "wallet_revokePermissions",
// // //                 params: [
// // //                     {
// // //                         eth_accounts: {}
// // //                     }
// // //                 ]
// // //             });
// // //         } catch (revokeError) {
// // //             console.log("Revoke permissions failed:", revokeError);
// // //         }

// // //         // Now request accounts (should show popup)
// // //         const accounts = await window.ethereum.request({ 
// // //             method: "eth_requestAccounts" 
// // //         });

// // //         if (!accounts || accounts.length === 0) {
// // //             setMessage("No MetaMask accounts selected. Please try again.");
// // //             return;
// // //         }

// // //         const selectedAccount = accounts[0];
// // //         console.log("User selected account:", selectedAccount);
// // //         await loginWithSelectedAccount(selectedAccount);

// // //     } catch (err) {
// // //         console.error("MetaMask connection error:", err);
        
// // //         if (err.code === 4001) {
// // //             setMessage("MetaMask connection was rejected by user.");
// // //         } else if (err.code === -32002) {
// // //             setMessage("MetaMask connection request is already pending. Please check MetaMask.");
// // //         } else {
// // //             setMessage("Failed to connect to MetaMask. Please try again.");
// // //         }
        
// // //         setLoading(false);
// // //     }
// // // };

// // //     // Function to login after account selection
// // //     const loginWithSelectedAccount = async (walletAddress) => {
// // //         try {
// // //             setLoading(true);
// // //             setMessage("Connecting to server..."); // Show progress

// // //             console.log("Attempting wallet login with address:", walletAddress);

// // //             const res = await fetch("http://localhost:5000/api/auth/wallet-login", {
// // //                 method: "POST",
// // //                 headers: { 
// // //                     "Content-Type": "application/json",
// // //                     "Accept": "application/json"
// // //                 },
// // //                 credentials: "include",
// // //                 body: JSON.stringify({ walletAddress }),
// // //             });

// // //             console.log("Response status:", res.status);
// // //             console.log("Response headers:", Object.fromEntries(res.headers.entries()));

// // //             // Check if response is actually JSON
// // //             const contentType = res.headers.get('content-type');
// // //             if (!contentType || !contentType.includes('application/json')) {
// // //                 const textResponse = await res.text();
// // //                 console.error("Non-JSON response received:", textResponse);
// // //                 setMessage(`Server error: Expected JSON response but got ${contentType || 'unknown'}`);
// // //                 return;
// // //             }

// // //             const data = await res.json();
// // //             console.log("Response data:", data);

// // //             if (!res.ok) {
// // //                 setMessage(data.message || `Server error: ${res.status} ${res.statusText}`);
// // //                 return;
// // //             }

// // //             // Clear form and messages on success
// // //             setForm({ email: "", password: "" });
// // //             setMessage("Login successful!");
// // //             login(data); // save in AuthContext

// // //         } catch (err) {
// // //             console.error("Wallet login error:", err);
            
// // //             // More specific error messages
// // //             if (err.name === 'TypeError' && err.message.includes('fetch')) {
// // //                 setMessage("Cannot connect to server. Is your backend running on http://localhost:5000?");
// // //             } else if (err.name === 'SyntaxError') {
// // //                 setMessage("Server returned invalid response. Check server logs.");
// // //             } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
// // //                 setMessage("Network connection failed. Check if backend server is running.");
// // //             } else {
// // //                 setMessage(`Connection error: ${err.message}`);
// // //             }
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };



// // //     return (
// // //         <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
// // //             <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
// // //                 <div className="text-center mb-8">
// // //                     <LogIn className="mx-auto h-12 w-12 text-blue-600" />
// // //                     <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
// // //                         Sign in to your account
// // //                     </h2>
// // //                 </div>

// // //                 {/* Email Login Form */}
// // //                 <form onSubmit={handleSubmit} className="space-y-6">
// // //                     <div>
// // //                         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
// // //                             Email address
// // //                         </label>
// // //                         <input
// // //                             id="email"
// // //                             name="email"
// // //                             type="email"
// // //                             autoComplete="email"
// // //                             required
// // //                             value={form.email}
// // //                             onChange={handleChange}
// // //                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //                         />
// // //                     </div>
// // //                     <div>
// // //                         <label htmlFor="password" className="block text-sm font-medium text-gray-700">
// // //                             Password
// // //                         </label>
// // //                         <input
// // //                             id="password"
// // //                             name="password"
// // //                             type="password"
// // //                             autoComplete="current-password"
// // //                             required
// // //                             value={form.password}
// // //                             onChange={handleChange}
// // //                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //                         />
// // //                     </div>
// // //                     <button
// // //                         type="submit"
// // //                         disabled={loading}
// // //                         className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
// // //                     >
// // //                         {loading ? 'Signing in...' : 'Sign In'}
// // //                     </button>
// // //                 </form>

// // //                 {/* MetaMask Login */}
// // //                 <button
// // //                     type="button"
// // //                     onClick={handleWalletLogin}
// // //                     disabled={loading}
// // //                     className="w-full mt-4 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
// // //                 >
// // //                     {loading ? "Connecting Wallet..." : "Login with MetaMask"}
// // //                 </button>

// // //                 {/* Error/Success Messages */}
// // //                 {message && (
// // //                     <p className={`mt-4 text-center text-sm ${
// // //                         message.toLowerCase().includes('success') || message.startsWith('✅') 
// // //                             ? 'text-green-600' 
// // //                             : 'text-red-600'
// // //                     }`}>
// // //                         {message.replace(/^[✅❌]\s*/, '')}
// // //                     </p>
// // //                 )}



// // //                 <div className="mt-6 text-center">
// // //                     <p className="text-sm text-gray-600">
// // //                         Don't have an account?{' '}
// // //                         <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
// // //                             Sign Up
// // //                         </Link>
// // //                     </p>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }




// // import React, { useState } from 'react';
// // import { ethers } from 'ethers';
// // import { useAuth } from '../../context/AuthContext';
// // import { useNavigate, Link } from 'react-router-dom';

// // const LoginPage = () => {
// //     const [error, setError] = useState('');
// //     const [loading, setLoading] = useState(false);
// //     const { login } = useAuth();
// //     const navigate = useNavigate();

// //     const handleMetaMaskLogin = async () => {
// //         if (!window.ethereum) {
// //             setError('MetaMask is not installed. Please install it to continue.');
// //             return;
// //         }

// //         setLoading(true);
// //         setError('');
// //         try {
// //             // Step 1: Connect to wallet and get the signer. This will prompt connection if not already connected.
// //             const provider = new ethers.BrowserProvider(window.ethereum);
// //             await provider.send("eth_requestAccounts", []); // Essential for prompting connection
// //             const signer = await provider.getSigner();
// //             const walletAddress = await signer.getAddress();

// //             // Step 2: Request the unique message (nonce) from the backend
// //             const nonceRes = await fetch('http://localhost:5000/api/auth/get-nonce', {
// //                 method: 'POST',
// //                 headers: { 'Content-Type': 'application/json' },
// //                 body: JSON.stringify({ walletAddress }),
// //             });
            
// //             const nonceData = await nonceRes.json();
// //             if (!nonceRes.ok) throw new Error(nonceData.message);

// //             // Step 3: Ask the user to sign the message
// //             const signature = await signer.signMessage(nonceData.message);
            
// //             // Step 4: Send the signature to the backend for verification
// //             const loginRes = await fetch('http://localhost:5000/api/auth/login-signature', {
// //                 method: 'POST',
// //                 headers: { 'Content-Type': 'application/json' },
// //                 body: JSON.stringify({ walletAddress, signature }),
// //             });
            
// //             const loginData = await loginRes.json();
// //             if (!loginRes.ok) throw new Error(loginData.message);
            
// //             // Step 5: Update global state via AuthContext. This triggers the header update.
// //             login(loginData);
            
// //             // Step 6: Navigate to the correct dashboard based on role
// //             if (loginData.role === 'Buyer') {
// //                 navigate('/buyer-dashboard');
// //             } else if (loginData.role === 'Owner') {
// //                 navigate('/owner-dashboard');
// //             } else if (loginData.role === 'Verifier') {
// //                 navigate('/verifier-dashboard');
// //             } else {
// //                 navigate('/');
// //             }

// //         } catch (err) {
// //             setError(err.message);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     return (
// //         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
// //             <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
// //                 <div>
// //                     <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
// //                         Sign in to your account
// //                     </h2>
// //                     <p className="mt-2 text-center text-sm text-gray-600">
// //                         Connect your wallet and sign a message to log in securely.
// //                     </p>
// //                 </div>
// //                 <div className="mt-8">
// //                     <button
// //                         onClick={handleMetaMaskLogin}
// //                         disabled={loading}
// //                         className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
// //                     >
// //                         {loading ? 'Verifying...' : 'Connect & Login with MetaMask'}
// //                     </button>
// //                 </div>
// //                 {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
// //                 <p className="mt-4 text-center text-sm text-gray-600">
// //                     Need an account?{' '}
// //                     <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
// //                         Register here
// //                     </Link>
// //                 </p>
// //             </div>
// //         </div>
// //     );
// // };

// // export default LoginPage;



// import React, { useState } from 'react';
// import { ethers } from 'ethers';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate, Link } from 'react-router-dom';

// const LoginPage = () => {
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const { login } = useAuth();
//     const navigate = useNavigate();

//     const handleMetaMaskLogin = async () => {
//         if (!window.ethereum) {
//             setError('MetaMask is not installed. Please install it to continue.');
//             return;
//         }

//         setLoading(true);
//         setError('');
//         try {
//             // Step 1: Connect to wallet and get the signer
//             const provider = new ethers.BrowserProvider(window.ethereum);
//             await provider.send("eth_requestAccounts", []);
//             const signer = await provider.getSigner();
//             const walletAddress = await signer.getAddress();

//             // Step 2: Request the unique message (nonce) from the backend
//             const nonceRes = await fetch('http://localhost:5000/api/auth/get-nonce', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 credentials: 'include', // ✅ ADDED - Critical for cookies
//                 body: JSON.stringify({ walletAddress }),
//             });
            
//             const nonceData = await nonceRes.json();
//             if (!nonceRes.ok) throw new Error(nonceData.message);

//             // Step 3: Ask the user to sign the message
//             const signature = await signer.signMessage(nonceData.message);
            
//             // Step 4: Send the signature to the backend for verification
//             const loginRes = await fetch('http://localhost:5000/api/auth/login-signature', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 credentials: 'include', // ✅ ADDED - Critical for cookies
//                 body: JSON.stringify({ walletAddress, signature }),
//             });
            
//             const loginData = await loginRes.json();
//             if (!loginRes.ok) throw new Error(loginData.message);
            
//             console.log('✅ Login successful:', loginData);
            
//             // Step 5: Update global state via AuthContext
//             login(loginData);
            
//             // Step 6: Navigate to the correct dashboard based on role
//             if (loginData.user.role === 'Buyer') {
//                 navigate('/buyer-dashboard');
//             } else if (loginData.user.role === 'Owner' || loginData.user.role === 'Seller') {
//                 navigate('/owner-dashboard');
//             } else if (loginData.user.role === 'Verifier') {
//                 navigate('/verifier-dashboard');
//             } else {
//                 navigate('/');
//             }

//         } catch (err) {
//             console.error('Login error:', err);
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//             <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
//                 <div>
//                     <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//                         Sign in to your account
//                     </h2>
//                     <p className="mt-2 text-center text-sm text-gray-600">
//                         Connect your wallet and sign a message to log in securely.
//                     </p>
//                 </div>
//                 <div className="mt-8">
//                     <button
//                         onClick={handleMetaMaskLogin}
//                         disabled={loading}
//                         className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
//                     >
//                         {loading ? 'Verifying...' : 'Connect & Login with MetaMask'}
//                     </button>
//                 </div>
//                 {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
//                 <p className="mt-4 text-center text-sm text-gray-600">
//                     Need an account?{' '}
//                     <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
//                         Register here
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleMetaMaskLogin = async () => {
        if (!window.ethereum) {
            setError('MetaMask is not installed. Please install it to continue.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Step 1: Connect to wallet and get the signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const walletAddress = await signer.getAddress();

            // Step 2: Request the unique message (nonce) from the backend
            const nonceRes = await fetch('http://localhost:5000/api/auth/get-nonce', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ walletAddress }),
            });
            
            const nonceData = await nonceRes.json();
            if (!nonceRes.ok) throw new Error(nonceData.message || 'Failed to get nonce');

            // Step 3: Ask the user to sign the message
            const signature = await signer.signMessage(nonceData.message);
            
            // Step 4: Send the signature to the backend for verification
            const loginRes = await fetch('http://localhost:5000/api/auth/login-signature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ walletAddress, signature }),
            });
            
            const loginData = await loginRes.json();
            if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');
            
            console.log('✅ Login response:', loginData);
            
            // CRITICAL FIX: Check the structure of loginData
            // Backend might return { token, user } or { token, role, name, etc. }
            // We need to normalize this before passing to login()
            
            let userData;
            if (loginData.user) {
                // If backend returns { token, user: {...} }
                userData = {
                    token: loginData.token,
                    ...loginData.user
                };
            } else {
                // If backend returns { token, role, name, email, ... } (flat structure)
                userData = loginData;
            }
            
            // Verify we have the required fields
            if (!userData.role) {
                throw new Error('Invalid login response: role not found');
            }
            
            console.log('✅ Normalized user data:', userData);
            
            // Step 5: Update global state via AuthContext
            login(userData);
            
            // Step 6: Navigate to the correct dashboard based on role
            if (userData.role === 'Buyer') {
                navigate('/buyer-dashboard');
            } else if (userData.role === 'Owner' || userData.role === 'Seller') {
                navigate('/owner-dashboard');
            } else if (userData.role === 'Verifier') {
                navigate('/verifier-dashboard');
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error('❌ Login error:', err);
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Connect your wallet and sign a message to log in securely.
                    </p>
                </div>
                <div className="mt-8">
                    <button
                        onClick={handleMetaMaskLogin}
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Verifying...' : 'Connect & Login with MetaMask'}
                    </button>
                </div>
                {error && (
                    <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Need an account?{' '}
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;