import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from '../App'
import Home from '../components/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RegisterAsHotel from '../pages/RegisterAsHotel';
import RegisterAsTourGuide from '../pages/RegisterAsTourGuide';
import RegisterAsTravelAgency from '../pages/RegisterAsTravelAgency';

//temporarily routing here, these should be private routes
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
        element: <Login/>
      },
      {
        path: '/register',
        element: <Register/>,
        children: [
          {
            path: 'hotel',  // Note: removed leading slash
            element: <RegisterAsHotel/>
          },
          {
            path: 'tour-guide',
            element: <RegisterAsTourGuide/>
          },
          {
            path: 'travel-agency',
            element: <RegisterAsTravelAgency/>
          }
        ]
      },

      // hotel profile making
      // {
      //   path:'/hotel',
      //   element:
      // }

      // dashboard routes for now, should be private routes this is temporary
      //paths for hotel
      {
        path: '/hotel',
        children:[
          {
            path: 'dashboard',
            element: <HotelDashboard/>
          },

          {
            path: 'booking-history',
            element: <HotelBookingHistory/>
          },

          {
            path: 'payment-history',
            element: <HotelPaymentHistory/>
          },

          {
            path: 'create-profile',
            element: <HotelCreateProfile/>
          },

          {
            path: 'room-service',
            element: <HotelRoomService/>
          },

          {
            path: 'promotions',
            element: <HotelPromotions/>
          },


          {
            path: 'bankdetails',
            element: <HotelBankDetails/>
          },

          {
            path: 'chat',
            element: <HotelChat/>
          },

          {
            path: 'settings',
            element: <HotelSettings/>
          },

          {
            path: 'reviews',
            element: <HotelReview/>
          },

          //inside pages, edits, creates
          {
            path:'edit-room-service',
            element: <HotelEditRoomService/>
          }


        ]

      },

      //paths for tour guide
      {
        path: '/tour-guide',
        children:[
          
            {
              path: 'dashboard',
              element: <TourGuideDashboard/>
            },

            {
              path: 'booking-history',
              element: <TourGuideBookingHistory/>
            },

            {
              path: 'payment-history',
              element: <TourGuidePaymentHistory/>
            },

            {
              path: 'tours',
              element: <TourGuideTours/>
            },

            {
              path: 'settings',
              element: <TourGuideSettings/>
            },

            {
              path: 'chat',
              element: <TourGuideChat/>
            },

            {
              path:'promotions',
              element:<TourGuidePromotions/>
            },

            {
            path: 'bankdetails',
            element: <TourGuideBankDetails/>
          },

          {
              path:'tour-details/:id',
              element:<TourGuideDisplayTours/>
            },

            {
            path: 'reviews',
            element: <TourGuideReview/>
          },

            {
              path:'create-profile',
              element: <TourGuideCreateProfile/>
            }
          
        ]
      },

      //travel agency routes
      {
        path: '/travel-agency',
        children:[
          {
            path:'dashboard',
            element: <TravelAgencyDashboard/>
          },

          {
            path: 'booking-history',
            element: <TravelAgencyBookingHistory/>
          },

          {
            path: 'payment-history',
            element: <TravelAgencyPaymentHistory/>
          },

          {
            path: 'settings',
            element: <TravelAgencySettings/>
          },

          {
            path: 'vehicles',
            element: <TravelAgencyVehicles/>
          },

          {
            path: 'chat',
            element: <TravelAgencyChat/>
          },

          {
            path: 'bankdetails',
            element: <TravelAgencyBankDetails/>
          },

          {
            path: 'create-profile',
            element: <TravelAgencyCreateProfile/>
          },

          {
            path: 'reviews',
            element: <TravelAgencyReview/>
          },

          {
            path: 'promotions',
            element: <TravelAgencyPromotions/>
          }
        ]
      }
    ]
  },
]);

export default router;