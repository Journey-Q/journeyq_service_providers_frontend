import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SidebarHotel';
import { FiDollarSign, FiCalendar, FiUser, FiInfo, FiFilter, FiCreditCard, FiMail, FiPhone } from 'react-icons/fi';
import PaymentHistoryService from '../../api_service/PaymentHistoryService';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2025');
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Available months and years for filtering
  const months = [
    { value: 'all', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const years = ['2025', '2024', '2023'];

  // Fetch payment history on component mount
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        const serviceProvider = localStorage.getItem('serviceProvider');
        const serviceProviderId = serviceProvider ? JSON.parse(serviceProvider).id : null;
        
        if (!serviceProviderId) {
          throw new Error('Service provider ID not found');
        }

        const paymentData = await PaymentHistoryService.getPaymentHistoryByServiceProviderId(serviceProviderId);
        setPayments(paymentData);
      } catch (err) {
        console.error('Error fetching payment history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  // Filter payments based on selected filters (only completed transactions)
  const filteredPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.date);
    const paymentMonth = String(paymentDate.getMonth() + 1).padStart(2, '0');
    const paymentYear = String(paymentDate.getFullYear());

    const monthMatch = monthFilter === 'all' || paymentMonth === monthFilter;
    const yearMatch = paymentYear === yearFilter;
    
    return monthMatch && yearMatch && payment.status === 'completed';
  });

  const formatAmount = (cents) => {
    return `LKR ${(cents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-gray-600">Loading payment history...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-red-600">Error: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
       
        {/* Filter Section */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <FiFilter className="text-gray-500 mr-2" />
              <h3 className="font-medium text-gray-700">Filter Payments</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
              {/* Month Filter */}
              <div className="relative">
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2953A6] focus:border-transparent rounded-md"
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Year Filter */}
              <div className="relative">
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2953A6] focus:border-transparent rounded-md"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-grey-600 text-[#2953A6] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Guest Details</th>
                  <th className="px-6 py-4 text-left font-medium">Date & Time</th>
                  <th className="px-6 py-4 text-left font-medium">Amount</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium">{payment.guest.name}</div>
                        <div className="text-sm text-gray-500">{payment.guest.room}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          <span>
                            {payment.date} <span className="text-gray-400">at</span> {payment.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">{formatAmount(payment.amount)}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <button 
                          className="inline-flex items-center text-sm text-[#2953A6] hover:text-[#1F74BF] font-medium transition-colors"
                          onClick={() => setSelectedPayment(selectedPayment === payment.id ? null : payment.id)}
                        >
                          <FiInfo className="mr-1" /> Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No completed payments found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of <span className="font-medium">{filteredPayments.length}</span> completed payments
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-100">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Payment Details Popup Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50 p-4" onClick={() => setSelectedPayment(null)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const payment = filteredPayments.find(p => p.id === selectedPayment);
                return payment ? (
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                      <h3 className="text-xl font-bold text-gray-800">Payment Details</h3>
                      <button 
                        onClick={() => setSelectedPayment(null)}
                        className="text-gray-400 hover:text-gray-600 text-xl font-semibold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Payment ID */}
                    <div className="mb-4 p-3 bg-[#2953A6]/10 rounded-lg">
                      <div className="text-sm text-gray-600">Payment ID</div>
                      <div className="font-mono text-[#2953A6] font-semibold">{payment.paymentId}</div>
                    </div>

                    {/* Related Booking */}
                    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-700">Related Booking</div>
                      <div className="font-mono text-green-600 font-semibold">{payment.bookingId}</div>
                    </div>

                    {/* Guest Details */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-gray-800 text-lg border-b border-gray-100 pb-2">Guest Information</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FiUser className="text-[#2953A6] w-5 h-5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-gray-800">{payment.guest.name}</div>
                            <div className="text-sm text-gray-600">{payment.guest.room}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <FiMail className="text-[#2953A6] w-5 h-5 flex-shrink-0" />
                          <div className="text-gray-700">{payment.guest.email}</div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <FiPhone className="text-[#2953A6] w-5 h-5 flex-shrink-0" />
                          <div className="text-gray-700">{payment.guest.phone}</div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="text-[#2953A6] w-5 h-5 flex-shrink-0 mt-1">📍</div>
                          <div className="text-gray-700">{payment.guest.address}</div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-gray-800 text-lg border-b border-gray-100 pb-2">Payment Information</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Payment Date:</span>
                          <div className="font-semibold text-gray-800">{payment.date}</div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Payment Time:</span>
                          <div className="font-semibold text-gray-800">{payment.time}</div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Amount Paid:</span>
                          <div className="font-bold text-green-600 text-lg">{formatAmount(payment.amount)}</div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Payment Method:</span>
                          <div className="font-semibold text-gray-800">{payment.method}</div>
                        </div>

                        {payment.cardLastFour && (
                          <div>
                            <span className="text-sm text-gray-600">Card Last Four:</span>
                            <div className="font-semibold text-gray-800">**** {payment.cardLastFour}</div>
                          </div>
                        )}

                        {payment.bankReference && (
                          <div>
                            <span className="text-sm text-gray-600">Bank Reference:</span>
                            <div className="font-semibold text-gray-800">{payment.bankReference}</div>
                          </div>
                        )}

                        <div>
                          <span className="text-sm text-gray-600">Transaction ID:</span>
                          <div className="font-mono text-sm text-gray-800">{payment.transactionId}</div>
                        </div>

                        <div>
                          <span className="text-sm text-gray-600">Invoice:</span>
                          <div className="font-mono text-sm text-gray-800">{payment.invoice}</div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Stay Details */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-gray-800 text-lg border-b border-gray-100 pb-2">Stay Information</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Check-in:</span>
                          <div className="font-semibold text-gray-800">{payment.checkIn}</div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Check-out:</span>
                          <div className="font-semibold text-gray-800">{payment.checkOut}</div>
                        </div>

                        <div>
                          <span className="text-sm text-gray-600">Total Nights:</span>
                          <div className="font-semibold text-gray-800">{payment.nights} {payment.nights === 1 ? 'night' : 'nights'}</div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Status:</span>
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              ✓ Completed
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PaymentHistory;