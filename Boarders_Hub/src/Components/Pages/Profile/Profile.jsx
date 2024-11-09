// Profile.jsx
import React from 'react';
import './Profile.css';

const Profile = () => {
    return (
        <div className="profile-container">
            <div className="profile-header">
                <img src="profile-picture-url.jpg" alt="Profile" className="profile-picture" />
                <div className="profile-details">
                    <h1 className="nickname">User  Nickname</h1>
                    <h2 className="name">User  Full Name</h2>
                </div>
            </div>
            <div className="contact-info">
                <h3>Contact Information</h3>
                {/* Add contact info here */}
            </div>
            <div className="favorites-section">
                <h3>Favorites</h3>
                {/* Add favorite properties here */}
            </div>
            <div className="property-owned-section">
                <h3>Property Owned</h3>
                <div className="properties-container-profile">
                    {/* Example property card */}
                    <div className="property-card">
                        <img src="property-image-url.jpg" alt="Property" className="recipe-photo" />
                        <div className="property-details">
                            <h4>Property Title</h4>
                            <p>Location</p>
                        </div>
                    </div>
                    {/* Add more property cards as needed */}
                </div>
            </div>
            <div className="profile-actions">
                <button className="edit-profile-button">Edit Profile</button>
                <button className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default Profile;