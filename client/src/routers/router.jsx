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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path: '/',
        element: <Home/>
      },

      {
        path: '/login',
        element: <Login/>
      },

      {
        path: '/register',
        element: <Register/>
      },

      {
        path:'/register-hotel',
        element:<RegisterAsHotel/>
      },

      {
        path:'/register-tour-guide',
        element:<RegisterAsTourGuide/>
      },

      {
        path:'/register-travel-agency',
        element:<RegisterAsTravelAgency/>
      }
    ]
  },
]);

export default router;