import { createBrowserRouter } from "react-router-dom";

import ProjectLayout from "../../pages/createProject/ProjectLayout";
import Information from "../../pages/createProject/information/Information";
import CreateProject from "../../pages/createProject/project/CreateProject";
import HomePage from "../../pages/homePage/HomePage";
import PaymentPage from "../../pages/paymentPage/PaymentPage";
import ProfilePage from "../../pages/profilePage/ProfilePage";
import ProfileAccount from "../../pages/profileSettings/profileAccount/ProfileAccount";
import ProfileDecor from "../../pages/profileSettings/profileDecor/ProfileDecor";
import ProfileInfo from "../../pages/profileSettings/profileInfo/ProfileInfo";
import ProfileNotifications from "../../pages/profileSettings/profileNotifications/ProfileNotifications";
import UserProfilePage from "../../pages/userProfile/UserProfile";
import DocsPage from "../../pages/docsPage/DocsPage";

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
    path: "/profile/projects",
    element: <ProfilePage tab="projects" />,
  },
  {
    path: "/profile/main",
    element: <ProfilePage tab="main" />,
  },
  {
    path: "/profile/subscriptions",
    element: <ProfilePage tab="subscriptions" />,
  },
  {
    path: "/profile/profile-info",
    element: <ProfileInfo />,
  },
  {
    path: "/profile/profile-decor",
    element: <ProfileDecor />,
  },
  {
    path: "/profile/profile-notifications",
    element: <ProfileNotifications />,
  },
  {
    path: "/profile/profile-account",
    element: <ProfileAccount />,
  },
  {
    path: "/docs",
    element: <DocsPage />,
  },
  {
    path: "/payment",
    element: <PaymentPage />,
  },
  {
    path: "/user/:userId",
    element: <UserProfilePage />,
  },
  {
    path: "/user/:userId/main",
    element: <UserProfilePage tab="main" />,
  },
  {
    path: "/user/:userId/projects",
    element: <UserProfilePage tab="projects" />,
  },
  {
    path: "/user/:userId/subscriptions",
    element: <UserProfilePage tab="subscriptions" />,
  },

  {
    path: "/create-project",
    element: <ProjectLayout />,
    children: [
      {
        index: true,
        element: <CreateProject />,
      },
    ],
  },
  {
    path: "/project-information",
    element: <ProjectLayout />,
    children: [
      {
        index: true,
        element: <Information />,
      },
    ],
  },
]);
