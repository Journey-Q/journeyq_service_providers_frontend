import React, { useState } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  Map,
  ChevronRight,
  // Hiking
} from 'lucide-react';

import Sidebar from '../../components/SidebarTourGuide'; 
import { TourGuideOverview } from './TourGuideOverview';

const DashboardTourGuide = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const tourStats = {
    monthly: { tours: 28, revenue: 88500, guides: 6 },
    weekly:  { tours: 7,  revenue: 23000, guides: 4 },
    yearly:  { tours: 305, revenue: 1112000, guides: 10 }
  };

  const recentTours = [
    { id: 'TP001', name: 'Ella Adventure', guide: 'Nimal Perera', from: 'Jul 01', to: 'Jul 03', amount: 'Rs. 15000', status: 'completed' },
    { id: 'TP002', name: 'Kandy Cultural Trip', guide: 'Sajith Kumara', from: 'Jul 04', to: 'Jul 06', amount: 'Rs. 18000', status: 'booked' },
    { id: 'TP003', name: 'Galle City Tour', guide: 'Ruwan Silva', from: 'Jul 02', to: 'Jul 02', amount: 'Rs. 5000', status: 'in-progress' },
    { id: 'TP004', name: 'Sigiriya Climb', guide: 'Amal Rajapaksa', from: 'Jul 05', to: 'Jul 05', amount: 'Rs. 7000', status: 'booked' },
  ];

  const currentStats = tourStats[selectedPeriod];

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'in-progress': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-stone-800">Tour Guide Dashboard</h1>
            <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-inner border border-stone-200">
              {['weekly', 'monthly', 'yearly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-1 rounded-md text-sm font-medium capitalize transition-colors ${
                    selectedPeriod === period
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl shadow-sm p-6 border border-teal-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-800">Tours This Period</p>
                  <p className="mt-1 text-3xl font-bold text-teal-900">{currentStats.tours}</p>
                  <p className="text-xs mt-1 text-teal-700">+12% from last period</p>
                </div>
                <div className="p-3 rounded-full bg-white/50 backdrop-blur-sm">
                  {/* <Hiking className="w-6 h-6 text-teal-700" /> */}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-sm p-6 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-800">Revenue</p>
                  <p className="mt-1 text-3xl font-bold text-amber-900">
                    Rs.{currentStats.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs mt-1 text-amber-700">+8% from last period</p>
                </div>
                <div className="p-3 rounded-full bg-white/50 backdrop-blur-sm">
                  <DollarSign className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-sm p-6 border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-800">Available Guides</p>
                  <p className="mt-1 text-3xl font-bold text-indigo-900">{currentStats.guides}</p>
                  <p className="text-xs mt-1 text-indigo-700">+2 from last month</p>
                </div>
                <div className="p-3 rounded-full bg-white/50 backdrop-blur-sm">
                  <Users className="w-6 h-6 text-indigo-700" />
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="bg-white rounded-2xl shadow-sm border border-stone-200 lg:col-span-2">
              <header className="p-5 border-b border-stone-200">
                <h2 className="text-lg font-semibold text-stone-800 flex items-center">
                  <Map className="w-5 h-5 mr-2 text-teal-600" />
                  Upcoming Tours
                </h2>
              </header>

              <div className="divide-y divide-stone-100">
                {recentTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="p-4 hover:bg-stone-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(tour.status)}`}>
                        {tour.status === 'booked' && <Calendar className="w-5 h-5" />}
                        {tour.status === 'in-progress' && <Map className="w-5 h-5" />}
                        {/* {tour.status === 'completed' && <Hiking className="w-5 h-5" />} */}
                      </div>
                      <div>
                        <h3 className="font-medium text-stone-800">{tour.name}</h3>
                        <p className="text-sm text-stone-500">
                          {tour.from} - {tour.to} • {tour.guide}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-stone-700">{tour.amount}</span>
                      <ChevronRight className="w-5 h-5 text-stone-400" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-stone-200 text-center">
                <button className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors">
                  View all tours →
                </button>
              </div>
            </section>

            {/* <TourGuideOverview /> */}
          </div>

          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors flex flex-col items-center">
                <Calendar className="w-6 h-6 text-teal-600 mb-2" />
                <span className="text-sm font-medium text-teal-800">Schedule Tour</span>
              </button>
              <button className="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors flex flex-col items-center">
                <Users className="w-6 h-6 text-amber-600 mb-2" />
                <span className="text-sm font-medium text-amber-800">Manage Clients</span>
              </button>
              <button className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-colors flex flex-col items-center">
                <Map className="w-6 h-6 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-indigo-800">Tour Routes</span>
              </button>
              <button className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors flex flex-col items-center">
                <DollarSign className="w-6 h-6 text-emerald-600 mb-2" />
                <span className="text-sm font-medium text-emerald-800">Earnings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTourGuide;