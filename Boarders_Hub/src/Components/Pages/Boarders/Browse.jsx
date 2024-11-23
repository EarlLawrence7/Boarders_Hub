import React, { useState, useEffect } from "react";
import "./Browse.css"; // Import the CSS file
import { FaArrowRight } from 'react-icons/fa'; // Import the arrow icon
import { AiOutlineSearch } from "react-icons/ai"; // Import the icon
import { auth } from '../Login/firebaseConfig';  // Ensure this import is correct
import { getAuth, signOut } from "firebase/auth"; // Firebase Auth import
import { useNavigate } from 'react-router-dom';

function Modal({ room, onClose }) {
  const handleRentNow = () => {
    alert(`You have chosen to rent: ${room.title}`);
    // Add any additional logic for the "Rent now" action, such as redirecting or making an API call.
  };

  const handleContactOwner = () => {
    alert(`Contacting owner: ${room.owner}`);
    // You can replace this with actual contact logic like opening an email client, chat, etc.
  };
  const handleSeeMore = () => {
    alert(`See More: ${room.owner}`);
    // You can replace this with actual contact logic like opening an another window or tab for more detailed informations.
  };

  return (
    <div className="Modal-overlay">
      <div className="Modal-content">
        <button className="Close-button" onClick={onClose}>X</button>
        <h2>{room.title}</h2>
        <p><strong>Location:</strong> {room.location}</p>
        <p><strong>Price:</strong> {room.price}</p>
        <p><strong>Details:</strong> {room.details}</p>
        <p><strong>Owner:</strong> {room.owner}</p>
        <button className="More-button" onClick={handleSeeMore}>
          See More... <FaArrowRight className="More-button-icon" />
        </button>
        <div className="Modal-buttons-container">
          <button className="Rent-button" onClick={handleRentNow}>Rent now</button>
          <button className="Contact-button" onClick={handleContactOwner}>Contact Owner</button>
        </div>
      </div>
    );
  }
  
function Browse() {
  const [expandedRoom, setExpandedRoom] = useState(null); // Fix: Initialize the state here
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);  // State for current page
  const roomsPerPage = 8;  // Updated to 8 rooms per page
  const navigate = useNavigate();

  /////////////////////////////////////////////////////// Sample room data
  const rooms = [
    {
      id: 1,
      title: "Cozy Apartment Near University",
      shortDescription: "A fully furnished 1-bedroom apartment perfect for students.",
      location: "Cebu City, near XYZ University",
      price: "₱10,000/month",
      details: "Includes Wi-Fi, air conditioning, and a study area.",
      owner: "Ayorrnnn",
      profilePicture: "download (1).jpg"
    },
    {
      id: 2,
      title: "Modern Condo Unit in Downtown",
      shortDescription: "A stylish condo unit close to major offices.",
      location: "Downtown Cebu City",
      price: "₱15,000/month",
      details: "24/7 security, pool access, and gym facilities.",
      owner: "Jane Smith",
      profilePicture: "catttooo.jpg"
    },
    {
      id: 3,
      title: "Shared Room for Budget-Friendly Stay",
      shortDescription: "Utilities included, shared kitchen Perfect for a small group or family.",
      location: "Cebu City, near ABC Mall",
      price: "₱5,000/month",
      details: "Utilities included, shared kitchen, and common living area.",
      owner: "Alice Johnson",
      profilePicture: "sample2.jpg"
    },
    {
      id: 4,
      title: "Spacious 2-Bedroom Apartment",
      shortDescription: "Perfect for a small group or family.",
      location: "Cebu City, near DEF Park",
      price: "₱20,000/month",
      details: "Pet-friendly, parking space, and a balcony with a view.",
      owner: "Robert Lee",
      profilePicture: "download.jpg"
    },

    {
      id: 5,
      title: "Spacious 2-Bedroom Apartment",
      shortDescription: "Perfect for a small group or family.",
      location: "Cebu City, near DEF Park",
      price: "₱20,000/month",
      details: "Pet-friendly, parking space, and a balcony with a view.",
      owner: "Robert Lee",
      profilePicture: "2x2 ideas (1).jpg"
    },
    {
      id: 6,
      title: "Spacious 2-Bedroom Apartment",
      shortDescription: "Perfect for a small group or family.",
      location: "Cebu City, near DEF Park",
      price: "₱20,000/month",
      details: "Pet-friendly, parking space, and a balcony with a view.",
      owner: "Robert Lee",
      profilePicture: " download (3).jpg"
    },
    {
      id: 7,
      title: "Spacious 2-Bedroom Apartment",
      shortDescription: "Perfect for a small group or family.",
      location: "Cebu City, near DEF Park",
      price: "₱20,000/month",
      details: "Pet-friendly, parking space, and a balcony with a view.",
      owner: "Robert Lee",
      profilePicture: "download (2).jpg"
    },
    {
      id: 8,
      title: "Spacious 2-Bedroom Apartment",
      shortDescription: "Perfect for a small group or family.",
      location: "Cebu City, near DEF Park",
      price: "₱20,000/month",
      details: "Pet-friendly, parking space, and a balcony with a view.",
      owner: "Earl Baguio"
    },
    {
      id: 9,
      title: "Spacious 2-Bedroom Apartment",
      shortDescription: "Perfect for a small group or family.",
      location: "Cebu City, near DEF Park",
      price: "₱20,000/month",
      details: "Pet-friendly, parking space, and a balcony with a view.",
      owner: "Robert Lee"
    },
    {
      id: 10,
      title: "Spacious 2-Bedroom Apartment",
      shortDescription: "Perfect for a small group or family.",
      location: "Cebu City, near DEF Park",
      price: "₱20,000/month",
      details: "Pet-friendly, parking space, and a balcony with a view.",
      owner: "Robert Lee"
    },
    {
      id: 11,
      title: "Spacious 2-Bedroom Apartment",
      shortDescription: "Perfect for a small group or family.",
      location: "Cebu City, near DEF Park",
      price: "₱20,000/month",
      details: "Pet-friendly, parking space, and a balcony with a view.",
      owner: "Robert Lee"
    },
    {
      id: 12,
      title: "Spacious 2-Bedroom Apartment",
      shortDescription: "Perfect for a small group or family.",
      location: "Cebu City, near DEF Park",
      price: "₱20,000/month",
      details: "Pet-friendly, parking space, and a balcony with a view.",
      owner: "Robert Lee"
    },

  ];
  /////////////////////////////////////////////////////////// sample room data

  // Pagination logic: calculate the rooms to show on the current page
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  // Handle page change
  const nextPage = () => {
    if (currentPage * roomsPerPage < rooms.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };
  /////////////////////////////////////////////////////////////////////// this block is for login persistence
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);
  /////////////////////////////////////////////////////////////////////// this block is for login persistence

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

  const handleOpenModal = (room) => {
    setExpandedRoom(room); // Fix: Ensure this sets the room object to `expandedRoom`
  };

  const handleCloseModal = () => {
    setExpandedRoom(null);
  };


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
            className={`Nav-button ${window.location.pathname === '/history' ? 'active' : ''}`}
            onClick={() => window.location.href = '/history'}
          >
            Boarding History
          </button>
        </div>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <img src="default-profpic.png" alt="Profile Icon" className="Profile-icon-image" />
          <div className={`dropdown-menu ${dropdownVisible ? 'show' : ''}`}>
            <button onClick={() => navigate("/profile")} className="dropdown-item">View Profile</button>
            <button onClick={() => navigate("/add-listing")} className="dropdown-item">Add Listings</button>
            <button onClick={() => navigate("/view-properties")} className="dropdown-item">View Properties</button>
            <button onClick={handleLogout} className="dropdown-item">Logout</button>
          </div>
        </div>
      </div>
      <div className="Room-card-container">
        {currentRooms.map((room) => (
          <div key={room.id} className="Room-card">
            <h2 className="Room-title">{room.title}</h2>
            <p className="Room-summary">{room.shortDescription}</p>
            <div className="Card-footer">
              {room.profilePicture ? (
                <img
                  src={room.profilePicture}
                  alt={`${room.owner}'s profile`}
                  className="Profile-picture"
                />
              ) : (
                <div className="Profile-placeholder">
                  {room.owner.split(' ').map(name => name.charAt(0).toUpperCase()).join('')}
                </div>
              )}
              <button className="Details-button" onClick={() => handleOpenModal(room)}>
                See Details
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="Pagination-container">
        <button className="Pagination-button" onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button className="Pagination-button" onClick={nextPage} disabled={currentPage * roomsPerPage >= rooms.length}>
          Next
        </button>
      </div>
      {expandedRoom && <Modal room={expandedRoom} onClose={handleCloseModal} />}
    </div>
  );
}

export default Browse;
