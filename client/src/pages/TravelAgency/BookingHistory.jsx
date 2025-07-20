import React, { useState } from 'react';
import Sidebar from '../../components/SidebarTravelAgency';
import { FiCalendar, FiUser, FiInfo, FiChevronDown, FiFilter, FiClock, FiCheckCircle, FiXCircle, FiPhone, FiMail, FiUsers } from 'react-icons/fi';

const BookingHistory = () => {
  // Split bookings into pending and confirmed
  const [bookings, setBookings] = useState({
    pending: [
      {
        id: 'BKG-PD-2025-0715-001',
        client: { 
          name: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          phone: '+94 76 111 2222',
        },
        serviceType: 'Luxury Van',
        date: 'July 15, 2025',
        time: '8:00 AM',
        destination: 'Yala National Park',
        numberOfPeople: 6,
        proposedBudget: 35000,
        additionalRequirements: 'WiFi enabled vehicle',
        bookingDate: 'June 25, 2025'
      }
    ],
    confirmed: [
      {
        id: 'BKG-2025-0710-001',
        client: { 
          name: 'Jason Miller',
          email: 'jason.miller@example.com',
          phone: '+94 77 123 4567',
        },
        serviceType: 'Van',
        date: 'July 10, 2025',
        time: '9:00 AM',
        destination: 'Kandy',
        numberOfPeople: 8,
        budget: 25000,
        additionalRequirements: 'Child seats needed',
        status: 'confirmed',
        bookingDate: 'June 15, 2025'
      },
      {
        id: 'BKG-2025-0710-002',
        client: { 
          name: 'Ella Watson',
          email: 'ella.watson@example.com',
          phone: '+94 71 987 6543',
        },
        serviceType: 'Car',
        date: 'July 10, 2025',
        time: '2:00 PM',
        destination: 'Ella',
        numberOfPeople: 3,
        budget: 15000,
        additionalRequirements: 'English speaking driver',
        status: 'cancelled',
        reason: 'Client requested cancellation',
        bookingDate: 'June 10, 2025'
      },
      {
        id: 'BKG-2025-0709-003',
        client: { 
          name: 'Noah Smith',
          email: 'noah.smith@example.com',
          phone: '+94 76 555 1234',
        },
        serviceType: 'Bus',
        date: 'July 9, 2025',
        time: '10:30 AM',
        destination: 'Galle',
        numberOfPeople: 25,
        budget: 45000,
        additionalRequirements: 'Luxury bus with AC',
        status: 'completed',
        bookingDate: 'May 28, 2025'
      }
    ]
  });

  // State for filters and popup
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2025');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Status config with theme colors
  const statusConfig = {
    pending: {
      text: 'Pending',
      color: 'bg-amber-100 text-amber-800',
      icon: <FiClock className="mr-1" />
    },
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

  // Handle accepting a booking
  const handleAcceptBooking = (bookingId) => {
    const bookingToAccept = bookings.pending.find(b => b.id === bookingId);
    if (bookingToAccept) {
      setBookings(prev => ({
        pending: prev.pending.filter(b => b.id !== bookingId),
        confirmed: [
          ...prev.confirmed,
          {
            ...bookingToAccept,
            id: `BKG-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${prev.confirmed.length + 1}`,
            status: 'confirmed',
            budget: bookingToAccept.proposedBudget
          }
        ]
      }));
    }
  };

  // Handle rejecting a booking
  const handleRejectBooking = (bookingId) => {
    setBookings(prev => ({
      ...prev,
      pending: prev.pending.filter(b => b.id !== bookingId)
    }));
  };

  // Filter confirmed bookings based on selected filters
  const filteredBookings = bookings.confirmed.filter(booking => {
    const bookingDate = new Date(booking.bookingDate);
    const bookingMonth = String(bookingDate.getMonth() + 1).padStart(2, '0');
    const bookingYear = String(bookingDate.getFullYear());

    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
    const monthMatch = monthFilter === 'all' || bookingMonth === monthFilter;
    const yearMatch = bookingYear === yearFilter;
    
    return statusMatch && monthMatch && yearMatch;
  });

  const formatAmount = (amount) => {
    return `LKR ${amount?.toLocaleString()}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Transport Bookings</h2>
        
        {/* Pending Bookings Section */}
        {bookings.pending.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FiClock className="mr-2 text-amber-500" /> Pending Booking Requests
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-grey-600 text-[#2953A6] border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">Request ID</th>
                    <th className="px-6 py-4 text-left font-medium">Client</th>
                    <th className="px-6 py-4 text-left font-medium">Service Type</th>
                    <th className="px-6 py-4 text-left font-medium">Travel Date</th>
                    <th className="px-6 py-4 text-left font-medium">Destination</th>
                    <th className="px-6 py-4 text-left font-medium">Proposed Budget</th>
                    <th className="px-6 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.pending.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm text-[#2953A6]">{booking.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{booking.client.name}</div>
                        <div className="text-sm text-gray-500">{booking.client.email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {booking.serviceType}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="text-gray-400" />
                          {booking.date} at {booking.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {booking.destination}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatAmount(booking.proposedBudget)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium"
                          onClick={() => handleAcceptBooking(booking.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="text-sm bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-md font-medium"
                          onClick={() => handleRejectBooking(booking.id)}
                        >
                          Reject
                        </button>
                        <button
                          className="text-sm text-[#2953A6] hover:text-[#1F74BF] font-medium"
                          onClick={() => setSelectedBooking(booking.id)}
                        >
                          <FiInfo className="inline-block mr-1" /> Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
                  {Object.entries(statusConfig)
                    .filter(([key]) => key !== 'pending') // Exclude pending from filter
                    .map(([key, config]) => (
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

        {/* Confirmed Bookings Section */}
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <FiCheckCircle className="mr-2 text-blue-500" /> Booking History
        </h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-grey-600 text-[#2953A6] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Booking ID</th>
                  <th className="px-6 py-4 text-left font-medium">Client Details</th>
                  <th className="px-6 py-4 text-left font-medium">Service Type</th>
                  <th className="px-6 py-4 text-left font-medium">Travel Date</th>
                  <th className="px-6 py-4 text-left font-medium">Destination</th>
                  <th className="px-6 py-4 text-left font-medium">Budget</th>
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
                        <div className="font-medium">{booking.client.name}</div>
                        <div className="text-sm text-gray-500">{booking.client.email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {booking.serviceType}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="text-gray-400" />
                          {booking.date} at {booking.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {booking.destination}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatAmount(booking.budget)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status].color}`}>
                            {statusConfig[booking.status].icon} {statusConfig[booking.status].text}
                          </span>
                        </div>
                        {booking.status === 'cancelled' && booking.reason && (
                          <div className="text-xs text-rose-600 mt-1">{booking.reason}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          className="inline-flex items-center text-sm text-[#2953A6] hover:text-[#1F74BF] font-medium transition-colors"
                          onClick={() => setSelectedBooking(booking.id)}
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
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {(() => {
                // Check both pending and confirmed bookings
                const booking = [...bookings.pending, ...bookings.confirmed].find(b => b.id === selectedBooking);
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

                    {/* Client Details */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-gray-800 text-lg border-b border-gray-100 pb-2">Client Information</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FiUser className="text-[#2953A6] w-5 h-5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-gray-800">{booking.client.name}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <FiMail className="text-[#2953A6] w-5 h-5 flex-shrink-0" />
                          <div className="text-gray-700">{booking.client.email}</div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <FiPhone className="text-[#2953A6] w-5 h-5 flex-shrink-0" />
                          <div className="text-gray-700">{booking.client.phone}</div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-gray-800 text-lg border-b border-gray-100 pb-2">Booking Information</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Service Type:</span>
                          <div className="font-semibold text-gray-800">{booking.serviceType}</div>
                        </div>
                        
                        {booking.status && (
                          <div>
                            <span className="text-sm text-gray-600">Status:</span>
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status].color}`}>
                                {statusConfig[booking.status].icon} {statusConfig[booking.status].text}
                              </span>
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="text-sm text-gray-600">Travel Date:</span>
                          <div className="font-semibold text-gray-800">{booking.date} at {booking.time}</div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Destination:</span>
                          <div className="font-semibold text-gray-800">{booking.destination}</div>
                        </div>

                        <div>
                          <span className="text-sm text-gray-600">Number of People:</span>
                          <div className="font-semibold text-gray-800">
                            <div className="flex items-center gap-1">
                              <FiUsers className="text-gray-400" />
                              {booking.numberOfPeople}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Budget:</span>
                          <div className="font-bold text-[#2953A6]">
                            {formatAmount(booking.budget || booking.proposedBudget)}
                          </div>
                        </div>

                        <div>
                          <span className="text-sm text-gray-600">Booking Date:</span>
                          <div className="font-semibold text-gray-800">{booking.bookingDate}</div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Requirements */}
                    {booking.additionalRequirements && (
                      <div className="space-y-2 mb-6">
                        <h4 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Additional Requirements</h4>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-gray-700">{booking.additionalRequirements}</p>
                        </div>
                      </div>
                    )}

                    {/* Cancellation Info */}
                    {booking.status === 'cancelled' && booking.reason && (
                      <div className="space-y-2 mb-6">
                        <h4 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Cancellation</h4>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-700">Reason: {booking.reason}</p>
                        </div>
                      </div>
                    )}

                    {/* Action buttons for pending bookings */}
                    {!booking.status && (
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          onClick={() => {
                            handleRejectBooking(booking.id);
                            setSelectedBooking(null);
                          }}
                          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md"
                        >
                          Reject Request
                        </button>
                        <button
                          onClick={() => {
                            handleAcceptBooking(booking.id);
                            setSelectedBooking(null);
                          }}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md"
                        >
                          Accept Request
                        </button>
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