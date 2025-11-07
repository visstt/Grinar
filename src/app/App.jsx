import React from "react";

import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CookieModal from "../shared/ui/components/modal/CookieModal";
import FirstVisitModal from "../shared/ui/components/modal/FirstVisitModal";
import "./App.css";
import { router } from "./router/Routers";
import useAuthTokenGuard from "./useAuthTokenGuard";

function App() {
  useAuthTokenGuard();
  const [showFirstVisitModal, setShowFirstVisitModal] = React.useState(false);

  React.useEffect(() => {
    const firstVisitShown = localStorage.getItem("firstVisitModalShown");
    if (!firstVisitShown) {
      setShowFirstVisitModal(true);
    }
  }, []);

  const handleCloseFirstVisitModal = () => {
    localStorage.setItem("firstVisitModalShown", "true");
    setShowFirstVisitModal(false);
  };
  return (
    <>
      <FirstVisitModal
        open={showFirstVisitModal}
        onClose={handleCloseFirstVisitModal}
      />
      <ToastContainer />
      <RouterProvider router={router} />
      <CookieModal />
    </>
  );
}

export default App;
