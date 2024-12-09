import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  handleLogout,
  redirectToLoginIfLoggedOut,
  useUserProfile,
} from "../Login/firebaseConfig";
import ContactUs from "../ContactUs/ContactUs"; // Make sure the path is correct
import ChatBot from "../ChatBot/ChatBot"; // Import the ChatBot component
import "./Home.css";

function Home() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false); // Modal state
  const [showChatBot, setShowChatBot] = useState(false); // State to toggle ChatBot visibility
  const navigate = useNavigate();

  // To check if currently logged out: true -> redirect to login
  redirectToLoginIfLoggedOut(navigate);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const [userData, setUserData] = useState({
    profilePicture: "", // Storing profile picture URL
  });

  // Use the custom hook to fetch user profile picture
  useUserProfile(setUserData, navigate);

  const toggleContactModal = () => {
    setShowContactModal(true); // Trigger modal visibility
  };

  const toggleChatBot = () => {
    setShowChatBot(!showChatBot); // Toggle visibility of the ChatBot
  };

  const goToAboutUs = () => {
    navigate("/about-us"); // Navigate to the AboutUs page
  };

  return (
    <div className="Home-container">
      <div className="Top-container">
        <a href="/home">
          <img src="Boardershub.png" alt="Logo" className="Logo-image" />
        </a>
        <div className="Nav-bar">
          <button
            className={`Nav-button ${
              window.location.pathname === "/home" ? "active" : ""
            }`}
            onClick={() => window.location.href = "/home"}
          >
            Home
          </button>
          <button
            className={`Nav-button ${
              window.location.pathname === "/browse" ? "active" : ""
            }`}
            onClick={() => window.location.href = "/browse"}
          >
            Browse
          </button>
          <button
            className={`Nav-button ${
              window.location.pathname === "/about-us" ? "active" : ""
            }`}
            onClick={goToAboutUs} // Navigate to About Us
          >
            About us
          </button>
          <button
            className={`Nav-button ${
              window.location.pathname === "/Contact" ? "active" : ""
            }`}
            onClick={toggleContactModal} // Trigger Contact Us modal
          >
            Contact Us
          </button>
          <button
            className={`Nav-button ${
              window.location.pathname === "/Privacy" ? "active" : ""
            }`}
            onClick={() => window.location.href = "/Privacy"}
          >
            Privacy Policy
          </button>
          <button
            className={`Nav-button ${
              window.location.pathname === "/owner-listing" ? "active" : ""
            }`}
            onClick={() => window.location.href = "/AddListings"}
          >
            Be a homeowner
          </button>
        </div>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <img
            src={userData.profilePicture || "default-profpic.png"}
            alt="Profile Icon"
            className="Profile-icon-image"
          />
          <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
            <button
              onClick={() => navigate("/profile")}
              className="dropdown-item"
            >
              View Profile
            </button>
            <button
              onClick={() => navigate("/AddListings")}
              className="dropdown-item"
            >
              Add Listings
            </button>
            <button
              onClick={() => navigate("/view-tenants")}
              className="dropdown-item"
            >
              View Tenants
            </button>
            <button
              onClick={() => navigate("/Properties")}
              className="dropdown-item"
            >
              View Properties
            </button>
            <button
              onClick={() => handleLogout(navigate)}
              className="dropdown-item"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <img
        src="Boarders_hub-removebg.png"
        alt="Boarders Hub Logo"
        className="welcome-image"
      />
      <div className="message-box">
        <p className="message-text">
          Finding a place to call home has never been easier. At Boarder's Hub,
          we specialize in connecting students and professionals with trusted
          and verified homeowners in Cebu City to help you find the ideal space
          that perfectly suits your needs and lifestyle. With our intuitive
          search tools and comprehensive listings, browsing available rooms has
          never been simpler.
          <br />
          <br />
          Our platform isn’t just about finding a room—it’s about finding a
          community. Engage with a welcoming network of homeowners and fellow
          boarders who can offer support, insights, and shared experiences.
          With detailed property listings, user reviews, and secure booking
          options, you can confidently choose your new living space knowing
          that every detail has been considered for your comfort and
          convenience.
          <br />
          <br />
          Whether you're looking for a cozy spot near your school, a vibrant
          area with easy access to nightlife, or a peaceful neighborhood close
          to work, we’re committed to making your stay in Cebu City both
          comfortable and stress-free. Start your journey with Boarder's Hub
          today and find the right place to truly call home!
        </p>
      </div>

      <div className="button-container">
        <button
          className="browse-button"
          onClick={() => window.location.href = "/browse"}
        >
          Browse ROOMS NOW!
        </button>
        <p className="register-link">
          List your room and be part of the homeowner community today.
        </p>
        <div className="button-container-Two">
          <button
            className="Homeowner-button"
            onClick={() => window.location.href = "/AddListings"}
          >
            BE A HOMEOWNER!
          </button>
        </div>
        <div className="small-images">
          <img
            src="Easy to use.png"
            alt="Small Image 1"
            className="small-image"
          />
          <img
            src="engaging.png"
            alt="Small Image 2"
            className="small-image"
          />
          <img
            src="Approved.png"
            alt="Small Image 3"
            className="small-image"
          />
        </div>
      </div>

      {/* ChatBot Button */}
      <button className="chatbot-button" onClick={toggleChatBot}>
        Chat with Us
      </button>

      {/* Include the ChatBot Component */}
      {showChatBot && <ChatBot />}

      {/* Include the Contact Us modal here */}
      <ContactUs showModal={showContactModal} setShowModal={setShowContactModal} />
    </div>
  );
}

export default Home;
