import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { handleLogout, redirectToLoginIfLoggedOut } from "../Login/firebaseConfig";
import "./History.css";

function History() {
  const [rentalHistory, setRentalHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  // To check if currently logged out: true->redirect to login
  redirectToLoginIfLoggedOut(navigate);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("rentalHistory")) || [];
    setRentalHistory(history.reverse()); // Show latest first
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleDelete = (index) => {
    const updatedHistory = rentalHistory.filter((_, i) => i !== index);
    setRentalHistory(updatedHistory);
    localStorage.setItem("rentalHistory", JSON.stringify(updatedHistory.reverse()));
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtered history based on search query
  const filteredHistory = rentalHistory.filter((entry) =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="History-container">
      {/* Top container with logo, search bar, and navigation */}
      <div className="Top-container">
        <a href="/home">
          <img src="Boardershub.png" alt="Logo" className="Logo-image" />
        </a>
        <div className="Search-wrapper">
          <AiOutlineSearch className="Search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="Search-bar"
            value={searchQuery} // Bind input value to searchQuery
            onChange={handleSearchChange} // Handle input change
          />
        </div>
        <div className="Nav-bar">
          <button className={`Nav-button ${window.location.pathname === '/home' ? 'active' : ''}`} onClick={() => window.location.href = '/home'}>Home</button>
          <button className={`Nav-button ${window.location.pathname === '/browse' ? 'active' : ''}`} onClick={() => window.location.href = '/browse'}>Browse</button>
          <button className={`Nav-button ${window.location.pathname === '/saved-rooms' ? 'active' : ''}`} onClick={() => window.location.href = '/saved-rooms'}>Saved Rooms</button>
          <button className={`Nav-button ${window.location.pathname === '/history' ? 'active' : ''}`} onClick={() => window.location.href = '/history'}>Boarding History</button>
        </div>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <img src="default-profpic.png" alt="Profile Icon" className="Profile-icon-image" />
          <div className={`dropdown-menu ${dropdownVisible ? 'show' : ''}`}>
            <button onClick={() => navigate("/profile")} className="dropdown-item">View Profile</button>
            <button onClick={() => navigate("/add-listing")} className="dropdown-item">Add Listings</button>
            <button onClick={() => navigate("/view-properties")} className="dropdown-item">View Properties</button>
            <button onClick={() => handleLogout(navigate)} className="dropdown-item">Logout</button>
          </div>
        </div>
      </div>

      {/* Boarding History Section */}
      <h1 className="History-title">Boarding History</h1>
      {filteredHistory.length === 0 ? (
        <p className="History-empty">No matching rental history found.</p>
      ) : (
        <div className="History-box">
          <div className="History-list">
            {filteredHistory.map((entry, index) => (
              <div key={index} className="History-item">
                <h2 className="History-item-title">{entry.title}</h2>
                <p><strong>Location:</strong> {entry.location}</p>
                <p><strong>Check-In Date:</strong> {entry.checkInDate}</p>
                <p><strong>Status:</strong> {entry.status}</p>
                <button className="Delete-button" onClick={() => handleDelete(index)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
