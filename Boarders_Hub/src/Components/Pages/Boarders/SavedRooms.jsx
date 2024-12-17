import React, { useState, useEffect } from "react";
import "./SavedRooms.css";
import { AiOutlineSearch } from "react-icons/ai";
import { auth, handleRemoveRoom, fetchSavedRooms, handleLogout, redirectToLoginIfLoggedOut, useUserProfile } from "../Login/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { BsBookmarkFill } from "react-icons/bs";

function Modal({ room, onClose }) {
  const [showAllImages, setShowAllImages] = useState(true);
  const user = auth.currentUser;
  const userId = user.uid;
  const navigate = useNavigate();

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('Modal-overlay')) {
      onClose();
    }
  };

  // Handle Rent request and other button actions
  const handleRentNow = () => {
    alert("You have clicked Rent Now!");
    onClose();
  };

  const handleEditListing = (roomId) => {
    navigate("/edit", { state: { roomId } });
  };

  const handleContactOwner = () => {
    alert("Contacting the owner...");
  };

  return (
    <div className="Modal-overlay" onClick={handleOverlayClick}>
      <div className="Modal-content">
        <button className="Close-button" onClick={onClose}>✖</button>
        <h2>{room.RoomType}</h2>
        <p><strong>Location:</strong> {room.location}</p>
        <p><strong>Price:</strong> {room.price}</p>
        <p><strong>Details:</strong> {room.details}</p>
        {/* Safely access room.owner */}
        <p><strong>Owner:</strong> {room.owner ? room.owner.fullName : 'Owner details not available'}</p>
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

        <div className="Modal-buttons-container">
          {userId !== room.ownerId ? (
            <>
              <button className="Rent-button" onClick={handleRentNow}>Rent now</button>
              <button className="Contact-button" onClick={handleContactOwner}>Contact Owner</button>
            </>
          ) : (
            <>
              <p>You are the owner of this room.</p>
              <button className="Contact-button" onClick={() => handleEditListing(room.id)}>Edit listing</button>
              <button className="Rent-button" onClick={onClose}>Go back</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SavedRooms() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [savedRooms, setSavedRooms] = useState([]);
  const [expandedRoom, setExpandedRoom] = useState(null); // State to manage the expanded room
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ profilePicture: "" });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = savedRooms.filter((room) =>
    room.RoomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.price.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useUserProfile(setUserData, navigate);
  redirectToLoginIfLoggedOut(navigate);

  // Fetch saved rooms when the component mounts
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const savedRoomsData = await fetchSavedRooms(user.uid);
          setSavedRooms(savedRoomsData);
        }
      } catch (error) {
        console.error("Error fetching saved rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [auth.currentUser]);

  // Remove a saved room
  const handleRemoveRoomButton = async (roomId) => {
    const user = auth.currentUser;
    if (user) {
      await handleRemoveRoom(user.uid, roomId);
      const updatedRooms = savedRooms.filter((room) => room.id !== roomId);
      setSavedRooms(updatedRooms);
      alert("Room removed from saved rooms.");
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleOpenModal = (room) => {
    setExpandedRoom(room);
  };

  const handleCloseModal = () => {
    setExpandedRoom(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your saved rooms...</p>
      </div>
    );
  }

  return (
    <div className="SavedRoom-container">
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="Nav-bar">
          <button
            className={`Nav-button ${window.location.pathname === "/home" ? "active" : ""}`}
            onClick={() => (window.location.href = "/home")}
          >
            Home
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/browse" ? "active" : ""}`}
            onClick={() => (window.location.href = "/browse")}
          >
            Browse
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/saved-rooms" ? "active" : ""}`}
            onClick={() => (window.location.href = "/saved-rooms")}
          >
            Saved Rooms
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/history" ? "active" : ""}`}
            onClick={() => (window.location.href = "/history")}
          >
            Boarding History
          </button>
        </div>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <img src={userData.profilePicture || "default-profpic.png"} alt="Profile Icon" className="Profile-icon-image" />
          <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
            <button onClick={() => navigate("/profile")} className="dropdown-item">
              View Profile
            </button>
            <button onClick={() => navigate("/AddListings")} className="dropdown-item">
              Add Listings
            </button>
            <button onClick={() => navigate("/Properties")} className="dropdown-item">
              View Properties
            </button>
            <button onClick={() => handleLogout(navigate)} className="dropdown-item">
              Logout
            </button>
          </div>
        </div>
      </div>
      <main>
        <h1 className="SavedRoom-title">Your Saved Rooms</h1>
        {filteredRooms.length > 0 ? (
          <div className="saved-card-container">
            {filteredRooms.map((room) => (
              <div key={room.id} className="Room-card" onClick={() => handleOpenModal(room)}>
                <div
                  className="Room-card-image"
                  style={{
                    backgroundImage: `url(${room.images && room.images.length > 0 ? room.images[0] : "default-room-image.png"})`,
                  }}
                ></div>
                <h2 className="Room-title">{room.RoomType || "Room Type Unavailable"}</h2>
                <p className="Room-summary">{room.shortDescription || "Description not available"}</p>
                <p className="Room-summary">{room.price || "Price not listed"}</p>
                <div className="Card-footer">
                  <button className="Delete-button" onClick={() => handleRemoveRoomButton(room.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="SavedRoom-empty">No rooms match your search!</p>
        )}
      </main>
      {expandedRoom && <Modal room={expandedRoom} onClose={handleCloseModal} />}
    </div>
  );
}

export default SavedRooms;
