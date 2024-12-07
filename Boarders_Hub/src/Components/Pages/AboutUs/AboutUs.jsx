import React, { useState } from "react";
import "./AboutUs.css";

function AboutUs() {
  // State to control dropdown visibility
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Placeholder user data
  const userData = {
    profilePicture: null, // Replace with actual profile picture URL or leave null for default
  };

  // Functions to handle button actions
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    // Logic for logout
    console.log("Logging out...");
    window.location.href = "/login"; // Redirect to login
  };

  const goToAboutUs = () => {
    window.location.href = "/about-us";
  };

  const toggleContactModal = () => {
    alert("Contact Us modal triggered!"); // Replace with actual modal logic
  };

  return (
    <div className="Home-container">
      <div className="Top-container">
        <a href="/home">
          <img src="Boardershub.png" alt="Logo" className="Logo-image" />
        </a>
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
            className={`Nav-button ${window.location.pathname === "/about-us" ? "active" : ""}`}
            onClick={goToAboutUs}
          >
            About Us
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/Contact" ? "active" : ""}`}
            onClick={toggleContactModal}
          >
            Contact Us
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/Privacy" ? "active" : ""}`}
            onClick={() => (window.location.href = "/Privacy")}
          >
            Privacy Policy
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/owner-listing" ? "active" : ""}`}
            onClick={() => (window.location.href = "/AddListings")}
          >
            Be a Homeowner
          </button>
        </div>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <img
            src={userData.profilePicture || "default-profpic.png"}
            alt="Profile Icon"
            className="Profile-icon-image"
          />
          <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
            <button onClick={() => (window.location.href = "/profile")} className="dropdown-item">
              View Profile
            </button>
            <button onClick={() => (window.location.href = "/AddListings")} className="dropdown-item">
              Add Listings
            </button>
            <button onClick={() => (window.location.href = "/view-tenants")} className="dropdown-item">
              View Tenants
            </button>
            <button onClick={() => (window.location.href = "/Properties")} className="dropdown-item">
              View Properties
            </button>
            <button onClick={handleLogout} className="dropdown-item">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="AboutUs-content">
  <div className="AboutUs-inner-container">
    <h1 className="AboutUs-title">About Us</h1>
    <p className="AboutUs-description">
    Welcome to our project! We are a team of seven students from H2 and Group 1 working on a platform
            that simplifies room rentals and management. This project is for our CPEPE361 class, and we are
            excited to present our work!
    </p>

    <div className="Team-info">
  <h2 className="Team-title">Meet Our Team</h2>
  <ul className="Team-members-list">
    <li className="Team-member">
      <img
        src="/src/Components/Aboutuspictures/arbien.jpg"
        alt="Arbien M. Armenion"
        className="Team-member-img"
      />
      <div className="Team-member-name">Arbien M. Armenion</div>
      <div className="Team-member-role">Co-Frontend Developer</div>
    </li>
    <li className="Team-member">
      <img
        src="/src/Components/Aboutuspictures/dan.jpg"
        alt="Dan Vincent Y. Adlawan"
        className="Team-member-img"
      />
      <div className="Team-member-name">Dan Vincent Y. Adlawan</div>
      <div className="Team-member-role">Co-Frontend Developer</div>
    </li>
    <li className="Team-member">
      <img
        src="/src/Components/Aboutuspictures/daryl.jpg"
        alt="Daryl D. Butar"
        className="Team-member-img"
      />
      <div className="Team-member-name">Daryl D. Butar</div>
      <div className="Team-member-role">Main Backend Developer</div>
    </li>
    <li className="Team-member">
      <img
        src="/src/Components/Aboutuspictures/jeremiah.jpg"
        alt="Jeremiah Calbario"
        className="Team-member-img"
      />
      <div className="Team-member-name">Jeremiah Calbario</div>
      <div className="Team-member-role">Co-Backend Developer</div>
    </li>
    <li className="Team-member">
      <img
        src="/src/Components/Aboutuspictures/earl.jpg"
        alt="Earl Lawrence O. Baguio"
        className="Team-member-img"
      />
      <div className="Team-member-name">Earl Lawrence O. Baguio</div>
      <div className="Team-member-role">Main Frontend Developer</div>
    </li>
    <li className="Team-member">
      <img
        src="/src/Components/Aboutuspictures/Nicko.jpg"
        alt="Nicko Louis Adora"
        className="Team-member-img"
      />
      <div className="Team-member-name">Nicko Louis Adora</div>
      <div className="Team-member-role">Co-Frontend Developer</div>
    </li>
    <li className="Team-member">
      <img
        src="/src/Components/Aboutuspictures/Daniel image.jpg"
        alt="Daniel Montesclaros"
        className="Team-member-img"
      />
      <div className="Team-member-name">Daniel M. Montesclaros</div>
      <div className="Team-member-role">Co-Frontend Developer & Tester</div>
    </li>
  </ul>
</div>


    <div className="Project-info">
      <h2 className="Project-title">Our Project</h2>
      <p className="Project-description">
      This project aims to create a platform for easy room rentals and management, providing an efficient and user-friendly experience for homeowners and tenants. Our goal is to streamline the rental process, making it easier for both parties to manage listings, payments, and communication.
      </p>
    </div>
  </div>
</div>
</div> // Close Home-container
  );
}

export default AboutUs;
