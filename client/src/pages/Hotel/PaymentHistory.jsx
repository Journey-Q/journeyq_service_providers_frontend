import React, { useState } from 'react';
import Sidebar from '../../components/SidebarHotel';
import { FiDollarSign, FiCalendar, FiUser, FiInfo, FiFilter, FiCreditCard, FiMail, FiPhone } from 'react-icons/fi';

const PaymentHistory = () => {
  // Sample payment data - only completed transactions with booking IDs
  const allPayments = [
    {
      id: 'PMT-2025-0615-001',
      bookingId: 'BK-2025-0615-001',
      guest: { 
        name: 'John D. Silva', 
        room: 'Deluxe Suite #302',
        email: 'john.silva@example.com',
        phone: '+94 77 123 4567',
        address: 'No. 15, Galle Road, Colombo 03'
      },
      date: 'June 15, 2025',
      time: '10:45 AM',
      amount: 45000,
      method: 'Credit Card (VISA)',
      status: 'completed',
      invoice: '#INV-2025-0615-001',
      cardLastFour: '4532',
      transactionId: 'TXN-901234567',
      checkIn: 'June 15, 2025',
      checkOut: 'June 18, 2025',
      nights: 3
    },
    {
      id: 'PMT-2025-0528-002',
      bookingId: 'BK-2025-0528-002',
      guest: { 
        name: 'Sarah Johnson', 
        room: 'Premium Room #105',
        email: 'sarah.j@example.com',
        phone: '+94 75 888 9999',
        address: 'No. 123, Hill Street, Nuwara Eliya'
      },
      date: 'May 28, 2025',
      time: '2:30 PM',
      amount: 27500,
      method: 'Credit Card (VISA)',
      status: 'completed',
      invoice: '#INV-2025-0528-002',
      cardLastFour: '1234',
      transactionId: 'TXN-812345678',
      checkIn: 'May 28, 2025',
      checkOut: 'May 30, 2025',
      nights: 2
    },
    {
      id: 'PMT-2025-0405-003',
      bookingId: 'BK-2025-0405-003',
      guest: { 
        name: 'Michael Brown', 
        room: 'Family Suite #210',
        email: 'michael.b@example.com',
        phone: '+94 78 246 8135',
        address: 'No. 67, Main Street, Galle'
      },
      date: 'April 5, 2025',
      time: '11:20 AM',
      amount: 38000,
      method: 'Bank Transfer',
      status: 'completed',
      invoice: '#INV-2025-0405-003',
      bankReference: 'BT-567890123',
      transactionId: 'TXN-723456789',
      checkIn: 'April 5, 2025',
      checkOut: 'April 10, 2025',
      nights: 5
    },
    {
      id: 'PMT-2025-0320-004',
      bookingId: 'BK-2025-0320-004',
      guest: { 
        name: 'Alice M. Smith', 
        room: 'Standard Double #215',
        email: 'alice.smith@example.com',
        phone: '+94 71 987 6543',
        address: 'No. 42, Kandy Road, Peradeniya'
      },
      date: 'March 20, 2025',
      time: '3:20 PM',
      amount: 30000,
      method: 'Bank Transfer',
      status: 'completed',
      invoice: '#INV-2025-0320-004',
      bankReference: 'BT-678901234',
      transactionId: 'TXN-634567890',
      checkIn: 'March 20, 2025',
      checkOut: 'March 23, 2025',
      nights: 3
    },
    {
      id: 'PMT-2025-0215-005',
      bookingId: 'BK-2025-0215-005',
      guest: { 
        name: 'Robert K. Lee', 
        room: 'Executive Suite #401',
        email: 'robert.lee@example.com',
        phone: '+94 76 555 1234',
        address: 'No. 88, Negombo Road, Katunayake'
      },
      date: 'February 15, 2025',
      time: '9:15 AM',
      amount: 55000,
      method: 'Credit Card (MasterCard)',
      status: 'completed',
      invoice: '#INV-2025-0215-005',
      cardLastFour: '8765',
      transactionId: 'TXN-545678901',
      checkIn: 'February 15, 2025',
      checkOut: 'February 20, 2025',
      nights: 5
    }
  ];

  // State for filters and popup
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

  // Filter payments based on selected filters (only completed transactions)
  const filteredPayments = allPayments.filter(payment => {
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
                  <th className="px-6 py-4 text-left font-medium">Payment ID</th>
                  <th className="px-6 py-4 text-left font-medium">Booking ID</th>
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
                      <td className="px-6 py-4 font-mono text-sm text-[#2953A6]">
                        {payment.id}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-green-600">
                        {payment.bookingId}
                      </td>
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
                          <FiDollarSign className="text-green-600" />
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
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
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
                      <div className="font-mono text-[#2953A6] font-semibold">{payment.id}</div>
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
                          <span className="text-sm text-gray-600">Amount Paid:</span>
                          <div className="font-bold text-green-600 text-lg">{formatAmount(payment.amount)}</div>
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