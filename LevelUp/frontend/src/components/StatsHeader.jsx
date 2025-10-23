// src/components/StatsHeader.jsx
import React from 'react';
import './StatsHeader.css';

function StatsHeader({ user }) {
  if (!user) {
    return <div className="stats-header-loading">Loading stats...</div>;
  }

  // --- NEW: Add this logic ---
  // This formula must match the one in DashboardPage.jsx
  const xpToNextLevel = user.level * 100;
  // Calculate the XP the user still needs
  const xpRemaining = xpToNextLevel - user.xp;
  // Create the hover text
  const tooltipText = `More ${xpRemaining} XP for next level!`;
  // --- End of new logic ---

  return (
    <div className="stats-header">
      <h2 className="stats-welcome">Welcome back, {user.username}!</h2>
      <div className="stats-info">

        {/* UPDATED: We added the 'title' attribute and a new className */}
        <div 
          className="stat-item stat-level-tooltip" 
          title={tooltipText}
        >
          <span className="stat-label">LEVEL</span>
          <span className="stat-value">{user.level}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">XP</span>
          <span className="stat-value">{user.xp} XP</span>
        </div>
      </div>
    </div>
  );
}

export default StatsHeader;