
import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Iniciando aplicación Agendes Yeca 2025...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("No se encontró el elemento #root");
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("Mounting App successful");
