import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SidebarHotel';
import ReviewService from '../../api_service/ReviewService';
import { FiStar, FiCalendar, FiUser, FiInfo, FiChevronDown, FiChevronUp, FiAlertCircle } from 'react-icons/fi';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get service provider ID
  const serviceProvider = localStorage.getItem('serviceProvider');
  const serviceProviderId = serviceProvider ? JSON.parse(serviceProvider).id : null;

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      if (!serviceProviderId) {
        setError('Service provider ID not found. Please login again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await ReviewService.getReviewsByServiceProviderId(serviceProviderId);
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to fetch reviews');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [serviceProviderId]);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / reviews.length 
    : 0;

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else {
      return sortOrder === 'asc' 
        ? (a.rating || 0) - (b.rating || 0)
        : (b.rating || 0) - (a.rating || 0);
    }
  });

  const openModal = (review) => {
    setSelectedReview(review);
  };

  const closeModal = () => {
    setSelectedReview(null);
  };

  const toggleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Guest Reviews & Ratings</h1>
          <p className="text-gray-600 mt-2">
            View and manage guest feedback for your hotel
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <FiAlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : (
          <>
            {/* Rating Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center">
                <div className="text-4xl font-bold text-gray-800 mr-4">{averageRating.toFixed(1)}</div>
                <div>
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-6 h-6 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">Based on {reviews.length} reviews</div>
                </div>
              </div>
            </div>

            {/* Sorting Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex space-x-3">
                <button 
                  onClick={() => toggleSort('date')}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${sortBy === 'date' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <FiCalendar className="mr-2" />
                  Date
                  {sortBy === 'date' && (
                    sortOrder === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                  )}
                </button>
                <button 
                  onClick={() => toggleSort('rating')}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${sortBy === 'rating' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <FiStar className="mr-2" />
                  Rating
                  {sortBy === 'rating' && (
                    sortOrder === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium">Booking ID</th>
                      <th className="px-6 py-4 text-left font-medium">Guest</th>
                      <th className="px-6 py-4 text-left font-medium">Date</th>
                      <th className="px-6 py-4 text-left font-medium">Review</th>
                      <th className="px-6 py-4 text-left font-medium">Rating</th>
                      <th className="px-6 py-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedReviews.length > 0 ? (
                      sortedReviews.map((review) => (
                        <tr key={review.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-mono text-sm text-blue-600">{review.bookingId}</td>
                          <td className="px-6 py-4 font-medium">{review.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{review.date}</td>
                          <td className="px-6 py-4">
                            <p className="text-gray-600 line-clamp-2">{review.review}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => openModal(review)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              <FiInfo className="inline-block mr-1" /> Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No reviews found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Review Details Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-800">Review Details</h3>
                  <button 
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 text-xl font-semibold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>

                {/* Booking ID */}
                <div className="mb-4 p-3 bg-blue-100 rounded-lg">
                  <div className="font-mono text-blue-600 font-semibold">{selectedReview.bookingId}</div>
                </div>

                {/* Guest Details */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-800 text-lg border-b border-gray-100 pb-2">Guest Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiUser className="text-blue-600 w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-800">{selectedReview.name}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FiCalendar className="text-blue-600 w-5 h-5 flex-shrink-0" />
                      <div className="text-gray-700">{selectedReview.date}</div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-800 text-lg border-b border-gray-100 pb-2">Review</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700">{selectedReview.review}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 text-lg border-b border-gray-100 pb-2">Rating</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-6 h-6 ${i < selectedReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-gray-700 font-medium">{selectedReview.rating}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Reviews;