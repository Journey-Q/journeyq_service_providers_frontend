import React, { useState, useEffect } from "react";
import Sidebar from "../../components/SidebarTourGuide";
import InsertTour from "./InsertTour";
import EditTour from "./EditTour";
import SingleTour from "./SingleTour";
import TourPackageService from "../../api_service/TourPackageService";


const Tours = () => {
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [photoModal, setPhotoModal] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const [tours, setTours] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    originalPrice: "",
    discount: "0",
    duration: "1 day",
    places: "",
    highlights: "",
    status: "available",
    image: "",
    rating: "4.0",
    maxPeople: "10",
    minPeople: "2",
    aboutTour: "",
    included: "",
    itinerary: "",
    importantNotes: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [tourPhotos, setTourPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  const statusColors = {
    AVAILABLE: "bg-green-100 text-green-800",
    UNAVAILABLE: "bg-red-100 text-red-800",
    available: "bg-green-100 text-green-800",
    unavailable: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    AVAILABLE: "Available",
    UNAVAILABLE: "Unavailable",
    available: "Available",
    unavailable: "Unavailable",
  };

  // Fetch tours on component mount
  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      // Replace with actual service provider ID from your auth context or localStorage
      const serviceProviderId = localStorage.getItem("serviceProviderId") || "33"; // Fallback for demo
      const tourPackages = await TourPackageService.getTourPackagesByServiceProviderId(serviceProviderId);
      
      // Transform backend data to match frontend structure
      const transformedTours = tourPackages.map(tour => ({
        id: tour.id,
        name: tour.name,
        image: tour.image,
        originalPrice: tour.originalPrice,
        discount: tour.discount,
        finalPrice: tour.finalPrice,
        pricePerPerson: tour.pricePerPerson,
        duration: tour.duration,
        places: tour.places || [],
        highlights: tour.highlights || [],
        status: tour.status?.toLowerCase() || "available",
        rating: tour.rating,
        maxPeople: tour.maxPeople,
        minPeople: tour.minPeople,
        aboutTour: tour.aboutTour,
        included: tour.included || [],
        itinerary: tour.itinerary || [],
        importantNotes: tour.importantNotes || [],
        pastTourPhotos: tour.pastTourImages?.map(img => img.imageUrl) || [],
        serviceProviderId: tour.serviceProviderId
      }));
      
      setTours(transformedTours);
    } catch (err) {
      console.error("Error fetching tours:", err);
      setError(err.message);
      // Fallback to demo data if API fails
      setTours(getDemoTours());
    } finally {
      setLoading(false);
    }
  };

  // Demo data fallback
  const getDemoTours = () => [
    {
      id: 1,
      name: "Anuradhapura Cultural Visit",
      image: "https://images.unsplash.com/photo-1659244352464-75e539618056?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YW51cmFkaGFwdXJhfGVufDB8fDB8fHww",
      originalPrice: 15000,
      discount: 10,
      finalPrice: 13500,
      pricePerPerson: 13500,
      duration: "1 day",
      places: ["Anuradhapura Temples", "Ruwanwelisaya", "Isurumuniya"],
      highlights: ["Historical sites", "Cultural experience", "Local cuisine"],
      status: "available",
      rating: 4.5,
      maxPeople: 15,
      minPeople: 2,
      aboutTour: "Explore the ancient capital of Sri Lanka with its magnificent temples, stupas, and archaeological wonders. This cultural journey takes you through 2,500 years of history.",
      included: ["Transportation", "Professional guide", "Entrance fees", "Lunch"],
      itinerary: [
        { time: "8:00 AM", activity: "Pickup from hotel" },
        { time: "10:00 AM", activity: "Visit Ruwanwelisaya Stupa" },
        { time: "12:00 PM", activity: "Lunch at local restaurant" },
        { time: "2:00 PM", activity: "Explore Isurumuniya Temple" },
        { time: "4:00 PM", activity: "Return journey" },
      ],
      importantNotes: [
        "Bring comfortable walking shoes",
        "Dress modestly for temples",
        "Carry water bottle",
        "Weather can be hot - bring sun protection",
      ],
      pastTourPhotos: [],
    },
    {
      id: 2,
      name: "Sigiriya & Dambulla Adventure",
      image: "https://plus.unsplash.com/premium_photo-1730145749791-28fc538d7203?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2lnaXJpeWF8ZW58MHx8MHx8fDA%3D",
      originalPrice: 25000,
      discount: 8,
      finalPrice: 23000,
      pricePerPerson: 23000,
      duration: "1 day",
      places: ["Sigiriya Rock Fortress", "Dambulla Cave Temple"],
      highlights: ["UNESCO sites", "Scenic views", "Historical significance"],
      status: "available",
      rating: 4.8,
      maxPeople: 12,
      minPeople: 2,
      aboutTour: "Climb the iconic Sigiriya Rock Fortress and explore the magnificent Dambulla Cave Temple. Two UNESCO World Heritage sites in one incredible day.",
      included: ["Transportation", "Professional guide", "Entrance fees", "All meals", "Water"],
      itinerary: [
        { time: "7:00 AM", activity: "Pickup from hotel" },
        { time: "8:30 AM", activity: "Climb Sigiriya Rock" },
        { time: "12:00 PM", activity: "Lunch break" },
        { time: "2:00 PM", activity: "Visit Dambulla Cave Temple" },
        { time: "5:00 PM", activity: "Return journey" },
      ],
      importantNotes: [
        "Moderate fitness required for climbing",
        "Bring comfortable hiking shoes",
        "Early morning start recommended",
        "Carry ID for entrance",
      ],
      pastTourPhotos: [],
    }
  ];

  // Filter tours based on search and filters
  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tour.status === statusFilter;
    
    let matchesPrice = true;
    if (priceFilter === "low") {
      matchesPrice = tour.finalPrice <= 15000;
    } else if (priceFilter === "medium") {
      matchesPrice = tour.finalPrice > 15000 && tour.finalPrice <= 30000;
    } else if (priceFilter === "high") {
      matchesPrice = tour.finalPrice > 30000;
    }
    
    return matchesSearch && matchesStatus && matchesPrice;
  });

  const calculateFinalPrice = (originalPrice, discount) => {
    const price = parseFloat(originalPrice) || 0;
    const discountValue = parseFloat(discount) || 0;
    return Math.round(price - (price * discountValue) / 100);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTourPhotosUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 7 - tourPhotos.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length === 0) return;

    const newPhotos = [...tourPhotos, ...filesToAdd];
    setTourPhotos(newPhotos);

    // Create previews for new files
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeTourPhoto = (index) => {
    const newPhotos = tourPhotos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    setTourPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const handleAddTourPhotos = (tour) => {
    setCurrentTour(tour);
    setTourPhotos([]);
    setPhotoPreviews([]);
    setPhotoModal(true);
  };

  const handleSaveTourPhotos = () => {
    if (currentTour && tourPhotos.length > 0) {
      setTours(prev => prev.map(tour => 
        tour.id === currentTour.id 
          ? { ...tour, pastTourPhotos: [...tour.pastTourPhotos, ...photoPreviews] }
          : tour
      ));
    }
    setPhotoModal(false);
    setCurrentTour(null);
    setTourPhotos([]);
    setPhotoPreviews([]);
  };

  const handleInsertSubmit = async (e) => {
    e.preventDefault();

    try {
      const placesArray = formData.places
        .split(",")
        .map((place) => place.trim())
        .filter((place) => place);
      const highlightsArray = formData.highlights
        .split(",")
        .map((highlight) => highlight.trim())
        .filter((highlight) => highlight);
      const includedArray = formData.included
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
      const notesArray = formData.importantNotes
        .split(",")
        .map((note) => note.trim())
        .filter((note) => note);

      const originalPrice = parseInt(formData.originalPrice);
      const discount = parseFloat(formData.discount);
      const finalPrice = calculateFinalPrice(originalPrice, discount);

      const newTourData = {
        serviceProviderId: localStorage.getItem("serviceProviderId") || "33",
        name: formData.name,
        originalPrice: originalPrice,
        discount: discount,
        finalPrice: finalPrice,
        pricePerPerson: finalPrice,
        duration: formData.duration,
        places: placesArray,
        highlights: highlightsArray,
        status: formData.status.toUpperCase(),
        rating: parseFloat(formData.rating),
        maxPeople: parseInt(formData.maxPeople),
        minPeople: parseInt(formData.minPeople),
        aboutTour: formData.aboutTour,
        included: includedArray,
        itinerary: [],
        importantNotes: notesArray,
        image: imagePreview || "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW51cmFkaGFwdXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      };

      const createdTour = await TourPackageService.createTourPackage(newTourData);
      
      // Transform and add to local state
      const transformedTour = {
        id: createdTour.id,
        ...newTourData,
        status: newTourData.status.toLowerCase(),
        pastTourPhotos: []
      };
      
      setTours((prev) => [...prev, transformedTour]);
      setShowInsertModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating tour:", error);
      alert("Failed to create tour: " + error.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const placesArray = formData.places
        .split(",")
        .map((place) => place.trim())
        .filter((place) => place);
      const highlightsArray = formData.highlights
        .split(",")
        .map((highlight) => highlight.trim())
        .filter((highlight) => highlight);
      const includedArray = formData.included
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
      const notesArray = formData.importantNotes
        .split(",")
        .map((note) => note.trim())
        .filter((note) => note);

      const originalPrice = parseInt(formData.originalPrice);
      const discount = parseFloat(formData.discount);
      const finalPrice = calculateFinalPrice(originalPrice, discount);

      const updatedTourData = {
        serviceProviderId: currentTour.serviceProviderId,
        name: formData.name,
        originalPrice: originalPrice,
        discount: discount,
        finalPrice: finalPrice,
        pricePerPerson: finalPrice,
        duration: formData.duration,
        places: placesArray,
        highlights: highlightsArray,
        status: formData.status.toUpperCase(),
        rating: parseFloat(formData.rating),
        maxPeople: parseInt(formData.maxPeople),
        minPeople: parseInt(formData.minPeople),
        aboutTour: formData.aboutTour,
        included: includedArray,
        itinerary: currentTour.itinerary || [],
        importantNotes: notesArray,
        image: imagePreview || currentTour.image,
      };

      await TourPackageService.updateTourPackage(currentTour.id, updatedTourData);
      
      // Update local state
      const updatedTour = {
        ...currentTour,
        ...updatedTourData,
        status: updatedTourData.status.toLowerCase(),
        pastTourPhotos: currentTour.pastTourPhotos || []
      };

      setTours((prev) =>
        prev.map((tour) => (tour.id === currentTour.id ? updatedTour : tour))
      );
      setShowEditModal(false);
      resetForm();
      setCurrentTour(null);
    } catch (error) {
      console.error("Error updating tour:", error);
      alert("Failed to update tour: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      originalPrice: "",
      discount: "0",
      duration: "1 day",
      places: "",
      highlights: "",
      status: "available",
      image: "",
      rating: "4.0",
      maxPeople: "10",
      minPeople: "2",
      aboutTour: "",
      included: "",
      itinerary: "",
      importantNotes: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const handleDeleteClick = (tour) => {
    setCurrentTour(tour);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await TourPackageService.deleteTourPackage(currentTour.id);
      setTours((prev) => prev.filter((tour) => tour.id !== currentTour.id));
      setDeleteModal(false);
      setCurrentTour(null);
    } catch (error) {
      console.error("Error deleting tour:", error);
      alert("Failed to delete tour: " + error.message);
    }
  };

  const formatPrice = (price) => {
    return `Rs.${price?.toLocaleString("en-IN") || '0'}`;
  };

  const formatDiscount = (discount) => {
    if (!discount || discount === 0) return null;
    return `${discount}% OFF`;
  };

  const handleEditTour = (tour) => {
    setCurrentTour(tour);
    setFormData({
      name: tour.name,
      originalPrice: tour.originalPrice,
      discount: tour.discount,
      duration: tour.duration,
      places: tour.places?.join(", ") || "",
      highlights: tour.highlights?.join(", ") || "",
      status: tour.status,
      image: tour.image,
      rating: tour.rating,
      maxPeople: tour.maxPeople,
      minPeople: tour.minPeople,
      aboutTour: tour.aboutTour,
      included: tour.included?.join(", ") || "",
      itinerary: "",
      importantNotes: tour.importantNotes?.join(", ") || "",
    });
    setImagePreview(tour.image);
    setShowEditModal(true);
  };

  const handleSingleTourEdit = (tour) => {
    setSelectedTour(null);
    handleEditTour(tour);
  };

  const handleSingleTourDelete = (tour) => {
    setSelectedTour(null);
    handleDeleteClick(tour);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tours...</p>
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
          <div className="text-center text-red-600">
            <p>Error loading tours: {error}</p>
            <button 
              onClick={fetchTours}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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

      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search by Name */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>

            {/* Price Filter */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Prices</option>
              <option value="low">Low (≤ Rs.15,000)</option>
              <option value="medium">Medium (Rs.15,001 - 30,000)</option>
              <option value="high">High (≥ Rs.30,001)</option>
            </select>
          </div>

          {/* Add New Tour Button */}
          <button
            onClick={() => setShowInsertModal(true)}
            className="bg-[#0B9ED9] hover:bg-[#0891C7] text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-all duration-200 flex items-center gap-2 hover:shadow-md whitespace-nowrap"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Tour
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-xl overflow-hidden border border-gray-300 shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Clickable Image */}
              <div 
                className="h-48 overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedTour(tour)}
              >
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {tour.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    {formatDiscount(tour.discount)}
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {tour.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      statusColors[tour.status]
                    }`}
                  >
                    {statusLabels[tour.status]}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-yellow-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-600">
                      {tour.rating}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {tour.minPeople}-{tour.maxPeople} people
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <div className="flex flex-col">
                    {tour.discount > 0 ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 text-lg">
                            {formatPrice(tour.finalPrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(tour.originalPrice)}
                          </span>
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          You save Rs.
                          {(
                            tour.originalPrice - tour.finalPrice
                          ).toLocaleString("en-IN")}
                        </div>
                      </>
                    ) : (
                      <span className="font-medium text-gray-800 text-lg">
                        {formatPrice(tour.finalPrice)}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">per person</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {tour.duration} tour
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {tour.places?.length || 0} location
                    {(tour.places?.length || 0) > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Tour Highlights
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tour.highlights?.slice(0, 3).map((highlight, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {highlight}
                      </span>
                    ))}
                    {(tour.highlights?.length || 0) > 3 && (
                      <span className="text-xs text-gray-500">
                        +{(tour.highlights?.length || 0) - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Add Past Tour Photos Button */}
                <div className="mb-4">
                  <button
                    onClick={() => handleAddTourPhotos(tour)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Add Past Tour Photos
                    {(tour.pastTourPhotos?.length || 0) > 0 && (
                      <span className="bg-purple-800 text-xs px-2 py-1 rounded-full">
                        {tour.pastTourPhotos?.length || 0}
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => handleEditTour(tour)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(tour)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
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
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tours found matching your criteria.</p>
          </div>
        )}

        {/* Insert Tour Modal */}
        <InsertTour
          showModal={showInsertModal}
          setShowModal={setShowInsertModal}
          formData={formData}
          setFormData={setFormData}
          imagePreview={imagePreview}
          handleImageUpload={handleImageUpload}
          handleSubmit={handleInsertSubmit}
          resetForm={resetForm}
        />

        {/* Edit Tour Modal */}
        <EditTour
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          formData={formData}
          setFormData={setFormData}
          imagePreview={imagePreview}
          handleImageUpload={handleImageUpload}
          handleSubmit={handleEditSubmit}
          resetForm={resetForm}
        />

        {/* Single Tour Detail Modal */}
        {selectedTour && (
          <SingleTour
            tour={selectedTour}
            onClose={() => setSelectedTour(null)}
            onEdit={handleSingleTourEdit}
            onDelete={handleSingleTourDelete}
          />
        )}

        {/* Add Tour Photos Modal */}
        {photoModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Add Past Tour Photos - {currentTour?.name}
                  </h2>
                  <button
                    onClick={() => setPhotoModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photos (Maximum 7, {7 - tourPhotos.length} remaining)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleTourPhotosUpload}
                    disabled={tourPhotos.length >= 7}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    You can select multiple images at once
                  </p>
                </div>

                {/* Photo Previews */}
                {photoPreviews.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Selected Photos</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {photoPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Tour photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeTourPhoto(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Existing Photos */}
                {currentTour?.pastTourPhotos && currentTour.pastTourPhotos.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Existing Photos</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {currentTour.pastTourPhotos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Existing tour photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setPhotoModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTourPhotos}
                    disabled={tourPhotos.length === 0}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Photos
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  Delete Tour
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete "
                  <span className="font-semibold">{currentTour?.name}</span>"?
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

export default Tours;