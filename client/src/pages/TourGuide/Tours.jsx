import React, { useState } from 'react';
import Sidebar from '../../components/SidebarTourGuide';

const Tours = () => {
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [photoModal, setPhotoModal] = useState(false);
  const [tourPhotos, setTourPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  
  const [tours, setTours] = useState([
    {
      id: 1,
      name: "Anuradhapura Cultural Visit",
      image: "https://images.unsplash.com/photo-1659244352464-75e539618056?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YW51cmFkaGFwdXJhfGVufDB8fDB8fHww",
      originalPrice: 15000,
      discount: 10,
      finalPrice: 13500,
      pricePerPerson: 13500,
      duration: "1 day",
      places: ["Anuradhapura Temples", "Ruwanwelisaya", "Isurumuniya"],
      highlights: ["Historical sites", "Cultural experience", "Local cuisine"],
      status: "available",
      rating: 4.5,
      maxPeople: 15,
      minPeople: 2,
      aboutTour: "Explore the ancient capital of Sri Lanka with its magnificent temples, stupas, and archaeological wonders. This cultural journey takes you through 2,500 years of history.",
      included: ["Transportation", "Professional guide", "Entrance fees", "Lunch"],
      itinerary: [
        { time: "8:00 AM", activity: "Pickup from hotel" },
        { time: "10:00 AM", activity: "Visit Ruwanwelisaya Stupa" },
        { time: "12:00 PM", activity: "Lunch at local restaurant" },
        { time: "2:00 PM", activity: "Explore Isurumuniya Temple" },
        { time: "4:00 PM", activity: "Return journey" }
      ],
      importantNotes: ["Bring comfortable walking shoes", "Dress modestly for temples", "Carry water bottle", "Weather can be hot - bring sun protection"]
    },
    {
      id: 2,
      name: "Sigiriya & Dambulla Adventure",
      image: "https://plus.unsplash.com/premium_photo-1730145749791-28fc538d7203?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2lnaXJpeWF8ZW58MHx8MHx8fDA%3D",
      originalPrice: 25000,
      discount: 8,
      finalPrice: 23000,
      pricePerPerson: 23000,
      duration: "1 day",
      places: ["Sigiriya Rock Fortress", "Dambulla Cave Temple"],
      highlights: ["UNESCO sites", "Scenic views", "Historical significance"],
      status: "available",
      rating: 4.8,
      maxPeople: 12,
      minPeople: 2,
      aboutTour: "Climb the iconic Sigiriya Rock Fortress and explore the magnificent Dambulla Cave Temple. Two UNESCO World Heritage sites in one incredible day.",
      included: ["Transportation", "Professional guide", "Entrance fees", "All meals", "Water"],
      itinerary: [
        { time: "7:00 AM", activity: "Pickup from hotel" },
        { time: "8:30 AM", activity: "Climb Sigiriya Rock" },
        { time: "12:00 PM", activity: "Lunch break" },
        { time: "2:00 PM", activity: "Visit Dambulla Cave Temple" },
        { time: "5:00 PM", activity: "Return journey" }
      ],
      importantNotes: ["Moderate fitness required for climbing", "Bring comfortable hiking shoes", "Early morning start recommended", "Carry ID for entrance"]
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    discount: '0',
    duration: '1 day',
    places: '',
    highlights: '',
    status: 'available',
    image: '',
    rating: '4.0',
    maxPeople: '10',
    minPeople: '2',
    aboutTour: '',
    included: '',
    itinerary: '',
    importantNotes: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const statusColors = {
    available: "bg-green-100 text-green-800",
    unavailable: "bg-red-100 text-red-800"
  };

  const statusLabels = {
    available: "Available",
    unavailable: "Unavailable"
  };

  const calculateFinalPrice = (originalPrice, discount) => {
    const price = parseFloat(originalPrice) || 0;
    const discountValue = parseFloat(discount) || 0;
    return Math.round(price - (price * discountValue / 100));
  };

  const getCurrentFinalPrice = () => {
    return calculateFinalPrice(formData.originalPrice, formData.discount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    const placesArray = formData.places.split(',').map(place => place.trim()).filter(place => place);
    const highlightsArray = formData.highlights.split(',').map(highlight => highlight.trim()).filter(highlight => highlight);
    const includedArray = formData.included.split(',').map(item => item.trim()).filter(item => item);
    const notesArray = formData.importantNotes.split(',').map(note => note.trim()).filter(note => note);
    
    const originalPrice = parseInt(formData.originalPrice);
    const discount = parseFloat(formData.discount);
    const finalPrice = calculateFinalPrice(originalPrice, discount);
    
    const newTour = {
      id: editMode ? currentTour.id : tours.length + 1,
      name: formData.name,
      originalPrice: originalPrice,
      discount: discount,
      finalPrice: finalPrice,
      pricePerPerson: finalPrice,
      duration: formData.duration,
      places: placesArray,
      highlights: highlightsArray,
      status: formData.status,
      rating: parseFloat(formData.rating),
      maxPeople: parseInt(formData.maxPeople),
      minPeople: parseInt(formData.minPeople),
      aboutTour: formData.aboutTour,
      included: includedArray,
      itinerary: [], // Will be handled in detail page
      importantNotes: notesArray,
      image: imagePreview || "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW51cmFkaGFwdXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    };

    if (editMode) {
      setTours(prev => prev.map(tour => tour.id === currentTour.id ? newTour : tour));
    } else {
      setTours(prev => [...prev, newTour]);
    }
    
    setShowModal(false);
    resetForm();
    setEditMode(false);
    setCurrentTour(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      originalPrice: '',
      discount: '0',
      duration: '1 day',
      places: '',
      highlights: '',
      status: 'available',
      image: '',
      rating: '4.0',
      maxPeople: '10',
      minPeople: '2',
      aboutTour: '',
      included: '',
      itinerary: '',
      importantNotes: ''
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleDeleteClick = (tour) => {
    setCurrentTour(tour);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    setTours(prev => prev.filter(tour => tour.id !== currentTour.id));
    setDeleteModal(false);
    setCurrentTour(null);
  };

  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString('en-IN')}`;
  };

  const formatDiscount = (discount) => {
    if (discount === 0) return null;
    return `${discount}% OFF`;
  };

  const handleEditTour = (tour) => {
    setCurrentTour(tour);
    setEditMode(true);
    setFormData({
      name: tour.name,
      originalPrice: tour.originalPrice,
      discount: tour.discount,
      duration: tour.duration,
      places: tour.places.join(', '),
      highlights: tour.highlights.join(', '),
      status: tour.status,
      image: tour.image,
      rating: tour.rating,
      maxPeople: tour.maxPeople,
      minPeople: tour.minPeople,
      aboutTour: tour.aboutTour,
      included: tour.included.join(', '),
      itinerary: '',
      importantNotes: tour.importantNotes.join(', ')
    });
    setImagePreview(tour.image);
    setShowModal(true);
  };

  const handleOpenPhotoModal = (tour) => {
    setCurrentTour(tour);
    setPhotoModal(true);
    setTourPhotos([]);
    setPhotoPreviews([]);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert('Maximum 4 photos allowed');
      return;
    }
    
    setTourPhotos(files);
    
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === files.length) {
          setPhotoPreviews([...previews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitPhotos = (e) => {
    e.preventDefault();
    console.log('Photos for tour:', currentTour.id, tourPhotos);
    setPhotoModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6 flex justify-end">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#0B9ED9] hover:bg-[#0891C7] text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-all duration-200 flex items-center gap-2 hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Tour
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-xl overflow-hidden border border-gray-300 shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={tour.image} 
                  alt={tour.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {tour.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    {formatDiscount(tour.discount)}
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{tour.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[tour.status]}`}>
                    {statusLabels[tour.status]}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-600">{tour.rating}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {tour.minPeople}-{tour.maxPeople} people
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <div className="flex flex-col">
                    {tour.discount > 0 ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 text-lg">{formatPrice(tour.finalPrice)}</span>
                          <span className="text-sm text-gray-500 line-through">{formatPrice(tour.originalPrice)}</span>
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          You save Rs.{(tour.originalPrice - tour.finalPrice).toLocaleString('en-IN')}
                        </div>
                      </>
                    ) : (
                      <span className="font-medium text-gray-800 text-lg">{formatPrice(tour.finalPrice)}</span>
                    )}
                    <span className="text-xs text-gray-500">per person</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {tour.duration} tour
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {tour.places.length} location{tour.places.length > 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tour Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {tour.highlights.slice(0, 3).map((highlight, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {highlight}
                      </span>
                    ))}
                    {tour.highlights.length > 3 && (
                      <span className="text-xs text-gray-500">+{tour.highlights.length - 3} more</span>
                    )}
                  </div>
                </div>

                {/* Expanded Tour Details */}
                <div className="mb-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">About This Tour</h4>
                    <p className="text-sm text-gray-600">{tour.aboutTour}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">What's Included</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {tour.included.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Important Notes</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {tour.importantNotes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button 
                    onClick={() => handleEditTour(tour)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(tour)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Tour Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editMode ? 'Edit Tour' : 'Add New Tour'}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      setEditMode(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tour Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                          placeholder="Enter tour name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                        <select
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                        >
                          <option value="1 day">1 day</option>
                          <option value="2 days">2 days</option>
                          <option value="3 days">3 days</option>
                          <option value="4 days">4 days</option>
                          <option value="5 days">5 days</option>
                          <option value="1 week">1 week</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <input
                          type="number"
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          min="1"
                          max="5"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Min People</label>
                          <input
                            type="number"
                            name="minPeople"
                            value={formData.minPeople}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max People</label>
                          <input
                            type="number"
                            name="maxPeople"
                            value={formData.maxPeople}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tour Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                        >
                          <option value="available">Available</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Discount</h3>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (LKR)</label>
                          <input
                            type="number"
                            name="originalPrice"
                            value={formData.originalPrice}
                            onChange={handleInputChange}
                            required
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                            placeholder="Enter original price"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Percentage (%)
                          </label>
                          <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                            placeholder='Enter percentage (0-100)'
                          />
                        </div>

                        {formData.originalPrice && (
                          <div className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Final Price per person:</span>
                              <div className="text-right">
                                {formData.discount > 0 ? (
                                  <>
                                    <div className="font-semibold text-lg text-green-600">
                                      Rs{getCurrentFinalPrice().toLocaleString('en-IN')}
                                    </div>
                                    <div className="text-sm text-gray-500 line-through">
                                      Rs{parseInt(formData.originalPrice).toLocaleString('en-IN')}
                                    </div>
                                    <div className="text-xs text-green-600">
                                      Save Rs{(parseInt(formData.originalPrice) - getCurrentFinalPrice()).toLocaleString('en-IN')}
                                    </div>
                                  </>
                                ) : (
                                  <div className="font-semibold text-lg">
                                    Rs{parseInt(formData.originalPrice).toLocaleString('en-IN')}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tour Image</label>
                        <div className="space-y-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
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
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Places Visited</label>
                      <textarea
                        name="places"
                        value={formData.places}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                        placeholder="Enter places visited, separated by commas (e.g., Sigiriya Rock, Dambulla Cave Temple)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tour Highlights</label>
                      <textarea
                        name="highlights"
                        value={formData.highlights}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                        placeholder="Enter highlights, separated by commas (e.g., Cultural experience, Scenic views, Local cuisine)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">About This Tour</label>
                      <textarea
                        name="aboutTour"
                        value={formData.aboutTour}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                        placeholder="Describe the tour in detail..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
                      <textarea
                        name="included"
                        value={formData.included}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                        placeholder="Enter what's included, separated by commas (e.g., Transportation, Guide, Meals, Accommodation)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Important Notes</label>
                      <textarea
                        name="importantNotes"
                        value={formData.importantNotes}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                        placeholder="Enter important notes, separated by commas (e.g., Bring comfortable shoes, Weather dependent, ID required)"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-[#2953A6] hover:bg-[#1F74BF] text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      {editMode ? 'Update Tour' : 'Add Tour'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditMode(false);
                        resetForm();
                      }}
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
                
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Delete Tour</h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete "<span className="font-semibold">{currentTour?.name}</span>"? This action cannot be undone.
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

export default Tours;