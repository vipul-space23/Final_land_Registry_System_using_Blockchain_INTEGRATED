// // import React, { useState, useEffect } from 'react';
// // import { useAuth } from '../../context/AuthContext';
// // import { ShieldCheck, ShieldX, FileText } from 'lucide-react';

// // const VerifyUsersPage = () => {
// //     const [pendingUsers, setPendingUsers] = useState([]);
// //     const [loading, setLoading] = useState(true);   
// //     const [error, setError] = useState('');
    
// //     // We will use state for both the message and its type ('success' or 'error')
// //     const [message, setMessage] = useState('');
// //     const [messageType, setMessageType] = useState('success'); 
    
// //     const { user } = useAuth();

// //     const fetchPendingUsers = async () => {
// //         if (!user || !user.token) return;
// //         setLoading(true);
// //         setError('');
// //         try {
// //             const response = await fetch('http://localhost:5000/api/verifier/pending-users', {
// //                 headers: { 'Authorization': `Bearer ${user.token}` },
// //             });
// //             const data = await response.json();
// //             if (!response.ok) throw new Error(data.message || 'Failed to fetch users.');
// //             setPendingUsers(data);
// //         } catch (err) {
// //             setError(err.message);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         if(user?.token) {
// //             fetchPendingUsers();
// //         }
// //     }, [user]);

// //     const handleAction = async (userId, action) => {
// //         // This function will now work correctly for BOTH approve and reject
// //         const endpoint = action === 'approve' ? 'verify-user' : 'reject-user';
// //         setMessage('');
// //         setError('');
// //         try {
// //             const response = await fetch(`http://localhost:5000/api/verifier/${endpoint}/${userId}`, {
// //                 method: 'PUT',
// //                 headers: { 'Authorization': `Bearer ${user.token}` },
// //             });
            
// //             const data = await response.json();
// //             if (!response.ok) throw new Error(data.message);

// //             // Set the message and its type for correct color styling
// //             setMessage(data.message);
// //             setMessageType(action === 'approve' ? 'success' : 'error'); // Green for approve, Red for reject

// //             // Refresh the user list so the user disappears
// //             fetchPendingUsers();
// //         } catch (err) {
// //             setError(`Action failed: ${err.message}`);
// //         }
// //     };
    
// //     // (Your Confirmation Modal code can stay here if you have it)

// //     if (loading) return <p className="text-center mt-8 text-lg">Loading pending users...</p>;

// //     // Dynamically set the message style based on its type
// //     const messageStyles = messageType === 'success' 
// //         ? 'bg-green-100 border-green-400 text-green-700' 
// //         : 'bg-red-100 border-red-400 text-red-700';

// //     return (
// //         <div className="container mx-auto p-4 sm:p-6 lg:p-8">
// //             <h1 className="text-3xl font-bold text-gray-800 mb-6">Verify New Users</h1>

// //             {message && <div className={`${messageStyles} border px-4 py-3 rounded relative mb-4`} role="alert">{message}</div>}
// //             {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

// //             {pendingUsers.length === 0 ? (
// //                 <div className="bg-white p-8 rounded-lg shadow-md text-center">
// //                     <p className="text-gray-600 text-lg">There are no new registration requests to review.</p>
// //                 </div>
// //             ) : (
// //                 <div className="overflow-x-auto bg-white rounded-lg shadow">
// //                     <table className="min-w-full divide-y divide-gray-200">
// //                         <thead className="bg-gray-50">
// //                              <tr>
// //                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
// //                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
// //                                 <th className="px-6 py-3 text-left text-xs font-medium text-ड़ियां-500 uppercase tracking-wider">Role</th>
// //                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
// //                                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody className="bg-white divide-y divide-gray-200">
// //                             {pendingUsers.map((pUser) => (
// //                                 <tr key={pUser._id}>
// //                                     <td className="px-6 py-4">{pUser.name}</td>
// //                                     <td className="px-6 py-4">{pUser.email}</td>
// //                                     <td className="px-6 py-4">{pUser.role}</td>
// //                                     <td className="px-6 py-4">
// //                                         <a href={`http://localhost:5000/${pUser.kycDocument.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1">
// //                                             <FileText size={16} />
// //                                             <span>View Document</span>
// //                                         </a>
// //                                     </td>
// //                                     <td className="px-6 py-4 text-center space-x-2">
// //                                         <button onClick={() => handleAction(pUser._id, 'approve')} className="p-2 rounded-full text-green-600 bg-green-100 hover:bg-green-200" title="Approve">
// //                                             <ShieldCheck size={20} />
// //                                         </button>
// //                                         <button onClick={() => handleAction(pUser._id, 'reject')} className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200" title="Reject">
// //                                             <ShieldX size={20} />
// //                                         </button>
// //                                     </td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default VerifyUsersPage;









// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { ShieldCheck, ShieldX, FileText } from 'lucide-react';

// const VerifyUsersPage = () => {
//     const [pendingUsers, setPendingUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
    
//     // We will use state for both the message and its type ('success' or 'error')
//     const [message, setMessage] = useState('');
//     const [messageType, setMessageType] = useState('success'); 
    
//     const { user } = useAuth();

//     const fetchPendingUsers = async () => {
//         if (!user || !user.token) return;
//         setLoading(true);
//         setError('');
//         try {
//             const response = await fetch('http://localhost:5000/api/verifier/pending-users', {
//                 headers: { 'Authorization': `Bearer ${user.token}` },
//             });
//             const data = await response.json();
//             if (!response.ok) throw new Error(data.message || 'Failed to fetch users.');
//             setPendingUsers(data);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if(user?.token) {
//             fetchPendingUsers();
//         }
//     }, [user]);

//     const handleAction = async (userId, action) => {
//         // This function will now work correctly for BOTH approve and reject
//         const endpoint = action === 'approve' ? 'verify-user' : 'reject-user';
//         setMessage('');
//         setError('');
//         try {
//             const response = await fetch(`http://localhost:5000/api/verifier/${endpoint}/${userId}`, {
//                 method: 'PUT',
//                 headers: { 'Authorization': `Bearer ${user.token}` },
//             });
            
//             const data = await response.json();
//             if (!response.ok) throw new Error(data.message);

//             // Set the message and its type for correct color styling
//             setMessage(data.message);
//             setMessageType(action === 'approve' ? 'success' : 'error'); // Green for approve, Red for reject

//             // Refresh the user list so the user disappears
//             fetchPendingUsers();
//         } catch (err) {
//             setError(`Action failed: ${err.message}`);
//         }
//     };
    
//     // (Your Confirmation Modal code can stay here if you have it)

//     if (loading) return <p className="text-center mt-8 text-lg">Loading pending users...</p>;

//     // Dynamically set the message style based on its type
//     const messageStyles = messageType === 'success' 
//         ? 'bg-green-100 border-green-400 text-green-700' 
//         : 'bg-red-100 border-red-400 text-red-700';

//     return (
//         <div className="container mx-auto p-4 sm:p-6 lg:p-8">
//             <h1 className="text-3xl font-bold text-gray-800 mb-6">Verify New Users</h1>

//             {message && <div className={`${messageStyles} border px-4 py-3 rounded relative mb-4`} role="alert">{message}</div>}
//             {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

//             {pendingUsers.length === 0 ? (
//                 <div className="bg-white p-8 rounded-lg shadow-md text-center">
//                     <p className="text-gray-600 text-lg">There are no new registration requests to review.</p>
//                 </div>
//             ) : (
//                 <div className="overflow-x-auto bg-white rounded-lg shadow">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                              <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-ड़ियां-500 uppercase tracking-wider">Role</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
//                                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {pendingUsers.map((pUser) => (
//                                 <tr key={pUser._id}>
//                                     <td className="px-6 py-4">{pUser.name}</td>
//                                     <td className="px-6 py-4">{pUser.email}</td>
//                                     <td className="px-6 py-4">{pUser.role}</td>
//                                     <td className="px-6 py-4">
//                                         <a href={`http://localhost:5000/${pUser.kycDocument.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1">
//                                             <FileText size={16} />
//                                             <span>View Document</span>
//                                         </a>
//                                     </td>
//                                     <td className="px-6 py-4 text-center space-x-2">
//                                         <button onClick={() => handleAction(pUser._id, 'approve')} className="p-2 rounded-full text-green-600 bg-green-100 hover:bg-green-200" title="Approve">
//                                             <ShieldCheck size={20} />
//                                         </button>
//                                         <button onClick={() => handleAction(pUser._id, 'reject')} className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200" title="Reject">
//                                             <ShieldX size={20} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default VerifyUsersPage;


import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ShieldX, FileText } from 'lucide-react';

const VerifyUsersPage = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success'); 
    
    const { user } = useAuth(); // This context must store the token

    const fetchPendingUsers = async () => {
        if (!user || !user.token) { // This check is now valid
             setLoading(false); // Stop loading if no token
             return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/verifier/pending-users', {
                // REMOVED 'credentials: include'
                headers: { 
                    'Authorization': `Bearer ${user.token}` // ADDED Auth header
                },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch users.');
            setPendingUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // This check will now work, assuming your AuthContext saves the token from login
        if(user?.token) {
            fetchPendingUsers();
        } else {
            setLoading(false); // Make sure to stop loading if no user/token
        }
    }, [user]);

    const handleAction = async (userId, action) => {
        if (!user || !user.token) { // Add safety check
            setError('You are not authorized.');
            return;
        }
        const endpoint = action === 'approve' ? 'verify-user' : 'reject-user';
        setMessage('');
        setError('');
        try {
            const response = await fetch(`http://localhost:5000/api/verifier/${endpoint}/${userId}`, {
                method: 'PUT',
                // REMOVED 'credentials: include'
                headers: { 
                    'Authorization': `Bearer ${user.token}` // ADDED Auth header
                },
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setMessage(data.message);
            setMessageType(action === 'approve' ? 'success' : 'error');

            fetchPendingUsers();
        } catch (err) {
            setError(`Action failed: ${err.message}`);
        }
    };
    
    if (loading) return <p className="text-center mt-8 text-lg">Loading pending users...</p>;

    const messageStyles = messageType === 'success' 
        ? 'bg-green-100 border-green-400 text-green-700' 
        : 'bg-red-100 border-red-400 text-red-700';

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Verify New Users</h1>

            {message && <div className={`${messageStyles} border px-4 py-3 rounded relative mb-4`} role="alert">{message}</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            {pendingUsers.length === 0 && !loading ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-gray-600 text-lg">There are no new registration requests to review.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pendingUsers.map((pUser) => (
                                <tr key={pUser._id}>
                                    <td className="px-6 py-4">{pUser.name}</td>
                                    <td className="px-6 py-4">{pUser.email}</td>
                                    <td className="px-6 py-4">{pUser.role}</td>
                                    <td className="px-6 py-4">
                                        <a href={`http://localhost:5000/${pUser.kycDocument.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1">
                                            <FileText size={16} />
                                            <span>View Document</span>
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        <button onClick={() => handleAction(pUser._id, 'approve')} className="p-2 rounded-full text-green-600 bg-green-100 hover:bg-green-200" title="Approve">
                                            <ShieldCheck size={20} />
                                        </button>
                                        <button onClick={() => handleAction(pUser._id, 'reject')} className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200" title="Reject">
                                            <ShieldX size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default VerifyUsersPage;











