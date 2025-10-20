import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Loader2, AlertTriangle } from 'lucide-react';
import TravelVehicleService from '../../api_service/TravelVehicleService';

const VehicleOverview = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get service provider ID
  const serviceProvider = localStorage.getItem("serviceProvider");
  const serviceProviderId = serviceProvider
    ? JSON.parse(serviceProvider).id
    : null;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    if (!serviceProviderId) {
      setError('Service provider not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const vehiclesData = await TravelVehicleService.getVehiclesByServiceProviderId(serviceProviderId);
      
      // Transform backend data
      const transformedVehicles = vehiclesData.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        image: vehicle.image,
        pricePerKmWithAC: vehicle.pricePerKmWithAC,
        pricePerKmWithoutAC: vehicle.pricePerKmWithoutAC,
        numberOfSeats: vehicle.numberOfSeats,
        features: vehicle.features || [],
        status: vehicle.status?.toLowerCase() || 'available',
        type: vehicle.type,
        ac: vehicle.ac
      }));
      
      setVehicles(transformedVehicles);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'available');
  const availableCount = availableVehicles.length;
  const rentedCount = vehicles.filter(v => v.status === 'unavailable').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'maintenance').length;

  // Get first 3 available vehicles for display
  const displayVehicles = availableVehicles.slice(0, 3);

  // Calculate fleet usage rate
  const fleetUsageRate = totalVehicles > 0 
    ? Math.round(((rentedCount + maintenanceCount) / totalVehicles) * 100) 
    : 0;

  if (loading) {
    return (
      <section className="bg-white shadow-md border border-gray-100 flex flex-col h-full">
        <header className="p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Available Vehicles</h2>
        </header>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Loading vehicles...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white shadow-md border border-gray-100 flex flex-col h-full">
        <header className="p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Available Vehicles</h2>
        </header>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <button 
              onClick={fetchVehicles}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white shadow-md border border-gray-100 flex flex-col h-full">
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
          {displayVehicles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No available vehicles</p>
              <Link 
                to="/travel/vehicle-management"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
              >
                Add vehicles
              </Link>
            </div>
          ) : (
            displayVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100?text=Vehicle';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-800 text-sm truncate">{vehicle.name}</h5>
                  <div className="flex items-center text-xs text-gray-600 mt-1">
                    <span className="font-medium text-[#2953A6]">
                      Rs.{vehicle.pricePerKmWithAC}/km
                    </span>
                    <span className="mx-1">•</span>
                    <span>{vehicle.numberOfSeats} seats</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    {vehicle.ac && (
                      <span className="bg-white text-gray-600 text-xs px-1.5 py-0.5 rounded border">
                        AC
                      </span>
                    )}
                    <span className="bg-white text-gray-600 text-xs px-1.5 py-0.5 rounded border">
                      {vehicle.type}
                    </span>
                    {vehicle.features.length > 0 && (
                      <span className="text-gray-500 text-xs">
                        +{vehicle.features.length}
                      </span>
                    )}
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                  Available
                </span>
              </div>
            ))
          )}
          
          {availableCount > 3 && (
            <div className="text-center pt-2">
              <Link 
                to="/travel/vehicle-management"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View {availableCount - 3} more available vehicle{availableCount - 3 > 1 ? 's' : ''}
              </Link>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Vehicles:</span>
            <span className="font-medium text-gray-800">{totalVehicles}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Fleet Usage Rate:</span>
            <span className="font-medium text-gray-800">{fleetUsageRate}%</span>
          </div>
          {maintenanceCount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">In Maintenance:</span>
              <span className="font-medium text-yellow-600">{maintenanceCount}</span>
            </div>
          )}
          <Link 
            to="/travel/vehicle-management"
            className="block w-full px-4 py-2 bg-[#1F74BF] hover:bg-[#2953A6] text-white text-center rounded-lg transition-colors font-medium text-sm"
          >
            Manage All Vehicles
          </Link>
        </div>
      </div>
    </section>
  );
};

export { VehicleOverview };