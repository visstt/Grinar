import { createBrowserRouter } from "react-router-dom";

import BlogPage from "../../pages/blogPage/BlogPage";
import CreateArticle from "../../pages/createArticle/article/CreateArticle";
import ArticleInformation from "../../pages/createArticle/information/Information";
import Information from "../../pages/createProject/information/Information";
import CreateProject from "../../pages/createProject/project/CreateProject";
import DocsPage from "../../pages/docsPage/DocsPage";
import HomePage from "../../pages/homePage/HomePage";
import PaymentPage from "../../pages/paymentPage/PaymentPage";
import ProfilePage from "../../pages/profilePage/ProfilePage";
import ProfileAccount from "../../pages/profileSettings/profileAccount/ProfileAccount";
import ProfileDecor from "../../pages/profileSettings/profileDecor/ProfileDecor";
import ProfileInfo from "../../pages/profileSettings/profileInfo/ProfileInfo";
import ProfileNotifications from "../../pages/profileSettings/profileNotifications/ProfileNotifications";
import ProjectsPage from "../../pages/projectsPage/ProjectsPage";
import SpecialistsPage from "../../pages/specialistsPage/SpecialistsPage";
import UserProfilePage from "../../pages/userProfile/UserProfile";

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
    path: "/projects",
    element: <ProjectsPage />,
  },
  {
    path: "/specialists",
    element: <SpecialistsPage />,
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
    path: "/blog",
    element: <BlogPage />,
  },
  {
    path: "/create-project",
    element: <CreateProject />,
  },
  {
    path: "/project-information",
    element: <Information />,
  },
  {
    path: "/create-article",
    element: <CreateArticle />,
  },
  {
    path: "/article-information",
    element: <ArticleInformation />,
  },
]);
