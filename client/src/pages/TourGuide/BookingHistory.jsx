import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SidebarTourGuide';
import TourBookingService from '../../api_service/TourBookingService';
import TourPackageService from '../../api_service/TourPackageService';
import { FiCalendar, FiUser, FiInfo, FiClock, FiCheckCircle, FiXCircle, FiPhone, FiMail, FiUsers, FiAlertCircle, FiFilter } from 'react-icons/fi';

const BookingHistory = () => {
  const [bookings, setBookings] = useState({
    pending: [],
    confirmed: []
  });
  const [tourPackages, setTourPackages] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());

  // Get service provider ID from localStorage
  const serviceProvider = localStorage.getItem('serviceProvider');
  const serviceProviderId = serviceProvider ? JSON.parse(serviceProvider).id : null;
  
  // Get tour guide ID from localStorage or use serviceProviderId as fallback
  const tourGuideId = localStorage.getItem('serviceProviderId') || localStorage.getItem('userId') || serviceProviderId;

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate that we have the required IDs
      if (!serviceProviderId) {
        throw new Error('Service provider information not found. Please login again.');
      }

      if (!tourGuideId) {
        throw new Error('Tour guide ID not found. Please login again.');
      }

      // Fetch tour packages first using serviceProviderId
      const toursResponse = await TourPackageService.getTourPackagesByServiceProviderId(serviceProviderId);
      const toursMap = {};
      if (Array.isArray(toursResponse)) {
        toursResponse.forEach(tour => {
          toursMap[tour.id] = tour.tourName;
        });
      }
      setTourPackages(toursMap);

      // Fetch all bookings using tourGuideId
      const allBookingsResponse = await TourBookingService.getBookingsByTourGuide(tourGuideId);
      
      if (Array.isArray(allBookingsResponse)) {
        // Separate bookings by status
        const pending = allBookingsResponse.filter(b => b.status === 'PENDING_APPROVAL');
        const confirmed = allBookingsResponse.filter(b => 
          b.status !== 'PENDING_APPROVAL'
        );

        setBookings({
          pending,
          confirmed
        });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

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

  // Filter confirmed bookings based on selected filters
  const filteredBookings = bookings.confirmed.filter(booking => {
    const bookingDate = new Date(booking.tourDate || booking.createdAt);
    const bookingMonth = String(bookingDate.getMonth() + 1).padStart(2, '0');
    const bookingYear = String(bookingDate.getFullYear());

    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
    const monthMatch = monthFilter === 'all' || bookingMonth === monthFilter;
    const yearMatch = bookingYear === yearFilter;
    
    return statusMatch && monthMatch && yearMatch;
  });

  const formatAmount = (amount) => `LKR ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      setError(null);
      await TourBookingService.approveBooking(bookingId, tourGuideId);
      await fetchData(); // Refresh data
    } catch (err) {
      console.error('Error accepting booking:', err);
      setError(err.message || 'Failed to accept booking');
    }
  };

  const handleRejectBooking = async (bookingId, reason = null) => {
    try {
      setError(null);
      await TourBookingService.rejectBooking(bookingId, tourGuideId, reason);
      setShowRejectionModal(null);
      setRejectionReason('');
      await fetchData(); // Refresh data
    } catch (err) {
      console.error('Error rejecting booking:', err);
      setError(err.message || 'Failed to reject booking');
    }
  };

  const getTourName = (tourId) => {
    return tourPackages[tourId] || `Tour #${tourId}`;
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
      <main className="flex-1 p-4 lg:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tour Bookings</h2>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg flex items-center">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
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
                    <th className="px-4 lg:px-6 py-4 text-left font-medium">Guest</th>
                    <th className="px-4 lg:px-6 py-4 text-left font-medium">Tour</th>
                    <th className="px-4 lg:px-6 py-4 text-left font-medium">Date</th>
                    <th className="px-4 lg:px-6 py-4 text-left font-medium">Participants</th>
                    <th className="px-4 lg:px-6 py-4 text-left font-medium">Total Amount</th>
                    <th className="px-4 lg:px-6 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.pending.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4 font-mono text-sm text-[#2953A6]">#{booking.id}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div>{getTourName(booking.tourId)}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span>{formatDate(booking.tourDate)}</span>
                      </td>
                      <td className="px-4 lg:px-6 py-4">{booking.numberOfPeople}</td>
                      <td className="px-4 lg:px-6 py-4 font-medium">{formatAmount(booking.totalAmount)}</td>
                      <td className="px-4 lg:px-6 py-4 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium"
                            onClick={() => handleAcceptBooking(booking.id)}
                          >
                            Accept
                          </button>
                          <button
                            className="text-sm bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-md font-medium"
                            onClick={() => setShowRejectionModal(booking.id)}
                          >
                            Reject
                          </button>
                          <button
                            className="text-sm text-[#2953A6] hover:text-[#1F74BF] font-medium"
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
                    .filter(([key]) => key !== 'PENDING_APPROVAL') // Exclude pending from filter
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
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Guest</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Tour</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Date</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Participants</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Amount</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-4 lg:px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4 font-mono text-sm text-[#2953A6]">#{booking.id}</td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div>{getTourName(booking.tourId)}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <span>{formatDate(booking.tourDate)}</span>
                    </td>
                    <td className="px-4 lg:px-6 py-4">{booking.numberOfPeople}</td>
                    <td className="px-4 lg:px-6 py-4 font-medium">{formatAmount(booking.totalAmount)}</td>
                    <td className="px-4 lg:px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {statusConfig[booking.status]?.icon} {statusConfig[booking.status]?.text || booking.status}
                      </span>
                      {booking.status === 'CANCELLED' && booking.cancellationReason && (
                        <div className="text-xs text-rose-600 mt-1">{booking.cancellationReason}</div>
                      )}
                      {booking.status === 'REJECTED' && booking.rejectionReason && (
                        <div className="text-xs text-gray-600 mt-1">{booking.rejectionReason}</div>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-right">
                      <button
                        className="text-sm text-[#2953A6] hover:text-[#1F74BF] font-medium"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <FiInfo className="inline-block mr-1" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBooking(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-800">Booking Details</h3>
                  <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600 text-xl font-semibold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">✕</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">Booking ID</h4>
                    <p className="font-mono text-sm text-[#2953A6]">#{selectedBooking.id}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800">Guest Information</h4>
                    <p className="flex items-center mt-1"><FiUser className="mr-2 text-gray-500" />{selectedBooking.customerName}</p>
                    <p className="flex items-center mt-1 text-sm text-gray-600"><FiMail className="mr-2 text-gray-500" />{selectedBooking.customerEmail}</p>
                    <p className="flex items-center mt-1 text-sm text-gray-600"><FiPhone className="mr-2 text-gray-500" />{selectedBooking.customerPhone}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800">Tour Details</h4>
                    <p className="mt-1"><strong>{getTourName(selectedBooking.tourId)}</strong></p>
                    <p className="text-sm text-gray-600 flex items-center mt-1"><FiCalendar className="mr-2" />{formatDate(selectedBooking.tourDate)}</p>
                    <p className="text-sm text-gray-600 flex items-center mt-1"><FiUsers className="mr-2" />Participants: {selectedBooking.numberOfPeople}</p>
                    <p className="text-sm text-gray-600 mt-1">Price per person: {formatAmount(selectedBooking.pricePerPerson)}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">Total: {formatAmount(selectedBooking.totalAmount)}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800">Status</h4>
                    <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${statusConfig[selectedBooking.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {statusConfig[selectedBooking.status]?.icon} {statusConfig[selectedBooking.status]?.text || selectedBooking.status}
                    </p>
                    {selectedBooking.status === 'CANCELLED' && selectedBooking.cancellationReason && (
                      <p className="text-xs text-rose-600 mt-2">Reason: {selectedBooking.cancellationReason}</p>
                    )}
                    {selectedBooking.status === 'REJECTED' && selectedBooking.rejectionReason && (
                      <p className="text-xs text-gray-600 mt-2">Reason: {selectedBooking.rejectionReason}</p>
                    )}
                  </div>

                  {selectedBooking.specialRequests && (
                    <div>
                      <h4 className="font-semibold text-gray-800">Special Requests</h4>
                      <p className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-1">{selectedBooking.specialRequests}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-800">Booking Timeline</h4>
                    <p className="text-xs text-gray-600 mt-1">Created: {formatDate(selectedBooking.createdAt)}</p>
                    {selectedBooking.approvedAt && <p className="text-xs text-gray-600">Approved: {formatDate(selectedBooking.approvedAt)}</p>}
                    {selectedBooking.rejectedAt && <p className="text-xs text-gray-600">Rejected: {formatDate(selectedBooking.rejectedAt)}</p>}
                    {selectedBooking.cancelledAt && <p className="text-xs text-gray-600">Cancelled: {formatDate(selectedBooking.cancelledAt)}</p>}
                    {selectedBooking.completedAt && <p className="text-xs text-gray-600">Completed: {formatDate(selectedBooking.completedAt)}</p>}
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
                      className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => {
                        handleAcceptBooking(selectedBooking.id);
                        setSelectedBooking(null);
                      }}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md"
                    >
                      Accept Request
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
                  <button onClick={() => setShowRejectionModal(null)} className="text-gray-400 hover:text-gray-600 text-xl font-semibold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">✕</button>
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
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRejectBooking(showRejectionModal, rejectionReason || null)}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md"
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