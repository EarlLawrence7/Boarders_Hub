import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import "./Profile.css";

function Profile() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    // Handle edit profile action (e.g., navigate to edit profile page)
    navigate("/edit-profile");
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
    <div className="Profile-container">
      <div className="Top-container">
        <a href="/home">
          <img src="Boardershub.png" alt="Logo" className="Logo-image" />
        </a>
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
            className={`Nav-button ${window.location.pathname === '/About' ? 'active' : ''}`}
            onClick={() => window.location.href = '/About'}
          >
            About us
          </button>
          <button
            className={`Nav-button ${window.location.pathname === '/Listing' ? 'active' : ''}`}
            onClick={() => window.location.href = '/Listing'}
          >
            Be a homeowner
          </button>
        </div>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <img src="default-profpic.png" alt="Profile Icon" className="Profile-icon-image" />
          <div className={`dropdown-menu ${dropdownVisible ? 'show' : ''}`}>
            <button onClick={handleLogout} className="dropdown-item">Logout</button>
          </div>
        </div>
      </div>

      <div className="Profile-info">
        <div className="Profile-details">
          <img src="default-profpic.png" alt="Profile" className="profile-picture" />
          <div className="text-container">
            <h1 className="nickname">User Nickname</h1>
            <h2 className="name">User Full Name</h2>
            
            {/* Edit Profile Button */}
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="contact-info">
          <h1>Contact Information</h1>
          <div className="contact-details">
            <p><strong>Phone:</strong> +1234567890</p>
            <p><strong>Email:</strong> user@example.com</p>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="favorites">
          <h1>Favorites</h1>
          <p>List of user favorites will go here.</p>
        </div>

        {/* Properties Owned Section */}
        <div className="properties-owned">
          <h1>Properties Owned</h1>
          <p>List of properties the user owns will go here.</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
