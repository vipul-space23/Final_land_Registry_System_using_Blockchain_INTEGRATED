import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Use useAuth to get user info and token
import { Users, Home, Clock } from 'lucide-react'; // Using lucide-react for icons

const VerifierDashboardPage = () => {
    const { user } = useAuth(); // Get the logged-in user
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingUsers: 0,
        totalProperties: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.token) return;
            try {
                const response = await fetch('http://localhost:5000/api/verifier/stats', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error('Failed to fetch stats');
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    const statCards = [
        { label: "Total Users Registered", value: stats.totalUsers, color: "bg-blue-600", icon: <Users size={32} /> },
        { label: "Pending Verifications", value: stats.pendingUsers, color: "bg-amber-600", icon: <Clock size={32} /> },
        { label: "Total Properties Registered", value: stats.totalProperties, color: "bg-green-600", icon: <Home size={32} /> },
    ];

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="container mx-auto max-w-7xl px-4">
                {/* User Profile Section */}
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                        <Users size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user ? user.name : 'Loading...'}</h2>
                        <p className="text-sm text-gray-500">Land Inspector</p>
                    </div>
                </div>

                {/* Stats Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {statCards.map((stat, index) => (
                        <div key={index} className={`p-6 rounded-lg shadow-md text-white flex items-center justify-between ${stat.color}`}>
                            <div>
                                <h3 className="text-lg font-medium">{stat.label}</h3>
                                <p className="text-4xl font-bold mt-2">{loading ? '...' : stat.value}</p>
                            </div>
                            <div>{stat.icon}</div>
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the Dashboard</h2>
                    <p className="text-gray-600">Please select a task from the navigation bar, such as "Verify User", to begin.</p>
                </div>  
            </div>
        </div>
    );
};

export default VerifierDashboardPage;