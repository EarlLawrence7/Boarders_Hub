import React, { useState, useEffect } from "react";
import "./Properties.css"; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import { handleLogout, redirectToLoginIfLoggedOut } from "../Login/firebaseConfig";

function Properties() {
  const navigate = useNavigate();
  
  // To check if currently logged out: true->redirect to login
  redirectToLoginIfLoggedOut(navigate);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const handleViewProfile = () => {
    // Handle view profile action (e.g., navigate to profile page)
    navigate("/profile");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="Properties-container">
      <div className="Top-container">
        <a href="/home">
          <img
            src="Boardershub.png"
            alt="Logo"
            className="Logo-image"
          />
        </a>
        
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <img src="default-profpic.png" alt="Profile Icon" className="Profile-icon-image" />
          <div className={`dropdown-menu ${dropdownVisible ? 'show' : ''}`}>
            <button onClick={handleViewProfile} className="dropdown-item">View Profile</button>
            <button onClick={handleViewProfile} className="dropdown-item">Add Listings</button>
            <button onClick={handleViewProfile} className="dropdown-item">View Tenants</button>
            <button onClick={handleViewProfile} className="dropdown-item">View Properties</button>
            <button onClick={handleLogout} className="dropdown-item">Logout</button>
          </div>
        </div>
      </div>
      {/* Content of the Browse page can go here */}
    </div>
  );
}

export default Properties;
