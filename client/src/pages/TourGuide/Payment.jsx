import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import PaymentService from '../../api_service/PaymentService';

const PaymentModal = ({ isOpen, onClose, promotion, onPaymentSuccess }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Advertisement pricing (you can customize these)
  const pricingPlans = {
    basic: { name: 'Basic Plan', price: 2359, duration: '7 days', features: ['Standard visibility'] },
    premium: { name: 'Premium Plan', price: 5899, duration: '30 days', features: ['High visibility', 'Featured placement'] },
    featured: { name: 'Featured Plan', price: 11799, duration: '60 days', features: ['Maximum visibility', 'Top placement'] }
  };

  const [selectedPlan, setSelectedPlan] = useState('premium');

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!paymentData.cardNumber.replace(/\s/g, '') || paymentData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Valid card number is required';
    }

    if (!paymentData.expiryDate || paymentData.expiryDate.length < 5) {
      newErrors.expiryDate = 'Valid expiry date is required';
    }

    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = 'Valid CVV is required';
    }

    if (!paymentData.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
    }

    if (!paymentData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!paymentData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Prepare payment data for backend
      const backendPaymentData = {
        promotionId: promotion.id,
        plan: selectedPlan,
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        cardholderName: paymentData.cardholderName,
        billingAddress: paymentData.billingAddress,
        city: paymentData.city,
        zipCode: paymentData.zipCode
      };

      // Call backend payment API
      const response = await PaymentService.processPayment(backendPaymentData);
      
      // Payment successful
      setPaymentComplete(true);
      
      // Call success callback after a short delay
      setTimeout(() => {
        onPaymentSuccess({
          promotionId: promotion.id,
          plan: selectedPlan,
          amount: pricingPlans[selectedPlan].price,
          transactionId: response.transactionId || 'TXN' + Date.now()
        });
        onClose();
        setPaymentComplete(false);
        setIsProcessing(false);
      }, 2000);

    } catch (error) {
      setIsProcessing(false);
      setErrors({ general: error.message || 'Payment failed. Please try again.' });
    }
  };

  const closeModal = () => {
    if (!isProcessing) {
      onClose();
      setPaymentData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        billingAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      });
      setErrors({});
      setPaymentComplete(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Advertise Your Promotion</h2>
              <p className="text-gray-600 mt-1">Choose a plan and complete payment to start advertising</p>
            </div>
            <button
              onClick={closeModal}
              disabled={isProcessing}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {paymentComplete ? (
            // Payment Success Screen
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">
                Your promotion "{promotion?.title}" is now being advertised.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="text-sm text-green-800">
                  <div className="flex justify-between mb-1">
                    <span>Plan:</span>
                    <span className="font-medium">{pricingPlans[selectedPlan].name}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Duration:</span>
                    <span className="font-medium">{pricingPlans[selectedPlan].duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-medium">Rs.{pricingPlans[selectedPlan].price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Promotion Details & Pricing */}
              <div>
                {/* Promotion Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Promotion Details</h3>
                  <div className="flex items-start space-x-4">
                    <img 
                      src={promotion?.image} 
                      alt={promotion?.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{promotion?.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{promotion?.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {promotion?.discount}% OFF
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {promotion?.validFrom} to {promotion?.validTo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Plans */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Advertisement Plan</h3>
                  <div className="space-y-3">
                    {Object.entries(pricingPlans).map(([key, plan]) => (
                      <div 
                        key={key}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedPlan === key 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPlan(key)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="plan"
                              checked={selectedPlan === key}
                              onChange={() => setSelectedPlan(key)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <div>
                              <h4 className="font-medium text-gray-800">{plan.name}</h4>
                              <p className="text-sm text-gray-600">{plan.duration} • {plan.features.join(' • ')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-800">Rs.{plan.price.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">/{plan.duration}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{pricingPlans[selectedPlan].name}</span>
                      <span>Rs.{pricingPlans[selectedPlan].price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>GST (18%)</span>
                      <span>Rs.{Math.round(pricingPlans[selectedPlan].price * 0.18).toLocaleString()}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>Rs.{Math.round(pricingPlans[selectedPlan].price * 1.18).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Form */}
              <div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Lock className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">Secure Payment</span>
                  </div>

                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                        <span className="text-sm text-red-800">{errors.general}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={paymentData.cardholderName}
                        onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.cardholderName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.cardholderName && (
                        <p className="text-red-600 text-xs mt-1">{errors.cardholderName}</p>
                      )}
                    </div>

                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={paymentData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        <CreditCard className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                      </div>
                      {errors.cardNumber && (
                        <p className="text-red-600 text-xs mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    {/* Expiry Date & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={paymentData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.expiryDate && (
                          <p className="text-red-600 text-xs mt-1">{errors.expiryDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          value={paymentData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.cvv ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="123"
                          maxLength="4"
                        />
                        {errors.cvv && (
                          <p className="text-red-600 text-xs mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                      <input
                        type="text"
                        value={paymentData.billingAddress}
                        onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.billingAddress ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="123 Main Street"
                      />
                      {errors.billingAddress && (
                        <p className="text-red-600 text-xs mt-1">{errors.billingAddress}</p>
                      )}
                    </div>

                    {/* City, State, ZIP */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={paymentData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.city ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Mumbai"
                        />
                        {errors.city && (
                          <p className="text-red-600 text-xs mt-1">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          value={paymentData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.zipCode ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="400001"
                        />
                        {errors.zipCode && (
                          <p className="text-red-600 text-xs mt-1">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>

                    {/* State & Country */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={paymentData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Maharashtra"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={paymentData.country}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4" />
                        <span>Pay Rs.{Math.round(pricingPlans[selectedPlan].price * 1.18).toLocaleString()}</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    Your payment information is encrypted and secure. By proceeding, you agree to our terms of service.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;