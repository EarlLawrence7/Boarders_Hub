import React, { useState } from "react";
import "./Browse.css"; // Import the CSS file

function Home() {
  return (
    <div className="Browse-container">
      <div className="Top-container">
        <img
          src="Boardershub.png"
          alt="Logo"
          className="Logo-image"
        />
        <input
          type="text"
          placeholder="Search..."
          className="Search-bar"
        />
        <div className="Nav-bar">
          <span>Home</span>
          <span>Browse</span>
          <span>Saved Rooms</span>
        </div>
        <img
          src="froggyBrain.png"
          alt="Profile"
          className="Profile-image"
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}

export default Home;
