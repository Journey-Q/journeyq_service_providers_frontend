import React, { useState, useEffect } from "react";
import Sidebar from "../../components/SidebarTravelAgency";
import {
  FaUser,
  FaPhone,
  FaLanguage,
  FaStar,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import InsertDriver from "./InsertDriver";
import EditDriver from "./EditDriver";
import TravelDriverService from "../../api_service/TravelDriverService"; 

const Drivers = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  // Map backend status to frontend status
  const mapBackendStatus = (backendStatus) => {
    const statusMap = {
      AVAILABLE: "available",
      ON_LEAVE: "on leave",
      TRAINING: "training",
      UNAVAILABLE: "unavailable",
    };
    return statusMap[backendStatus] || "available";
  };

  // Map frontend status to backend status
  const mapFrontendStatus = (frontendStatus) => {
    const statusMap = {
      available: "AVAILABLE",
      "on leave": "ON_LEAVE",
      training: "TRAINING",
      unavailable: "UNAVAILABLE",
    };
    return statusMap[frontendStatus] || "AVAILABLE";
  };

  // Transform backend data to frontend format
  const transformDriverData = (backendDriver) => {
    console.log(`Driver ${backendDriver.name} status:`, backendDriver.status); // Debug log
    
    return {
      id: backendDriver.id,
      name: backendDriver.name,
      experience: backendDriver.experience,
      languages: Array.isArray(backendDriver.languages)
        ? backendDriver.languages
        : [],
      contactNumber: backendDriver.contactNumber,
      profilePhoto:
        backendDriver.profilePhoto ||
        "https://randomuser.me/api/portraits/men/1.jpg",
      rating: backendDriver.rating || 0,
      licenseNumber: backendDriver.licenseNumber,
      status: mapBackendStatus(backendDriver.status),
      serviceProviderId: backendDriver.serviceProviderId,
    };
  };

  // Fetch drivers from backend
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);

      const serviceProvider = localStorage.getItem("serviceProvider");
      const serviceProviderId = serviceProvider
        ? JSON.parse(serviceProvider).id
        : null;

      const backendDrivers =
        await TravelDriverService.getDriversByServiceProviderId(
          serviceProviderId
        );

      // Transform backend data to frontend format
      const transformedDrivers = backendDrivers.map(transformDriverData);
      setDrivers(transformedDrivers);
      setFilteredDrivers(transformedDrivers);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = drivers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(driver => driver.status === statusFilter);
    }

    // Apply experience filter
    if (experienceFilter) {
      filtered = filtered.filter(driver => {
        const experience = driver.experience;
        switch (experienceFilter) {
          case "0-2":
            return experience >= 0 && experience <= 2;
          case "3-5":
            return experience >= 3 && experience <= 5;
          case "6-10":
            return experience >= 6 && experience <= 10;
          case "10+":
            return experience > 10;
          default:
            return true;
        }
      });
    }

    setFilteredDrivers(filtered);
  };

  // Handle filter changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleExperienceFilterChange = (e) => {
    setExperienceFilter(e.target.value);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, experienceFilter, drivers]);

  // Handle delete driver
  const handleDeleteDriver = async (driverId) => {
    try {
      await TravelDriverService.deleteDriver(driverId);
      setDrivers((prev) => prev.filter((driver) => driver.id !== driverId));
      setDeleteModal(false);
      setCurrentDriver(null);
    } catch (err) {
      console.error("Error deleting driver:", err);
      setError(err.message);
    }
  };

  // Handle driver update from EditDriver
  const handleDriverUpdate = (updatedDriver) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === updatedDriver.id ? updatedDriver : driver
    ));
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const statusColors = {
    available: "bg-green-100 text-green-800",
    "on leave": "bg-yellow-100 text-yellow-800",
    training: "bg-sky-100 text-sky-800",
    unavailable: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    available: "Available",
    "on leave": "On Leave",
    training: "In Training",
    unavailable: "Unavailable",
  };

  const handleEdit = (driver) => {
    setCurrentDriver(driver);
    setEditModal(true);
  };

  const handleDeleteClick = (driver) => {
    setCurrentDriver(driver);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (currentDriver) {
      handleDeleteDriver(currentDriver.id);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  // Refresh drivers after insert/edit operations
  const refreshDrivers = () => {
    fetchDrivers();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setExperienceFilter("");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading drivers...</p>
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
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">
              Error loading drivers
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchDrivers}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        {/* Header and Add Button */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search and Filters */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Drivers
              </label>
              <input
                type="text"
                placeholder="Search by name or license..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="on leave">On Leave</option>
                <option value="training">In Training</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                value={experienceFilter}
                onChange={handleExperienceFilterChange}
              >
                <option value="">Any</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="w-full md:w-auto flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>

            {/* Add Driver Button */}
            <InsertDriver
              showModal={showModal}
              setShowModal={setShowModal}
              drivers={drivers}
              setDrivers={setDrivers}
              onDriverUpdate={refreshDrivers}
            />
          </div>

          {/* Active filters indicator */}
          {(searchTerm || statusFilter || experienceFilter) && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span>Active filters:</span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Search: "{searchTerm}"
                </span>
              )}
              {statusFilter && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  Status: {statusLabels[statusFilter]}
                </span>
              )}
              {experienceFilter && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Experience: {experienceFilter}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Drivers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Driver</th>
                  <th className="px-6 py-4 text-left font-medium">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left font-medium">Languages</th>
                  <th className="px-6 py-4 text-left font-medium">Contact</th>
                  {/* <th className="px-6 py-4 text-left font-medium">Rating</th> */}
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={driver.profilePhoto}
                          alt={driver.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-800">
                            {driver.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {driver.licenseNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{driver.experience} years</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {driver.languages.map((lang, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <FaPhone className="mr-2 text-gray-500" />
                        {driver.contactNumber}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="flex items-center">
                        {renderStars(driver.rating)}
                        <span className="ml-2 text-sm text-gray-600">{driver.rating.toFixed(1)}</span>
                      </div>
                    </td> */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[driver.status]
                        }`}
                      >
                        {statusLabels[driver.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEdit(driver)}
                          className="text-sky-600 hover:text-sky-800 font-medium text-sm flex items-center"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(driver)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center"
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* No results message */}
            {filteredDrivers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No drivers found matching your filters.
                {(searchTerm || statusFilter || experienceFilter) && (
                  <button
                    onClick={clearFilters}
                    className="ml-2 text-sky-600 hover:text-sky-800 underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex justify-between items-center">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium">{filteredDrivers.length}</span> of{" "}
              <span className="font-medium">{drivers.length}</span> drivers
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">
                Previous
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Edit Driver Modal */}
        <EditDriver
          editModal={editModal}
          setEditModal={setEditModal}
          currentDriver={currentDriver}
          setCurrentDriver={setCurrentDriver}
          drivers={drivers}
          setDrivers={setDrivers}
          onDriverUpdate={handleDriverUpdate}
        />

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
                  Delete Driver
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete "
                  <span className="font-semibold">{currentDriver?.name}</span>"?
                  This action cannot be undone.
                </p>

                <div className="flex space-x-4">
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Drivers;