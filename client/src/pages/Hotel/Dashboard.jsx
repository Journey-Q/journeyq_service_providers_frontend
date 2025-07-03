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
  Coffee
  // ❌ Sidebar icon removed – not used
} from 'lucide-react';

import SidebarHotel from '../../components/SidebarHotel'; // ✅ renamed

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  /* ---------------------------- sample data ---------------------------- */
  const bookingStats = {
    monthly: { bookings: 156, revenue: 45680, occupancy: 78 },
    weekly:  { bookings: 38,  revenue: 11250, occupancy: 82 },
    yearly:  { bookings: 1843, revenue: 542340, occupancy: 75 }
  };

  const recentBookings = [
    { id: 'BK001', guest: 'John Smith', room: '101', checkIn: '2025-07-03', checkOut: '2025-07-06', amount: 450, status: 'confirmed' },
    { id: 'BK002', guest: 'Sarah Johnson', room: '205', checkIn: '2025-07-04', checkOut: '2025-07-08', amount: 680, status: 'confirmed' },
    { id: 'BK003', guest: 'Mike Wilson', room: '312', checkIn: '2025-07-05', checkOut: '2025-07-07', amount: 320, status: 'pending' },
    { id: 'BK004', guest: 'Emma Davis', room: '108', checkIn: '2025-07-06', checkOut: '2025-07-10', amount: 720, status: 'confirmed' },
    { id: 'BK005', guest: 'Tom Brown', room: '220', checkIn: '2025-07-07', checkOut: '2025-07-09', amount: 380, status: 'checked-in' }
  ];

  const hotelProfile = {
    name: 'Hotel Quasar',
    rating: 4,
    rooms: 75,
    location: 'New York, NY',
    phone: '+1 (555) 123-4567',
    email: 'admin@hotelquasar.com',
    website: 'www.hotelquasar.com',
    amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Spa & Wellness']
  };

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
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Dashboard – Hotel
            </h1>
            <p className="text-gray-600">
              Welcome back! Here’s what’s happening at your hotel.
            </p>
          </header>

          {/* Period selector */}
          <div className="mb-8">
            <div className="flex space-x-4">
              {['weekly', 'monthly', 'yearly'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-6 py-2 rounded-lg font-medium capitalize transition-colors ${
                    selectedPeriod === period
                      ? 'bg-[#0088cc] text-white'
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
                  <p className="mt-2 text-sm text-green-600 flex items-center">
                    <TrendingUp className="mr-1 w-4 h-4" />
                    +12% from last {selectedPeriod.slice(0, -2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#0088cc]/10">
                  <Calendar className="w-8 h-8 text-[#0088cc]" />
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
                    ${currentStats.revenue.toLocaleString()}
                  </p>
                  <p className="mt-2 text-sm text-green-600 flex items-center">
                    <TrendingUp className="mr-1 w-4 h-4" />
                    +8% from last {selectedPeriod.slice(0, -2)}
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
                  <p className="mt-2 text-sm text-green-600 flex items-center">
                    <TrendingUp className="mr-1 w-4 h-4" />
                    +5% from last {selectedPeriod.slice(0, -2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </section>

          {/* Two‑column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent bookings */}
            <section className="bg-white rounded-xl shadow-md border border-gray-100">
              <header className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">
                  Recent Bookings
                </h2>
              </header>
              <div className="p-6">
                <div className="space-y-4">
                  {recentBookings.map(b => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800">
                            {b.guest}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              b.status
                            )}`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Room {b.room} • {b.checkIn} to {b.checkOut}
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#0088cc]">
                          {b.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077bb] transition-colors">
                  View All Bookings
                </button>
              </div>
            </section>

            {/* Hotel profile */}
            <section className="bg-white rounded-xl shadow-md border border-gray-100">
              <header className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Hotel Profile</h2>
              </header>
              <div className="p-6 space-y-6">
                {/* Name & stars */}
                <div className="text-center">
                  <h3 className="mb-2 text-2xl font-bold text-gray-800">
                    {hotelProfile.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= hotelProfile.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">
                      ({hotelProfile.rating}/5)
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <Detail icon={MapPin} text={hotelProfile.location} />
                  <Detail icon={Users} text={`${hotelProfile.rooms} Rooms`} />
                  <Detail icon={Phone} text={hotelProfile.phone} />
                  <Detail icon={Mail} text={hotelProfile.email} />
                  <Detail icon={Globe} text={hotelProfile.website} />
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="mb-3 font-semibold text-gray-800">Amenities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {hotelProfile.amenities.map(a => (
                      <Amenity key={a} label={a} />
                    ))}
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Edit Profile
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Small helper components for cleaner JSX */
const Detail = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-3">
    <Icon className="w-5 h-5 text-[#0088cc]" />
    <span className="text-gray-700">{text}</span>
  </div>
);

const Amenity = ({ label }) => {
  const iconMap = {
    'Free WiFi': Wifi,
    Parking: Car,
    Restaurant: Coffee,
    'Spa & Wellness': Star
  };
  const Icon = iconMap[label] || Star;
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <Icon className="w-4 h-4 text-[#0088cc]" />
      <span>{label}</span>
    </div>
  );
};

export default Dashboard;
