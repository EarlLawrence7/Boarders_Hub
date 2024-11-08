import React, { useState } from "react";
import "./Home.css"; // Import the CSS file

function Home() {
  return (
    <div className="home-container">
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

      <h1 className="home-header">Welcome to</h1>
      <img src="Boardershub.png" alt="Boarders Hub Logo" className="welcome-image" />
      <div className="message-box">
        <p className="message-text">
          Finding a place to call home has never been easier. At Boarders Hub, we connect students and professionals with trusted homeowners in Cebu City to help you find the ideal space that fits your needs and lifestyle. Browse available rooms, connect with a welcoming community, and book your new home with ease.
          <br /><br />
          Whether you're looking for a cozy spot close to school or a convenient location near work, we’re here to make your stay comfortable and stress-free. Start exploring today and discover the right place to call home!
        </p>
      </div>
    </div>
  );
}

export default Home;
