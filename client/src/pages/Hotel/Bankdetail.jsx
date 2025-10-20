import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Check, AlertCircle, Eye, EyeOff, Copy, Plus } from 'lucide-react';
import Sidebar from '../../components/SidebarHotel';
import BankDetailsService from '../../api_service/BankDetailsService';

const BankDetailsPage = () => {
  const [bankDetails, setBankDetails] = useState(null);
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [editForm, setEditForm] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: 'SAVINGS',
    mobileNumber: '',
    emailId: ''
  });
  const [errors, setErrors] = useState({});
  const [serviceProviderId, setServiceProviderId] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      const serviceProvider = localStorage.getItem('serviceProvider');
      const id = serviceProvider ? JSON.parse(serviceProvider).id : null;
      
      if (!id) {
        setApiError('Service provider ID not found. Please login again.');
        setIsLoading(false);
        return;
      }
      
      setServiceProviderId(id);
      
      const data = await BankDetailsService.getBankDetailsByServiceProviderId(id);
      setBankDetails(data);
      setHasBankDetails(true);
      setEditForm({
        accountHolderName: data.accountHolderName || '',
        accountNumber: data.accountNumber || '',
        ifscCode: data.ifscCode || '',
        bankName: data.bankName || '',
        branchName: data.branchName || '',
        accountType: data.accountType || 'SAVINGS',
        mobileNumber: data.mobileNumber || '',
        emailId: data.emailId || ''
      });
    } catch (error) {
      console.error('Error fetching bank details:', error);
      if (error.message.includes('Bank details not found')) {
        setHasBankDetails(false);
        setBankDetails(null);
      } else {
        setApiError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
  };

  const handleAddNew = () => {
    setShowAddModal(true);
    setEditForm({
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branchName: '',
      accountType: 'SAVINGS',
      mobileNumber: '',
      emailId: ''
    });
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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        ...editForm,
        serviceProviderId: serviceProviderId
      };

      if (hasBankDetails && bankDetails) {
        const updatedData = await BankDetailsService.editBankDetails(serviceProviderId, payload);
        setBankDetails(updatedData);
        setIsEditing(false);
        alert('Bank details updated successfully!');
      } else {
        const createdData = await BankDetailsService.createBankDetails(payload);
        setBankDetails(createdData);
        setHasBankDetails(true);
        setShowAddModal(false);
        alert('Bank details added successfully!');
      }
      
      await fetchBankDetails();
    } catch (error) {
      console.error('Error saving bank details:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (showAddModal) {
      setShowAddModal(false);
    } else {
      setIsEditing(false);
    }
    if (bankDetails) {
      setEditForm({
        accountHolderName: bankDetails.accountHolderName || '',
        accountNumber: bankDetails.accountNumber || '',
        ifscCode: bankDetails.ifscCode || '',
        bankName: bankDetails.bankName || '',
        branchName: bankDetails.branchName || '',
        accountType: bankDetails.accountType || 'SAVINGS',
        mobileNumber: bankDetails.mobileNumber || '',
        emailId: bankDetails.emailId || ''
      });
    }
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
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

  // const getStatusColor = (status) => {
  //   const statusUpper = status?.toUpperCase();
  //   switch (statusUpper) {
  //     case 'VERIFIED':
  //       return 'text-green-600 bg-green-100';
  //     case 'PENDING':
  //       return 'text-yellow-600 bg-yellow-100';
  //     case 'FAILED':
  //       return 'text-red-600 bg-red-100';
  //     default:
  //       return 'text-gray-600 bg-gray-100';
  //   }
  // };

  const getStatusIcon = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'VERIFIED':
        return <Check className="w-4 h-4" />;
      case 'PENDING':
        return <AlertCircle className="w-4 h-4" />;
      case 'FAILED':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const renderFormFields = (isModal = false) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Account Holder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Holder Name *
        </label>
        {(isEditing && !isModal) || isModal ? (
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
            <span className="text-gray-800">{bankDetails?.accountHolderName}</span>
            <button
              onClick={() => copyToClipboard(bankDetails?.accountHolderName)}
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
        {(isEditing && !isModal) || isModal ? (
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
              {showAccountNumber ? bankDetails?.accountNumber : maskAccountNumber(bankDetails?.accountNumber)}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAccountNumber(!showAccountNumber)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => copyToClipboard(bankDetails?.accountNumber)}
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
        {(isEditing && !isModal) || isModal ? (
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
            <span className="text-gray-800 font-mono">{bankDetails?.ifscCode}</span>
            <button
              onClick={() => copyToClipboard(bankDetails?.ifscCode)}
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
        {(isEditing && !isModal) || isModal ? (
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
            <span className="text-gray-800">{bankDetails?.bankName}</span>
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
        {(isEditing && !isModal) || isModal ? (
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
            <span className="text-gray-800">{bankDetails?.branchName}</span>
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
        {(isEditing && !isModal) || isModal ? (
          <select
            value={editForm.accountType}
            onChange={(e) => handleInputChange('accountType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="SAVINGS">Savings</option>
            <option value="CURRENT">Current</option>
          </select>
        ) : (
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-800">{bankDetails?.accountType}</span>
          </div>
        )}
      </div>

      {/* Mobile Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mobile Number *
        </label>
        {(isEditing && !isModal) || isModal ? (
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
            <span className="text-gray-800">{bankDetails?.mobileNumber}</span>
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
        {(isEditing && !isModal) || isModal ? (
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
            <span className="text-gray-800">{bankDetails?.emailId}</span>
          </div>
        )}
        {errors.emailId && (
          <p className="text-red-600 text-xs mt-1">{errors.emailId}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B9ED9]"></div>
              <p className="mt-4 text-gray-600">Loading bank details...</p>
            </div>
          ) : apiError ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Bank Details</h3>
              <p className="text-gray-600 mb-6">{apiError}</p>
              <button
                onClick={fetchBankDetails}
                className="px-6 py-2 bg-[#0B9ED9] text-white rounded-lg hover:bg-[#0891C7] transition-colors"
              >
                Retry
              </button>
            </div>
          ) : !hasBankDetails ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bank Details Found</h3>
              <p className="text-gray-600 mb-6">You haven't added your bank details yet. Please add them to receive payments.</p>
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-2 px-6 py-3 bg-[#0B9ED9] text-white rounded-lg hover:bg-[#0891C7] transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Bank Details</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold text-gray-800">Bank Account Information</h2>
                    {/* {bankDetails && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bankDetails.verificationStatus)}`}>
                        {getStatusIcon(bankDetails.verificationStatus)}
                        <span className="ml-1 capitalize">{bankDetails.verificationStatus?.toLowerCase()}</span>
                      </span>
                    )} */}
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
                        disabled={isLoading}
                      >
                        <Save className="w-4 h-4" />
                        <span>{isLoading ? 'Saving...' : 'Save'}</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {bankDetails && bankDetails.verificationStatus?.toUpperCase() === 'VERIFIED' && bankDetails.lastVerified && (
                  <p className="text-sm text-gray-500 mt-2">
                    Last verified on {new Date(bankDetails.lastVerified).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Bank Details Form */}
              <div className="p-6">
                {renderFormFields(false)}

                {/* Verification Notice */}
                {/* {bankDetails && bankDetails.verificationStatus?.toUpperCase() === 'PENDING' && (
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
                )} */}

                {bankDetails && bankDetails.verificationStatus?.toUpperCase() === 'FAILED' && (
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
          )}

          {/* Add Bank Details Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Add Bank Details</h2>
                    <button
                      onClick={handleCancel}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {renderFormFields(true)}

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-[#0B9ED9] text-white rounded-lg hover:bg-[#0891C7] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Bank Details'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankDetailsPage;