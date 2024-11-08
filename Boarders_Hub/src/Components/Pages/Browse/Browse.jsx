import React, { useState, useEffect } from "react";
import "./Browse.css"; // Import the CSS file
import { AiOutlineSearch } from "react-icons/ai"; // Import the icon
import { AiOutlineUser } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

function Browse() {
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
    <div className="Browse-container">
      <div className="Top-container">
        <a href="/home">
          <img
            src="Boardershub.png"
            alt="Logo"
            className="Logo-image"
          />
        </a>
        <div className="Search-wrapper">
          <AiOutlineSearch className="Search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="Search-bar"
          />
        </div>
        <div className="Nav-bar">
          <button
            className={`Nav-button ${window.location.pathname === '/home' ? 'active' : ''}`}
            onClick={() => window.location.href = '/home'}
          >
            Home
          </button>
          <button
            className={`Nav-button ${window.location.pathname === '/browse' ? 'active' : ''}`}
            onClick={() => window.location.href = '/browse'}
          >
            Browse
          </button>
          <button
            className={`Nav-button ${window.location.pathname === '/saved-rooms' ? 'active' : ''}`}
            onClick={() => window.location.href = '/saved-rooms'}
          >
            Saved Rooms
          </button>
        </div>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <AiOutlineUser className="Profile-icon" />
          <div className={`dropdown-menu ${dropdownVisible ? 'show' : ''}`}>
            <button onClick={handleViewProfile} className="dropdown-item">View profile</button>
            <button onClick={handleLogout} className="dropdown-item">Logout</button>
          </div>
        </div>
      </div>
      {/* Content of the Browse page can go here */}
    </div>
  );
}

export default Browse;
