import './App.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { router } from './router/Routers'
import Footer from '../shared/ui/footer/Footer'

function App() {

  return (
    <>
    <ToastContainer />
    <RouterProvider router={router} />
    <Footer/>
    </>
  )
}

export default App
