import React, { useState, useEffect } from "react";
import "./Browse.css"; // Import the CSS file
import { FaArrowRight } from 'react-icons/fa'; // Import the arrow icon
import { AiOutlineSearch } from "react-icons/ai"; // Import the search icon
import { auth, doc, db, setDoc, arrayUnion, handleLogout, redirectToLoginIfLoggedOut, useUserProfile, fetchListings } from '../Login/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { BsBookmarkFill } from "react-icons/bs";

function Modal({ room, onClose }) {
  const [showRentModal, setShowRentModal] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const user = auth.currentUser;
  const userId = user.uid;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('Modal-overlay')) {
      onClose();
    }
  };

  const handleOpenRentModal = (room) => {
    setShowRentModal(room);
  };

  const handleCloseRentModal = () => {
    setShowRentModal(null);
  };

  const handleContactOwner = () => {
    setShowContactModal(true);
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
          <button className="More-button" onClick={handleSeeMore}>
            See More... <FaArrowRight className="More-button-icon" />
          </button>
        )}
        <div className="Modal-buttons-container">
          {userId !== room.ownerId ? (
            <>
              <button className="Rent-button" onClick={() => handleOpenRentModal(room)}>Rent now</button>
              <button className="Contact-button" onClick={handleContactOwner}>Contact Owner</button>
            </>
          ) : (
            <>
              <p>You are the owner of this room.</p>
              <button className="Contact-button" onClick={null}>Edit listing</button>
              <button className="Rent-button" onClick={onClose}>Go back</button>
            </>
          )}
        </div>
      </div>
      {showContactModal && (
        <div className="Contact-modal-overlay">
          <div className="Contact-modal">
            <button className="Close-button" onClick={() => setShowContactModal(false)}>X</button>
            <h2>Contact the Owner below</h2>
            <p><strong>Name:</strong> {room.owner.fullName}</p>
            <p><strong>Email:</strong> {room.owner.email}</p>
            <p><strong>Phone:</strong> {room.owner.phone}</p>
            <div className="Social-links">
            </div>
          </div>
        </div>
      )}
      {showRentModal && <RentModal room={showRentModal} onClose={handleCloseRentModal} />}
    </div>
  );
}

function RentModal({ room, onClose }) {
  const user = auth.currentUser;
  const userId = user.uid;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('Modal-overlay')) {
      onClose();
    }
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
      </div>
    </div>
  );
}

function Browse() {
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

  // Fetch room data from Firestore using fetchListings
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomList = await fetchListings(); // Use fetchListings to get room data
        setRooms(roomList); // Update state with fetched room data
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  // Pagination logic
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

  // Function to save a room to the user's savedRooms array
const handleSave = async (roomId) => {
  try {
    const user = auth.currentUser; // Get the current authenticated user
    if (user) {
      const userDocRef = doc(db, "users", user.uid); // Reference to the user's document in Firestore

      // Check if savedRooms array exists, if not, create it
      await setDoc(
        userDocRef,
        {
          savedRooms: arrayUnion(roomId), // Append roomId to savedRooms array
        },
        { merge: true } // Use merge to avoid overwriting other user data
      );

      console.log("Room saved to savedRooms array.");
    } else {
      console.log("User is not authenticated.");
    }
  } catch (error) {
    console.error("Error saving room:", error);
  }
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="Nav-bar">
          <button className={`Nav-button ${window.location.pathname === '/home' ? 'active' : ''}`} onClick={() => window.location.href = '/home'}>
            Home
          </button>
          <button className={`Nav-button ${window.location.pathname === '/browse' ? 'active' : ''}`} onClick={() => window.location.href = '/browse'}>
            Browse
          </button>
          <button className={`Nav-button ${window.location.pathname === '/saved-rooms' ? 'active' : ''}`} onClick={() => window.location.href = '/saved-rooms'}>
            Saved Rooms
          </button>
          <button className={`Nav-button ${window.location.pathname === '/history' ? 'active' : ''}`} onClick={() => window.location.href = '/history'}>
            Boarding History
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
      <div className="Room-card-container">
        {currentRooms.map((room) => (
          <div key={room.id} className="Room-card">
            <div className="Room-card-image" style={{ backgroundImage: `url(${room.images[0]})` }}></div>
            <h2 className="Room-title">{room.RoomType}</h2>
            <p className="Room-summary">{room.shortDescription}</p>
            <div className="Card-footer">
              {room.owner.profilePicture ? (
                <div className="Profile-picture-container">
                  <img
                    src={room.owner.profilePicture}
                    alt={`${room.owner.fullName}'s profile`}
                    className="Profile-picture"
                  />
                </div>
              ) : (
                <div className="Profile-placeholder">
                  {room.owner.fullName ? room.owner.fullName.split(' ').map(name => name.charAt(0).toUpperCase()).join('') : 'NA'}
                </div>
              )}
              <button className="Details-button" onClick={() => handleOpenModal(room)}>
                See Details
              </button>
              <div className="Save-icon" onClick={() => handleSave(room.id)}>
                <BsBookmarkFill />
                <span className="Tooltip-text">Save Room</span>
              </div>
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
