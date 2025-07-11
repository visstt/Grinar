import { BrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Footer from "../shared/ui/components/footer/Footer";
import "./App.css";
import { router } from "./router/Routers";
import useAuthTokenGuard from "./useAuthTokenGuard";

function App() {
  useAuthTokenGuard(); // Проверка токена при старте приложения
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
      <Footer />
    </>
  );
}

export default App;
