import React, { useState, useEffect } from "react";
import "./Properties.css"; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import { handleLogout, redirectToLoginIfLoggedOut } from "../Login/firebaseConfig";

function Properties() {
  const [expandedRoom, setExpandedRoom] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rooms, setRooms] = useState([]);  // State to hold rooms fetched from Firestore
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const roomsPerPage = 8;
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    profilePicture: "",
  });

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
          <img src={userData.profilePicture || "default-profpic.png"} alt="Profile Icon" className="Profile-icon-image" />
          <div className={`dropdown-menu ${dropdownVisible ? 'show' : ''}`}>
            <button onClick={() => navigate("/profile")} className="dropdown-item">View Profile</button>
            <button onClick={() => navigate("/AddListings")} className="dropdown-item">Add Listings</button>
            <button onClick={() => navigate("/Properties")} className="dropdown-item">View Properties</button>
            <button onClick={() => handleLogout(navigate)} className="dropdown-item">Logout</button>
          </div>
        </div>
      </div>
      {/* Content of the Browse page can go here */}
    </div>
  );
}

export default Properties;
