// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // <-- MUST import these
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';         // <-- MUST import your new page
import DashboardPage from './pages/DashboardPage'; // <-- MUST import your new page

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        {/* This <Routes> block is what "listens" to the URL */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard/:userId" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;