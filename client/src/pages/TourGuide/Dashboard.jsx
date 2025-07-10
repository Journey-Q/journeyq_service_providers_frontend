import React, { useState } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  Map,
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
      case 'booked': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
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

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tours This Period</p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">{currentStats.tours}</p>
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
                    Rs.{currentStats.revenue.toLocaleString()}
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
                  <p className="text-sm font-medium text-gray-600">Available Guides</p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">{currentStats.guides}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-150">
              <header className="p-4 border-b border-gray-100 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-800">Recent Tours</h2>
              </header>

              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {recentTours.map((tour) => (
                    <div
                      key={tour.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800 text-sm">
                            {tour.name}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}
                          >
                            {tour.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {tour.guide} • {tour.from} to {tour.to}
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#2953A6]">
                          {tour.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-100 flex-shrink-0">
                  <button className="w-full px-4 py-2 bg-[#1F74BF] text-white rounded-lg transition-colors font-medium">
                    View All Tours
                  </button>
                </div>
              </div>
            </section>

            <TourGuideOverview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTourGuide;
