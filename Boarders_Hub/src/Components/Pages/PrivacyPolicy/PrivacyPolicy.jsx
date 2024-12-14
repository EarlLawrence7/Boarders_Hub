import React, { useState } from 'react';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(prevState => !prevState);
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
            onClick={() => (window.location.href = "/about-us")}
          >
            About Us
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/Contact" ? "active" : ""}`}
            onClick={() => (window.location.href = "/Contact")}
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
            src="default-profpic.png" // Replace with dynamic userData if available
            alt="Profile Icon"
            className="Profile-icon-image"
          />
          {/* Use inline styles for controlling dropdown visibility */}
          <div 
            className={`dropdown-menu ${dropdownVisible ? "show" : ""}`} 
            style={{ display: dropdownVisible ? 'block' : 'none' }}
          >
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
            <button onClick={() => alert('Logout functionality')} className="dropdown-item">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="privacy-policy-page-container">
        <h1 className="privacy-policy-page-title">Privacy Policy for Boarding Hub</h1>

        <p className="privacy-policy-page-introduction">
          At Boarding Hub, accessible from BoardersHub.com, we prioritize the privacy of our users. This Privacy Policy document outlines the types of information we collect and how we use it. By using our services, you agree to the collection and use of information in accordance with this policy.
        </p>

        <section className="privacy-policy-page-section">
          <h2 className="privacy-policy-page-section-title">Information We Collect</h2>
          <ul>
            <li><strong>Personal Information:</strong> When you register on our platform, we collect personal details such as your name, email address, phone number, and payment information. Information related to your profile, including the type of property you are listing or renting, preferences, and browsing history on our site.</li>
            <li><strong>Usage Data:</strong> We collect information about how you interact with our website, including IP addresses, browser type, page views, and referral URLs. This data helps us analyze trends and improve the user experience.</li>
            <li><strong>Location Data:</strong> We may collect your location data to help you find available properties in your area. This data is used only with your consent and can be disabled through your device settings.</li>
          </ul>
        </section>

        <section className="privacy-policy-page-section">
          <h2 className="privacy-policy-page-section-title">How We Use Your Information</h2>
          <ul>
            <li>To personalize your experience and tailor our services to your needs.</li>
            <li>To process your rental transactions, payments, and bookings.</li>
            <li>To communicate with you regarding your account, inquiries, and notifications about updates or offers.</li>
            <li>To improve the functionality of our platform and optimize user experience.</li>
            <li>To ensure compliance with legal requirements and prevent fraud.</li>
          </ul>
        </section>

        <section className="privacy-policy-page-section">
          <h2 className="privacy-policy-page-section-title">Data Retention</h2>
          <p>We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy. If you choose to delete your account, we will retain your data only as required by law or for legitimate business purposes.</p>
        </section>

        <section className="privacy-policy-page-section">
          <h2 className="privacy-policy-page-section-title">Cookies</h2>
          <p>We use cookies to enhance your experience on our website. Cookies are small files stored on your device that help us understand how you interact with our platform, remember your preferences, and improve the user experience. You can disable cookies through your browser settings, but this may limit the functionality of our website.</p>
        </section>

        <section className="privacy-policy-page-section">
          <h2 className="privacy-policy-page-section-title">Sharing Your Information</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. However, we may share your information with trusted third parties who assist us in operating our platform, conducting business, or servicing you, as long as they agree to keep this information confidential. We may also share your information when required by law or to protect the rights, property, or safety of Boarding Hub or its users.</p>
        </section>

        <section className="privacy-policy-page-section">
          <h2 className="privacy-policy-page-section-title">Security</h2>
          <p>We take the security of your personal information seriously and implement industry-standard security measures to protect your data. While we strive to ensure that your data remains safe, please understand that no method of transmission over the internet or electronic storage is 100% secure.</p>
        </section>

        <section className="privacy-policy-page-section">
          <h2 className="privacy-policy-page-section-title">Your Rights</h2>
          <ul>
            <li>Access, update, or delete your personal information.</li>
            <li>Request a copy of your data in a portable format.</li>
            <li>Withdraw consent for us to collect your data (where applicable).</li>
            <li>Opt out of marketing communications at any time.</li>
          </ul>
          <p>To exercise these rights, please contact us at our email boardershub@gmail.com.</p>
        </section>

        <section className="privacy-policy-page-section">
          <h2 className="privacy-policy-page-section-title">Third-Party Links</h2>
          <p>Our website may contain links to third-party websites. Please note that we are not responsible for the privacy practices of these websites. We encourage you to review their privacy policies before providing any personal information.</p>
        </section>

        <section className="privacy-policy-page-section">
          <h2 className="privacy-policy-page-section-title">Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. Any changes will be posted on this page with the updated date. Please review this policy periodically for any updates.</p>
        </section>

        <section className="privacy-policy-page-section">
          <h2 className="privacy-policy-page-section-title">Contact Us</h2>
          <ul>
            <li><strong>Email:</strong> boardershub@gmail.com</li>
            <li><strong>Address:</strong> Cebu Institute of Technology - University (CITU)
            N. Bacalso Ave, Cebu City, 6000, Philippines</li>
            <li><strong>Phone Number:</strong> 09XXXXXXXXX</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
