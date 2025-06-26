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
    ]
  },
]);

export default router;