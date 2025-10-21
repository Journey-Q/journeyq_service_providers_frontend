import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Star,
  Phone,
  Mail,
  Eye,
  Bed,
  Home,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import SidebarHotel from "../../components/SidebarHotel";
import { Link } from "react-router-dom";

// Import your API services
import HotelBookingService from "../../api_service/HotelBookings";
import RoomService from "../../api_service/RoomService";
import ReviewService from "../../api_service/ReviewService";
import PromotionService from "../../api_service/PromotionService";
import PaymentHistoryService from "../../api_service/PaymentHistoryService";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [stats, setStats] = useState({
    bookings: 0,
    revenue: 0,
    occupancy: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get service provider ID
  const serviceProvider = localStorage.getItem("serviceProvider");
  const serviceProviderId = serviceProvider
    ? JSON.parse(serviceProvider).id
    : null;

  useEffect(() => {
    if (serviceProviderId) {
      fetchDashboardData();
    }
  }, [serviceProviderId, selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        bookingsData,
        roomsData,
        reviewsData,
        promotionsData,
        paymentsData,
      ] = await Promise.all([
        HotelBookingService.getBookingsByServiceProvider(serviceProviderId),
        RoomService.getRoomsByServiceProviderId(serviceProviderId),
        ReviewService.getReviewsByServiceProviderId(serviceProviderId),
        PromotionService.getPromotionsByServiceProviderId(serviceProviderId),
        PaymentHistoryService.getPaymentHistoryByServiceProviderId(
          serviceProviderId
        ),
      ]);

      // Process and set data
      processDashboardData(
        bookingsData,
        roomsData,
        reviewsData,
        promotionsData,
        paymentsData
      );
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const processDashboardData = (
    bookings,
    rooms,
    reviews,
    promotions,
    payments
  ) => {
    // Process bookings
    const validBookings = Array.isArray(bookings) ? bookings : [];
    const recentBookingsList = validBookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
      .map((booking) => ({
        id: booking.id,
        guest: booking.customerName || "Unknown Guest",
        room: `Room ${booking.roomId || "N/A"}`,
        checkIn: formatDate(booking.checkInDate),
        checkOut: formatDate(booking.checkOutDate),
        amount: `LKR ${booking.totalAmount || 0}`,
        status: booking.status?.toLowerCase() || "pending",
      }));
    setRecentBookings(recentBookingsList);

    // Process rooms
    const validRooms = Array.isArray(rooms) ? rooms : [];
    setRooms(validRooms.slice(0, 4)); // Show only 4 rooms

    // Process reviews
    const validReviews = Array.isArray(reviews) ? reviews : [];
    setReviews(validReviews.slice(0, 3)); // Show only 3 reviews

    // Process promotions
    const validPromotions = Array.isArray(promotions) ? promotions : [];
    setPromotions(
      validPromotions
        .filter(
          (p) =>
            p.status?.toLowerCase() === "advertised" ||
            p.status?.toLowerCase() === "approved"
        )
        .slice(0, 2)
    );

    // Calculate stats
    calculateStats(validBookings, validRooms, validReviews, payments);
  };

  const calculateStats = (bookings, rooms, reviews, payments) => {
    // Bookings count for selected period
    const periodBookings = filterByPeriod(bookings, selectedPeriod);

    // Revenue calculation from payments
    const completedPayments = Array.isArray(payments)
      ? payments.filter((p) => p.status === "completed")
      : [];
    const periodRevenue = filterByPeriod(
      completedPayments,
      selectedPeriod
    ).reduce((sum, payment) => sum + (payment.amount || 0), 0);

    // Occupancy rate calculation
    const totalRooms = rooms.length;

    // Get current date for occupancy calculation
    const currentDate = new Date();

    // Count occupied rooms (rooms with active bookings for current date)
    const occupiedRooms = bookings.filter((booking) => {
      // Check if booking is active and current date falls between check-in and check-out
      const checkInDate = new Date(booking.checkInDate);
      const checkOutDate = new Date(booking.checkOutDate);

      return (
        ["CONFIRMED", "CHECKED_IN"].includes(booking.status) &&
        currentDate >= checkInDate &&
        currentDate <= checkOutDate
      );
    }).length;

    const occupancyRate =
      totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    // Reviews stats
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          reviews.length
        : 0;

    setStats({
      bookings: periodBookings.length,
      revenue: periodRevenue,
      occupancy: occupancyRate,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length,
    });
  };

  const filterByPeriod = (data, period) => {
    const now = new Date();
    let startDate;

    switch (period) {
      case "weekly":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "monthly":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "yearly":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return data;
    }

    return data.filter((item) => {
      const itemDate = new Date(
        item.createdAt || item.date || item.checkInDate
      );
      return itemDate >= startDate;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    const rupees = (amount / 100).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `Rs. ${rupees}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "checked_in":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoomStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "OCCUPIED":
        return "bg-red-100 text-red-800";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SidebarHotel />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B9ED9]"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SidebarHotel />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <div className="text-red-600 mb-4">Error loading dashboard</div>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarHotel />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          {/* <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div> */}

          {/* Period selector */}
          <div className="mb-8">
            <div className="flex space-x-4">
              {["weekly", "monthly", "yearly"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-6 py-2 rounded-lg font-medium capitalize transition-colors ${
                    selectedPeriod === period
                      ? "bg-[#0B9ED9] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Stats cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Bookings */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Bookings
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">
                    {stats.bookings}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {selectedPeriod}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#2953A6]/10">
                  <Calendar className="w-8 h-8 text-[#2953A6]" />
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">
                    {formatCurrency(stats.revenue)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {selectedPeriod}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Occupancy */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Occupancy Rate
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">
                    {stats.occupancy}%
                  </p>
                  <p className="text-xs text-gray-500">Current rate</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Guest Rating
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">
                    {stats.averageRating}/5
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.totalReviews} reviews
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-100">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>
          </section>

          {/* Three-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Bookings */}
            <section className="bg-white rounded-xl shadow-md border border-gray-100 lg:col-span-2">
              <header className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Recent Bookings
                </h2>
              </header>

              <div className="p-6">
                <div className="space-y-4">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-800">
                              {booking.guest}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {booking.room} • {booking.checkIn} to{" "}
                            {booking.checkOut}
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#2953A6]">
                            {booking.amount}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No recent bookings found
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    to="/hotel/booking-history"
                    className="block w-full px-4 py-3 bg-[#1F74BF] text-white rounded-lg hover:bg-[#2953A6] transition-colors font-medium text-center"
                  >
                    View All Bookings
                  </Link>
                </div>
              </div>
            </section>

            {/* Right Sidebar - Rooms, Reviews, Promotions */}
            <div className="space-y-6">
              {/* Room Overview */}
              <section className="bg-white rounded-xl shadow-md border border-gray-100">
                <header className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <Bed className="w-5 h-5 mr-2" />
                    Room Status
                  </h2>
                </header>

                <div className="p-6">
                  <div className="space-y-4">
                    {rooms.length > 0 ? (
                      rooms.map((room) => (
                        <div
                          key={room.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Home className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {room.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Rs. {room.price}/night
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getRoomStatusColor(
                              room.status
                            )}`}
                          >
                            {room.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No rooms found
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      to="/hotel/room-service"
                      className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
                    >
                      Manage Rooms
                    </Link>
                  </div>
                </div>
              </section>

              {/* Recent Reviews */}
              <section className="bg-white rounded-xl shadow-md border border-gray-100">
                <header className="p-6 border-b border-gray-100">
                  <Link
                    to="/hotel/reviews"
                    className="text-xl font-bold text-gray-800 flex items-center hover:text-[#0088cc] transition-colors"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Recent Reviews
                  </Link>
                </header>

                <div className="p-6">
                  <div className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-800">
                              {review.customerName || "Anonymous"}
                            </h3>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (review.rating || 0)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {review.reviewText ||
                              review.review ||
                              "No review content"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No reviews yet
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Active Promotions */}
              <section className="bg-white rounded-xl shadow-md border border-gray-100">
                <header className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Active Promotions
                  </h2>
                </header>

                <div className="p-6">
                  <div className="space-y-4">
                    {promotions.length > 0 ? (
                      promotions.map((promotion) => (
                        <div
                          key={promotion.id}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-800">
                              {promotion.title}
                            </h3>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {promotion.discount}% OFF
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {promotion.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            Valid until {formatDate(promotion.validTo)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No active promotions
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      to="/hotel/promotions"
                      className="block w-full px-4 py-2 bg-[#0B9ED9] text-white rounded-lg hover:bg-[#0891C7] transition-colors font-medium text-center"
                    >
                      Create Promotion
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;