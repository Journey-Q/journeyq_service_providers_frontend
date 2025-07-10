import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

const VehicleOverview = () => {
  // Sample available vehicles data
  const availableVehicles = [
    {
      id: 1,
      name: "Toyota Prius",
      image: "https://images.unsplash.com/photo-1583267746890-3b89c7e5a4e3?auto=format&fit=crop&w=500&q=60",
      pricePerDay: 3000,
      seats: 4,
      features: ["Hybrid", "Air Conditioning", "Automatic"],
      status: "available"
    },
    {
      id: 2,
      name: "Nissan Caravan",
      image: "https://images.unsplash.com/photo-1603732551685-6483ac55b02f?auto=format&fit=crop&w=500&q=60",
      pricePerDay: 4500,
      seats: 10,
      features: ["Spacious", "AC", "Manual"],
      status: "available"
    },
    {
      id: 3,
      name: "Suzuki Alto",
      image: "https://images.unsplash.com/photo-1601239442949-3c4d285a0bd7?auto=format&fit=crop&w=500&q=60",
      pricePerDay: 2000,
      seats: 4,
      features: ["Compact", "Economical", "Automatic"],
      status: "available"
    }
  ];

  const totalVehicles = 20;
  const availableCount = 6;
  const rentedCount = 12;
  const maintenanceCount = 2;

  return (
    <section className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
      <header className="p-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Available Vehicles</h2>
          <Link 
            to="/travel/vehicle-management"
            className="flex items-center text-[#2953A6] hover:text-[#1F74BF] font-medium text-sm transition-colors"
          >
            <Eye className="w-4 h-4 mr-1" />
            View All
          </Link>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Quick Stats */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-xl font-bold text-green-600">{availableCount}</div>
              <div className="text-xs text-green-700">Available</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="text-xl font-bold text-red-600">{rentedCount}</div>
              <div className="text-xs text-red-700">Rented</div>
            </div>
          </div>
        </div>

        {/* Available Vehicles List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {availableVehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <img 
                src={vehicle.image} 
                alt={vehicle.name}
                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-800 text-sm truncate">{vehicle.name}</h5>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  <span className="font-medium text-[#2953A6]">Rs.{vehicle.pricePerDay}/day</span>
                  <span className="mx-1">•</span>
                  <span>{vehicle.seats} seats</span>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  {vehicle.features.slice(0, 2).map((feature, index) => (
                    <span key={index} className="bg-white text-gray-600 text-xs px-1.5 py-0.5 rounded border">
                      {feature}
                    </span>
                  ))}
                  {vehicle.features.length > 2 && (
                    <span className="text-gray-500 text-xs">
                      +{vehicle.features.length - 2}
                    </span>
                  )}
                </div>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                Available
              </span>
            </div>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Fleet Usage Rate:</span>
            <span className="font-medium text-gray-800">
              {Math.round((rentedCount / totalVehicles) * 100)}%
            </span>
          </div>
          <Link 
            to="/travel/vehicle-management"
            className="block w-full px-4 py-2 bg-[#1F74BF] text-white text-center rounded-lg transition-colors font-medium text-sm"
          >
            Manage All Vehicles
          </Link>
        </div>
      </div>
    </section>
  );
};

export { VehicleOverview };
