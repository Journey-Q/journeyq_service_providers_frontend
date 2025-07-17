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
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/2020_Toyota_HiAce_%28front%29.jpg/500px-2020_Toyota_HiAce_%28front%29.jpg",
      type: "Van",
      brand: "Toyota",
      model: "Hiace Super GL",
      year: 2022,
      licensePlate: "NC-1234",
      ac: true,
      numberOfSeats: 12,
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
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/NISSAN_Sunny_B13.jpg/500px-NISSAN_Sunny_B13.jpg",
      type: "Car",
      brand: "Nissan",
      model: "Sunny",
      year: 2021,
      licensePlate: "BPK-4729",
      ac: true,
      numberOfSeats: 4,
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
      image: "data:image/jpeg;base64,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",
      type: "Bus",
      brand: "Ashok Leyland",
      model: "Luxury Coach",
      year: 2020,
      licensePlate: "NP-2468",
      ac: true,
      numberOfSeats: 40,
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
    numberOfSeats: '',
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
      numberOfSeats: parseInt(formData.numberOfSeats),
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
      numberOfSeats: '',
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
      numberOfSeats: vehicle.numberOfSeats.toString(),
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
      numberOfSeats: parseInt(formData.numberOfSeats),
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
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md border border-gray-200">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    {/* Vehicle Type Filter */}
    <div className="w-full md:w-auto">
      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
      <select 
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Types</option>
        <option value="Van">Van</option>
        <option value="Car">Car</option>
        <option value="Bus">Bus</option>
        <option value="SUV">SUV</option>
        <option value="Motorcycle">Motorcycle</option>
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
                    <span className="font-medium text-blue-600">{formatPrice(vehicle.pricePerKmWithAC)} per km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Without AC:</span>
                    <span className="font-medium text-gray-600">{formatPrice(vehicle.pricePerKmWithoutAC)} per km</span>
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
                    {/* numberOfSeats */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passenger Capacity*</label>
                      <input
                        type="number"
                        name="numberOfSeats"
                        value={formData.numberOfSeats}
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
                    {/* numberOfSeats */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passenger Capacity*</label>
                      <input
                        type="number"
                        name="numberOfSeats"
                        value={formData.numberOfSeats}
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