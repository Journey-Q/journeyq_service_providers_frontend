import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/SidebarTourGuide';

const DisplayTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tour, setTour] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    // Get tour data from location state or fetch from API
    if (location.state?.tour) {
      setTour(location.state.tour);
      setEditData(location.state.tour);
      setImagePreview(location.state.tour.image);
    } else {
      // In a real app, you'd fetch from API using the ID
      // For now, redirect back to tours
      navigate('/tours');
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (e, fieldName) => {
    const { value } = e.target;
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setEditData(prev => ({
      ...prev,
      [fieldName]: arrayValue
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...editData.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setEditData(prev => ({
      ...prev,
      itinerary: newItinerary
    }));
  };

  const addItineraryItem = () => {
    setEditData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { time: '', activity: '' }]
    }));
  };

  const removeItineraryItem = (index) => {
    const newItinerary = editData.itinerary.filter((_, i) => i !== index);
    setEditData(prev => ({
      ...prev,
      itinerary: newItinerary
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setEditData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateFinalPrice = (originalPrice, discount) => {
    const price = parseFloat(originalPrice) || 0;
    const discountValue = parseFloat(discount) || 0;
    return Math.round(price - (price * discountValue / 100));
  };

  const handleSave = () => {
    // Calculate final price
    const finalPrice = calculateFinalPrice(editData.originalPrice, editData.discount);
    const updatedTour = {
      ...editData,
      finalPrice,
      pricePerPerson: finalPrice
    };
    
    setTour(updatedTour);
    setEditMode(false);
    
    // In a real app, you'd save to API here
    console.log('Saving tour:', updatedTour);
  };

  const handleCancel = () => {
    setEditData(tour);
    setImagePreview(tour.image);
    setEditMode(false);
  };

  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString('en-IN')}`;
  };

  if (!tour) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/tours')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tours
          </button>
          
          <div className="flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-[#2953A6] hover:bg-[#1F74BF] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Tour
              </button>
            )}
          </div>
        </div>

        {/* Tour Details */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-96">
            {editMode ? (
              <div className="h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-4"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-80 max-w-full object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            ) : (
              <img
                src={tour.image}
                alt={tour.name}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Overlay with basic info */}
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="font-medium">{tour.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{tour.minPeople}-{tour.maxPeople} people</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{tour.duration}</span>
                  </div>
                </div>
                
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className="text-4xl font-bold bg-transparent border-b-2 border-white text-white placeholder-white/70 w-full"
                    placeholder="Tour name"
                  />
                ) : (
                  <h1 className="text-4xl font-bold mb-2">{tour.name}</h1>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About This Tour */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Tour</h2>
                  {editMode ? (
                    <textarea
                      name="aboutTour"
                      value={editData.aboutTour}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      placeholder="Describe the tour..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{tour.aboutTour}</p>
                  )}
                </section>

                {/* Places Visited */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Places You'll Visit</h2>
                  {editMode ? (
                    <textarea
                      value={editData.places?.join(', ')}
                      onChange={(e) => handleArrayInputChange(e, 'places')}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      placeholder="Enter places separated by commas"
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tour.places?.map((place, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <svg className="w-5 h-5 text-[#2953A6] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-700">{place}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Tour Highlights */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour Highlights</h2>
                  {editMode ? (
                    <textarea
                      value={editData.highlights?.join(', ')}
                      onChange={(e) => handleArrayInputChange(e, 'highlights')}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      placeholder="Enter highlights separated by commas"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {tour.highlights?.map((highlight, index) => (
                        <span key={index} className="bg-[#2953A6] text-white px-3 py-1 rounded-full text-sm">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </section>

                {/* What's Included */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">What's Included</h2>
                  {editMode ? (
                    <textarea
                      value={editData.included?.join(', ')}
                      onChange={(e) => handleArrayInputChange(e, 'included')}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      placeholder="Enter included items separated by commas"
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tour.included?.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Tour Itinerary */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour Itinerary</h2>
                  {editMode ? (
                    <div className="space-y-4">
                      {editData.itinerary?.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center p-4 border border-gray-200 rounded-lg">
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => handleItineraryChange(index, 'time', e.target.value)}
                            placeholder="Time"
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                          />
                          <input
                            type="text"
                            value={item.activity}
                            onChange={(e) => handleItineraryChange(index, 'activity', e.target.value)}
                            placeholder="Activity"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                          />
                          <button
                            onClick={() => removeItineraryItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addItineraryItem}
                        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#2953A6] hover:text-[#2953A6] transition-colors"
                      >
                        + Add Itinerary Item
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tour.itinerary?.map((item, index) => (
                        <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                          <div className="w-20 text-sm font-medium text-[#2953A6] mr-4 flex-shrink-0">
                            {item.time}
                          </div>
                          <div className="text-gray-700">{item.activity}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Important Notes */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Important Notes</h2>
                  {editMode ? (
                    <textarea
                      value={editData.importantNotes?.join(', ')}
                      onChange={(e) => handleArrayInputChange(e, 'importantNotes')}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      placeholder="Enter important notes separated by commas"
                    />
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="space-y-2">
                        {tour.importantNotes?.map((note, index) => (
                          <div key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-gray-700">{note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Pricing Card */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Tour Pricing</h3>
                    
                    {editMode ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (LKR)</label>
                          <input
                            type="number"
                            name="originalPrice"
                            value={editData.originalPrice}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                          <input
                            type="number"
                            name="discount"
                            value={editData.discount}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                          <input
                            type="number"
                            name="rating"
                            value={editData.rating}
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
                              value={editData.minPeople}
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
                              value={editData.maxPeople}
                              onChange={handleInputChange}
                              min="1"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                          <select
                            name="duration"
                            value={editData.duration}
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <select
                            name="status"
                            value={editData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                          >
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {tour.discount > 0 ? (
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-1">
                              {formatPrice(tour.finalPrice)}
                            </div>
                            <div className="text-lg text-gray-500 line-through">
                              {formatPrice(tour.originalPrice)}
                            </div>
                            <div className="text-sm text-green-600 font-medium">
                              Save {formatPrice(tour.originalPrice - tour.finalPrice)} ({tour.discount}% off)
                            </div>
                            <div className="text-sm text-gray-500 mt-2">per person</div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-800 mb-1">
                              {formatPrice(tour.finalPrice)}
                            </div>
                            <div className="text-sm text-gray-500">per person</div>
                          </div>
                        )}
                        
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Group Size:</span>
                            <span className="text-sm font-medium">{tour.minPeople}-{tour.maxPeople} people</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Duration:</span>
                            <span className="text-sm font-medium">{tour.duration}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Rating:</span>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              <span className="text-sm font-medium">{tour.rating}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Status:</span>
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                              tour.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {tour.status === 'available' ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  {!editMode && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full bg-[#2953A6] hover:bg-[#1F74BF] text-white py-2 px-4 rounded-lg font-medium transition-colors">
                          View Bookings
                        </button>
                        <button className="w-full bg-sky-300 hover:bg-sky-400 text-black py-2 px-4 rounded-lg font-medium transition-colors">
                          Add Past Tour Photos
                        </button>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                          Duplicate Tour
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DisplayTour;