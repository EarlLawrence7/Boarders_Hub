import React, { useState, useEffect } from "react";
import "./Browse.css"; // Import the CSS file
import { AiOutlineSearch } from "react-icons/ai"; // Import the icon
import { AiOutlineUser } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';


function Browse() {
  const [expandedRoomId, setExpandedRoomId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const handleViewProfile = () => {
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
  const toggleRoomDetails = (roomId) => {
    setExpandedRoomId(expandedRoomId === roomId ? null : roomId);
  };
  // Sample room data
  const rooms = [
    {
      id: 1,
      title: "Cozy Apartment Near University",
      shortDescription: "A fully furnished 1-bedroom apartment perfect for students.",
      location: "Cebu City, near XYZ University",
      price: "₱10,000/month",
      details: "Includes Wi-Fi, air conditioning, and a study area.",
      owner: "John Doe"
    },
    {
      id: 2,
      title: "Modern Condo Unit in Downtown",
      shortDescription: "A stylish condo unit close to major offices.",
      location: "Downtown Cebu City",
      price: "₱15,000/month",
      details: "24/7 security, pool access, and gym facilities.",
      owner: "Jane Smith"
    },
    {
      id: 3,
      title: "Shared Room for Budget-Friendly Stay",
      shortDescription: "A shared room option ideal for budget-conscious boarders.",
      location: "Cebu City, near ABC Mall",
      price: "₱5,000/month",
      details: "Utilities included, shared kitchen, and common living area.",
      owner: "Alice Johnson"
    },
    {
      id: 4,
      title: "Spacious 2-Bedroom Apartment",
      shortDescription: "Perfect for a small group or family.",
      location: "Cebu City, near DEF Park",
      price: "₱20,000/month",
      details: "Pet-friendly, parking space, and a balcony with a view.",
      owner: "Robert Lee"
    }
  ];

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
          <button
            className={`Nav-button ${window.location.pathname === '/history ' ? 'active' : ''}`}
            onClick={() => window.location.href = '/history'}
          >
            Boarding History
          </button>
        </div>
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
      <div className="Room-card-container">
        {rooms.map(room => (
          <div key={room.id} className="Room-card">
            <h2 className="Room-title">{room.title}</h2>
            <p className="Room-summary">{room.shortDescription}</p>
            {expandedRoomId === room.id && (
              <div className="Room-details">
                <p><strong>Location:</strong> {room.location}</p>
                <p><strong>Price:</strong> {room.price}</p>
                <p><strong>Details:</strong> {room.details}</p>
                <p><strong>Owner:</strong> {room.owner}</p>
              </div>
            )}
            <button className="Details-button" onClick={() => toggleRoomDetails(room.id)}>
              {expandedRoomId === room.id ? "Hide Details" : "See Details"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Browse;
