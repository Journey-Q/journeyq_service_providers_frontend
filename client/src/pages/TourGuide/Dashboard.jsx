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

// Beautiful Line Chart Component
const BeautifulLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        <TrendingUp className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-lg font-medium">No booking data available</p>
        <p className="text-sm mt-1">Bookings will appear here once you have activity</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.bookings), 1);
  const chartHeight = 280;
  const chartWidth = 600;
  const padding = { top: 40, right: 40, bottom: 50, left: 60 };

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * (chartWidth - padding.left - padding.right);
    const y = chartHeight - padding.bottom - ((d.bookings / maxValue) * (chartHeight - padding.top - padding.bottom));
    return { x, y, value: d.bookings, label: d.date };
  });

  const pathData = points.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="w-full h-80 bg-white rounded-lg p-4">
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
          </linearGradient>
          
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Vertical grid lines */}
        {points.map((point, i) => (
          <line
            key={`v-${i}`}
            x1={point.x}
            y1={padding.top}
            x2={point.x}
            y2={chartHeight - padding.bottom}
            stroke="#f8fafc"
            strokeWidth="1"
          />
        ))}

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + (chartHeight - padding.top - padding.bottom) * ratio;
          return (
            <line
              key={`h-${i}`}
              x1={padding.left}
              y1={y}
              x2={chartWidth - padding.right}
              y2={y}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          );
        })}

        {/* Area fill */}
        <path
          d={`${pathData} L ${points[points.length-1].x} ${chartHeight - padding.bottom} L ${points[0].x} ${chartHeight - padding.bottom} Z`}
          fill="url(#areaGradient)"
        />

        {/* Main line */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points with glow effect */}
        {points.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="#ffffff"
              stroke="#0ea5e9"
              strokeWidth="3"
              className="drop-shadow-lg"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="#0ea5e9"
              fillOpacity="0.2"
            />
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((point, i) => (
          <text
            key={i}
            x={point.x}
            y={chartHeight - 20}
            textAnchor="middle"
            fontSize="12"
            fill="#64748b"
            fontWeight="500"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {point.label}
          </text>
        ))}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const value = Math.round(maxValue * (1 - ratio));
          const y = padding.top + (chartHeight - padding.top - padding.bottom) * ratio;
          return (
            <g key={i}>
              <text
                x={padding.left - 15}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#64748b"
                fontWeight="500"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {value}
              </text>
              <line
                x1={padding.left - 5}
                y1={y}
                x2={padding.left}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* Chart title */}
        <text
          x={chartWidth / 2}
          y={20}
          textAnchor="middle"
          fontSize="14"
          fill="#1e293b"
          fontWeight="600"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Daily Bookings
        </text>
      </svg>
    </div>
  );
};

// Beautiful Bar Chart Component
const BeautifulBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        <DollarSign className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-lg font-medium">No revenue data available</p>
        <p className="text-sm mt-1">Revenue will appear here once you have completed tours</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.revenue), 0.1);
  const chartHeight = 280;
  const chartWidth = 600;
  const padding = { top: 40, right: 40, bottom: 50, left: 60 };
  const barWidth = ((chartWidth - padding.left - padding.right) / data.length) * 0.7;

  return (
    <div className="w-full h-80 bg-white rounded-lg p-4">
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
          </linearGradient>
          
          <linearGradient id="barHover" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Vertical grid lines */}
        {data.map((_, i) => {
          const x = padding.left + (i / data.length) * (chartWidth - padding.left - padding.right) + 
                   ((chartWidth - padding.left - padding.right) / data.length) / 2;
          return (
            <line
              key={`v-${i}`}
              x1={x}
              y1={padding.top}
              x2={x}
              y2={chartHeight - padding.bottom}
              stroke="#f8fafc"
              strokeWidth="1"
            />
          );
        })}

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + (chartHeight - padding.top - padding.bottom) * ratio;
          return (
            <line
              key={`h-${i}`}
              x1={padding.left}
              y1={y}
              x2={chartWidth - padding.right}
              y2={y}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = padding.left + (i / data.length) * (chartWidth - padding.left - padding.right) + 
                   ((chartWidth - padding.left - padding.right) / data.length - barWidth) / 2;
          const barHeight = (d.revenue / maxValue) * (chartHeight - padding.top - padding.bottom);
          const y = chartHeight - padding.bottom - barHeight;
          
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="url(#barGradient)"
                rx="6"
                className="transition-all duration-300 hover:fill-[url(#barHover)] hover:filter hover:brightness-110"
              />
              
              {/* Value label on top of bar */}
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                fontSize="11"
                fill="#059669"
                fontWeight="600"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                Rs.{d.revenue.toFixed(1)}K
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          const x = padding.left + (i / data.length) * (chartWidth - padding.left - padding.right) + 
                   ((chartWidth - padding.left - padding.right) / data.length) / 2;
          return (
            <text
              key={i}
              x={x}
              y={chartHeight - 20}
              textAnchor="middle"
              fontSize="12"
              fill="#64748b"
              fontWeight="500"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {d.date}
            </text>
          );
        })}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const value = (maxValue * (1 - ratio)).toFixed(1);
          const y = padding.top + (chartHeight - padding.top - padding.bottom) * ratio;
          return (
            <g key={i}>
              <text
                x={padding.left - 15}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#64748b"
                fontWeight="500"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                Rs.{value}K
              </text>
              <line
                x1={padding.left - 5}
                y1={y}
                x2={padding.left}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* Chart title */}
        <text
          x={chartWidth / 2}
          y={20}
          textAnchor="middle"
          fontSize="14"
          fill="#1e293b"
          fontWeight="600"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Daily Revenue (in thousands)
        </text>

        {/* Axis labels */}
        <text
          x={chartWidth / 2}
          y={chartHeight - 5}
          textAnchor="middle"
          fontSize="11"
          fill="#94a3b8"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Days
        </text>
        
        <text
          x={10}
          y={chartHeight / 2}
          textAnchor="middle"
          fontSize="11"
          fill="#94a3b8"
          fontFamily="system-ui, -apple-system, sans-serif"
          transform={`rotate(-90, 10, ${chartHeight / 2})`}
        >
          Revenue (₹ Thousands)
        </text>
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
          {/* Header */}
          <div className="mb-8">
            <p className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </p>
            <p className="text-gray-600">Here's what's happening with your tours today.</p>
          </div>

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

          {/* Stats Cards */}
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-sky-600" />
                  Bookings Trend
                </h2>
                <span className="text-sm text-gray-500 bg-sky-50 px-3 py-1 rounded-full">Last 7 days</span>
              </div>
              <BeautifulLineChart data={chartData} />
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                  Revenue
                </h2>
                <span className="text-sm text-gray-500 bg-emerald-50 px-3 py-1 rounded-full">Last 7 days</span>
              </div>
              <BeautifulBarChart data={chartData} />
            </div>
          </div>

          {/* Recent Bookings */}
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

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

              {/* <button className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors flex flex-col items-center">
                <DollarSign className="w-6 h-6 text-emerald-600 mb-2" />
                <span className="text-sm font-medium text-emerald-800">Earnings</span>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTourGuide;