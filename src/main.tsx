import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupGlobalErrorHandling } from "./utils/errorHandling";

// Setup global error handling
setupGlobalErrorHandling();

const rootElement = document.getElementById("root");
if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    
    // Emergency fallback if the app fails to render
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: system-ui;">
        <h2>Something went wrong</h2>
        <p>We're having trouble loading the application.</p>
        <button onclick="window.location.reload()" style="padding: 8px 16px; cursor: pointer; margin-top: 20px;">
          Reload Page
        </button>
      </div>
    `;
  }
} else {
  console.error('Root element not found');
}
