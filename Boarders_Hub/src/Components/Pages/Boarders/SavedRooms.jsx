import React, { useState, useEffect } from "react";
import "./SavedRooms.css";
import { AiOutlineSearch } from "react-icons/ai";
import { auth, handleRemoveRoom, fetchSavedRooms, handleLogout, redirectToLoginIfLoggedOut, useUserProfile } from "../Login/firebaseConfig";
import { useNavigate } from "react-router-dom";

function SavedRooms() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [savedRooms, setSavedRooms] = useState([]); // State to hold saved rooms
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true); // To handle loading state
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
        const user = auth.currentUser; // Get the current user
        if (user) {
          const savedRoomsData = await fetchSavedRooms(user.uid); // Fetch saved rooms from Firestore
          setSavedRooms(savedRoomsData);
        }
      } catch (error) {
        console.error("Error fetching saved rooms:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchRooms();
  }, [auth.currentUser]); // Re-fetch when auth.currentUser changes

  // Remove a saved room
  const handleRemoveRoomButton = async (roomId) => {
    const user = auth.currentUser; // Get the current user
    if (user) {
      await handleRemoveRoom(user.uid, roomId); // Call the function with userId and roomId
      const updatedRooms = savedRooms.filter((room) => room.id !== roomId);
      setSavedRooms(updatedRooms); // Update local state
      alert("Room removed from saved rooms.");
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div> {/* Add a spinner or loading animation */}
        <p>Loading your saved rooms...</p> {/* Loading text */}
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
        {filteredRooms.length > 0 ? ( // Use filteredRooms here
          <div className="saved-card-container">
            {filteredRooms.map((room) => ( // Use filteredRooms here
              <div key={room.id} className="Room-card">
                <div
                  className="Room-card-image"
                  style={{
                    backgroundImage: `url(${room.images && room.images.length > 0
                      ? room.images[0]
                      : "default-room-image.png"
                      })`,
                  }}
                ></div>

                <h2 className="Room-title">{room.RoomType || "Room Type Unavailable"}</h2>
                <p className="Room-summary">{room.shortDescription || "Description not available"}</p>
                <p className="Room-price">{room.price || "Price not listed"}</p>

                <div className="Card-footer">
                  <button
                    className="Delete-button"
                    onClick={() => handleRemoveRoomButton(room.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="SavedRoom-empty">No rooms match your search!</p> // Updated message
        )}
      </main>

    </div>
  );
}

export default SavedRooms;
