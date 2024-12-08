import React, { useState, useEffect } from "react";
import "./Properties.css"; // Import the CSS file
import { FaArrowRight } from 'react-icons/fa'; // Import the arrow icon
import { AiOutlineSearch } from "react-icons/ai"; // Import the search icon
import { auth, handleLogout, redirectToLoginIfLoggedOut, useUserProfile, fetchListings } from '../Login/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Modal({ room, onClose }) {
  const [showAllImages, setShowAllImages] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('Modal-overlay')) {
      onClose();
    }
  };

  const handleRentNow = () => {
    const history = JSON.parse(localStorage.getItem("rentalHistory")) || [];
    history.push({
      title: room.title,
      location: room.location,
      checkInDate: new Date().toLocaleDateString(),
      status: "Pending",
    });
    localStorage.setItem("rentalHistory", JSON.stringify(history));
    alert(`You have chosen to rent: ${room.title}`);
    onClose();
  };

  const handleSeeMore = () => {
    setShowAllImages(true);
  };

  return (
    <div className="Modal-overlay" onClick={handleOverlayClick}>
      <div className="Modal-content">
        <button className="Close-button" onClick={onClose}>X</button>
        <h2>{room.RoomType}</h2>
        <p><strong>Location:</strong> {room.location}</p>
        <p><strong>Price:</strong> {room.price}</p>
        <p><strong>Details:</strong> {room.details}</p>
        <p><strong>Owner:</strong> {room.owner.fullName}</p>
        {room.images && room.images.length > 0 && (
          <div className="Room-images">
            <img src={room.images[0]} alt="Room Image" />
            {showAllImages && room.images.length > 1 && (
              <div className="Room-images-scrollable">
                {room.images.slice(1).map((image, index) => (
                  <img key={index} src={image} alt={`Room Image ${index + 1}`} />
                ))}
              </div>
            )}
          </div>
        )}
        {room.images.length > 1 && !showAllImages && (
          <button className="More-button1" onClick={handleSeeMore}>
            See More... <FaArrowRight className="More-button-icon" />
          </button>
        )}
        <div className="Modal-buttons-container1">
          <button className="Edit-button" onClick={handleRentNow}>Edit listing</button>
        </div>
      </div>
    </div>
  );
}

function Properties() {
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rooms, setRooms] = useState([]);  // State to hold rooms fetched from Firestore
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const roomsPerPage = 8;
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    profilePicture: "",
  });

  useUserProfile(setUserData, navigate);
  redirectToLoginIfLoggedOut(navigate);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomList = await fetchListings(); // Fetch all rooms
        const userEmail = auth.currentUser.email; // Get the logged-in user's email
        const userOwnedRooms = roomList.filter(room => room.owner.email === userEmail); // Filter by email
        setRooms(userOwnedRooms); // Update state with filtered rooms
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOpenModal = (room) => {
    setExpandedRoom(room);
  };

  const handleCloseModal = () => {
    setExpandedRoom(null);
  };

  const handleViewRequests = (room) => {
    navigate("/view-requests", { state: { room } });
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
        <div className="Search-wrapper">
          <AiOutlineSearch className="Search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="Search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="Nav-bar">
          <button
            className="Nav-button"
            onClick={handleGoBack}
          >
            Go back
          </button>
        </div>
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
      <div className="Room-card-container1">
        {currentRooms.map((room) => (
          <div key={room.id} className="Room-card1">
            <div className="Room-card-image1" style={{ backgroundImage: `url(${room.images[0]})` }}></div>
            <h2 className="Room-title">{room.RoomType}</h2>
            <p className="Room-summary">{room.shortDescription}</p>
            <div className="Card-footer1">
              <button className="Pendings-button" onClick={() => handleViewRequests(room)}>
                View Requests
              </button>
              <button className="Pendings-button" onClick={() => handleOpenModal(room)}>
                See details
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

export default Properties;
