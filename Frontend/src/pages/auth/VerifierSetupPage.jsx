import React, { useState } from 'react';
import { ethers } from 'ethers';

const VerifierSetupPage = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateVerifier = async () => {
        if (!email) return setError('Please enter an email address.');
        if (!window.ethereum) return setError('MetaMask is not installed.');
        
        setLoading(true);
        setError('');
        setStatus('');

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const walletAddress = await signer.getAddress();

            const response = await fetch('http://localhost:5000/api/auth/setup-verifier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, walletAddress }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setStatus(`SUCCESS! Verifier account created for wallet: ${data.walletAddress}. You can now use the main login page.`);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-red-100 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg border-4 border-red-500">
                <h2 className="text-2xl font-bold text-center text-red-700">ONE-TIME VERIFIER SETUP</h2>
                <p className="text-center text-sm text-gray-600 mt-2">Use this page once to create the admin account.</p>
                <div className="mt-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Verifier's Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="mt-6">
                    <button onClick={handleCreateVerifier} disabled={loading} className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400">
                        {loading ? 'Creating...' : 'Connect Wallet & Create Verifier'}
                    </button>
                </div>
                {status && <p className="mt-4 text-center text-sm text-green-600">{status}</p>}
                {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
};

export default VerifierSetupPage;