import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import App from "./App.tsx";
import AppProvider from "./context/AppProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <AppProvider>
        <App />
      </AppProvider>
    </HeroUIProvider>
  </React.StrictMode>,
);
