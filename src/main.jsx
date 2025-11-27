import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import "core-js/stable";
import "regenerator-runtime/runtime";

// navigator.serviceWorker.register("/public/firebase-messaging-sw.js");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch((err) => {
      console.log("Service worker registration failed, error:", err);
    });
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <App />
  </>
);
