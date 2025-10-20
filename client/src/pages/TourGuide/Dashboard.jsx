import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  Map,
  ChevronRight,
  TrendingUp,
  Package,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

import Sidebar from '../../components/SidebarTourGuide';
import TourBookingService from '../../api_service/TourBookingService';
import TourPackageService from '../../api_service/TourPackageService';
import TourPackageReviewService from '../../api_service/TourPackageReviewService';

// Simple Line Chart Component
const SimpleLineChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>;

  const maxValue = Math.max(...data.map(d => d.bookings), 1);
  const width = 100;
  const height = 250;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = chartHeight - (d.bookings / maxValue) * chartHeight;
    return { x, y, value: d.bookings, label: d.date };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="relative" style={{ height: '250px' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => {
          const y = padding.top + (chartHeight / 4) * i;
          return (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#f0f0f0"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="2"
          transform={`translate(${padding.left}, ${padding.top})`}
        />

        {/* Points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x + padding.left}
            cy={p.y + padding.top}
            r="4"
            fill="#0ea5e9"
          />
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x + padding.left}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            fontSize="10"
            fill="#6b7280"
          >
            {p.label}
          </text>
        ))}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map(i => {
          const value = Math.round((maxValue / 4) * (4 - i));
          const y = padding.top + (chartHeight / 4) * i;
          return (
            <text
              key={i}
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#6b7280"
            >
              {value}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Simple Bar Chart Component
const SimpleBarChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>;

  const maxValue = Math.max(...data.map(d => d.revenue), 0.1);
  const width = 100;
  const height = 250;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const barWidth = chartWidth / data.length * 0.6;

  return (
    <div className="relative" style={{ height: '250px' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => {
          const y = padding.top + (chartHeight / 4) * i;
          return (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#f0f0f0"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = padding.left + (i / data.length) * chartWidth + (chartWidth / data.length - barWidth) / 2;
          const barHeight = (d.revenue / maxValue) * chartHeight;
          const y = padding.top + chartHeight - barHeight;
          
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#10b981"
                rx="2"
              />
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          const x = padding.left + (i / data.length) * chartWidth + (chartWidth / data.length) / 2;
          return (
            <text
              key={i}
              x={x}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {d.date}
            </text>
          );
        })}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map(i => {
          const value = ((maxValue / 4) * (4 - i)).toFixed(1);
          const y = padding.top + (chartHeight / 4) * i;
          return (
            <text
              key={i}
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#6b7280"
            >
              {value}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const DashboardTourGuide = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    weekly: { tours: 0, revenue: 0, bookings: 0 },
    monthly: { tours: 0, revenue: 0, bookings: 0 },
    yearly: { tours: 0, revenue: 0, bookings: 0 }
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [chartData, setChartData] = useState([]);

  const serviceProvider = localStorage.getItem('serviceProvider');
  const serviceProviderId = serviceProvider ? JSON.parse(serviceProvider).id : null;
  const tourGuideId = localStorage.getItem('serviceProviderId') || localStorage.getItem('userId') || serviceProviderId;
  const userName = serviceProvider ? JSON.parse(serviceProvider).name : 'Tour Guide';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [bookingsData, toursData, reviewsData] = await Promise.all([
        TourBookingService.getBookingsByTourGuide(tourGuideId),
        TourPackageService.getTourPackagesByServiceProviderId(serviceProviderId),
        TourPackageReviewService.getReviewsByServiceProviderId(serviceProviderId)
      ]);

      setBookings(bookingsData || []);
      setTours(toursData || []);
      setReviews(reviewsData || []);

      calculateStats(bookingsData || [], toursData || []);
      
      const recent = (bookingsData || [])
        .filter(b => b.status !== 'CANCELLED' && b.status !== 'REJECTED')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentBookings(recent);

      generateChartData(bookingsData || []);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookingsData, toursData) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const completedBookings = bookingsData.filter(b => b.status === 'COMPLETED');

    const calculatePeriodStats = (startDate) => {
      const periodBookings = completedBookings.filter(b => 
        new Date(b.completedAt || b.createdAt) >= startDate
      );
      
      const revenue = periodBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const bookingCount = bookingsData.filter(b => 
        new Date(b.createdAt) >= startDate && 
        (b.status === 'APPROVED' || b.status === 'COMPLETED')
      ).length;

      return {
        tours: toursData.length,
        revenue: revenue,
        bookings: bookingCount
      };
    };

    setStats({
      weekly: calculatePeriodStats(weekAgo),
      monthly: calculatePeriodStats(monthAgo),
      yearly: calculatePeriodStats(yearAgo)
    });
  };

  const generateChartData = (bookingsData) => {
    const now = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayBookings = bookingsData.filter(b => {
        const bookingDate = new Date(b.createdAt).toISOString().split('T')[0];
        return bookingDate === dateStr && (b.status === 'APPROVED' || b.status === 'COMPLETED');
      });

      const dayRevenue = bookingsData.filter(b => {
        const completedDate = b.completedAt ? new Date(b.completedAt).toISOString().split('T')[0] : null;
        return completedDate === dateStr && b.status === 'COMPLETED';
      }).reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        bookings: dayBookings.length,
        revenue: dayRevenue / 1000
      });
    }

    setChartData(data);
  };

  const getTourName = (tourId) => {
    const tour = tours.find(t => t.id === tourId);
    return tour ? tour.name : `Tour #${tourId}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_APPROVAL': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'APPROVED': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING_APPROVAL': return <Clock className="w-4 h-4" />;
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatAmount = (amount) => `Rs. ${Number(amount).toLocaleString('en-US')}`;

  const currentStats = stats[selectedPeriod];
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
          <div className="text-center text-rose-600">
            <p>Error loading dashboard: {error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-4 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600"
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

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
         

          <div className="mb-6 flex justify-end">
            <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
              {['weekly', 'monthly', 'yearly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                    selectedPeriod === period
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">{currentStats.bookings}</p>
                  <p className="text-xs mt-1 text-sky-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Active this period
                  </p>
                </div>
                <div className="p-3 rounded-full bg-sky-50">
                  <Calendar className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">
                    Rs.{(currentStats.revenue / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs mt-1 text-emerald-600 flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    From completed tours
                  </p>
                </div>
                <div className="p-3 rounded-full bg-emerald-50">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tour Packages</p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">{tours.length}</p>
                  <p className="text-xs mt-1 text-indigo-600 flex items-center">
                    <Package className="w-3 h-3 mr-1" />
                    Active packages
                  </p>
                </div>
                <div className="p-3 rounded-full bg-indigo-50">
                  <Map className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">{averageRating}</p>
                  <p className="text-xs mt-1 text-amber-600 flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    From {reviews.length} reviews
                  </p>
                </div>
                <div className="p-3 rounded-full bg-amber-50">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Bookings Trend (Last 7 Days)</h2>
              <SimpleLineChart data={chartData} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue (Last 7 Days, in thousands)</h2>
              <SimpleBarChart data={chartData} />
            </div>
          </div>

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <header className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-sky-600" />
                Recent Bookings
              </h2>
              <Link to="/tour-guide/booking-history" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                View All →
              </Link>
            </header>

            <div className="divide-y divide-gray-100">
              {recentBookings.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No recent bookings
                </div>
              ) : (
                recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{getTourName(booking.tourId)}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.tourDate)} • {booking.customerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-700">{formatAmount(booking.totalAmount)}</p>
                        <p className="text-xs text-gray-500">{booking.numberOfPeople} people</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/tour-guide/tours">
                <button className="w-full p-4 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 transition-colors flex flex-col items-center">
                  <Map className="w-6 h-6 text-sky-600 mb-2" />
                  <span className="text-sm font-medium text-sky-800">Manage Tours</span>
                </button>
              </Link>

              <Link to="/tour-guide/booking-history">
                <button className="w-full p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-colors flex flex-col items-center">
                  <Users className="w-6 h-6 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-indigo-800">View Bookings</span>
                </button>
              </Link>

              <Link to="/tour-guide/promotions">
                <button className="w-full p-4 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors flex flex-col items-center">
                  <Star className="w-6 h-6 text-amber-600 mb-2" />
                  <span className="text-sm font-medium text-amber-800">Promotions</span>
                </button>
              </Link>

              <button className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors flex flex-col items-center">
                <DollarSign className="w-6 h-6 text-emerald-600 mb-2" />
                <span className="text-sm font-medium text-emerald-800">Earnings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTourGuide;