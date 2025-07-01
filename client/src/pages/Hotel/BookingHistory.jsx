import React, { useState } from 'react';
import SidebarHotel from '../../components/SidebarHotel';
import { FiCalendar, FiUser, FiInfo, FiChevronDown, FiFilter, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const BookingHistory = () => {
  // Sample booking data
  const allBookings = [
    {
      id: 'BK-2025-0615-001',
      guest: { name: 'John D. Silva', email: 'john.silva@example.com' },
      room: 'Deluxe Suite #302',
      checkIn: 'June 15, 2025',
      checkOut: 'June 18, 2025',
      nights: 3,
      amount: 135000,
      status: 'confirmed',
      bookingDate: 'June 10, 2025'
    },
    {
      id: 'BK-2025-0612-002',
      guest: { name: 'Alice M. Smith', email: 'alice.smith@example.com' },
      room: 'Standard Double #215',
      checkIn: 'June 12, 2025',
      checkOut: 'June 15, 2025',
      nights: 3,
      amount: 90000,
      status: 'completed',
      bookingDate: 'May 28, 2025'
    },
    {
      id: 'BK-2025-0528-003',
      guest: { name: 'Robert K. Lee', email: 'robert.lee@example.com' },
      room: 'Executive Suite #401',
      checkIn: 'May 28, 2025',
      checkOut: 'June 2, 2025',
      nights: 5,
      amount: 225000,
      status: 'completed',
      bookingDate: 'May 15, 2025'
    },
    {
      id: 'BK-2025-0601-004',
      guest: { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
      room: 'Premium Room #105',
      checkIn: 'June 1, 2025',
      checkOut: 'June 3, 2025',
      nights: 2,
      amount: 55000,
      status: 'cancelled',
      bookingDate: 'May 20, 2025',
      cancellationReason: 'Change of plans'
    },
    {
      id: 'BK-2025-0520-005',
      guest: { name: 'Michael Brown', email: 'michael.b@example.com' },
      room: 'Family Suite #210',
      checkIn: 'May 20, 2025',
      checkOut: 'May 25, 2025',
      nights: 5,
      amount: 190000,
      status: 'completed',
      bookingDate: 'April 30, 2025'
    }
  ];

  // State for filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2025');

  // Status config
  const statusConfig = {
    confirmed: {
      text: 'Confirmed',
      color: 'bg-blue-100 text-blue-800',
      icon: <FiClock className="mr-1" />
    },
    completed: {
      text: 'Completed',
      color: 'bg-emerald-100 text-emerald-800',
      icon: <FiCheckCircle className="mr-1" />
    },
    cancelled: {
      text: 'Cancelled',
      color: 'bg-rose-100 text-rose-800',
      icon: <FiXCircle className="mr-1" />
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

  // Filter bookings based on selected filters
  const filteredBookings = allBookings.filter(booking => {
    // Parse booking date
    const bookingDate = new Date(booking.bookingDate);
    const bookingMonth = String(bookingDate.getMonth() + 1).padStart(2, '0');
    const bookingYear = String(bookingDate.getFullYear());

    // Apply status filter
    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
    
    // Apply month filter
    const monthMatch = monthFilter === 'all' || bookingMonth === monthFilter;
    
    // Apply year filter
    const yearMatch = bookingYear === yearFilter;
    
    return statusMatch && monthMatch && yearMatch;
  });

  const formatAmount = (cents) => {
    return `LKR ${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarHotel />
      
      <main className="flex-1 p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Booking History</h1>
          <p className="text-slate-600 mt-2">
            Review and manage all hotel bookings and reservations
          </p>
        </header>

        {/* Filter Section */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <FiFilter className="text-slate-500 mr-2" />
              <h3 className="font-medium text-slate-700">Filter Bookings</h3>
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

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Booking ID</th>
                  <th className="px-6 py-4 text-left font-medium">Guest Details</th>
                  <th className="px-6 py-4 text-left font-medium">Room</th>
                  <th className="px-6 py-4 text-left font-medium">Dates</th>
                  <th className="px-6 py-4 text-left font-medium">Nights</th>
                  <th className="px-6 py-4 text-left font-medium">Amount</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-blue-600">
                        {booking.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{booking.guest.name}</div>
                        <div className="text-sm text-slate-500">{booking.guest.email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {booking.room}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1">
                            <FiCalendar className="text-slate-400" />
                            {booking.checkIn}
                          </span>
                          <span className="text-xs text-slate-400 ml-5">to {booking.checkOut}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatAmount(booking.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status].color}`}>
                            {statusConfig[booking.status].icon} {statusConfig[booking.status].text}
                          </span>
                        </div>
                        {booking.status === 'cancelled' && booking.cancellationReason && (
                          <div className="text-xs text-rose-600 mt-1">{booking.cancellationReason}</div>
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
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No bookings found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex justify-between items-center">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredBookings.length}</span> of <span className="font-medium">{filteredBookings.length}</span> bookings
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

export default BookingHistory;