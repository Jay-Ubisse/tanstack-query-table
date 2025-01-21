import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ReactQueryProvider from "./providers/react-query.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </StrictMode>
);
