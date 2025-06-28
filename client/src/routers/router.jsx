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

//tour guide
import TourGuideDashboard from '../pages/TourGuide/Dashboard';

//travel agency
import TravelAgencyDashboard from '../pages/TravelAgency/Dashboard';

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
          }
        ]

      }
    ]
  },
]);

export default router;