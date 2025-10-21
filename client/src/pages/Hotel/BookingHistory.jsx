import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SidebarHotel';
import { FiCalendar, FiUser, FiInfo, FiFilter, FiClock, FiCheckCircle, FiXCircle, FiPhone, FiMail, FiUsers, FiAlertCircle, FiHome } from 'react-icons/fi';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // State for filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());

  // Get service provider ID from localStorage
  const serviceProvider = localStorage.getItem('serviceProvider');
  const serviceProviderId = serviceProvider ? JSON.parse(serviceProvider).id : null;

  useEffect(() => {
    if (serviceProviderId) {
      fetchData();
    }
  }, [serviceProviderId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!serviceProviderId) {
        throw new Error('Hotel information not found. Please login again.');
      }

      const response = await fetch(
        `https://serviceprovidersservice-production-8f10.up.railway.app/service/room-bookings/provider/${serviceProviderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`);
      }

      const allBookings = await response.json();
      
      if (Array.isArray(allBookings)) {
        setBookings(allBookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Status config with theme colors
  const statusConfig = {
    PENDING: {
      text: 'Pending',
      color: 'bg-amber-100 text-amber-800',
      icon: <FiClock className="mr-1" />
    },
    CONFIRMED: {
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
    CHECKED_IN: {
      text: 'Checked In',
      color: 'bg-green-100 text-green-800',
      icon: <FiHome className="mr-1" />
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

  // Handle confirming a booking
  const handleConfirmBooking = async (bookingId) => {
    try {
      setActionLoading(true);
      setError(null);
      
      console.log('Confirming booking:', bookingId);
      
      const response = await fetch(
        `https://serviceprovidersservice-production-8f10.up.railway.app/service/room-bookings/${bookingId}/confirm`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      console.log('Confirm response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Confirm error response:', errorText);
        throw new Error(`Failed to confirm booking: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Confirm success:', result);
      
      // Refresh data after successful confirmation
      await fetchData();
      setError(null);
    } catch (err) {
      console.error('Error confirming booking:', err);
      setError(err.message || 'Failed to confirm booking');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle completing a booking (check-out)
  const handleCompleteBooking = async (bookingId) => {
    try {
      setActionLoading(true);
      setError(null);
      
      console.log('Completing booking (checkout):', bookingId);
      
      const response = await fetch(
        `https://serviceprovidersservice-production-8f10.up.railway.app/service/room-bookings/${bookingId}/complete`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      console.log('Complete response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Complete error response:', errorText);
        throw new Error(`Failed to complete booking: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Complete success:', result);
      
      // Refresh data after successful completion
      await fetchData();
      setError(null);
    } catch (err) {
      console.error('Error completing booking:', err);
      setError(err.message || 'Failed to complete booking');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle cancelling a booking
  const handleCancelBooking = async (bookingId) => {
    try {
      setActionLoading(true);
      setError(null);
      
      console.log('Cancelling booking:', bookingId);
      
      const response = await fetch(
        `https://serviceprovidersservice-production-8f10.up.railway.app/service/room-bookings/${bookingId}/cancel`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({})
        }
      );

      console.log('Cancel response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cancel error response:', errorText);
        throw new Error(`Failed to cancel booking: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Cancel success:', result);
      
      // Refresh data after successful cancellation
      await fetchData();
      setError(null);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError(err.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter bookings based on selected filters
  const filteredBookings = bookings.filter(booking => {
    if (!booking.checkInDate) return false;
    
    const bookingDate = new Date(booking.checkInDate);
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

  const getRoomNumber = (roomId) => {
    return `Room #${roomId || 'N/A'}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Hotel Bookings</h2>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg flex items-center">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-rose-600 hover:text-rose-800"
            >
              ✕
            </button>
          </div>
        )}

        {actionLoading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span>Processing action...</span>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No bookings found
            </div>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">#</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Guest Details</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Room</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Dates</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Amount</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-4 lg:px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking, index) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4 font-medium text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="font-medium">{booking.customerName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{booking.customerEmail || 'No email'}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 font-medium">
                      {getRoomNumber(booking.roomId)}
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="text-gray-400" />
                          {formatDate(booking.checkInDate)}
                        </span>
                        <span className="text-xs text-gray-400 ml-5">to {formatDate(booking.checkOutDate)}</span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 font-medium">
                      {formatAmount(booking.totalAmount)}
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
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        {booking.status === 'PENDING' && (
                          <button
                            className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleConfirmBooking(booking.id)}
                            disabled={actionLoading}
                          >
                            Confirm
                          </button>
                        )}
                        {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                          <button
                            className="text-sm bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={actionLoading}
                          >
                            Cancel
                          </button>
                        )}
                        <button 
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="font-mono text-blue-700 font-semibold">Booking ID: #{selectedBooking.id}</div>
                </div>

                {/* Guest Details */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-800 text-lg border-b border-gray-100 pb-2">Guest Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiUser className="text-blue-600 w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-800">{selectedBooking.customerName || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FiMail className="text-blue-600 w-5 h-5 flex-shrink-0" />
                      <div className="text-gray-700">{selectedBooking.customerEmail || 'No email'}</div>
                    </div>
                    
                    {selectedBooking.customerPhone && (
                      <div className="flex items-center gap-3">
                        <FiPhone className="text-blue-600 w-5 h-5 flex-shrink-0" />
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
                      <span className="text-sm text-gray-600">Room:</span>
                      <div className="font-semibold text-gray-800">{getRoomNumber(selectedBooking.roomId)}</div>
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
                      <span className="text-sm text-gray-600">Check-in:</span>
                      <div className="font-semibold text-gray-800">{formatDate(selectedBooking.checkInDate)}</div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Check-out:</span>
                      <div className="font-semibold text-gray-800">{formatDate(selectedBooking.checkOutDate)}</div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600">Guests:</span>
                      <div className="font-semibold text-gray-800">
                        <div className="flex items-center gap-1">
                          <FiUsers className="text-gray-400" />
                          {selectedBooking.numberOfGuests || 1}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Nights:</span>
                      <div className="font-semibold text-gray-800">
                        {selectedBooking.numberOfNights || 1} {selectedBooking.numberOfNights === 1 ? 'night' : 'nights'}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600">Price per Night:</span>
                      <div className="font-semibold text-gray-800">
                        {formatAmount(selectedBooking.pricePerNight)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Total Amount:</span>
                      <div className="font-bold text-blue-600 text-lg">
                        {formatAmount(selectedBooking.totalAmount)}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600">Booking Date:</span>
                      <div className="font-semibold text-gray-800">{formatDateTime(selectedBooking.createdAt)}</div>
                    </div>

                    {selectedBooking.confirmedAt && (
                      <div>
                        <span className="text-sm text-gray-600">Confirmed At:</span>
                        <div className="font-semibold text-gray-800">{formatDateTime(selectedBooking.confirmedAt)}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                {(selectedBooking.cardHolderName || selectedBooking.maskedCardNumber) && (
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Payment Information</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      {selectedBooking.cardHolderName && (
                        <p className="text-gray-700"><strong>Card Holder:</strong> {selectedBooking.cardHolderName}</p>
                      )}
                      {selectedBooking.maskedCardNumber && (
                        <p className="text-gray-700"><strong>Card Number:</strong> {selectedBooking.maskedCardNumber}</p>
                      )}
                      {selectedBooking.expiryDate && (
                        <p className="text-gray-700"><strong>Expiry:</strong> {selectedBooking.expiryDate}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Special Requests</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                    </div>
                  </div>
                )}

                {/* Cancellation Info */}
                {selectedBooking.status === 'CANCELLED' && selectedBooking.cancellationReason && (
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Cancellation</h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-700">Reason: {selectedBooking.cancellationReason}</p>
                      {selectedBooking.cancelledAt && (
                        <p className="text-red-700 text-sm mt-1">Cancelled on: {formatDateTime(selectedBooking.cancelledAt)}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  {selectedBooking.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => {
                          handleCancelBooking(selectedBooking.id);
                          setSelectedBooking(null);
                        }}
                        className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={actionLoading}
                      >
                        Cancel Booking
                      </button>
                      <button
                        onClick={() => {
                          handleConfirmBooking(selectedBooking.id);
                          setSelectedBooking(null);
                        }}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={actionLoading}
                      >
                        Confirm Booking
                      </button>
                    </>
                  )}
                  {selectedBooking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => {
                        handleCancelBooking(selectedBooking.id);
                        setSelectedBooking(null);
                      }}
                      className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={actionLoading}
                    >
                      Cancel Booking
                    </button>
                  )}
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