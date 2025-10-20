import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SidebarTravelAgency';
import TravelBookingService from '../../api_service/TravelBookingService';
import { FiCalendar, FiUser, FiInfo, FiFilter, FiClock, FiCheckCircle, FiXCircle, FiPhone, FiMail, FiUsers, FiAlertCircle, FiNavigation } from 'react-icons/fi';

const BookingHistory = () => {
  const [bookings, setBookings] = useState({
    pending: [],
    confirmed: []
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(null);

  // State for filters and popup
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());

  // Get travel agency ID from localStorage
  const serviceProvider = localStorage.getItem('serviceProvider');
  const travelAgencyId = serviceProvider ? JSON.parse(serviceProvider).id : null;

  useEffect(() => {
    if (travelAgencyId) {
      fetchData();
    }
  }, [travelAgencyId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!travelAgencyId) {
        throw new Error('Travel agency information not found. Please login again.');
      }

      // Fetch pending bookings
      const pendingBookings = await TravelBookingService.getPendingBookings(travelAgencyId);
      
      // Fetch all bookings for the agency
      const allBookings = await TravelBookingService.getBookingsByTravelAgency(travelAgencyId);
      
      // Separate bookings by status
      const pending = Array.isArray(pendingBookings) ? pendingBookings : [];
      const confirmed = Array.isArray(allBookings) ? 
        allBookings.filter(b => b.status !== 'PENDING_APPROVAL') : [];

      setBookings({
        pending,
        confirmed
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Status config with theme colors
  const statusConfig = {
    PENDING_APPROVAL: {
      text: 'Pending',
      color: 'bg-amber-100 text-amber-800',
      icon: <FiClock className="mr-1" />
    },
    APPROVED: {
      text: 'Confirmed',
      color: 'bg-blue-100 text-blue-800',
      icon: <FiCheckCircle className="mr-1" />
    },
    COMPLETED: {
      text: 'Completed',
      color: 'bg-emerald-100 text-emerald-800',
      icon: <FiCheckCircle className="mr-1" />
    },
    CANCELLED: {
      text: 'Cancelled',
      color: 'bg-rose-100 text-rose-800',
      icon: <FiXCircle className="mr-1" />
    },
    REJECTED: {
      text: 'Rejected',
      color: 'bg-gray-100 text-gray-800',
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => (currentYear - i).toString());

  // Handle accepting a booking
  const handleAcceptBooking = async (bookingId) => {
    try {
      setError(null);
      await TravelBookingService.approveBooking(bookingId, travelAgencyId);
      await fetchData(); // Refresh data
    } catch (err) {
      console.error('Error accepting booking:', err);
      setError(err.message || 'Failed to accept booking');
    }
  };

  // Handle rejecting a booking
  const handleRejectBooking = async (bookingId, reason = null) => {
    try {
      setError(null);
      await TravelBookingService.rejectBooking(bookingId, travelAgencyId, reason);
      setShowRejectionModal(null);
      setRejectionReason('');
      await fetchData(); // Refresh data
    } catch (err) {
      console.error('Error rejecting booking:', err);
      setError(err.message || 'Failed to reject booking');
    }
  };

  // Handle completing a booking
  const handleCompleteBooking = async (bookingId) => {
    try {
      setError(null);
      await TravelBookingService.completeBooking(bookingId, travelAgencyId);
      await fetchData(); // Refresh data
    } catch (err) {
      console.error('Error completing booking:', err);
      setError(err.message || 'Failed to complete booking');
    }
  };

  // Filter confirmed bookings based on selected filters
  const filteredBookings = bookings.confirmed.filter(booking => {
    if (!booking.startDate) return false;
    
    const bookingDate = new Date(booking.startDate);
    const bookingMonth = String(bookingDate.getMonth() + 1).padStart(2, '0');
    const bookingYear = String(bookingDate.getFullYear());

    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
    const monthMatch = monthFilter === 'all' || bookingMonth === monthFilter;
    const yearMatch = bookingYear === yearFilter;
    
    return statusMatch && monthMatch && yearMatch;
  });

  const formatAmount = (amount) => {
    if (!amount) return 'LKR 0';
    return `LKR ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getVehicleType = (booking) => {
    // Determine vehicle type based on available data
    if (booking.withAC !== undefined) {
      return booking.withAC ? 'AC Vehicle' : 'Non-AC Vehicle';
    }
    return 'Vehicle';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2953A6] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-4 lg:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Transport Bookings</h2>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg flex items-center">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-rose-600 hover:text-rose-800"
            >
              ✕
            </button>
          </div>
        )}
        
        {/* Pending Bookings Section */}
        {bookings.pending.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FiClock className="mr-2 text-amber-500" /> Pending Booking Requests ({bookings.pending.length})
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-grey-600 text-[#2953A6] border-b border-gray-200">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 text-left font-medium">Request ID</th>
                    <th className="px-4 lg:px-6 py-4 text-left font-medium">Client</th>
                    <th className="px-4 lg:px-6 py-4 text-left font-medium">Vehicle Type</th>
                    <th className="px-4 lg:px-6 py-4 text-left font-medium">Travel Dates</th>
                    <th className="px-4 lg:px-6 py-4 text-left font-medium">Route</th>
                    <th className="px-4 lg:px-6 py-4 text-left font-medium">Total Amount</th>
                    <th className="px-4 lg:px-6 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.pending.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4 font-mono text-sm text-[#2953A6]">#{booking.id}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="font-medium">{booking.customerName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{booking.customerEmail || 'No email'}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 font-medium">
                        {getVehicleType(booking)}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="text-gray-400" />
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-1">
                          <FiNavigation className="text-gray-400" />
                          {booking.pickupLocation} → {booking.dropoffLocation}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 font-medium">
                        {formatAmount(booking.estimatedTotalAmount || booking.totalAmount)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition-colors"
                            onClick={() => handleAcceptBooking(booking.id)}
                          >
                            Accept
                          </button>
                          <button
                            className="text-sm bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-md font-medium transition-colors"
                            onClick={() => setShowRejectionModal(booking.id)}
                          >
                            Reject
                          </button>
                          <button
                            className="text-sm text-[#2953A6] hover:text-[#1F74BF] font-medium transition-colors"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <FiInfo className="inline-block mr-1" /> Details
                          </button>
                        </div>
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
                    .filter(([key]) => key !== 'PENDING_APPROVAL')
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
          <FiCheckCircle className="mr-2 text-blue-500" /> Booking History ({filteredBookings.length})
        </h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No booking history available
            </div>
          ) : (
            <table className="w-full min-w-[900px]">
              <thead className="bg-grey-600 text-[#2953A6] border-b border-gray-200">
                <tr>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Booking ID</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Client Details</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Vehicle Type</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Travel Dates</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Route</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Total Amount</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-4 lg:px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4 font-mono text-sm text-[#2953A6]">
                      #{booking.id}
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="font-medium">{booking.customerName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{booking.customerEmail || 'No email'}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 font-medium">
                      {getVehicleType(booking)}
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="text-gray-400" />
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-1">
                        <FiNavigation className="text-gray-400" />
                        {booking.pickupLocation} → {booking.dropoffLocation}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 font-medium">
                      {formatAmount(booking.estimatedTotalAmount || booking.totalAmount)}
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                          {statusConfig[booking.status]?.icon} {statusConfig[booking.status]?.text || booking.status}
                        </span>
                      </div>
                      {booking.status === 'CANCELLED' && booking.cancellationReason && (
                        <div className="text-xs text-rose-600 mt-1">{booking.cancellationReason}</div>
                      )}
                      {booking.status === 'REJECTED' && booking.rejectionReason && (
                        <div className="text-xs text-gray-600 mt-1">{booking.rejectionReason}</div>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        {booking.status === 'APPROVED' && (
                          <button
                            className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md font-medium transition-colors"
                            onClick={() => handleCompleteBooking(booking.id)}
                          >
                            Complete
                          </button>
                        )}
                        <button 
                          className="inline-flex items-center text-sm text-[#2953A6] hover:text-[#1F74BF] font-medium transition-colors"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <FiInfo className="mr-1" /> Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Details Popup Modal */}
        {selectedBooking && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-800">Booking Details</h3>
                  <button 
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl font-semibold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Booking ID */}
                <div className="mb-4 p-3 bg-[#2953A6]/10 rounded-lg">
                  <div className="font-mono text-[#2953A6] font-semibold">#{selectedBooking.id}</div>
                </div>

                {/* Client Details */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-800 text-lg border-b border-gray-100 pb-2">Client Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiUser className="text-[#2953A6] w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-800">{selectedBooking.customerName || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FiMail className="text-[#2953A6] w-5 h-5 flex-shrink-0" />
                      <div className="text-gray-700">{selectedBooking.customerEmail || 'No email'}</div>
                    </div>
                    
                    {selectedBooking.customerPhone && (
                      <div className="flex items-center gap-3">
                        <FiPhone className="text-[#2953A6] w-5 h-5 flex-shrink-0" />
                        <div className="text-gray-700">{selectedBooking.customerPhone}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-800 text-lg border-b border-gray-100 pb-2">Booking Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Vehicle Type:</span>
                      <div className="font-semibold text-gray-800">{getVehicleType(selectedBooking)}</div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[selectedBooking.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                          {statusConfig[selectedBooking.status]?.icon} {statusConfig[selectedBooking.status]?.text || selectedBooking.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600">Start Date:</span>
                      <div className="font-semibold text-gray-800">{formatDate(selectedBooking.startDate)}</div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600">End Date:</span>
                      <div className="font-semibold text-gray-800">{formatDate(selectedBooking.endDate)}</div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Pickup Location:</span>
                      <div className="font-semibold text-gray-800">{selectedBooking.pickupLocation}</div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600">Dropoff Location:</span>
                      <div className="font-semibold text-gray-800">{selectedBooking.dropoffLocation}</div>
                    </div>

                    {selectedBooking.estimatedKilometers && (
                      <div>
                        <span className="text-sm text-gray-600">Estimated Kilometers:</span>
                        <div className="font-semibold text-gray-800">{selectedBooking.estimatedKilometers} km</div>
                      </div>
                    )}

                    {selectedBooking.pricePerKm && (
                      <div>
                        <span className="text-sm text-gray-600">Price per KM:</span>
                        <div className="font-semibold text-gray-800">{formatAmount(selectedBooking.pricePerKm)}</div>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-sm text-gray-600">Total Amount:</span>
                      <div className="font-bold text-[#2953A6]">
                        {formatAmount(selectedBooking.estimatedTotalAmount || selectedBooking.totalAmount)}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600">Booking Date:</span>
                      <div className="font-semibold text-gray-800">{formatDateTime(selectedBooking.createdAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Additional Requirements */}
                {selectedBooking.specialRequests && (
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Special Requests</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                    </div>
                  </div>
                )}

                {/* Cancellation/Rejection Info */}
                {selectedBooking.status === 'CANCELLED' && selectedBooking.cancellationReason && (
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Cancellation</h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-700">Reason: {selectedBooking.cancellationReason}</p>
                    </div>
                  </div>
                )}

                {selectedBooking.status === 'REJECTED' && selectedBooking.rejectionReason && (
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Rejection</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-gray-700">Reason: {selectedBooking.rejectionReason}</p>
                    </div>
                  </div>
                )}

                {/* Timeline Information */}
                <div className="space-y-2 mb-6">
                  <h4 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Timeline</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Created: {formatDateTime(selectedBooking.createdAt)}</div>
                    {selectedBooking.approvedAt && <div>Approved: {formatDateTime(selectedBooking.approvedAt)}</div>}
                    {selectedBooking.rejectedAt && <div>Rejected: {formatDateTime(selectedBooking.rejectedAt)}</div>}
                    {selectedBooking.cancelledAt && <div>Cancelled: {formatDateTime(selectedBooking.cancelledAt)}</div>}
                    {selectedBooking.completedAt && <div>Completed: {formatDateTime(selectedBooking.completedAt)}</div>}
                  </div>
                </div>

                {/* Action buttons for pending bookings */}
                {selectedBooking.status === 'PENDING_APPROVAL' && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowRejectionModal(selectedBooking.id);
                        setSelectedBooking(null);
                      }}
                      className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-colors"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => {
                        handleAcceptBooking(selectedBooking.id);
                        setSelectedBooking(null);
                      }}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors"
                    >
                      Accept Request
                    </button>
                  </div>
                )}

                {/* Action button for approved bookings */}
                {selectedBooking.status === 'APPROVED' && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => {
                        handleCompleteBooking(selectedBooking.id);
                        setSelectedBooking(null);
                      }}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rejection Reason Modal */}
        {showRejectionModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowRejectionModal(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-800">Reject Booking</h3>
                  <button onClick={() => setShowRejectionModal(null)} className="text-gray-400 hover:text-gray-600 text-xl font-semibold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">✕</button>
                </div>
                
                <p className="text-gray-600 mb-4">Please provide a reason for rejecting this booking (optional):</p>
                
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                  rows="4"
                  placeholder="Enter rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowRejectionModal(null);
                      setRejectionReason('');
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRejectBooking(showRejectionModal, rejectionReason || null)}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-colors"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingHistory;