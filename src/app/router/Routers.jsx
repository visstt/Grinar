import { createBrowserRouter } from "react-router-dom";

import HomePage from "../../pages/homePage/HomePage";
import ProfilePage from "../../pages/profilePage/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
]);
