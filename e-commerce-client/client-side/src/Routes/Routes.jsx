import { createBrowserRouter } from "react-router-dom";
import Home from "../Components/Home/Home";
import Landing from "../Components/Landing/Landing";
import Login from "../Components/Login/Login";
import Register from "../Components/Register/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
    errorElement: <Error></Error>,
        children: [
            {
                path: '/',
                element: <Landing></Landing>
        
    },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
    ],
  },
]);
