import { createBrowserRouter } from "react-router-dom";

import HomePage from "../../pages/homePage/HomePage";
import ProfilePage from "../../pages/profilePage/ProfilePage";
import ProfileInfo from "../../pages/profileSettings/profileInfo/ProfileInfo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/profile/profile-info",
    element: <ProfileInfo />,
  },
]);
