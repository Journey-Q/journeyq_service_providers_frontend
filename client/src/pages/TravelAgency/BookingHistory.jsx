import React, { useState } from 'react';
import Sidebar from '../../components/SidebarTravelAgency';
import { FiCalendar, FiUser, FiInfo, FiFilter } from 'react-icons/fi';

const BookingHistory = () => {
  const allBookings = [
    {
      id: 'BKG-2025-0710-001',
      client: { name: 'Jason Miller' },
      date: 'July 10, 2025',
      time: '9:00 AM',
      destination: 'Kandy',
      status: 'confirmed',
    },
    {
      id: 'BKG-2025-0710-002',
      client: { name: 'Ella Watson' },
      date: 'July 10, 2025',
      time: '2:00 PM',
      destination: 'Ella',
      status: 'cancelled',
      reason: 'Client requested cancellation'
    },
    {
      id: 'BKG-2025-0709-003',
      client: { name: 'Noah Smith' },
      date: 'July 9, 2025',
      time: '10:30 AM',
      destination: 'Galle',
      status: 'completed',
    },
    {
      id: 'BKG-2025-0608-004',
      client: { name: 'Emily Johnson' },
      date: 'June 8, 2025',
      time: '11:00 AM',
      destination: 'Nuwara Eliya',
      status: 'confirmed',
    }
  ];

  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2025');

  const statusConfig = {
    confirmed: {
      text: 'Confirmed',
      color: 'bg-blue-100 text-blue-800',
      icon: '✓'
    },
    completed: {
      text: 'Completed',
      color: 'bg-emerald-100 text-emerald-800',
      icon: '✔'
    },
    cancelled: {
      text: 'Cancelled',
      color: 'bg-rose-100 text-rose-800',
      icon: '✗'
    }
  };

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

  const filteredBookings = allBookings.filter(booking => {
    const dateObj = new Date(booking.date);
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = String(dateObj.getFullYear());

    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
    const monthMatch = monthFilter === 'all' || month === monthFilter;
    const yearMatch = year === yearFilter;

    return statusMatch && monthMatch && yearMatch;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Booking History</h1>
          <p className="text-slate-600 mt-2">View and manage travel bookings</p>
        </header>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <FiFilter className="text-slate-500 mr-2" />
              <h3 className="font-medium text-slate-700">Filter Bookings</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Statuses</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.text}</option>
                ))}
              </select>

              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>

              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Booking ID</th>
                  <th className="px-6 py-4 text-left">client</th>
                  <th className="px-6 py-4 text-left">Date & Time</th>
                  <th className="px-6 py-4 text-left">Destination</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs text-blue-600">{booking.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{booking.client.name}</td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-slate-400" />
                          {booking.date} <span className="text-slate-400">at</span> {booking.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">{booking.destination}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status].color}`}>
                          {statusConfig[booking.status].icon} {statusConfig[booking.status].text}
                        </span>
                        {booking.status === 'cancelled' && booking.reason && (
                          <div className="text-xs text-rose-600 mt-1">{booking.reason}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 hover:underline text-sm inline-flex items-center">
                          <FiInfo className="mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center px-6 py-4 text-gray-500">
                      No bookings found for the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 text-sm text-slate-600">
            Showing <strong>1</strong> to <strong>{filteredBookings.length}</strong> of <strong>{filteredBookings.length}</strong> bookings
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingHistory;
