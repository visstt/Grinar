import './App.css'
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { router } from './router/Routers'
import Footer from '../shared/ui/footer/Footer'

function App() {

  return (
    <>
    <RouterProvider router={router} />
    <Footer/>
    </>
  )
}

export default App
