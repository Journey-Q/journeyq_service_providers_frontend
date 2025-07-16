import React, { useState } from 'react';
import Sidebar from '../../components/SidebarTravelAgency';
import { FaCar, FaBus, FaShuttleVan, FaMotorcycle, FaGasPump, FaSnowflake, FaUsers, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Vehicles = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: "Toyota Hiace Super GL",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwaGlhY2V8ZW58MHx8MHx8fDA%3D",
      type: "Van",
      brand: "Toyota",
      model: "Hiace Super GL",
      year: 2022,
      licensePlate: "NC-1234",
      ac: true,
      passengers: 12,
      pricePerKmWithAC: 120,
      pricePerKmWithoutAC: 100,
      fuelType: "Diesel",
      transmission: "Automatic",
      features: ["AC", "Comfortable Seats", "Luggage Space", "TV", "WiFi"],
      status: "available"
    },
    {
      id: 2,
      name: "Nissan Sunny",
      image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmlzc2FuJTIwc3Vubnl8ZW58MHx8MHx8fDA%3D",
      type: "Car",
      brand: "Nissan",
      model: "Sunny",
      year: 2021,
      licensePlate: "BPK-4729",
      ac: true,
      passengers: 4,
      pricePerKmWithAC: 80,
      pricePerKmWithoutAC: 60,
      fuelType: "Petrol",
      transmission: "Automatic",
      features: ["AC", "Fuel Efficient", "Comfortable Seats"],
      status: "available"
    },
    {
      id: 3,
      name: "Luxury Coach",
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bHV4dXJ5JTIwYnVzfGVufDB8fDB8fHww",
      type: "Bus",
      brand: "Ashok Leyland",
      model: "Luxury Coach",
      year: 2020,
      licensePlate: "NP-2468",
      ac: true,
      passengers: 40,
      pricePerKmWithAC: 200,
      pricePerKmWithoutAC: 150,
      fuelType: "Diesel",
      transmission: "Manual",
      features: ["AC", "Reclining Seats", "Toilet", "Entertainment System"],
      status: "maintenance"
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Van',
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    ac: true,
    passengers: '',
    pricePerKmWithAC: '',
    pricePerKmWithoutAC: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    features: '',
    status: 'available',
    image: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

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
    Van: <FaShuttleVan className="text-blue-500" />,
    Car: <FaCar className="text-purple-500" />,
    Bus: <FaBus className="text-orange-500" />,
    SUV: <FaCar className="text-teal-500" />,
    Motorcycle: <FaMotorcycle className="text-red-500" />
  };

  const fuelIcons = {
    Petrol: <FaGasPump className="text-gray-600" />,
    Diesel: <FaGasPump className="text-black" />,
    Electric: <FaGasPump className="text-green-500" />,
    Hybrid: <FaGasPump className="text-blue-300" />
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const featuresArray = formData.features.split(',').map(feature => feature.trim()).filter(feature => feature);
    
    const newVehicle = {
      id: vehicles.length + 1,
      name: formData.name,
      type: formData.type,
      brand: formData.brand,
      model: formData.model,
      year: parseInt(formData.year),
      licensePlate: formData.licensePlate,
      ac: formData.ac,
      passengers: parseInt(formData.passengers),
      pricePerKmWithAC: parseFloat(formData.pricePerKmWithAC),
      pricePerKmWithoutAC: parseFloat(formData.pricePerKmWithoutAC),
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      features: featuresArray,
      status: formData.status,
      image: imagePreview || "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVoaWNsZXxlbnwwfHwwfHx8MA%3D%3D"
    };

    setVehicles(prev => [...prev, newVehicle]);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Van',
      brand: '',
      model: '',
      year: '',
      licensePlate: '',
      ac: true,
      passengers: '',
      pricePerKmWithAC: '',
      pricePerKmWithoutAC: '',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      features: '',
      status: 'available',
      image: ''
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleEdit = (vehicle) => {
    setCurrentVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year.toString(),
      licensePlate: vehicle.licensePlate,
      ac: vehicle.ac,
      passengers: vehicle.passengers.toString(),
      pricePerKmWithAC: vehicle.pricePerKmWithAC.toString(),
      pricePerKmWithoutAC: vehicle.pricePerKmWithoutAC.toString(),
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      features: vehicle.features.join(', '),
      status: vehicle.status,
      image: vehicle.image
    });
    setImagePreview(vehicle.image);
    setImageFile(null);
    setEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    const featuresArray = formData.features.split(',').map(feature => feature.trim()).filter(feature => feature);
    
    const updatedVehicle = {
      ...currentVehicle,
      name: formData.name,
      type: formData.type,
      brand: formData.brand,
      model: formData.model,
      year: parseInt(formData.year),
      licensePlate: formData.licensePlate,
      ac: formData.ac,
      passengers: parseInt(formData.passengers),
      pricePerKmWithAC: parseFloat(formData.pricePerKmWithAC),
      pricePerKmWithoutAC: parseFloat(formData.pricePerKmWithoutAC),
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      features: featuresArray,
      status: formData.status,
      image: imagePreview || currentVehicle.image
    };

    setVehicles(prev => prev.map(vehicle => vehicle.id === currentVehicle.id ? updatedVehicle : vehicle));
    setEditModal(false);
    setCurrentVehicle(null);
    resetForm();
  };

  const handleDeleteClick = (vehicle) => {
    setCurrentVehicle(vehicle);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== currentVehicle.id));
    setDeleteModal(false);
    setCurrentVehicle(null);
  };

  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString('en-IN')}`;
  };

  const getVehicleIcon = (type) => {
    return typeIcons[type] || <FaCar />;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        {/* Header and Add Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Vehicle Fleet Management</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <FaPlus /> Add Vehicle
          </button>
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
                    {vehicle.passengers} passengers
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

        {/* Add Vehicle Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Add New Vehicle</h2>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vehicle Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Luxury Coach"
                      />
                    </div>

                    {/* Vehicle Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type*</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Van">Van</option>
                        <option value="Car">Car</option>
                        <option value="Bus">Bus</option>
                        <option value="SUV">SUV</option>
                        <option value="Motorcycle">Motorcycle</option>
                      </select>
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand*</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Toyota"
                      />
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Model*</label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Hiace Super GL"
                      />
                    </div>

                    {/* Year */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year*</label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 2022"
                      />
                    </div>

                    {/* License Plate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Plate*</label>
                      <input
                        type="text"
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., NC-1234"
                      />
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing (per km)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* With AC Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">With AC (Rs.)*</label>
                        <input
                          type="number"
                          name="pricePerKmWithAC"
                          value={formData.pricePerKmWithAC}
                          onChange={handleInputChange}
                          required
                          min="1"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 120"
                        />
                      </div>

                      {/* Without AC Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Without AC (Rs.)*</label>
                        <input
                          type="number"
                          name="pricePerKmWithoutAC"
                          value={formData.pricePerKmWithoutAC}
                          onChange={handleInputChange}
                          required
                          min="1"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Passengers */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passenger Capacity*</label>
                      <input
                        type="number"
                        name="passengers"
                        value={formData.passengers}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 12"
                      />
                    </div>

                    {/* AC */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="ac"
                        checked={formData.ac}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">Air Conditioning Available</label>
                    </div>

                    {/* Fuel Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type*</label>
                      <select
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    {/* Transmission */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transmission*</label>
                      <select
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                    <textarea
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter features, separated by commas (e.g., AC, WiFi, TV, Reclining Seats)"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status*</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="available">Available</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Image</label>
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Add Vehicle
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Vehicle Modal */}
        {editModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Vehicle</h2>
                  <button 
                    onClick={() => setEditModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vehicle Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Vehicle Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type*</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Van">Van</option>
                        <option value="Car">Car</option>
                        <option value="Bus">Bus</option>
                        <option value="SUV">SUV</option>
                        <option value="Motorcycle">Motorcycle</option>
                      </select>
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand*</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Model*</label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Year */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year*</label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* License Plate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Plate*</label>
                      <input
                        type="text"
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing (per km)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* With AC Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">With AC (Rs.)*</label>
                        <input
                          type="number"
                          name="pricePerKmWithAC"
                          value={formData.pricePerKmWithAC}
                          onChange={handleInputChange}
                          required
                          min="1"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Without AC Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Without AC (Rs.)*</label>
                        <input
                          type="number"
                          name="pricePerKmWithoutAC"
                          value={formData.pricePerKmWithoutAC}
                          onChange={handleInputChange}
                          required
                          min="1"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Passengers */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passenger Capacity*</label>
                      <input
                        type="number"
                        name="passengers"
                        value={formData.passengers}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* AC */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="ac"
                        checked={formData.ac}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">Air Conditioning Available</label>
                    </div>

                    {/* Fuel Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type*</label>
                      <select
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    {/* Transmission */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transmission*</label>
                      <select
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                    <textarea
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status*</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="available">Available</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Image</label>
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Update Vehicle
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditModal(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
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
                
                <div className="flex space-x-4">
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
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