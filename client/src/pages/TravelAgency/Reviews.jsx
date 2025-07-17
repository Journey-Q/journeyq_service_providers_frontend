import React, { useState } from 'react';
import Sidebar from '../../components/SidebarTravelAgency';

const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      tourId: 'TR001',
      tourName: 'Cultural Triangle Tour',
      guestName: 'John Doe',
      date: '2023-05-15',
      review: 'The guide was incredibly knowledgeable, and the sites were breathtaking.',
      rating: 5
    },
    {
      id: 2,
      tourId: 'TR002',
      tourName: 'Southern Coastal Adventure',
      guestName: 'Jane Smith',
      date: '2023-05-10',
      review: 'Loved the beaches! Could have used more time at Galle though.',
      rating: 4
    },
    {
      id: 3,
      tourId: 'TR003',
      tourName: 'Hill Country Explorer',
      guestName: 'Robert Johnson',
      date: '2023-05-05',
      review: 'Nice landscapes, but the bus was a bit uncomfortable for the long ride.',
      rating: 3
    },
  ]);

  const [selectedReview, setSelectedReview] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    } else {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    }
  });

  const openModal = (review) => setSelectedReview(review);
  const closeModal = () => setSelectedReview(null);
  const toggleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h1 className="text-2xl font-semibold mb-4">Travel Agency Ratings and Feedback</h1>

        {/* Average rating display */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center">
            <div className="text-4xl font-bold mr-4">{averageRating.toFixed(1)}</div>
            <div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-6 h-6 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-gray-600 mt-1">Based on {reviews.length} tour reviews</div>
            </div>
          </div>
        </div>

        {/* Sorting */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex space-x-4">
            <button onClick={() => toggleSort('date')} className={`px-4 py-2 rounded ${sortBy === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              Sort by Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button onClick={() => toggleSort('rating')} className={`px-4 py-2 rounded ${sortBy === 'rating' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              Sort by Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {/* Table of Reviews */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tour</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Review</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{review.tourName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{review.guestName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{review.date}</td>
                  <td className="px-6 py-4">{review.review.length > 20 ? `${review.review.substring(0, 20)}...` : review.review}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => openModal(review)} className="text-blue-600 hover:text-blue-900">See Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Review Details</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tour Name</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedReview.tourName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Guest</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedReview.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedReview.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rating</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < selectedReview.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Review</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedReview.review}</p>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex justify-end rounded-b-lg">
                <button onClick={closeModal} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
