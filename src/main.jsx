import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import DevPasswordGate from "../src/shared/DevPasswordGate.jsx";
import App from "./app/App.jsx";
import "./app/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DevPasswordGate>
      <App />
    </DevPasswordGate>
  </StrictMode>,
);
