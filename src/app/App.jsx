import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import { router } from "./router/Routers";
import useAuthTokenGuard from "./useAuthTokenGuard";

function App() {
  useAuthTokenGuard();
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
