import { createBrowserRouter } from "react-router-dom";

import ProjectLayout from "../../pages/createProject/ProjectLayout";
import Information from "../../pages/createProject/information/Information";
import CreateProject from "../../pages/createProject/project/CreateProject";
import HomePage from "../../pages/homePage/HomePage";
import ProfilePage from "../../pages/profilePage/ProfilePage";
import ProfileAccount from "../../pages/profileSettings/profileAccount/ProfileAccount";
import ProfileDecor from "../../pages/profileSettings/profileDecor/ProfileDecor";
import ProfileInfo from "../../pages/profileSettings/profileInfo/ProfileInfo";
import ProfileNotifications from "../../pages/profileSettings/profileNotifications/ProfileNotifications";

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
    path: "/project",
    element: <ProjectLayout />,
    children: [
      {
        path: "create",
        element: <CreateProject />,
      },
      {
        path: "information",
        element: <Information />,
      },
    ],
  },
  // Для обратной совместимости с существующими ссылками
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
