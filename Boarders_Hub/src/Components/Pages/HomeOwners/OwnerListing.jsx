import React, { useState, useEffect } from "react";
import "./OwnerListing.css"; // Import the CSS file
import { AiOutlineSearch } from "react-icons/ai"; // Import the icon
import { AiOutlineUser } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

function OwnerListing() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const handleViewProfile = () => {
    // Handle view profile action (e.g., navigate to profile page)
    navigate("/profile");
  };
  /////////////////////////////////////////////////////////////////////// this block is for login persistence
  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token, redirect to login page
      navigate("/");
    }
  }, [navigate]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    // Remove token from localStorage and redirect to login page
    localStorage.removeItem("token");
    navigate("/");
  };
  /////////////////////////////////////////////////////////////////////// this block is for login persistence

  return (
    <div className="Owner-container">
      <div className="Top-container">
        <a href="/home">
          <img
            src="Boardershub.png"
            alt="Logo"
            className="Logo-image"
          />
        </a>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <AiOutlineUser className="Profile-icon" />
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

export default OwnerListing;
