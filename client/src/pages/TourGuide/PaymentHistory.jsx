import React, { useState } from 'react';
import Sidebar from '../../components/SidebarTourGuide';
import { FiDollarSign, FiCalendar, FiUser, FiInfo, FiFilter, FiCreditCard, FiMail, FiPhone } from 'react-icons/fi';

const PaymentHistory = () => {
  // Sample payment data - only completed transactions
  const allPayments = [
    {
      id: 'PMT-2025-0615-001',
      guest: { 
        name: 'John D. Silva', 
        tour: 'Sigiriya & Dambulla Day Tour',
        email: 'john.silva@example.com',
        phone: '+94 77 123 4567',
        nationality: 'United States'
      },
      date: 'June 15, 2025',
      time: '10:45 AM',
      amount: 45000,
      status: 'completed',
      invoice: '#INV-2025-0615-001',
      transactionId: 'TXN-901234567',
      tourDate: 'June 18, 2025',
      participants: 4,
      pickupLocation: 'Colombo Hotel'
    },
    {
      id: 'PMT-2025-0528-002',
      guest: { 
        name: 'Sarah Johnson', 
        tour: 'Kandy Cultural Experience',
        email: 'sarah.j@example.com',
        phone: '+94 75 888 9999',
        nationality: 'Australia'
      },
      date: 'May 28, 2025',
      time: '2:30 PM',
      amount: 27500,
      status: 'completed',
      invoice: '#INV-2025-0528-002',
      transactionId: 'TXN-812345678',
      tourDate: 'May 30, 2025',
      participants: 2,
      pickupLocation: 'Nuwara Eliya Hotel'
    },
    {
      id: 'PMT-2025-0405-003',
      guest: { 
        name: 'Michael Brown', 
        tour: 'Galle Fort Walking Tour',
        email: 'michael.b@example.com',
        phone: '+94 78 246 8135',
        nationality: 'United Kingdom'
      },
      date: 'April 5, 2025',
      time: '11:20 AM',
      amount: 38000,
      status: 'completed',
      invoice: '#INV-2025-0405-003',
      transactionId: 'TXN-723456789',
      tourDate: 'April 10, 2025',
      participants: 3,
      pickupLocation: 'Galle Bus Station'
    },
    {
      id: 'PMT-2025-0320-004',
      guest: { 
        name: 'Alice M. Smith', 
        tour: 'Tea Plantation Tour',
        email: 'alice.smith@example.com',
        phone: '+94 71 987 6543',
        nationality: 'Canada'
      },
      date: 'March 20, 2025',
      time: '3:20 PM',
      amount: 30000,
      status: 'completed',
      invoice: '#INV-2025-0320-004',
      transactionId: 'TXN-634567890',
      tourDate: 'March 23, 2025',
      participants: 2,
      pickupLocation: 'Kandy City Center'
    },
    {
      id: 'PMT-2025-0215-005',
      guest: { 
        name: 'Robert K. Lee', 
        tour: 'Whale Watching Expedition',
        email: 'robert.lee@example.com',
        phone: '+94 76 555 1234',
        nationality: 'Singapore'
      },
      date: 'February 15, 2025',
      time: '9:15 AM',
      amount: 55000,
      status: 'completed',
      invoice: '#INV-2025-0215-005',
      transactionId: 'TXN-545678901',
      tourDate: 'February 20, 2025',
      participants: 5,
      pickupLocation: 'Mirissa Beach Hotel'
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
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Payment History</h1>
          <p className="text-slate-600 mt-2">
            View all completed payments for your guided tours
          </p>
        </header>
       
        {/* Filter Section */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <FiFilter className="text-slate-500 mr-2" />
              <h3 className="font-medium text-slate-700">Filter Payments</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
              {/* Month Filter */}
              <div className="relative">
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md"
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
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md"
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
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Payment ID</th>
                  <th className="px-6 py-4 text-left font-medium">Guest Details</th>
                  <th className="px-6 py-4 text-left font-medium">Date & Time</th>
                  <th className="px-6 py-4 text-left font-medium">Amount</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-blue-600">
                        {payment.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{payment.guest.name}</div>
                        <div className="text-sm text-slate-500">{payment.guest.tour}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-slate-400" />
                          <span>
                            {payment.date} <span className="text-slate-400">at</span> {payment.time}
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
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          onClick={() => setSelectedPayment(selectedPayment === payment.id ? null : payment.id)}
                        >
                          <FiInfo className="mr-1" /> Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-slate-500">
                      No completed payments found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex justify-between items-center">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of <span className="font-medium">{filteredPayments.length}</span> completed payments
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">
                Previous
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Payment Details Popup Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPayment(null)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const payment = filteredPayments.find(p => p.id === selectedPayment);
                return payment ? (
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                      <h3 className="text-xl font-bold text-slate-800">Payment Details</h3>
                      <button 
                        onClick={() => setSelectedPayment(null)}
                        className="text-slate-400 hover:text-slate-600 text-xl font-semibold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Payment ID */}
                    <div className="mb-4 p-3 bg-blue-100 rounded-lg">
                      <div className="font-mono text-blue-600 font-semibold">{payment.id}</div>
                    </div>

                    {/* Guest Details */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-slate-800 text-lg border-b border-gray-100 pb-2">Guest Information</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FiUser className="text-blue-600 w-5 h-5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-slate-800">{payment.guest.name}</div>
                            <div className="text-sm text-slate-600">{payment.guest.nationality}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <FiMail className="text-blue-600 w-5 h-5 flex-shrink-0" />
                          <div className="text-slate-700">{payment.guest.email}</div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <FiPhone className="text-blue-600 w-5 h-5 flex-shrink-0" />
                          <div className="text-slate-700">{payment.guest.phone}</div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-slate-800 text-lg border-b border-gray-100 pb-2">Payment Information</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-slate-600">Payment Date:</span>
                          <div className="font-semibold text-slate-800">{payment.date}</div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-slate-600">Amount Paid:</span>
                          <div className="font-bold text-green-600 text-lg">{formatAmount(payment.amount)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Tour Details */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-slate-800 text-lg border-b border-gray-100 pb-2">Tour Information</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <span className="text-sm text-slate-600">Tour Name:</span>
                          <div className="font-semibold text-slate-800">{payment.guest.tour}</div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-slate-600">Tour Date:</span>
                          <div className="font-semibold text-slate-800">{payment.tourDate}</div>
                        </div>

                        <div>
                          <span className="text-sm text-slate-600">Participants:</span>
                          <div className="font-semibold text-slate-800">{payment.participants}</div>
                        </div>
                        
                        <div className="col-span-2">
                          <span className="text-sm text-slate-600">Pickup Location:</span>
                          <div className="font-semibold text-slate-800">{payment.pickupLocation}</div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-slate-600">Status:</span>
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