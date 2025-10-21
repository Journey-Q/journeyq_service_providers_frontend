import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Star,
  Truck,
  Car,
  User,
  MessageCircle,
} from "lucide-react";
import SidebarTravelAgency from "../../components/SidebarTravelAgency";
import { Link } from "react-router-dom";

// Import your API services
import TravelBookingService from "../../api_service/TravelBookingService";
import TravelVehicleService from "../../api_service/TravelVehicleService";
import TravelDriverService from "../../api_service/TravelDriverService";
import ReviewService from "../../api_service/ReviewService";
import PromotionService from "../../api_service/PromotionService";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [stats, setStats] = useState({
    rentals: 0,
    revenue: 0,
    usageRate: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [recentRentals, setRecentRentals] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
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
        vehiclesData,
        driversData,
        reviewsData,
        promotionsData,
      ] = await Promise.all([
        TravelBookingService.getBookingsByTravelAgency(serviceProviderId),
        TravelVehicleService.getVehiclesByServiceProviderId(serviceProviderId),
        TravelDriverService.getDriversByServiceProviderId(serviceProviderId),
        ReviewService.getReviewsByServiceProviderId(serviceProviderId),
        PromotionService.getPromotionsByServiceProviderId(serviceProviderId),
      ]);

      // Process and set data
      processDashboardData(
        bookingsData,
        vehiclesData,
        driversData,
        reviewsData,
        promotionsData
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
    vehicles,
    drivers,
    reviews,
    promotions
  ) => {
    // Process bookings
    const validBookings = Array.isArray(bookings) ? bookings : [];
    const recentRentalsList = validBookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
      .map((booking) => ({
        id: booking.id,
        customer: booking.customerName || "Unknown Customer",
        vehicle: getVehicleType(booking),
        pickup: formatDate(booking.startDate),
        return: formatDate(booking.endDate),
        amount: formatAmount(
          booking.estimatedTotalAmount || booking.totalAmount
        ),
        status: mapBookingStatus(booking.status),
      }));
    setRecentRentals(recentRentalsList);

    // Process vehicles
    const validVehicles = Array.isArray(vehicles) ? vehicles : [];
    setVehicles(validVehicles.slice(0, 4));

    // Process drivers
    const validDrivers = Array.isArray(drivers) ? drivers : [];
    setDrivers(validDrivers.slice(0, 3));

    // Process reviews
    const validReviews = Array.isArray(reviews) ? reviews : [];
    setReviews(validReviews.slice(0, 3));

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
    calculateStats(validBookings, validVehicles, validReviews);
  };

  const calculateStats = (bookings, vehicles, reviews) => {
    // Rentals count for selected period
    const periodBookings = filterByPeriod(bookings, selectedPeriod);

    // Revenue calculation from completed bookings
    const completedBookings = bookings.filter((b) =>
      ["COMPLETED", "APPROVED"].includes(b.status)
    );
    const periodRevenue = filterByPeriod(
      completedBookings,
      selectedPeriod
    ).reduce(
      (sum, booking) =>
        sum + (booking.estimatedTotalAmount || booking.totalAmount || 0),
      0
    );

    // Fleet usage rate (simplified calculation)
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(
      (v) => v.status?.toLowerCase() === "available"
    ).length;
    const usageRate =
      totalVehicles > 0
        ? Math.round(
            ((totalVehicles - availableVehicles) / totalVehicles) * 100
          )
        : 0;

    // Reviews stats
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          reviews.length
        : 0;

    setStats({
      rentals: periodBookings.length,
      revenue: periodRevenue,
      usageRate: usageRate,
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
      const itemDate = new Date(item.createdAt || item.date || item.startDate);
      return itemDate >= startDate;
    });
  };

  const getVehicleType = (booking) => {
    if (booking.withAC !== undefined) {
      return booking.withAC ? "AC Vehicle" : "Non-AC Vehicle";
    }
    return "Vehicle";
  };

  const mapBookingStatus = (status) => {
    const statusMap = {
      PENDING_APPROVAL: "booked",
      APPROVED: "in-use",
      COMPLETED: "returned",
      CANCELLED: "cancelled",
      REJECTED: "cancelled",
    };
    return statusMap[status] || "booked";
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

  const formatAmount = (amount) => {
    const rupees = (amount || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `Rs. ${rupees}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "booked":
        return "bg-yellow-100 text-yellow-800";
      case "in-use":
        return "bg-blue-100 text-blue-800";
      case "returned":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVehicleStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDriverStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800";
      case "on leave":
        return "bg-yellow-100 text-yellow-800";
      case "training":
        return "bg-blue-100 text-blue-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SidebarTravelAgency />
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
        <SidebarTravelAgency />
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
      <SidebarTravelAgency />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          {/* <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Travel Agency Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your business overview.</p>
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
            {/* Rentals */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Rentals
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">
                    {stats.rentals}
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
                    {formatAmount(stats.revenue)}
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

            {/* Fleet Usage */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Fleet Usage
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">
                    {stats.usageRate}%
                  </p>
                  <p className="text-xs text-gray-500">Current rate</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <Truck className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Customer Rating
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
            {/* Recent Rentals */}
            <section className="bg-white rounded-xl shadow-md border border-gray-100 lg:col-span-2">
              <header className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Recent Rentals
                </h2>
              </header>

              <div className="p-6">
                <div className="space-y-4">
                  {recentRentals.length > 0 ? (
                    recentRentals.map((rental) => (
                      <div
                        key={rental.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-800">
                              {rental.customer}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                rental.status
                              )}`}
                            >
                              {rental.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {rental.vehicle} • {rental.pickup} to{" "}
                            {rental.return}
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#2953A6]">
                            {rental.amount}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No recent rentals found
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    to="/travel-agency/booking-history"
                    className="block w-full px-4 py-3 bg-[#1F74BF] text-white rounded-lg hover:bg-[#2953A6] transition-colors font-medium text-center"
                  >
                    View All Rentals
                  </Link>
                </div>
              </div>
            </section>

            {/* Right Sidebar - Vehicles, Drivers, Reviews, Promotions */}
            <div className="space-y-6">
              {/* Vehicle Overview */}
              <section className="bg-white rounded-xl shadow-md border border-gray-100">
                <header className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <Car className="w-5 h-5 mr-2" />
                    Fleet Status
                  </h2>
                </header>

                <div className="p-6">
                  <div className="space-y-4">
                    {vehicles.length > 0 ? (
                      vehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Truck className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {vehicle.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {vehicle.brand} {vehicle.model}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getVehicleStatusColor(
                              vehicle.status
                            )}`}
                          >
                            {vehicle.status?.toLowerCase() || "unknown"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No vehicles found
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      to="/travel-agency/vehicles"
                      className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
                    >
                      Manage Fleet
                    </Link>
                  </div>
                </div>
              </section>

              {/* Drivers Overview */}
              <section className="bg-white rounded-xl shadow-md border border-gray-100">
                <header className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Drivers
                  </h2>
                </header>

                <div className="p-6">
                  <div className="space-y-4">
                    {drivers.length > 0 ? (
                      drivers.map((driver) => (
                        <div
                          key={driver.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={driver.profilePhoto}
                              alt={driver.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {driver.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {driver.experience} years exp
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getDriverStatusColor(
                              driver.status
                            )}`}
                          >
                            {driver.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No drivers found
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      to="/travel-agency/drivers"
                      className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
                    >
                      Manage Drivers
                    </Link>
                  </div>
                </div>
              </section>

              {/* Recent Reviews */}
              <section className="bg-white rounded-xl shadow-md border border-gray-100">
                <header className="p-6 border-b border-gray-100">
                  <Link to="/travel-agency/reviews" className="block">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center hover:text-[#1F74BF] transition-colors">
                      <Star className="w-5 h-5 mr-2" />
                      Recent Reviews
                    </h2>
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
                      to="/travel-agency/promotions"
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
