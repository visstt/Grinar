import React, { useEffect, useState } from "react";

import { useLocation, useParams } from "react-router-dom";

import Subscriptions from "../profilePage/profileComponents/Subscriptions/Subscriptions";
import MyProjects from "../profilePage/profileComponents/myProjects/MyProjects";
import ProfileMainInfo from "../profilePage/profileComponents/profileMainInfo/ProfileMainInfo";
import { useUserProfile } from "./hooks/useUserProfile";
import UserProfileTitle from "./userProfileComponents/UserProfileTitle";

export default function UserProfile() {
  const { userId } = useParams();
  const { userProfile, loading, error } = useUserProfile(userId);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("main");

  useEffect(() => {
    if (location.pathname === `/user/${userId}/projects`)
      setActiveTab("projects");
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
      
      {activeTab === "main" && <ProfileMainInfo userProfile={userProfile} />}
      {activeTab === "projects" && <MyProjects userProfile={userProfile} />}
      {activeTab === "subscriptions" && (
        <Subscriptions
          subscriptions={userProfile.followings?.subscriptions || []}
        />
      )}
    </>
  );
}
