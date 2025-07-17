import React, { useState } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  Truck,
} from 'lucide-react';

import SidebarTravelAgency from '../../components/SidebarTravelAgency'; 
import { VehicleOverview } from './VehicleOverview'; // updated from RoomOverview

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  /* ---------------------------- sample data ---------------------------- */
  const rentalStats = {
    monthly: { rentals: 120, revenue: 34560, usageRate: 88 },
    weekly:  { rentals: 34,  revenue: 10200, usageRate: 75 },
    yearly:  { rentals: 1320, revenue: 412300, usageRate: 82 }
  };

  const recentRentals = [
    { id: 'VR001', customer: 'Kamal Perera', vehicle: 'Toyota Prius', pickup: 'Jul 01', return: 'Jul 04', amount: 'LKR 8500', status: 'returned' },
    { id: 'VR002', customer: 'Sunil Jayarathna', vehicle: 'Suzuki Alto', pickup: 'Jul 03', return: 'Jul 05', amount: 'LKR 5000', status: 'booked' },
    { id: 'VR003', customer: 'W.A. Silva', vehicle: 'Nissan Caravan', pickup: 'Jul 02', return: 'Jul 08', amount: 'LKR 12000', status: 'in-use' },
    { id: 'VR004', customer: 'Martin Wickramasinghe', vehicle: 'Toyota Hiace', pickup: 'Jul 05', return: 'Jul 10', amount: 'LKR 15000', status: 'booked' },
  ];

  const currentStats = rentalStats[selectedPeriod];

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked': return 'bg-yellow-100 text-yellow-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'returned': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /* ------------------------------ render ------------------------------ */
  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarTravelAgency />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Period selector */}
          <div className="mb-8">
            <div className="flex space-x-4">
              {['weekly', 'monthly', 'yearly'].map((period) => (
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
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rentals</p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">{currentStats.rentals}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#2953A6]/10">
                  <Calendar className="w-8 h-8 text-[#2953A6]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">
                    LKR {currentStats.revenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fleet Usage</p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">{currentStats.usageRate}%</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <Truck className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </section>

          {/* Layout with Recent Hires and vehicle overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-150">
              <header className="p-4 border-b border-gray-100 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-800">Recent Hires</h2>
              </header>

              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {recentRentals.map((rental) => (
                    <div
                      key={rental.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800 text-sm">
                            {rental.customer}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}
                          >
                            {rental.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {rental.vehicle} • {rental.pickup} to {rental.return}
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#2953A6]">
                          {rental.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-100 flex-shrink-0">
                  <button className="w-full px-4 py-2 bg-[#1F74BF] text-white rounded-lg transition-colors font-medium">
                    View All Rentals
                  </button>
                </div>
              </div>
            </section>

            <VehicleOverview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
