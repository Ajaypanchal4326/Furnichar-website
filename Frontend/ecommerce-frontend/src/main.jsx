import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import store from "./app/store";

// THEME INITIALIZER
const applyInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme) {
      document.documentElement.classList.toggle(
        "dark",
        savedTheme === "dark"
      )
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches

      document.documentElement.classList.toggle("dark", prefersDark)
    }
  } catch (err) {
    // fallback if storage blocked
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches

    document.documentElement.classList.toggle("dark", prefersDark)
  }
}

applyInitialTheme() // CALL BEFORE REACT RENDER


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
