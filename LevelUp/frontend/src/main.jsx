// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- MUST be imported
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* This <BrowserRouter> is what "activates" the router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);