import React, { useState } from 'react';
import { Edit2, Save, X, Check, AlertCircle, Eye, EyeOff, Copy } from 'lucide-react';
import Sidebar from '../../components/SidebarTourGuide';

const BankDetailsPage = () => {
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: 'Sri Lanka Tour Guide Agency',
    accountNumber: '1234567890123456',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank',
    branchName: 'Commercial Street Branch',
    accountType: 'Current',
    mobileNumber: '+91 98765 43210',
    emailId: 'finance@grandpalace.com',
    isVerified: true,
    verificationStatus: 'verified', // 'pending', 'verified', 'failed'
    lastVerified: '2025-01-15'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [editForm, setEditForm] = useState({ ...bankDetails });
  const [errors, setErrors] = useState({});

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...bankDetails });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editForm.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

    if (!editForm.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (editForm.accountNumber.length < 9 || editForm.accountNumber.length > 18) {
      newErrors.accountNumber = 'Account number must be between 9-18 digits';
    }

    if (!editForm.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(editForm.ifscCode)) {
      newErrors.ifscCode = 'Invalid IFSC code format';
    }

    if (!editForm.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!editForm.branchName.trim()) {
      newErrors.branchName = 'Branch name is required';
    }

    if (!editForm.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[+]?[1-9][\d\s-()]{8,15}$/.test(editForm.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number format';
    }

    if (!editForm.emailId.trim()) {
      newErrors.emailId = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.emailId)) {
      newErrors.emailId = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    setBankDetails({ 
      ...editForm, 
      verificationStatus: 'pending', 
      isVerified: false 
    });
    setIsEditing(false);
    
    // Simulate verification process
    setTimeout(() => {
      setBankDetails(prev => ({ 
        ...prev, 
        verificationStatus: 'verified', 
        isVerified: true,
        lastVerified: new Date().toISOString().split('T')[0]
      }));
    }, 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...bankDetails });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return '';
    const visible = accountNumber.slice(-4);
    const masked = '*'.repeat(accountNumber.length - 4);
    return masked + visible;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <Check className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'failed':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Bank Details Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-semibold text-gray-800">Bank Account Information</h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bankDetails.verificationStatus)}`}>
                    {getStatusIcon(bankDetails.verificationStatus)}
                    <span className="ml-1 capitalize">{bankDetails.verificationStatus}</span>
                  </span>
                </div>
                
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#0B9ED9] text-white rounded-lg hover:bg-[#0891C7] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Details</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
              
              {bankDetails.verificationStatus === 'verified' && (
                <p className="text-sm text-gray-500 mt-2">
                  Last verified on {new Date(bankDetails.lastVerified).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Bank Details Form */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Holder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.accountHolderName}
                      onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.accountHolderName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter account holder name"
                    />
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-800">{bankDetails.accountHolderName}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.accountHolderName)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {errors.accountHolderName && (
                    <p className="text-red-600 text-xs mt-1">{errors.accountHolderName}</p>
                  )}
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.accountNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter account number"
                    />
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-800 font-mono">
                        {showAccountNumber ? bankDetails.accountNumber : maskAccountNumber(bankDetails.accountNumber)}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowAccountNumber(!showAccountNumber)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(bankDetails.accountNumber)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  {errors.accountNumber && (
                    <p className="text-red-600 text-xs mt-1">{errors.accountNumber}</p>
                  )}
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.ifscCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter IFSC code"
                    />
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-800 font-mono">{bankDetails.ifscCode}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.ifscCode)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {errors.ifscCode && (
                    <p className="text-red-600 text-xs mt-1">{errors.ifscCode}</p>
                  )}
                </div>

                {/* Bank Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.bankName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter bank name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-800">{bankDetails.bankName}</span>
                    </div>
                  )}
                  {errors.bankName && (
                    <p className="text-red-600 text-xs mt-1">{errors.bankName}</p>
                  )}
                </div>

                {/* Branch Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.branchName}
                      onChange={(e) => handleInputChange('branchName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.branchName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter branch name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-800">{bankDetails.branchName}</span>
                    </div>
                  )}
                  {errors.branchName && (
                    <p className="text-red-600 text-xs mt-1">{errors.branchName}</p>
                  )}
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type *
                  </label>
                  {isEditing ? (
                    <select
                      value={editForm.accountType}
                      onChange={(e) => handleInputChange('accountType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-800">{bankDetails.accountType}</span>
                    </div>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.mobileNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter mobile number"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-800">{bankDetails.mobileNumber}</span>
                    </div>
                  )}
                  {errors.mobileNumber && (
                    <p className="text-red-600 text-xs mt-1">{errors.mobileNumber}</p>
                  )}
                </div>

                {/* Email ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email ID *
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.emailId}
                      onChange={(e) => handleInputChange('emailId', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.emailId ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-800">{bankDetails.emailId}</span>
                    </div>
                  )}
                  {errors.emailId && (
                    <p className="text-red-600 text-xs mt-1">{errors.emailId}</p>
                  )}
                </div>
              </div>

              {/* Verification Notice */}
              {bankDetails.verificationStatus === 'pending' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Verification in Progress</h4>
                      <p className="text-xs text-yellow-700 mt-1">
                        Your bank details are being verified. This may take a few minutes. You'll receive a confirmation once verified.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {bankDetails.verificationStatus === 'failed' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <X className="w-5 h-5 text-red-600 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Verification Failed</h4>
                      <p className="text-xs text-red-700 mt-1">
                        Bank details could not be verified. Please check the information and try again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsPage;