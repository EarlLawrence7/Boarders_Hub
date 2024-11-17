import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Login/firebaseConfig"; // Firebase Auth import
import { getDoc, doc } from "firebase/firestore"; // Firestore import
import { db } from "../Login/firebaseConfig"; // Firestore configuration
import { onAuthStateChanged, signOut } from "firebase/auth"; // Auth state listener
import "./Profile.css";

function Profile() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userData, setUserData] = useState({
    nickname: "",
    fullName: "",
    email: "",
    phone: "",
    birthday: "",
    profilePicture: "", // Added for storing profile picture URL
  });
  const [isEditing, setIsEditing] = useState(false); // Track if in edit mode
  const navigate = useNavigate();

  // Fetch user data and handle authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { email, phoneNumber } = user;

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userDetails = userDoc.data();
            setUserData({
              fullName: userDetails.username || "No Full Name",
              nickname: userDetails.username || "No Nickname",
              email: userDetails.email || email || "No Email",
              phone: userDetails.phone || phoneNumber || "No Phone Number",
              birthday: `${userDetails.birthDate?.day || "--"}/${
                userDetails.birthDate?.month || "--"
              }/${userDetails.birthDate?.year || "--"}`,
              profilePicture: userDetails.profilePicture || "", // Get profile picture from Firestore
            });
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        navigate("/"); // Navigate to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      navigate("/"); // Navigate to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev); // Toggle edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Add logic to update Firestore with the new userData here
    console.log("Saving changes:", userData);
    setIsEditing(false); // Exit edit mode
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserData((prevData) => ({
          ...prevData,
          profilePicture: reader.result, // Store the base64 string of the uploaded image
        }));
      };
      reader.readAsDataURL(file); // Convert the image to a base64 string
    }
  };

  return (
    <div className="Profile-container">
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
            className={`Nav-button ${window.location.pathname === "/About" ? "active" : ""}`}
            onClick={() => (window.location.href = "/About")}
          >
            About us
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/Listing" ? "active" : ""}`}
            onClick={() => (window.location.href = "/Listing")}
          >
            Be a homeowner
          </button>
        </div>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <img src="default-profpic.png" alt="Profile Icon" className="Profile-icon-image" />
          <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
            <button onClick={handleLogout} className="dropdown-item">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="Profile-info">
        <div className="Profile-details">
          <div className="profile-picture-container">
            <img
              src={userData.profilePicture || "default-profpic.png"}
              alt="Profile"
              className="profile-picture"
            />
          </div>
          <div className="text-container">
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="nickname"
                  value={userData.nickname}
                  onChange={handleInputChange}
                  className="edit-input"
                />
                <input
                  type="text"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleInputChange}
                  className="edit-input"
                />
                <div className="button-group">
                  <label htmlFor="file-upload" className="upload-btn">
                    Upload Picture
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    className="edit-profile-btn"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  
                </div>

              </>
            ) : (
              <>
                <h1 className="nickname">{userData.nickname}</h1>
                <h2 className="name">{userData.fullName}</h2>
                <button
                  className="edit-profile-btn"
                  onClick={handleEditToggle}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        <div className="contact-info">
          <h1>Contact Information</h1>
          <div className="contact-details">
            {isEditing ? (
              <>
                <p>
                  <strong>Phone:</strong>{" "}
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <input
                    type="text"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                </p>
                <p>
                  <strong>Birthday:</strong>{" "}
                  <input
                    type="text"
                    name="birthday"
                    value={userData.birthday}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Phone:</strong> {userData.phone}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Birthday:</strong> {userData.birthday}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Favorites Section */}
        <div className="favorites">
          <h1>Favorites</h1>
          <p>List of user favorites will go here.</p>
        </div>

        {/* Properties Owned Section */}
        <div className="properties-owned">
          <h1>Properties Owned</h1>
          <p>List of properties the user owns will go here.</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
