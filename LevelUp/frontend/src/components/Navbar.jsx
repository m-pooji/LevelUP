// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { FaHome, FaBolt } from 'react-icons/fa'; // 1. Import icons
import './Navbar.css';

function Navbar() {
  const appTitle = "LevelUP";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* 2. Left Side: Home Icon (links to homepage) */}
        <Link to="/" className="navbar-icon-link">
          <FaHome />
        </Link>
        
        {/* 3. Center: Title + Icon (also links to homepage) */}
        <Link to="/" className="navbar-logo">
          <FaBolt className="navbar-logo-icon" />
          <span className="navbar-logo-text">{appTitle}</span>
        </Link>
        
        {/* 4. Right Side: Placeholder to balance the layout */}
        <div className="navbar-right-placeholder"></div>
      </div>
    </nav>
  );
}

export default Navbar;