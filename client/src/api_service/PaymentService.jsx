import axios from 'axios';

const API_BASE_URL = 'https://serviceprovidersservice-production-8f10.up.railway.app/service/promotions';

class PaymentService {
  
  // Process payment for promotion advertising
  static async processPayment(paymentData) {
    try {
      console.log('Sending payment request:', paymentData);
      
      const response = await axios.post(`${API_BASE_URL}/pay`, paymentData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      });

      console.log('Payment response:', response.data);
      
      if (response.data && response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Payment service error:', error);
      
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error ||
                            `Payment failed with status ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Unable to connect to payment server. Please check your internet connection.');
      } else {
        // Something else happened
        throw new Error(error.message || 'Payment processing failed');
      }
    }
  }

  // Get payment details for a promotion
  static async getPaymentDetails(promotionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${promotionId}/payment-details`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        return response.data;
      } else {
        throw new Error('Failed to fetch payment details');
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error ||
                            `Failed to fetch payment details: ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Failed to fetch payment details');
      }
    }
  }

  // Validate card number (basic Luhn algorithm)
  static validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (!/^\d{16}$/.test(cleaned)) {
      return false;
    }

    // Luhn algorithm implementation
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Validate expiry date
  static validateExpiryDate(expiryDate) {
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return false;
    }

    const [month, year] = expiryDate.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (month < 1 || month > 12) {
      return false;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  }

  // Format amount with currency
  static formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

export default PaymentService;