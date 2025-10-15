import { Outlet, createBrowserRouter, useParams } from "react-router-dom";

import AdminPage from "../../pages/adminPage/AdminPage";
import ArticlePage from "../../pages/articlePage/ArticlePage";
import BlogPage from "../../pages/blogPage/BlogPage";
import ChatPage from "../../pages/chatPage/ChatPage";
import CreateArticleLayout from "../../pages/createArticle/CreateArticleLayout";
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
import { useUserStore } from "../../shared/store/userStore";
import Footer from "../../shared/ui/components/footer/Footer";

function LayoutWithFooter() {
  return (
    <div className="layout-root">
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function LayoutWithoutFooter() {
  return <Outlet />;
}

function ProfileRouteWrapper({ tab }) {
  const { userId } = useParams();
  const { user } = useUserStore();

  // Проверяем, совпадает ли userId из URL с ID текущего пользователя
  const isOwnProfile = user && userId === user.id?.toString();

  if (isOwnProfile) {
    return <ProfilePage tab={tab} />;
  } else {
    return <UserProfilePage tab={tab} />;
  }
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutWithFooter />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "profile-info",
        element: <ProfileInfo />,
      },
      {
        path: "profile-decor",
        element: <ProfileDecor />,
      },
      {
        path: "profile-notifications",
        element: <ProfileNotifications />,
      },
      {
        path: "profile-account",
        element: <ProfileAccount />,
      },
      {
        path: "docs",
        element: <DocsPage />,
      },
      {
        path: "payment",
        element: <PaymentPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "specialists",
        element: <SpecialistsPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "user/:userId",
        element: <ProfileRouteWrapper />,
      },
      {
        path: "user/:userId/main",
        element: <ProfileRouteWrapper tab="main" />,
      },
      {
        path: "user/:userId/projects",
        element: <ProfileRouteWrapper tab="projects" />,
      },
      {
        path: "user/:userId/blogs",
        element: <ProfileRouteWrapper tab="blogs" />,
      },
      {
        path: "user/:userId/subscriptions",
        element: <ProfileRouteWrapper tab="subscriptions" />,
      },
      {
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "blog/blog-by-id/:blogId",
        element: <ArticlePage />,
      },
      {
        path: "create-project",
        element: <CreateProject />,
      },
      {
        path: "project-information",
        element: <Information />,
      },
      {
        path: "create-article-flow",
        element: <CreateArticleLayout />,
        children: [
          {
            path: "create-article",
            element: <CreateArticle />,
          },
          {
            path: "article-information",
            element: <ArticleInformation />,
          },
        ],
      },
      // Добавляем для совместимости старых ссылок
      {
        path: "create-article",
        element: <CreateArticleLayout />,
        children: [
          {
            index: true,
            element: <CreateArticle />,
          },
        ],
      },
      {
        path: "article-information",
        element: <CreateArticleLayout />,
        children: [
          {
            index: true,
            element: <ArticleInformation />,
          },
        ],
      },
      {
        path: "user/:userId/profile-info",
        element: <ProfileInfo />,
      },
      {
        path: "user/:userId/profile-decor",
        element: <ProfileDecor />,
      },
      {
        path: "user/:userId/profile-notifications",
        element: <ProfileNotifications />,
      },
      {
        path: "user/:userId/profile-account",
        element: <ProfileAccount />,
      },
    ],
  },
  {
    path: "/chat-page",
    element: <LayoutWithoutFooter />,
    children: [
      {
        index: true,
        element: <ChatPage />,
      },
    ],
  },
]);
