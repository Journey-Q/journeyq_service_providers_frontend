import React from 'react';

const EditTour = ({ showModal, setShowModal, formData, setFormData, imagePreview, handleImageUpload, handleSubmit, resetForm }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateFinalPrice = (originalPrice, discount) => {
    const price = parseFloat(originalPrice) || 0;
    const discountValue = parseFloat(discount) || 0;
    return Math.round(price - (price * discountValue / 100));
  };

  const getCurrentFinalPrice = () => {
    return calculateFinalPrice(formData.originalPrice, formData.discount);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Tour</h2>
            <button 
              onClick={() => {
                setShowModal(false);
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
                Update Tour
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
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
  );
};

export default EditTour;