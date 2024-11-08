import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { AiOutlineUser } from "react-icons/ai";

function Home() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/.");
  };

  return (
    <div className="Home-container">
      <div className="Top-container">
        <a href="/home">
          <img src="Boardershub.png" alt="Logo" className="Logo-image" />
        </a>
        <div className="Nav-bar">
          <button className={`Nav-button ${window.location.pathname === '/home' ? 'active' : ''}`} onClick={() => window.location.href = '/home'}>
            Home
          </button>
          <button className={`Nav-button ${window.location.pathname === '/browse' ? 'active' : ''}`} onClick={() => window.location.href = '/browse'}>
            Browse
          </button>
          <button className={`Nav-button ${window.location.pathname === '/About' ? 'active' : ''}`} onClick={() => window.location.href = '/About'}>
            About us
          </button>
          <button className={`Nav-button ${window.location.pathname === '/Listing' ? 'active' : ''}`} onClick={() => window.location.href = '/Listing'}>
            Be a homeowner
          </button>
        </div>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <AiOutlineUser className="Profile-icon" />
          <div className={`dropdown-menu ${dropdownVisible ? 'show' : ''}`}>
            <button onClick={handleLogout} className="dropdown-item">Logout</button>
          </div>
        </div>
      </div>
      <img src="Boardershub.png" alt="Boarders Hub Logo" className="welcome-image" />
      <div className="message-box">
        <p className="message-text">
          Finding a place to call home has never been easier. At Boarder's Hub, we specialize in connecting students and professionals with trusted and verified homeowners in Cebu City to help you find the ideal space that perfectly suits your needs and lifestyle. With our intuitive search tools and comprehensive listings, browsing available rooms has never been simpler.
          <br /><br />
          Our platform isn’t just about finding a room—it’s about finding a community. Engage with a welcoming network of homeowners and fellow boarders who can offer support, insights, and shared experiences. With detailed property listings, user reviews, and secure booking options, you can confidently choose your new living space knowing that every detail has been considered for your comfort and convenience.
          <br /><br />
          Whether you're looking for a cozy spot near your school, a vibrant area with easy access to nightlife, or a peaceful neighborhood close to work, we’re committed to making your stay in Cebu City both comfortable and stress-free. Start your journey with Boarder's Hub today and find the right place to truly call home!
        </p>
      </div>
      <div className="button-container">
        <button className="browse-button" onClick={() => window.location.href = '/browse'}>
          Browse ROOMS NOW!
        </button>
        <p className="register-link">
          List your room and be part of the homeowner community today.
        </p>
        <div className="button-container-Two">
          <button className="Homeowner-button" onClick={() => window.location.href = '/Listing'}>
            BE A HOMEOWNER!
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
