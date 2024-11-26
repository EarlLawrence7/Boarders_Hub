import React, { useState, useEffect } from "react";
import "./Properties.css"; // Import the CSS file
import { auth } from '../Login/firebaseConfig';  // Ensure this import is correct
import { getAuth, signOut } from "firebase/auth"; // Firebase Auth import
import { useNavigate } from 'react-router-dom';

function Properties() {
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

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Redirect to login page
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle any potential error during logout
    }
  };
  /////////////////////////////////////////////////////////////////////// this block is for login persistence

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
