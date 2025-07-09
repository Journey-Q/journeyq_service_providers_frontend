import React, { useState } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Star,
  Phone,
  Mail,
  Globe,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Eye
} from 'lucide-react';

import SidebarHotel from '../../components/SidebarHotel'; 
import {RoomsOverview} from './Room_overview';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  /* ---------------------------- sample data ---------------------------- */
  const bookingStats = {
    monthly: { bookings: 156, revenue: 45680, occupancy: 78 },
    weekly:  { bookings: 38,  revenue: 11250, occupancy: 82 },
    yearly:  { bookings: 1843, revenue: 542340, occupancy: 75 }
  };

  const recentBookings = [
    { id: 'BK001', guest: 'John Smith', room: '101', checkIn: 'Dec 15', checkOut: 'Dec 18', amount: '$450', status: 'confirmed' },
    { id: 'BK002', guest: 'Sarah Johnson', room: '205', checkIn: 'Dec 16', checkOut: 'Dec 20', amount: '$680', status: 'confirmed' },
    { id: 'BK003', guest: 'Mike Wilson', room: '312', checkIn: 'Dec 17', checkOut: 'Dec 19', amount: '$320', status: 'pending' },
    { id: 'BK004', guest: 'Emma Davis', room: '108', checkIn: 'Dec 18', checkOut: 'Dec 22', amount: '$720', status: 'confirmed' },
    { id: 'BK005', guest: 'Tom Brown', room: '220', checkIn: 'Dec 19', checkOut: 'Dec 21', amount: '$380', status: 'checked-in' },
    { id: 'BK006', guest: 'Lisa Anderson', room: '104', checkIn: 'Dec 20', checkOut: 'Dec 24', amount: '$820', status: 'confirmed' }
  ];

  const currentStats = bookingStats[selectedPeriod];

  const getStatusColor = status => {
    switch (status) {
      case 'confirmed':  return 'bg-green-100 text-green-800';
      case 'pending':    return 'bg-yellow-100 text-yellow-800';
      case 'checked-in': return 'bg-blue-100 text-blue-800';
      default:           return 'bg-gray-100 text-gray-800';
    }
  };

  /* ------------------------------ render ------------------------------ */
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarHotel />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Period selector */}
          <div className="mb-8">
            <div className="flex space-x-4">
              {['weekly', 'monthly', 'yearly'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-6 py-2 rounded-lg font-medium capitalize transition-colors ${
                    selectedPeriod === period
                      ? 'bg-[#0B9ED9] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Stats cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Bookings */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Bookings
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">
                    {currentStats.bookings}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#2953A6]/10">
                  <Calendar className="w-8 h-8 text-[#2953A6]" />
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Revenue
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">
                    Rs.{currentStats.revenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Occupancy */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Occupancy Rate
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">
                    {currentStats.occupancy}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </section>

          {/* Two‑column layout with fixed height and scrollable content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
            {/* Recent bookings */}
            <section className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-150">
              <header className="p-4 border-b border-gray-100 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-800">
                  Recent Bookings
                </h2>
              </header>
              
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {recentBookings.map(booking => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800 text-sm">
                            {booking.guest}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Room {booking.room} • {booking.checkIn} to {booking.checkOut}
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#2953A6]">
                          {booking.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-100 flex-shrink-0">
                  <button className="w-full px-4 py-2 bg-[#1F74BF] text-white rounded-lg  transition-colors font-medium">
                    View All Bookings
                  </button>
                </div>
              </div>
            </section>

            {/* Room overview */}
            <RoomsOverview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;