/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-ignore
import React from "react";
//@ts-ignore
import ReactDOM from "react-dom/client";
import App from "./studio_app";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY is not set");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

// Use contextBridge
//@ts-ignore
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
