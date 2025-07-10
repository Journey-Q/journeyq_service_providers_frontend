import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

const TourGuideOverview = () => {
  const availableGuides = [
    {
      id: 1,
      name: 'Nimal Perera',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      languages: ['English', 'Sinhala'],
      experience: 5,
      rating: 4.8,
      specialization: 'Cultural & Nature Tours',
      status: 'available'
    },
    {
      id: 2,
      name: 'Sajith Kumara',
      image: 'https://randomuser.me/api/portraits/men/65.jpg',
      languages: ['English', 'Tamil'],
      experience: 3,
      rating: 4.5,
      specialization: 'Adventure Tours',
      status: 'available'
    },
    {
      id: 3,
      name: 'Ruwan Silva',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      languages: ['English', 'Sinhala', 'German'],
      experience: 7,
      rating: 4.9,
      specialization: 'City Walks & Heritage Sites',
      status: 'available'
    }
  ];

  return (
    <section className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
      <header className="p-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Available Tour Guides</h2>
          <Link
            to="/travel/tour-guides"
            className="flex items-center text-[#2953A6] hover:text-[#1F74BF] font-medium text-sm transition-colors"
          >
            <Eye className="w-4 h-4 mr-1" />
            View All
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {availableGuides.map((guide) => (
          <div
            key={guide.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img
              src={guide.image}
              alt={guide.name}
              className="w-12 h-12 object-cover rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-gray-800 text-sm truncate">{guide.name}</h5>
              <div className="text-xs text-gray-600">
                {guide.specialization} • {guide.experience} yrs experience
              </div>
              <div className="text-xs text-gray-500">
                Languages: {guide.languages.join(', ')}
              </div>
              <div className="text-xs text-yellow-600 font-medium mt-0.5">
                ⭐ {guide.rating}
              </div>
            </div>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
              {guide.status}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 flex-shrink-0">
        <Link
          to="/travel/tour-guides"
          className="block w-full px-4 py-2 bg-[#1F74BF] text-white text-center rounded-lg transition-colors font-medium text-sm"
        >
          Manage Guides
        </Link>
      </div>
    </section>
  );
};

export { TourGuideOverview };