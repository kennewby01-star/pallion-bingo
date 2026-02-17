// Deployment Timestamp: 2024-05-20T20:00:00.000Z - Version 1.9 ULTIMATE
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Critical mounting error:", error);
    rootElement.innerHTML = `<div style="color: white; padding: 20px; font-family: sans-serif;">Error loading app: ${error}</div>`;
  }
}