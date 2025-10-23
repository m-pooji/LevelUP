// src/pages/HomePage.jsx
import React from 'react';
import AuthCard from '../components/AuthCard';
import './HomePage.css'; // We'll create this

function HomePage() {
  return (
    <div className="homepage-container">
      {/* This is the left side description */}
      <div className="homepage-description">
        <h1 className="description-title">
          Turn Your Tasks into Triumphs.
        </h1>
        <p className="description-text">
          Welcome to <strong>LevelUP</strong>, the only to-do list
          that rewards your productivity. Complete tasks,
          gain XP, and watch your skills grow.
          Stop just *doing* tasks—start *conquering* them.
        </p>
      </div>

      {/* This is the right side AuthCard */}
      <AuthCard />
    </div>
  );
}

export default HomePage;