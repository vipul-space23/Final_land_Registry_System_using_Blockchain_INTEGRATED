// import React, { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { Edit2, Save, X, Copy, Check, ArrowLeft, Mail, User as UserIcon, Wallet } from 'lucide-react';

// const OwnerProfile = () => {
//   const { user, updateUser } = useAuth();
//   const [isEditPage, setIsEditPage] = useState(false);
//   const [copiedField, setCopiedField] = useState(null);
//   const [editData, setEditData] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     address: user?.address || '',
//   });
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);
//   const [errors, setErrors] = useState({});

//   if (!user) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-gray-600 text-lg">Please log in to view your profile.</p>
//       </div>
//     );
//   }

//   // Copy to clipboard
//   const copyToClipboard = (text, field) => {
//     navigator.clipboard.writeText(text);
//     setCopiedField(field);
//     setTimeout(() => setCopiedField(null), 2000);
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};
//     if (!editData.name.trim()) newErrors.name = 'Name is required';
//     if (!editData.email.trim()) newErrors.email = 'Email is required';
//     if (editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
//       newErrors.email = 'Invalid email format';
//     }
//     if (editData.phone && !/^[0-9]{10}$/.test(editData.phone.replace(/\D/g, ''))) {
//       newErrors.phone = 'Phone must be 10 digits';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle edit mode
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   // Save changes
//   const handleSave = async () => {
//     if (!validateForm()) return;

//     setIsSaving(true);
//     try {
//       const response = await fetch('http://localhost:5000/api/auth/profile', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(editData),
//         credentials: 'include',
//       });

//       if (!response.ok) throw new Error('Failed to update profile');
      
//       const data = await response.json();
//       if (updateUser) updateUser(data);
//       setSaveSuccess(true);
//       setTimeout(() => {
//         setSaveSuccess(false);
//         setIsEditPage(false);
//       }, 2000);
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       setErrors({ form: 'Failed to update profile. Please try again.' });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Cancel editing
//   const handleCancel = () => {
//     setEditData({
//       name: user?.name || '',
//       email: user?.email || '',
//       phone: user?.phone || '',
//       address: user?.address || '',
//     });
//     setErrors({});
//     setIsEditPage(false);
//   };

//   return (
//     <div className="space-y-6">
//       {/* VIEW PAGE */}
//       {!isEditPage ? (
//         <>
//           {/* Welcome Header */}
//           <div>
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user.name || 'User'}</h1>
//           </div>

//           {/* Profile Card */}
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             {/* Header with Edit Button */}
//             <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-6 flex justify-between items-center">
//               <h2 className="text-2xl font-bold text-white">Profile Information</h2>
//               <button
//                 onClick={() => {
//                   setIsEditPage(true);
//                   setEditData({
//                     name: user?.name || '',
//                     email: user?.email || '',
//                     phone: user?.phone || '',
//                     address: user?.address || '',
//                   });
//                 }}
//                 className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
//               >
//                 <Edit2 size={20} /> Edit Profile
//               </button>
//             </div>

//             {/* Profile Content */}
//             <div className="p-6 space-y-6">
//               {/* Name Card */}
//               <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition">
//                 <div className="flex items-center gap-3 mb-2">
//                   <UserIcon size={18} className="text-indigo-600" />
//                   <p className="text-sm text-gray-600 font-medium">Full Name</p>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-900">{user.name || 'Not provided'}</p>
//               </div>

//               {/* Email Card */}
//               <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Mail size={18} className="text-indigo-600" />
//                   <p className="text-sm text-gray-600 font-medium">Email Address</p>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <p className="text-lg font-semibold text-gray-900">{user.email || 'Not provided'}</p>
//                   <button
//                     onClick={() => copyToClipboard(user.email, 'email')}
//                     className="text-indigo-600 hover:text-indigo-700 transition p-2 hover:bg-white rounded-lg"
//                   >
//                     {copiedField === 'email' ? <Check size={20} /> : <Copy size={20} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Wallet Card */}
//               <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Wallet size={18} className="text-indigo-600" />
//                   <p className="text-sm text-gray-600 font-medium">Wallet Address</p>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <p className="text-lg font-mono font-semibold text-gray-900">
//                     {user.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 'Not connected'}
//                   </p>
//                   {user.walletAddress && (
//                     <button
//                       onClick={() => copyToClipboard(user.walletAddress, 'wallet')}
//                       className="text-indigo-600 hover:text-indigo-700 transition p-2 hover:bg-white rounded-lg"
//                     >
//                       {copiedField === 'wallet' ? <Check size={20} /> : <Copy size={20} />}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         /* EDIT PAGE */
//         <div className="transition-all duration-300">
//           {/* Header */}
//           <div className="flex items-center gap-4 mb-6">
//             <button
//               onClick={handleCancel}
//               className="p-2 hover:bg-gray-100 rounded-lg transition"
//             >
//               <ArrowLeft size={24} className="text-gray-700" />
//             </button>
//             <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
//           </div>

//           {/* Edit Card */}
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-6">
//               <h2 className="text-xl font-bold text-white">Update Your Information</h2>
//             </div>

//             <div className="p-8">
//               {/* Success Message */}
//               {saveSuccess && (
//                 <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center gap-3">
//                   <Check size={20} className="text-green-600" />
//                   <p className="text-green-800 font-semibold">Profile updated successfully!</p>
//                 </div>
//               )}

//               {/* Form Error */}
//               {errors.form && (
//                 <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
//                   <p className="text-red-800 font-semibold">{errors.form}</p>
//                 </div>
//               )}

//               {/* Form */}
//               <div className="space-y-6">
//                 {/* Name Field */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={editData.name}
//                     onChange={handleEditChange}
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ${
//                       errors.name ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter your full name"
//                   />
//                   {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
//                 </div>

//                 {/* Email Field */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={editData.email}
//                     onChange={handleEditChange}
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ${
//                       errors.email ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter your email"
//                   />
//                   {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
//                 </div>

//                 {/* Phone Field */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={editData.phone}
//                     onChange={handleEditChange}
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ${
//                       errors.phone ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter 10-digit phone number"
//                   />
//                   {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
//                 </div>

//                 {/* Address Field */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
//                   <textarea
//                     name="address"
//                     value={editData.address}
//                     onChange={handleEditChange}
//                     rows="3"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
//                     placeholder="Enter your address"
//                   />
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-3 pt-6 border-t">
//                   <button
//                     onClick={handleSave}
//                     disabled={isSaving}
//                     className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
//                   >
//                     <Save size={20} /> {isSaving ? 'Saving...' : 'Save Changes'}
//                   </button>
//                   <button
//                     onClick={handleCancel}
//                     disabled={isSaving}
//                     className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition disabled:opacity-50"
//                   >
//                     <X size={20} /> Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OwnerProfile;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Correct path assumed
import { Edit2, Save, X, Copy, Check, ArrowLeft, Mail, User as UserIcon, Wallet, Phone } from 'lucide-react'; // Added Phone icon

const OwnerProfile = () => {
  const { user, updateUser } = useAuth(); // Get user and updateUser function
  const [isEditPage, setIsEditPage] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    // Removed address
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Please log in to view your profile.</p>
      </div>
    );
  }

  // Copy to clipboard
  const copyToClipboard = (text, field) => {
    if (!text) return; // Don't copy if text is empty
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!editData.name.trim()) newErrors.name = 'Name is required';
    if (!editData.email.trim()) newErrors.email = 'Email is required';
    if (editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = 'Invalid email format';
    }
    // Make phone optional, but validate if present
    if (editData.phone && !/^[0-9]{10}$/.test(editData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits (if provided)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle edit mode input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Save changes via API
  const handleSave = async () => {
    if (!validateForm()) return;

    // ✅ Get token from AuthContext
    const token = user?.token;
    if (!token) {
        setErrors({ form: 'Authentication error. Please log in again.' });
        return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setErrors({}); // Clear previous form errors

    try {
      // ✅ Use the correct endpoint and PATCH method
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // ✅ Use token from context
        },
        body: JSON.stringify(editData),
        // 'credentials': 'include', // <-- REMOVE THIS. Not needed with token auth.
      });

      const data = await response.json(); // Always try to parse JSON

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      // ✅ Update user context with the LATEST data from backend
      if (updateUser) {
        // Ensure the backend response includes the necessary fields
        // The backend should return the updated user object, potentially including a refreshed token if needed
         updateUser({ ...user, ...data }); // Merge existing user data with updates
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditPage(false); // Go back to view mode
      }, 2000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ form: error.message || 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    // Reset editData to current user state
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      // address removed
    });
    setErrors({});
    setIsEditPage(false);
  };

  return (
    <div className="space-y-6">
      {/* VIEW PAGE */}
      {!isEditPage ? (
        <>
          {/* Welcome Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user.name || 'User'}</h1>
            {/* You could add a subtitle here if needed */}
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header with Edit Button */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Profile Information</h2>
              <button
                onClick={() => {
                  setIsEditPage(true);
                  // Pre-fill edit form with current user data
                  setEditData({
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    // address removed
                  });
                  setErrors({}); // Clear any previous errors
                  setSaveSuccess(false); // Clear success message
                }}
                className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
              >
                <Edit2 size={20} /> Edit Profile
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6">
              {/* Name Card */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition">
                <div className="flex items-center gap-3 mb-2">
                  <UserIcon size={18} className="text-indigo-600" />
                  <p className="text-sm text-gray-600 font-medium">Full Name</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{user.name || 'Not provided'}</p>
              </div>

              {/* Email Card */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={18} className="text-indigo-600" />
                  <p className="text-sm text-gray-600 font-medium">Email Address</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-900 truncate" title={user.email || ''}>{user.email || 'Not provided'}</p>
                  <button
                    onClick={() => copyToClipboard(user.email, 'email')}
                    disabled={!user.email}
                    className="text-indigo-600 hover:text-indigo-700 transition p-2 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title={user.email ? "Copy Email" : "No email to copy"}
                  >
                    {copiedField === 'email' ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition">
                <div className="flex items-center gap-3 mb-2">
                  <Phone size={18} className="text-indigo-600" />
                  <p className="text-sm text-gray-600 font-medium">Phone Number</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-900">{user.phone || 'Not provided'}</p>
                   {/* Optional: Add copy button for phone */}
                   {user.phone && (
                    <button
                        onClick={() => copyToClipboard(user.phone, 'phone')}
                        className="text-indigo-600 hover:text-indigo-700 transition p-2 hover:bg-white rounded-lg"
                        title="Copy Phone Number"
                    >
                        {copiedField === 'phone' ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                   )}
                </div>
              </div>


              {/* Wallet Card */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition">
                <div className="flex items-center gap-3 mb-2">
                  <Wallet size={18} className="text-indigo-600" />
                  <p className="text-sm text-gray-600 font-medium">Wallet Address</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-mono font-semibold text-gray-900 truncate" title={user.walletAddress || ''}>
                    {user.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 'Not connected'}
                  </p>
                  {user.walletAddress && (
                    <button
                      onClick={() => copyToClipboard(user.walletAddress, 'wallet')}
                      className="text-indigo-600 hover:text-indigo-700 transition p-2 hover:bg-white rounded-lg"
                      title="Copy Wallet Address"
                    >
                      {copiedField === 'wallet' ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* EDIT PAGE */
        <div className="transition-all duration-300">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Cancel Edit"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          </div>

          {/* Edit Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-6">
              <h2 className="text-xl font-bold text-white">Update Your Information</h2>
            </div>

            <div className="p-8">
              {/* Success Message */}
              {saveSuccess && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center gap-3">
                  <Check size={20} className="text-green-600" />
                  <p className="text-green-800 font-semibold">Profile updated successfully!</p>
                </div>
              )}

              {/* Form Error */}
              {errors.form && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
                  <p className="text-red-800 font-semibold">{errors.form}</p>
                </div>
              )}

              {/* Form */}
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel" // Use tel for better mobile input
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 10-digit phone number (Optional)"
                    maxLength="10" // Limit input length
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* REMOVED ADDRESS FIELD */}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    <Save size={20} /> {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition disabled:opacity-50"
                  >
                    <X size={20} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerProfile;