import React, { useState } from 'react';
import Sidebar from '../../components/SidebarTourGuide';
import { FiCalendar, FiUser, FiInfo, FiClock, FiCheckCircle, FiXCircle, FiPhone, FiMail, FiUsers } from 'react-icons/fi';

const BookingHistory = () => {
  const allBookings = [
    {
      id: 'TG-BK-2025-0701-001',
      guest: {
        name: 'Nimal Perera',
        email: 'nimal.p@example.com',
        phone: '+94 71 123 4567',
        address: 'No. 42, Flower Road, Colombo 07'
      },
      tourName: 'Kandy Day Tour',
      tourGuide: 'Kasun Jayasinghe',
      startDate: 'July 1, 2025',
      endDate: 'July 1, 2025',
      participants: 2,
      amount: 150000,
      status: 'confirmed',
      bookingDate: 'June 25, 2025',
      specialRequests: 'Sinhala-speaking guide'
    },
    {
      id: 'TG-BK-2025-0628-002',
      guest: {
        name: 'Samantha de Silva',
        email: 'samantha.d@example.com',
        phone: '+94 77 987 6543',
        address: 'No. 15, Beach Road, Matara'
      },
      tourName: 'Sigiriya & Dambulla',
      tourGuide: 'Tharindu Fernando',
      startDate: 'June 28, 2025',
      endDate: 'June 28, 2025',
      participants: 4,
      amount: 240000,
      status: 'completed',
      bookingDate: 'June 20, 2025',
      specialRequests: 'Pick-up from hotel'
    },
    {
      id: 'TG-BK-2025-0620-003',
      guest: {
        name: 'Ashan Weerasinghe',
        email: 'ashan.w@example.com',
        phone: '+94 76 555 7890',
        address: 'No. 90, Temple Road, Anuradhapura'
      },
      tourName: 'Ella Adventure Tour',
      tourGuide: 'Dinuka Rathnayake',
      startDate: 'June 20, 2025',
      endDate: 'June 21, 2025',
      participants: 3,
      amount: 300000,
      status: 'cancelled',
      bookingDate: 'June 10, 2025',
      cancellationReason: 'Illness in group',
      specialRequests: 'English-speaking guide'
    }
  ];

  const [selectedBooking, setSelectedBooking] = useState(null);

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

  const formatAmount = (cents) => `LKR ${(cents / 100).toFixed(2)}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tour Booking History</h2>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-grey-600 text-[#2953A6] border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Booking ID</th>
                <th className="px-6 py-4 text-left font-medium">Guest</th>
                <th className="px-6 py-4 text-left font-medium">Tour</th>
                <th className="px-6 py-4 text-left font-medium">Dates</th>
                <th className="px-6 py-4 text-left font-medium">Participants</th>
                <th className="px-6 py-4 text-left font-medium">Amount</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-[#2953A6]">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{booking.guest.name}</div>
                    <div className="text-sm text-gray-500">{booking.guest.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{booking.tourName}</div>
                    <div className="text-sm text-gray-500">Guide: {booking.tourGuide}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span>{booking.startDate}</span>
                    <div className="text-xs text-gray-400">to {booking.endDate}</div>
                  </td>
                  <td className="px-6 py-4">{booking.participants}</td>
                  <td className="px-6 py-4 font-medium">{formatAmount(booking.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status].color}`}>
                      {statusConfig[booking.status].icon} {statusConfig[booking.status].text}
                    </span>
                    {booking.status === 'cancelled' && booking.cancellationReason && (
                      <div className="text-xs text-rose-600 mt-1">{booking.cancellationReason}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
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

        {selectedBooking && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBooking(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const booking = allBookings.find(b => b.id === selectedBooking);
                return booking && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                      <h3 className="text-xl font-bold text-gray-800">Booking Details</h3>
                      <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600 text-xl font-semibold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">✕</button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800">Guest</h4>
                        <p>{booking.guest.name}</p>
                        <p className="text-sm text-gray-600">{booking.guest.email}</p>
                        <p className="text-sm text-gray-600">{booking.guest.phone}</p>
                        <p className="text-sm text-gray-600">{booking.guest.address}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mt-4">Tour Details</h4>
                        <p><strong>{booking.tourName}</strong> with {booking.tourGuide}</p>
                        <p className="text-sm text-gray-600">{booking.startDate} to {booking.endDate}</p>
                        <p className="text-sm text-gray-600">Participants: {booking.participants}</p>
                        <p className="text-sm text-gray-600">Amount: {formatAmount(booking.amount)}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mt-4">Status</h4>
                        <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status].color}`}>
                          {statusConfig[booking.status].icon} {statusConfig[booking.status].text}
                        </p>
                        {booking.status === 'cancelled' && booking.cancellationReason && (
                          <p className="text-xs text-rose-600 mt-1">Reason: {booking.cancellationReason}</p>
                        )}
                      </div>

                      {booking.specialRequests && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-800">Special Requests</h4>
                          <p className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-2">{booking.specialRequests}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingHistory;