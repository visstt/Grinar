import React from "react";

import { Outlet } from "react-router-dom";

import { CreateArticleProvider } from "./context/CreateArticleContext";

export default function CreateArticleLayout() {
  return (
    <CreateArticleProvider>
      <Outlet />
    </CreateArticleProvider>
  );
}
