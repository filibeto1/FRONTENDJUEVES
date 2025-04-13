import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Solución: Elimina React.StrictMode temporalmente para diagnóstico
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />); // Eliminado StrictMode

reportWebVitals();