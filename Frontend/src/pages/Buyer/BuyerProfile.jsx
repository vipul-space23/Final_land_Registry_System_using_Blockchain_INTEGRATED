import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Correct path assumed
import { User, CreditCard, CheckCircle, Edit2, Save, X, Copy, Check, ArrowLeft, Mail, Phone as PhoneIcon, Wallet } from 'lucide-react'; // Added Edit/Save icons

const BuyerProfile = () => {
  const { user, updateUser } = useAuth(); // Get user and updateUser function
  const [isEditMode, setIsEditMode] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
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
    if (!text) return;
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
    if (editData.phone && !/^[0-9]{10}$/.test(editData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits (if provided)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes in edit mode
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

    const token = user?.token;
    if (!token) {
        setErrors({ form: 'Authentication error. Please log in again.' });
        return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setErrors({});

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      if (updateUser) {
         updateUser({ ...user, ...data }); // Update context with latest data
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditMode(false); // Switch back to view mode
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
    setEditData({ // Reset form to current user data
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setErrors({});
    setIsEditMode(false); // Switch back to view mode
  };

  return (
    <div className="space-y-6">
      {/* VIEW MODE */}
      {!isEditMode ? (
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between border-b pb-6 mb-6">
            {/* User Info */}
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold flex-shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="ml-6 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{user.name || 'User'}</h1>
                <p className="text-sm text-gray-500">Verified Buyer</p>
              </div>
            </div>
            {/* Edit Button & KYC Status */}
            <div className="flex flex-col items-center md:items-end space-y-3">
                 <button
                    onClick={() => {
                      setIsEditMode(true);
                      setEditData({ // Pre-fill form
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                      });
                      setErrors({});
                      setSaveSuccess(false);
                    }}
                    className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-200 transition text-sm"
                  >
                    <Edit2 size={16} /> Edit Profile
                  </button>
                 {user.kycStatus === 'verified' && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-5 h-5 mr-1" />
                    <span className="font-semibold">KYC Verified</span>
                  </div>
                 )}
            </div>
          </div>

          {/* Wallet & Profile Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-blue-600" /> Wallet & Profile Details
            </h2>
            <div className="p-4 bg-gray-50 rounded-lg space-y-3 border border-gray-200">
               {/* Email */}
               <div className="flex items-center justify-between">
                 <div className="flex items-center text-sm">
                    <Mail size={16} className="text-gray-500 mr-2"/>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900 truncate" title={user.email || ''}>{user.email || 'Not provided'}</span>
                 </div>
                 <button
                    onClick={() => copyToClipboard(user.email, 'email')}
                    disabled={!user.email}
                    className="text-indigo-600 hover:text-indigo-700 transition p-1 hover:bg-indigo-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title={user.email ? "Copy Email" : "No email to copy"}
                  >
                    {copiedField === 'email' ? <Check size={18} /> : <Copy size={18} />}
                  </button>
               </div>
               {/* Phone */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <PhoneIcon size={16} className="text-gray-500 mr-2"/>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="ml-2 text-gray-900">{user.phone || 'Not provided'}</span>
                  </div>
                  {user.phone && (
                   <button
                        onClick={() => copyToClipboard(user.phone, 'phone')}
                        className="text-indigo-600 hover:text-indigo-700 transition p-1 hover:bg-indigo-50 rounded-lg"
                        title="Copy Phone Number"
                    >
                        {copiedField === 'phone' ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  )}
               </div>
               {/* Wallet Address */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Wallet size={16} className="text-gray-500 mr-2"/>
                    <span className="font-medium text-gray-700">Wallet:</span>
                    <span className="ml-2 font-mono text-gray-900 truncate" title={user.walletAddress || ''}>
                      {user.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 'Not connected'}
                    </span>
                  </div>
                  {user.walletAddress && (
                    <button
                      onClick={() => copyToClipboard(user.walletAddress, 'wallet')}
                      className="text-indigo-600 hover:text-indigo-700 transition p-1 hover:bg-indigo-50 rounded-lg"
                      title="Copy Wallet Address"
                    >
                      {copiedField === 'wallet' ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  )}
               </div>
            </div>
          </div>
        </div>
      ) : (
        /* EDIT MODE */
        <div className="transition-all duration-300 bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 border-b pb-4">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Cancel Edit"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Your Profile</h1>
          </div>

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
                type="tel"
                name="phone"
                value={editData.phone}
                onChange={handleEditChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter 10-digit phone number (Optional)"
                maxLength="10"
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>

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
      )}
    </div>
  );
};

export default BuyerProfile;