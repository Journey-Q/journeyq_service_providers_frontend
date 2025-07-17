import React, { useState } from 'react';
import Sidebar from '../../components/SidebarTravelAgency';
import { FiDollarSign, FiCalendar, FiUser, FiInfo, FiChevronDown, FiFilter } from 'react-icons/fi';

const PaymentHistory = () => {
  // Sample payment data
  const allPayments = [
    {
      id: 'PMT-2025-0615-001',
      guest: { name: 'John D. Silva', },
      date: 'June 15, 2025',
      time: '10:45 AM',
      amount: 45000,
      method: 'Credit Card (VISA)',
      status: 'completed',
      invoice: '#INV-2025-0615-001'
    },
    {
      id: 'PMT-2025-0614-002',
      guest: { name: 'Alice M. Smith',},
      date: 'June 14, 2025',
      time: '3:20 PM',
      amount: 30000,
      method: 'Bank Transfer',
      status: 'pending',
      invoice: '#INV-2025-0614-002'
    },
    {
      id: 'PMT-2025-0512-003',
      guest: { name: 'Robert K. Lee',},
      date: 'May 12, 2025',
      time: '9:15 AM',
      amount: 15000,
      method: 'Credit Card (MasterCard)',
      status: 'failed',
      invoice: '#INV-2025-0512-003',
      failureReason: 'Insufficient funds'
    },
    {
      id: 'PMT-2025-0528-004',
      guest: { name: 'Sarah Johnson',},
      date: 'May 28, 2025',
      time: '2:30 PM',
      amount: 27500,
      method: 'Credit Card (VISA)',
      status: 'completed',
      invoice: '#INV-2025-0528-004'
    },
    {
      id: 'PMT-2025-0405-005',
      guest: { name: 'Michael Brown',},
      date: 'April 5, 2025',
      time: '11:20 AM',
      amount: 38000,
      method: 'Bank Transfer',
      status: 'completed',
      invoice: '#INV-2025-0405-005'
    }
  ];

  // State for filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2025');

  // Status config
  const statusConfig = {
    completed: {
      text: 'Completed',
      color: 'bg-emerald-100 text-emerald-800',
      icon: '✓'
    },
    pending: {
      text: 'Pending',
      color: 'bg-amber-100 text-amber-800',
      icon: '⏳'
    },
    failed: {
      text: 'Failed',
      color: 'bg-rose-100 text-rose-800',
      icon: '✗'
    }
  };

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

  // Filter payments based on selected filters
  const filteredPayments = allPayments.filter(payment => {
    // Parse payment date
    const paymentDate = new Date(payment.date);
    const paymentMonth = String(paymentDate.getMonth() + 1).padStart(2, '0');
    const paymentYear = String(paymentDate.getFullYear());

    // Apply status filter
    const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
    
    // Apply month filter
    const monthMatch = monthFilter === 'all' || paymentMonth === monthFilter;
    
    // Apply year filter
    const yearMatch = paymentYear === yearFilter;
    
    return statusMatch && monthMatch && yearMatch;
  });

  const formatAmount = (cents) => {
    return `LKR ${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        {/* <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Payment Transactions</h1>
          <p className="text-slate-600 mt-2">
            Review and manage recent guest payments and transactions
          </p>
        </header> */}

        {/* Filter Section */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <FiFilter className="text-slate-500 mr-2" />
              <h3 className="font-medium text-slate-700">Filter Payments</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md"
                >
                  <option value="all">All Statuses</option>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.text}</option>
                  ))}
                </select>
              </div>
              
              {/* Month Filter */}
              <div className="relative">
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="block text-base w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md"
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
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-blue-600">
                        {payment.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{payment.guest.name}</div>
                        <div className="text-sm text-slate-500">{payment.guest.room}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex text-xs items-center gap-2">
                          <FiCalendar className="text-slate-400" />
                          <span>
                            {payment.date} <span className="text-slate-400">at</span> {payment.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="text-slate-400" />
                          {formatAmount(payment.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[payment.status].color}`}>
                          {statusConfig[payment.status].icon} {statusConfig[payment.status].text}
                        </span>
                        {payment.status === 'failed' && payment.failureReason && (
                          <div className="text-xs text-rose-600 mt-1">{payment.failureReason}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                          <FiInfo className="mr-1" /> Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No payments found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex justify-between items-center">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of <span className="font-medium">{filteredPayments.length}</span> payments
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
      </main>
    </div>
  );
};

export default PaymentHistory;