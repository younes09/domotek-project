import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Nettoyage automatique des anciens Service Workers (PWA) sur localhost
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

