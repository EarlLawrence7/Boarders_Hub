import React, { useState, useEffect } from "react";
import "./SavedRooms.css";
import { AiOutlineSearch } from "react-icons/ai";
import { auth, handleLogout, redirectToLoginIfLoggedOut, useUserProfile, fetchListings } from '../Login/firebaseConfig';
import { useNavigate } from "react-router-dom";

function SavedRooms() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [savedRooms, setSavedRooms] = useState([]);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    profilePicture: "",
  });
  useUserProfile(setUserData, navigate);
  redirectToLoginIfLoggedOut(navigate);

  // Redirect if not logged in
  redirectToLoginIfLoggedOut(navigate);

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("savedRooms")) || [];
    setSavedRooms(storedRooms);
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleRemoveRoom = (roomId) => {
    const updatedRooms = savedRooms.filter((room) => room.id !== roomId);
    setSavedRooms(updatedRooms);
    localStorage.setItem("savedRooms", JSON.stringify(updatedRooms));
    alert("Room removed from saved rooms.");
  };

  return (
    <div className="SavedRoom-container">
      <div className="Top-container">
        <a href="/home">
          <img src="Boardershub.png" alt="Logo" className="Logo-image" />
        </a>
        <div className="Search-wrapper">
          <AiOutlineSearch className="Search-icon" />
          <input type="text" placeholder="Search..." className="Search-bar" />
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
      <main>
  <h1 className="SavedRoom-title">Your Saved Rooms</h1>
  {savedRooms.length > 0 ? (
    <div className="saved-card-container">
      {savedRooms.map((room) => (
        <div key={room.id} className="Room-card">
          {/* Add room image here if available */}
          <div className="Room-card-image" style={{ backgroundImage: `url(${room.images[0]})` }}></div>
          
          <h2 className="Room-title">{room.RoomType}</h2>
          <p className="Room-summary">{room.shortDescription}</p>
          <p className="Room-price">{room.price}</p>

          {/* Profile Picture or Placeholder */}
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
                {room.owner.fullName
                  ? room.owner.fullName.split(' ').map(name => name.charAt(0).toUpperCase()).join('')
                  : 'NA'}
              </div>
            )}
            
            {/* Remove button */}
            <button
              className="Delete-button"
              onClick={() => handleRemoveRoom(room.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="SavedRoom-empty">
      You have no saved rooms yet. Start saving your favorite listings!
    </p>
  )}
</main>
    </div>
  );
}

export default SavedRooms;
