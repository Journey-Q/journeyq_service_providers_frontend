import React from "react";

const SingleTour = ({ tour, onClose, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString("en-IN")}`;
  };

  const formatDiscount = (discount) => {
    if (discount === 0) return null;
    return `${discount}% OFF`;
  };

  const statusColors = {
    available: "bg-green-100 text-green-800",
    unavailable: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    available: "Available",
    unavailable: "Unavailable",
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{tour.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tour Image */}
          <div className="h-64 overflow-hidden rounded-lg mb-6 relative">
            <img
              src={tour.image}
              alt={tour.name}
              className="w-full h-full object-cover"
            />
            {tour.discount > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                {formatDiscount(tour.discount)}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm ${statusColors[tour.status]}`}>
                  {statusLabels[tour.status]}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rating:</span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="font-medium">{tour.rating}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Group Size:</span>
                <span>{tour.minPeople}-{tour.maxPeople} people</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration:</span>
                <span>{tour.duration}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Original Price:</span>
                <span className="text-lg text-gray-800 line-through">
                  {formatPrice(tour.originalPrice)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Discount:</span>
                <span className="text-green-600 font-semibold">
                  {tour.discount > 0 ? `${tour.discount}% OFF` : 'No discount'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Final Price:</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(tour.finalPrice)}
                </span>
              </div>

              {tour.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">You Save:</span>
                  <span className="text-green-600 font-semibold">
                    Rs.{(tour.originalPrice - tour.finalPrice).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tour Details */}
          <div className="space-y-6">
            {/* Places */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Places to Visit</h3>
              <div className="flex flex-wrap gap-2">
                {tour.places.map((place, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {place}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tour Highlights</h3>
              <div className="flex flex-wrap gap-2">
                {tour.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            {/* About Tour */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">About This Tour</h3>
              <p className="text-gray-600 leading-relaxed">{tour.aboutTour}</p>
            </div>

            {/* Included */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What's Included</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tour.included.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Itinerary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Itinerary</h3>
              <div className="space-y-3">
                {tour.itinerary.map((item, index) => (
                  <div key={index} className="flex items-start border-l-4 border-blue-500 pl-4 py-1">
                    <span className="font-medium text-blue-600 min-w-16">{item.time}</span>
                    <span className="text-gray-600 ml-4">{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Notes</h3>
              <ul className="space-y-2">
                {tour.importantNotes.map((note, index) => (
                  <li key={index} className="flex items-start text-gray-600">
                    <svg className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => onEdit(tour)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Tour
            </button>
            <button
              onClick={() => onDelete(tour)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTour;