import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./History.css";

function History() {
  const [rentalHistory, setRentalHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 5;
  // Filter rooms based on search query

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("rentalHistory")) || [];
    setRentalHistory(history.reverse());
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    // Implement logout functionality
  };

  const handleDelete = (index) => {
    const itemToDelete = rentalHistory[index];
    if (itemToDelete.status === "Pending") {
      alert("Cannot delete rentals with a Pending status.");
      return;
    }

    const updatedHistory = rentalHistory.filter((_, i) => i !== index);
    setRentalHistory(updatedHistory);
    localStorage.setItem("rentalHistory", JSON.stringify(updatedHistory.reverse()));
  };

  const handleCancel = (index) => {
    const updatedHistory = rentalHistory.map((entry, i) => {
      if (i === index) {
        return { ...entry, status: "Cancelled" };
      }
      return entry;
    });

    setRentalHistory(updatedHistory);
    localStorage.setItem("rentalHistory", JSON.stringify(updatedHistory.reverse()));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredHistory = rentalHistory.filter((entry) =>
    entry.title && entry.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="History-container">
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
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="Nav-bar">
          <button
            className={`Nav-button ${window.location.pathname === "/home" ? "active" : ""}`}
            onClick={() => window.location.href = "/home"}
          >
            Home
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/browse" ? "active" : ""}`}
            onClick={() => window.location.href = "/browse"}
          >
            Browse
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/saved-rooms" ? "active" : ""}`}
            onClick={() => window.location.href = "/saved-rooms"}
          >
            Saved Rooms
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/history" ? "active" : ""}`}
            onClick={() => window.location.href = "/history"}
          >
            Boarding History
          </button>
        </div>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <img src="default-profpic.png" alt="Profile Icon" className="Profile-icon-image" />
          <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
            <button onClick={() => navigate("/profile")} className="dropdown-item">View Profile</button>
            <button onClick={() => navigate("/add-listing")} className="dropdown-item">Add Listings</button>
            <button onClick={() => navigate("/view-tenants")} className="dropdown-item">View Tenants</button>
            <button onClick={() => navigate("/view-properties")} className="dropdown-item">View Properties</button>
            <button onClick={handleLogout} className="dropdown-item">Logout</button>
          </div>
        </div>
      </div>

      <h1 className="History-title">Boarding History</h1>

      {filteredHistory.length === 0 ? (
        <p className="History-empty">No matching rental history found.</p>
      ) : (
        <div className="History-box">
          {currentItems.map((entry, index) => (
            <div key={index} className="History-item">
              <h2 className="History-item-title">{entry.title}</h2>
              <p><strong>Location:</strong> {entry.location}</p>
              <p><strong>Check-In Date:</strong> {entry.checkInDate}</p>
              <p><strong>Status:</strong> {entry.status}</p>
              <button
                className="Cancel-button"
                onClick={() => handleCancel(index + startIndex)}
                disabled={entry.status === "Cancelled"}
              >
                {entry.status === "Cancelled" ? "Cancelled" : "Cancel Rent"}
              </button>
              <button
                className="Delete-button"
                onClick={() => handleDelete(index + startIndex)}
                disabled={entry.status === "Pending"}
              >
                {entry.status === "Pending" ? "Cannot Delete" : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="History-pagination">
        <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default History;
