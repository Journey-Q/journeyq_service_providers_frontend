import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SidebarTravelAgency';
import InsertVehicle from './InsertVehicle';
import EditVehicle from './EditVehicle';
import { FaCar, FaBus, FaShuttleVan, FaMotorcycle, FaGasPump, FaSnowflake, FaUsers, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { AlertTriangle, Loader2 } from 'lucide-react';
import TravelVehicleService from '../../api_service/TravelVehicleService';

const Vehicles = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Get the serviceProviderId
  const serviceProvider = localStorage.getItem("serviceProvider");
  const serviceProviderId = serviceProvider
    ? JSON.parse(serviceProvider).id
    : null;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const vehiclesData = await TravelVehicleService.getVehiclesByServiceProviderId(serviceProviderId);
      
      // Transform backend data to match frontend structure
      const transformedVehicles = vehiclesData.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        image: vehicle.image,
        type: vehicle.type,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        ac: vehicle.ac,
        numberOfSeats: vehicle.numberOfSeats,
        pricePerKmWithAC: vehicle.pricePerKmWithAC,
        pricePerKmWithoutAC: vehicle.pricePerKmWithoutAC,
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        features: vehicle.features || [],
        status: vehicle.status?.toLowerCase() || 'available'
      }));
      
      setVehicles(transformedVehicles);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    available: "bg-green-100 text-green-800",
    maintenance: "bg-yellow-100 text-yellow-800",
    unavailable: "bg-red-100 text-red-800"
  };

  const statusLabels = {
    available: "Available",
    maintenance: "Maintenance",
    unavailable: "Unavailable"
  };

  const typeIcons = {
    VAN: <FaShuttleVan className="text-blue-500" />,
    CAR: <FaCar className="text-purple-500" />,
    BUS: <FaBus className="text-orange-500" />,
    SUV: <FaCar className="text-teal-500" />,
    MOTORCYCLE: <FaMotorcycle className="text-red-500" />
  };

  const fuelIcons = {
    PETROL: <FaGasPump className="text-gray-600" />,
    DIESEL: <FaGasPump className="text-black" />,
    ELECTRIC: <FaGasPump className="text-green-500" />,
    HYBRID: <FaGasPump className="text-blue-300" />
  };

  const handleEdit = (vehicle) => {
    setCurrentVehicle(vehicle);
    setEditModal(true);
  };

  const handleDeleteClick = (vehicle) => {
    setCurrentVehicle(vehicle);
    setDeleteModal(true);
    setDeleteError('');
  };

  const confirmDelete = async () => {
    if (!currentVehicle) return;

    setDeleteLoading(true);
    setDeleteError('');

    try {
      await TravelVehicleService.deleteVehicle(currentVehicle.id);
      
      // Update local state to remove the deleted vehicle
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== currentVehicle.id));
      
      // Close modal and reset state
      setDeleteModal(false);
      setCurrentVehicle(null);
      
      console.log('Vehicle deleted successfully');
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setDeleteError(err.message || 'Failed to delete vehicle. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddVehicle = (newVehicle) => {
    // Add the new vehicle to the list
    setVehicles(prev => [...prev, newVehicle]);
    setShowModal(false);
    
    // Optionally refetch to ensure data consistency
    fetchVehicles();
  };

  const handleUpdateVehicle = (updatedVehicle) => {
    // Update the vehicle in the list
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
    ));
    setEditModal(false);
    setCurrentVehicle(null);
    
    // Optionally refetch to ensure data consistency
    fetchVehicles();
  };

  const formatPrice = (price) => {
    return `LKR ${price?.toLocaleString('en-IN') || '0'}`;
  };

  const getVehicleIcon = (type) => {
    return typeIcons[type] || <FaCar />;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vehicles...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchVehicles}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        {/* Header and Add Button */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Vehicle Type Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="VAN">Van</option>
                <option value="CAR">Car</option>
                <option value="BUS">Bus</option>
                <option value="SUV">SUV</option>
                <option value="MOTORCYCLE">Motorcycle</option>
              </select>
            </div>

            {/* Seats Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="1-4">1-4</option>
                <option value="5-8">5-8</option>
                <option value="9-15">9-15</option>
                <option value="16+">16+</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (per km)</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="0-50">Rs. 0-50</option>
                <option value="51-100">Rs. 51-100</option>
                <option value="101-150">Rs. 101-150</option>
                <option value="151+">Rs. 151+</option>
              </select>
            </div>

            {/* AC Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">AC</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="with">With AC</option>
                <option value="without">Without AC</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            {/* Add Vehicle Button */}
            <div className="w-full md:w-auto flex items-end">
              <button 
                onClick={() => setShowModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <FaPlus /> Add Vehicle
              </button>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              {/* Vehicle Image */}
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x300?text=Vehicle+Image';
                  }}
                />
                {/* Status Badge */}
                <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${statusColors[vehicle.status]}`}>
                  {statusLabels[vehicle.status]}
                </span>
              </div>
              
              {/* Vehicle Details */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{vehicle.name}</h3>
                    <p className="text-sm text-gray-500">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
                  </div>
                  <div className="text-2xl">
                    {getVehicleIcon(vehicle.type)}
                  </div>
                </div>
                
                {/* Pricing */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">With AC:</span>
                    <span className="font-medium text-blue-600">{formatPrice(vehicle.pricePerKmWithAC)}/km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Without AC:</span>
                    <span className="font-medium text-gray-600">{formatPrice(vehicle.pricePerKmWithoutAC)}/km</span>
                  </div>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUsers className="mr-2 text-gray-500" />
                    {vehicle.numberOfSeats} Seats
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    {fuelIcons[vehicle.fuelType]}
                    <span className="ml-2">{vehicle.fuelType}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    {vehicle.ac ? (
                      <>
                        <FaSnowflake className="mr-2 text-blue-400" />
                        <span>AC Available</span>
                      </>
                    ) : (
                      <span>No AC</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>{vehicle.transmission}</span>
                  </div>
                </div>
                
                {/* License Plate */}
                <div className="mb-4">
                  <div className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {vehicle.licensePlate}
                  </div>
                </div>
                
                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-between border-t pt-3">
                  <button 
                    onClick={() => handleEdit(vehicle)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(vehicle)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {vehicles.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No vehicles found</div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors mx-auto"
            >
              <FaPlus /> Add Your First Vehicle
            </button>
          </div>
        )}

        {/* Add Vehicle Modal */}
        {showModal && (
          <InsertVehicle
            onClose={() => setShowModal(false)}
            onVehicleAdded={handleAddVehicle}
          />
        )}

        {/* Edit Vehicle Modal */}
        {editModal && currentVehicle && (
          <EditVehicle
            vehicle={currentVehicle}
            onClose={() => setEditModal(false)}
            onUpdate={handleUpdateVehicle}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && currentVehicle && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Delete Vehicle</h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete "<span className="font-semibold">{currentVehicle?.name}</span>"? This action cannot be undone.
                </p>
                
                {/* Error Message */}
                {deleteError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{deleteError}</p>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <button
                    onClick={confirmDelete}
                    disabled={deleteLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Yes, Delete'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setDeleteModal(false);
                      setDeleteError('');
                    }}
                    disabled={deleteLoading}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
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

export default Vehicles;