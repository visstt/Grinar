import { createBrowserRouter } from "react-router-dom";
import HomePage from "../../pages/homePage/HomePage";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },])