import React, { useState } from 'react';
import Sidebar from '../../components/SidebarHotel';
import { FiCalendar, FiUser, FiInfo, FiChevronDown, FiFilter, FiClock, FiCheckCircle, FiXCircle, FiPhone, FiMail, FiUsers } from 'react-icons/fi';

const BookingHistory = () => {
  // Sample booking data with additional details
  const allBookings = [
    {
      id: 'BK-2025-0615-001',
      guest: { 
        name: 'John D. Silva', 
        email: 'john.silva@example.com',
        phone: '+94 77 123 4567',
        address: 'No. 15, Galle Road, Colombo 03'
      },
      room: 'Deluxe Suite #302',
      checkIn: 'June 15, 2025',
      checkOut: 'June 18, 2025',
      nights: 3,
      guests: 2,
      amount: 135000,
      status: 'confirmed',
      bookingDate: 'June 10, 2025',
      specialRequests: 'Late check-in, Twin beds',
      foodPreferences: 'Half Board'
    },
    {
      id: 'BK-2025-0612-002',
      guest: { 
        name: 'Alice M. Smith', 
        email: 'alice.smith@example.com',
        phone: '+94 71 987 6543',
        address: 'No. 42, Kandy Road, Peradeniya'
      },
      room: 'Standard Double #215',
      checkIn: 'June 12, 2025',
      checkOut: 'June 15, 2025',
      nights: 3,
      guests: 1,
      amount: 90000,
      status: 'completed',
      bookingDate: 'May 28, 2025',
      specialRequests: 'Non-smoking room',
      foodPreferences: 'Full Board'
    },
    {
      id: 'BK-2025-0528-003',
      guest: { 
        name: 'Robert K. Lee', 
        email: 'robert.lee@example.com',
        phone: '+94 76 555 1234',
        address: 'No. 88, Negombo Road, Katunayake'
      },
      room: 'Executive Suite #401',
      checkIn: 'May 28, 2025',
      checkOut: 'June 2, 2025',
      nights: 5,
      guests: 3,
      amount: 225000,
      status: 'completed',
      bookingDate: 'May 15, 2025',
      specialRequests: 'Airport transfer, Extra bed',
      foodPreferences: 'Bed & Breakfast'
    },
    {
      id: 'BK-2025-0601-004',
      guest: { 
        name: 'Sarah Johnson', 
        email: 'sarah.j@example.com',
        phone: '+94 75 888 9999',
        address: 'No. 123, Hill Street, Nuwara Eliya'
      },
      room: 'Premium Room #105',
      checkIn: 'June 1, 2025',
      checkOut: 'June 3, 2025',
      nights: 2,
      guests: 2,
      amount: 55000,
      status: 'cancelled',
      bookingDate: 'May 20, 2025',
      cancellationReason: 'Change of plans',
      specialRequests: 'Ground floor room',
      foodPreferences: 'Half Board'
    },
    {
      id: 'BK-2025-0520-005',
      guest: { 
        name: 'Michael Brown', 
        email: 'michael.b@example.com',
        phone: '+94 78 246 8135',
        address: 'No. 67, Main Street, Galle'
      },
      room: 'Family Suite #210',
      checkIn: 'May 20, 2025',
      checkOut: 'May 25, 2025',
      nights: 5,
      guests: 4,
      amount: 190000,
      status: 'completed',
      bookingDate: 'April 30, 2025',
      specialRequests: 'High chair, Extra towels',
      foodPreferences: 'Full Board'
    }
  ];

  // State for filters and popup
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2025');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Status config with theme colors
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
    const bookingDate = new Date(booking.bookingDate);
    const bookingMonth = String(bookingDate.getMonth() + 1).padStart(2, '0');
    const bookingYear = String(bookingDate.getFullYear());

    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
    const monthMatch = monthFilter === 'all' || bookingMonth === monthFilter;
    const yearMatch = bookingYear === yearFilter;
    
    return statusMatch && monthMatch && yearMatch;
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
              <h3 className="font-medium text-gray-700">Filter Bookings</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2953A6] focus:border-transparent rounded-md"
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

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-grey-600 text-[#2953A6] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Booking ID</th>
                  <th className="px-6 py-4 text-left font-medium">Guest Details</th>
                  <th className="px-6 py-4 text-left font-medium">Room</th>
                  <th className="px-6 py-4 text-left font-medium">Dates</th>
                  <th className="px-6 py-4 text-left font-medium">Guests</th>
                  <th className="px-6 py-4 text-left font-medium">Amount</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-[#2953A6]">
                        {booking.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{booking.guest.name}</div>
                        <div className="text-sm text-gray-500">{booking.guest.email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {booking.room}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1">
                            <FiCalendar className="text-gray-400" />
                            {booking.checkIn}
                          </span>
                          <span className="text-xs text-gray-400 ml-5">to {booking.checkOut}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <FiUsers className="text-gray-400" />
                          {booking.guests} 
                        </div>
                        <div className="text-xs text-gray-400">{booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</div>
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
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          className="inline-flex items-center text-sm text-[#2953A6] hover:text-[#1F74BF] font-medium transition-colors"
                          onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                        >
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
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredBookings.length}</span> of <span className="font-medium">{filteredBookings.length}</span> bookings
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

        {/* Details Popup Modal */}
        {selectedBooking && (
         <div
  className="fixed inset-0 bg-black/40  flex items-center justify-center z-50 p-4"
  onClick={() => setSelectedBooking(null)}
>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const booking = filteredBookings.find(b => b.id === selectedBooking);
                return booking ? (
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                      <h3 className="text-xl font-bold text-gray-800">Booking Details</h3>
                      <button 
                        onClick={() => setSelectedBooking(null)}
                        className="text-gray-400 hover:text-gray-600 text-xl font-semibold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Booking ID */}
                    <div className="mb-4 p-3 bg-[#2953A6]/10 rounded-lg">
                      <div className="font-mono text-[#2953A6] font-semibold">{booking.id}</div>
                    </div>

                    {/* Guest Details */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-gray-800 text-lg border-b border-gray-100 pb-2">Guest Information</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FiUser className="text-[#2953A6] w-5 h-5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-gray-800">{booking.guest.name}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <FiMail className="text-[#2953A6] w-5 h-5 flex-shrink-0" />
                          <div className="text-gray-700">{booking.guest.email}</div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <FiPhone className="text-[#2953A6] w-5 h-5 flex-shrink-0" />
                          <div className="text-gray-700">{booking.guest.phone}</div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="text-[#2953A6] w-5 h-5 flex-shrink-0 mt-1">📍</div>
                          <div className="text-gray-700">{booking.guest.address}</div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-gray-800 text-lg border-b border-gray-100 pb-2">Booking Information</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Room:</span>
                          <div className="font-semibold text-gray-800">{booking.room}</div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Status:</span>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status].color}`}>
                              {statusConfig[booking.status].icon} {statusConfig[booking.status].text}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-sm text-gray-600">Check-in:</span>
                          <div className="font-semibold text-gray-800">{booking.checkIn}</div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Check-out:</span>
                          <div className="font-semibold text-gray-800">{booking.checkOut}</div>
                        </div>

                        <div>
                          <span className="text-sm text-gray-600">Guests:</span>
                          <div className="font-semibold text-gray-800">{booking.guests} </div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Nights:</span>
                          <div className="font-semibold text-gray-800">{booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</div>
                        </div>

                        <div>
                          <span className="text-sm text-gray-600">Booking Date:</span>
                          <div className="font-semibold text-gray-800">{booking.bookingDate}</div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Total Amount:</span>
                          <div className="font-bold text-[#2953A6] text-lg">{formatAmount(booking.amount)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.specialRequests && (
                      <div className="space-y-2 mb-6">
                        <h4 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Special Requests</h4>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-gray-700">{booking.specialRequests}</p>
                        </div>
                      </div>
                    )}

                    {/* food preferences */}
                    {booking.foodPreferences && (
                      <div className="space-y-2 mb-6">
                        <h4 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Food Preferences</h4>
                        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
                          <p className="text-gray-700">{booking.foodPreferences}</p>
                        </div>
                      </div>
                    )}

                    {/* Cancellation Info */}
                    {booking.status === 'cancelled' && booking.cancellationReason && (
                      <div className="space-y-2 mb-6">
                        <h4 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Cancellation</h4>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-700">Reason: {booking.cancellationReason}</p>
                        </div>
                      </div>
                    )}

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

export default BookingHistory;