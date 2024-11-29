import React, { useState } from "react";
import "./SavedRooms.css"; // Import the CSS file
import { AiOutlineSearch } from "react-icons/ai"; // Import the search icon
import { handleLogout, redirectToLoginIfLoggedOut, useUserProfile } from "../Login/firebaseConfig";
import { useNavigate } from "react-router-dom";

function SavedRooms() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  // Redirect if not logged in
  redirectToLoginIfLoggedOut(navigate);

  const [userData, setUserData] = useState({
    profilePicture: "", // Storing profile picture URL
  });
  // Use the custom hook to fetch user profile picture
  useUserProfile(setUserData, navigate);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="saved-rooms-container">
      <header className="top-container">
        <a href="/home">
          <img src="Boardershub.png" alt="Logo" className="logo-image" />
        </a>
        <div className="search-wrapper">
          <AiOutlineSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
          />
        </div>
        <nav className="nav-bar">
          {["home", "browse", "saved-rooms", "history"].map((path) => (
            <button
              key={path}
              className={`nav-button ${window.location.pathname === `/${path}` ? "active" : ""}`}
              onClick={() => navigateTo(`/${path}`)}
            >
              {path.replace("-", " ").toUpperCase()}
            </button>
          ))}
        </nav>
        <div className="profile-icon-wrapper" onClick={toggleDropdown}>
          <img src={userData.profilePicture || "default-profpic.png"} alt="Profile Icon" className="Profile-icon-image" />
          {dropdownVisible && (
            <div className="dropdown-menu">
              {["/profile", "/AddListings", "/Properties"].map((path, index) => (
                <button
                  key={index}
                  onClick={() => navigateTo(path)}
                  className="dropdown-item"
                >
                  {path === "/profile"
                    ? "View Profile"
                    : path === "/AddListings"
                    ? "Add Listings"
                    : "View Properties"}
                </button>
              ))}
              <button
                onClick={() => handleLogout(navigate)}
                className="dropdown-item"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main>
        {/* Add Saved Rooms content here */}
        <h1>Your Saved Rooms</h1>
        <p>Start saving your favorite listings to view them here later.</p>
      </main>
    </div>
  );
}

export default SavedRooms;
