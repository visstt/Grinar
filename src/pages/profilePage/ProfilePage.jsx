import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import Loader from "../../shared/ui/components/Loader/Loader";
import useMyProfile from "./hooks/useMyProfile";
import Subscriptions from "./profileComponents/Subscriptions/Subscriptions";
import MyBlogs from "./profileComponents/myBlogs/MyBlogs";
import MyProjects from "./profileComponents/myProjects/MyProjects";
import ProfileMainInfo from "./profileComponents/profileMainInfo/ProfileMainInfo";
import ProfileTitle from "./profileComponents/profileTitle/ProfileTitle";

export default function ProfilePage({ tab }) {
  const { profile, loading, error } = useMyProfile();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(tab || "main");

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else if (location.pathname.includes("/projects"))
      setActiveTab("projects");
    else if (location.pathname.includes("/blogs")) setActiveTab("blogs");
    else if (location.pathname.includes("/subscriptions"))
      setActiveTab("subscriptions");
    else if (location.pathname.includes("/main")) setActiveTab("main");
    else setActiveTab("main");
  }, [location.pathname, tab]);

  if (loading) return <Loader />;
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
      {activeTab === "main" && <ProfileMainInfo />}
      {activeTab === "projects" && <MyProjects />}
      {activeTab === "blogs" && <MyBlogs />}
      {activeTab === "subscriptions" && (
        <Subscriptions
          subscriptions={profile.followings?.subscriptions || []}
        />
      )}
    </>
  );
}
