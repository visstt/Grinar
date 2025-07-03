import './App.css'
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { router } from './router/Routers'
function App() {

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
