import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import App from '../App'
import Home from '../components/Home';
import Login from '../pages/Login';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (accessToken) {
    // Get service provider data from localStorage (matches your login logic)
    const serviceProviderData = JSON.parse(localStorage.getItem('serviceProvider') || '{}');
    const { serviceType, isProfileCreated } = serviceProviderData;
    
    if (serviceType) {
      // If profile is not created, redirect to create profile
      if (!isProfileCreated) {
        switch (serviceType) {
          case 'HOTEL':
            return <Navigate to="/hotel/create-profile" replace />;
          case 'TOUR_GUIDE':
            return <Navigate to="/tour-guide/create-profile" replace />;
          case 'TRAVEL_AGENT':
            return <Navigate to="/travel-agency/create-profile" replace />;
          default:
            return <Navigate to="/" replace />;
        }
      } else {
        // If profile is created, redirect to dashboard
        switch (serviceType) {
          case 'HOTEL':
            return <Navigate to="/hotel/dashboard" replace />;
          case 'TOUR_GUIDE':
            return <Navigate to="/tour-guide/dashboard" replace />;
          case 'TRAVEL_AGENT':
            return <Navigate to="/travel-agency/dashboard" replace />;
          default:
            return <Navigate to="/" replace />;
        }
      }
    }
    
    // If no service type found, redirect to home
    return <Navigate to="/" replace />;
  }
  
  return children;
};

//hotel
import HotelDashboard from '../pages/Hotel/Dashboard';
import HotelBookingHistory from '../pages/Hotel/BookingHistory';
import HotelPaymentHistory from '../pages/Hotel/PaymentHistory';
import HotelRoomService from '../pages/Hotel/RoomService';
import HotelCreateProfile from '../pages/Hotel/CreateProfile';
import HotelSettings from '../pages/Hotel/Settings';
import HotelPromotions from '../pages/Hotel/Promotions';
import HotelChat from '../pages/Hotel/Chat';
import HotelEditRoomService from '../pages/Hotel/EditRoomService'
import HotelBankDetails from "../pages/Hotel/Bankdetail";
import HotelReview from "../pages/Hotel/Reviews";
import HotelPendingApproval from "../pages/Hotel/PendingApproval"

//tour guide
import TourGuideDashboard from '../pages/TourGuide/Dashboard';
import TourGuideChat from '../pages/TourGuide/Chat';
import TourGuideBookingHistory from '../pages/TourGuide/BookingHistory'
import TourGuidePaymentHistory from '../pages/TourGuide/PaymentHistory'
import TourGuideCreateProfile from '../pages/TourGuide/CreateProfile'
import TourGuideSettings from '../pages/TourGuide/Settings'
import TourGuideTours from '../pages/TourGuide/Tours'
import TourGuidePromotions from '../pages/TourGuide/Promotions'
import TourGuideReview from "../pages/TourGuide/Reviews"
import TourGuideBankDetails from '../pages/TourGuide/Bankdetail'
import TourGuideDisplayTours from '../pages/TourGuide/DisplayTour'
import TourGuidePendingApproval from '../pages/TourGuide/PendingApproval'

//travel agency
import TravelAgencyDashboard from '../pages/TravelAgency/Dashboard';
import TravelAgencyChat from '../pages/TravelAgency/Chat'
import TravelAgencyBookingHistory from '../pages/TravelAgency/BookingHistory'
import TravelAgencyPaymentHistory from '../pages/TravelAgency/PaymentHistory'
import TravelAgencyCreateProfile from '../pages/TravelAgency/CreateProfile'
import TravelAgencySettings from '../pages/TravelAgency/Settings'
import TravelAgencyVehicles from '../pages/TravelAgency/Vehicles'
import TravelAgencyPromotions from '../pages/TravelAgency/Promotions'
import TravelAgencyReview from '../pages/TravelAgency/Reviews'
import TravelAgencyBankDetails from '../pages/TravelAgency/Bankdetail'
import TravelAgencyDrivers from '../pages/TravelAgency/Drivers'
import TravelAgencyPendingApproval from '../pages/TravelAgency/PendingApproval'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: '/login',
        element: (
          <PublicRoute>
            <Login/>
          </PublicRoute>
        )
      },

     
      {
        path: '/hotel',
        children:[
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute>
                <HotelDashboard/>
              </ProtectedRoute>
            )
          },

          {
            path: 'booking-history',
            element: (
              <ProtectedRoute>
                <HotelBookingHistory/>
              </ProtectedRoute>
            )
          },

          {
            path: 'payment-history',
            element: (
              <ProtectedRoute>
                <HotelPaymentHistory/>
              </ProtectedRoute>
            )
          },

          {
            path: 'create-profile',
            element: (
              <ProtectedRoute>
                <HotelCreateProfile/>
              </ProtectedRoute>
            )
          },

          {
            path: 'room-service',
            element: (
              <ProtectedRoute>
                <HotelRoomService/>
              </ProtectedRoute>
            )
          },

          {
            path: 'promotions',
            element: (
              <ProtectedRoute>
                <HotelPromotions/>
              </ProtectedRoute>
            )
          },

          {
            path: 'bankdetails',
            element: (
              <ProtectedRoute>
                <HotelBankDetails/>
              </ProtectedRoute>
            )
          },

          {
            path: 'chat',
            element: (
              <ProtectedRoute>
                <HotelChat/>
              </ProtectedRoute>
            )
          },

          {
            path: 'settings',
            element: (
              <ProtectedRoute>
                <HotelSettings/>
              </ProtectedRoute>
            )
          },

          {
            path: 'reviews',
            element: (
              <ProtectedRoute>
                <HotelReview/>
              </ProtectedRoute>
            )
          },

          {
            path: 'pending-approval',
            element: (
              <ProtectedRoute>
                <HotelPendingApproval/>
              </ProtectedRoute>
            )
          },

          //inside pages, edits, creates
          {
            path:'edit-room-service',
            element: (
              <ProtectedRoute>
                <HotelEditRoomService/>
              </ProtectedRoute>
            )
          }
        ]
      },

      //paths for tour guide
      {
        path: '/tour-guide',
        children:[
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute>
                <TourGuideDashboard/>
              </ProtectedRoute>
            )
          },

          {
            path: 'booking-history',
            element: (
              <ProtectedRoute>
                <TourGuideBookingHistory/>
              </ProtectedRoute>
            )
          },

          {
            path: 'payment-history',
            element: (
              <ProtectedRoute>
                <TourGuidePaymentHistory/>
              </ProtectedRoute>
            )
          },

          {
            path: 'tours',
            element: (
              <ProtectedRoute>
                <TourGuideTours/>
              </ProtectedRoute>
            )
          },

          {
            path: 'settings',
            element: (
              <ProtectedRoute>
                <TourGuideSettings/>
              </ProtectedRoute>
            )
          },

          {
            path: 'chat',
            element: (
              <ProtectedRoute>
                <TourGuideChat/>
              </ProtectedRoute>
            )
          },

          {
            path:'promotions',
            element: (
              <ProtectedRoute>
                <TourGuidePromotions/>
              </ProtectedRoute>
            )
          },

          {
            path: 'bankdetails',
            element: (
              <ProtectedRoute>
                <TourGuideBankDetails/>
              </ProtectedRoute>
            )
          },

          {
            path:'tour-details/:id',
            element: (
              <ProtectedRoute>
                <TourGuideDisplayTours/>
              </ProtectedRoute>
            )
          },

          {
            path: 'reviews',
            element: (
              <ProtectedRoute>
                <TourGuideReview/>
              </ProtectedRoute>
            )
          },

          {
            path: 'pending-approval',
            element: (
              <ProtectedRoute>
                <TourGuidePendingApproval/>
              </ProtectedRoute>
            )
          },

          {
            path:'create-profile',
            element: (
              <ProtectedRoute>
                <TourGuideCreateProfile/>
              </ProtectedRoute>
            )
          }
        ]
      },

      //travel agency routes
      {
        path: '/travel-agency',
        children:[
          {
            path:'dashboard',
            element: (
              <ProtectedRoute>
                <TravelAgencyDashboard/>
              </ProtectedRoute>
            )
          },

          {
            path: 'booking-history',
            element: (
              <ProtectedRoute>
                <TravelAgencyBookingHistory/>
              </ProtectedRoute>
            )
          },

          {
            path: 'payment-history',
            element: (
              <ProtectedRoute>
                <TravelAgencyPaymentHistory/>
              </ProtectedRoute>
            )
          },

          {
            path: 'settings',
            element: (
              <ProtectedRoute>
                <TravelAgencySettings/>
              </ProtectedRoute>
            )
          },

          {
            path: 'vehicles',
            element: (
              <ProtectedRoute>
                <TravelAgencyVehicles/>
              </ProtectedRoute>
            )
          },

          {
            path: 'chat',
            element: (
              <ProtectedRoute>
                <TravelAgencyChat/>
              </ProtectedRoute>
            )
          },

          {
            path: 'bankdetails',
            element: (
              <ProtectedRoute>
                <TravelAgencyBankDetails/>
              </ProtectedRoute>
            )
          },

          {
            path: 'create-profile',
            element: (
              <ProtectedRoute>
                <TravelAgencyCreateProfile/>
              </ProtectedRoute>
            )
          },

          {
            path: 'reviews',
            element: (
              <ProtectedRoute>
                <TravelAgencyReview/>
              </ProtectedRoute>
            )
          },

          {
            path: 'drivers',
            element: (
              <ProtectedRoute>
                <TravelAgencyDrivers/>
              </ProtectedRoute>
            )
          },

          {
            path: 'pending-approval',
            element: (
              <ProtectedRoute>
                <TravelAgencyPendingApproval/>
              </ProtectedRoute>
            )
          },

          {
            path: 'promotions',
            element: (
              <ProtectedRoute>
                <TravelAgencyPromotions/>
              </ProtectedRoute>
            )
          }
        ]
      }
    ]
  },
]);

export default router;