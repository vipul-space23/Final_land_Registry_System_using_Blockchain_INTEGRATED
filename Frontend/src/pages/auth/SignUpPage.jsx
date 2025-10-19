// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { UserPlus } from 'lucide-react';

// const roles = [
//     { value: "Owner", label: "Land Owner" },
//     { value: "Buyer", label: "Buyer" },
//     { value: "Verifier", label: "Land Inspector / Verifier"}
// ];

// export default function SignUpPage() {
//     const [form, setForm] = useState({ name: "", email: "", phone: "", role: "", password: "" });
//     const [message, setMessage] = useState("");
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     // This function is now corrected
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setMessage("");
//         setLoading(true);
//         try {
//             const res = await fetch("http://localhost:5000/api/auth/register", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(form),
//             });
//             const data = await res.json();
//             if (res.ok) {
//                 setMessage("✅ Registration successful! Redirecting to login...");
//                 setTimeout(() => {
//                     navigate("/login");
//                 }, 2000); // Wait 2 seconds
//             } else {
//                 setMessage(`❌ ${data.message || "Registration failed"}`);
//             }
//         } catch (error) {
//             setMessage("❌ Server not reachable");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
//             <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
//                 <div className="text-center mb-8">
//                     <UserPlus className="mx-auto h-12 w-12 text-blue-600" />
//                     <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//                         Create a new account
//                     </h2>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
//                         <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
//                     </div>
//                     <div>
//                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
//                         <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
//                     </div>
//                      <div>
//                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
//                         <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
//                     </div>
//                     <div>
//                         <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am a</label>
//                         <select id="role" name="role" required value={form.role} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
//                             <option value="">Select a role</option>
//                             {roles.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}
//                         </select>
//                     </div>
//                     <div>
//                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
//                         <input id="password" name="password" type="password" autoComplete="new-password" required value={form.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading || message.startsWith('✅')}
//                         className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                     >
//                         {loading ? 'Creating account...' : 'Create Account'}
//                     </button>
//                 </form>
//                 {message && (
//                     <p className={`mt-4 text-center text-sm ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
//                         {message.replace(/^[✅❌]\s*/, '')}
//                     </p>
//                 )}
//                 <div className="mt-6 text-center">
//                     <p className="text-sm text-gray-600">
//                         Already have an account?{' '}
//                         <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
//                             Sign In
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate, Link } from 'react-router-dom';

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Buyer');
    const [walletAddress, setWalletAddress] = useState(''); // This is important for the two-step process
    const [kycDocument, setKycDocument] = useState(null);
    const [fileName, setFileName] = useState('Upload ID Proof (PDF, PNG, JPG)');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate();

    // Function specifically for the "Connect Wallet" button
    const handleConnectWallet = async () => {
        if (!window.ethereum) {
            return setError('MetaMask is not installed.');
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setWalletAddress(address); // Save the address to state
            setError(''); // Clear any previous errors
        } catch (err) {
            setError('Failed to connect wallet. Please try again.');
        }
    };

    

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setKycDocument(file);
            setFileName(file.name);
        }
    };

    // Function specifically for the "Register" (submit) button
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation check
        if (!name || !email || !walletAddress || !role || !kycDocument) {
            return setError('Please fill all fields, upload a document, and connect your wallet.');
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('role', role);
        formData.append('walletAddress', walletAddress); // Use the address from state
        formData.append('kycDocument', kycDocument);

        try {
            // Using the full URL for the "no-proxy" setup
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed.');

            setSuccess('Registration Successful! Redirecting...');
            setTimeout(() => {
                navigate('/pending-verification');
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                {/* The form calls handleSubmit on submission */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Form Inputs (Name, Email, Role, File Upload) */}
                        <input id="full-name" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-md"/>
                        <input id="email-address" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-md"/>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required className="w-full px-3 py-2 border rounded-md bg-white">
                            <option value="Buyer">I want to be a Buyer</option>
                            <option value="Owner">I want to be a Land Seller</option>
                        </select>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">KYC Document</label>
                            <div className="mt-1 flex justify-center p-6 border-2 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer font-medium text-indigo-600 hover:text-indigo-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                                    </label>
                                    <p className="text-xs text-gray-500">{fileName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEPARATE Wallet Connection Section */}
                    <div className="mt-6">
                        {walletAddress ? (
                            <div className="text-center p-3 bg-green-100 rounded-md border border-green-300">
                                <p className="text-sm font-medium text-green-800">Wallet Connected:</p>
                                <p className="text-xs text-gray-600 font-mono break-all">{walletAddress}</p>
                            </div>
                        ) : (
                            <button
                                type="button" // Important: type="button" prevents form submission
                                onClick={handleConnectWallet}
                                className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>

                    {/* SEPARATE Submit Button */}
                    <div>
                        <button
                            type="submit" // type="submit" will trigger the form's onSubmit
                            // This is the key: The button is disabled if loading OR if wallet is not connected
                            disabled={loading || !walletAddress}
                            className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
                {success && <p className="mt-2 text-center text-sm text-green-600">{success}</p>}
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;