import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import useMyProfile from "./hooks/useMyProfile";
import Subscriptions from "./profileComponents/Subscriptions/Subscriptions";
import MyProjects from "./profileComponents/myProjects/MyProjects";
import ProfileMainInfo from "./profileComponents/profileMainInfo/ProfileMainInfo";
import ProfileTitle from "./profileComponents/profileTitle/ProfileTitle";

export default function ProfilePage() {
  const { profile, loading, error } = useMyProfile();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("main");

  useEffect(() => {
    if (location.pathname === "/profile/projects") setActiveTab("projects");
    else if (location.pathname === "/profile/subscriptions")
      setActiveTab("subscriptions");
    else if (
      location.pathname === "/profile/main" ||
      location.pathname === "/profile"
    )
      setActiveTab("main");
    else setActiveTab("main");
  }, [location.pathname]);

  if (loading) return <div>Загрузка...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>Ошибка: {error?.message || error}</div>
    );
  if (!profile) return null;

  return (
    <>
      <div style={{ marginBottom: 80 }}>
        <ProfileTitle />
      </div>
      {/* Кнопки навигации убраны, используются только из ProfileTitle */}
      {activeTab === "main" && <ProfileMainInfo />}
      {activeTab === "projects" && <MyProjects />}
      {activeTab === "subscriptions" && (
        <Subscriptions
          subscriptions={profile.followings?.subscriptions || []}
        />
      )}
    </>
  );
}
