import React, { useEffect, useState } from "react";

import { useLocation, useParams } from "react-router-dom";

import { useUserProfile } from "./hooks/useUserProfile";
import UserProfileTitle from "./userProfileComponents/UserProfileTitle";
import UserMyBlogs from "./userProfileComponents/userMyBlogs/UserMyBlogs";
import UserMyProjects from "./userProfileComponents/userMyProjects/UserMyProjects";
import UserProfileMainInfo from "./userProfileComponents/userProfileMainInfo/UserProfileMainInfo";
import UserSubscriptions from "./userProfileComponents/userSubscriptions/UserSubscriptions";

export default function UserProfile() {
  const { userId } = useParams();
  const { userProfile, loading, error } = useUserProfile(userId);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("main");

  useEffect(() => {
    if (location.pathname === `/user/${userId}/projects`)
      setActiveTab("projects");
    else if (location.pathname === `/user/${userId}/blogs`)
      setActiveTab("blogs");
    else if (location.pathname === `/user/${userId}/subscriptions`)
      setActiveTab("subscriptions");
    else if (
      location.pathname === `/user/${userId}/main` ||
      location.pathname === `/user/${userId}`
    )
      setActiveTab("main");
    else setActiveTab("main");
  }, [location.pathname, userId]);

  if (loading) return <div>Загрузка...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>Ошибка: {error?.message || error}</div>
    );
  if (!userProfile) return null;

  return (
    <>
      <div style={{ marginBottom: 80 }}>
        <UserProfileTitle userProfile={userProfile} />
      </div>

      {activeTab === "main" && (
        <UserProfileMainInfo userProfile={userProfile} />
      )}
      {activeTab === "projects" && <UserMyProjects userProfile={userProfile} />}
      {activeTab === "blogs" && <UserMyBlogs userProfile={userProfile} />}
      {activeTab === "subscriptions" && (
        <UserSubscriptions
          subscriptions={userProfile.followings?.subscriptions || []}
          userProfile={userProfile}
        />
      )}
    </>
  );
}
