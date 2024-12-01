import React, { useState, useEffect } from "react";
import "./SavedRooms.css";
import { AiOutlineSearch } from "react-icons/ai"; 
import { handleLogout, redirectToLoginIfLoggedOut } from "../Login/firebaseConfig";
import { useNavigate } from "react-router-dom";

function SavedRooms() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [savedRooms, setSavedRooms] = useState([]);
  const navigate = useNavigate();

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
      <header className="Top-container">
        <a href="/home">
          <img src="Boardershub.png" alt="Logo" className="Logo-image" />
        </a>
        <div className="Search-wrapper">
          <AiOutlineSearch className="Search-icon" />
          <input type="text" placeholder="Search..." className="Search-bar" />
        </div>
        <nav className="Nav-bar">
          {["home", "browse", "saved-rooms", "history"].map((path) => (
            <button
              key={path}
              className={`Nav-button ${window.location.pathname === `/${path}` ? "active" : ""}`}
              onClick={() => navigate(`/${path}`)}
            >
              {path.replace("-", " ").toUpperCase()}
            </button>
          ))}
        </nav>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <img src="default-profpic.png" alt="Profile Icon" className="Profile-icon" />
          {dropdownVisible && (
            <div className="dropdown-menu">
              {["/profile", "/AddListings", "/Properties"].map((path, index) => (
                <button
                  key={index}
                  onClick={() => navigate(path)}
                  className="dropdown-item"
                >
                  {path === "/profile"
                    ? "View Profile"
                    : path === "/AddListings"
                    ? "Add Listings"
                    : "View Properties"}
                </button>
              ))}
              <button onClick={() => handleLogout(navigate)} className="dropdown-item">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main>
        <h1 className="SavedRoom-title">Your Saved Rooms</h1>
        {savedRooms.length > 0 ? (
          <div className="SavedRoom-box">
            <div className="SavedRoom-list">
              {savedRooms.map((room) => (
                <div key={room.id} className="SavedRoom-item">
                  <h2 className="SavedRoom-item-title">{room.title}</h2>
                  <p>{room.location}</p>
                  <p>{room.price}</p>
                  <button
                    className="Delete-button"
                    onClick={() => handleRemoveRoom(room.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
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
