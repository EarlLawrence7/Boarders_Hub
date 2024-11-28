import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth, uploadProfilePicture } from "../Login/firebaseConfig"; // Firebase imports
import { getDoc, setDoc, doc } from "firebase/firestore"; // Firestore import
import { onAuthStateChanged } from "firebase/auth"; // Auth state listener
import { handleLogout } from "../Login/firebaseConfig";
import "./Profile.css";

function Profile() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userData, setUserData] = useState({
    nickname: "",
    profilePicture: "", // Storing profile picture URL
  });
  const [isEditing, setIsEditing] = useState(false); // Track if in edit mode
  const navigate = useNavigate();

  // Fetch user data and handle authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userDetails = userDoc.data();
            setUserData({
              nickname: userDetails.username || "No Nickname",
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

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Upload the picture and get the download URL
        const imageUrl = await uploadProfilePicture(file, auth.currentUser.uid);
        
        // Update Firestore with the new profile picture URL
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, { profilePicture: imageUrl }, { merge: true });
  
        // Update the local state to reflect the new profile picture
        setUserData((prevData) => ({
          ...prevData,
          profilePicture: imageUrl,
        }));
  
        console.log("Profile picture uploaded and Firestore updated:", imageUrl);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        // Add user-friendly error handling (e.g., setting an error message in the state)
        alert("There was an error uploading the profile picture. Please try again.");
      }
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
          <img src={userData.profilePicture || "default-profpic.png"} alt="Profile Icon" className="Profile-icon-image" />
          <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
            <button onClick={() => handleLogout(navigate)} className="dropdown-item">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="Profile-info">
        <div className="Profile-details">
          <div className="profile-picture-container">
          <img
            src={userData.profilePicture ? `${userData.profilePicture}?t=${new Date().getTime()}` : "default-profpic.png"}
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
      </div>
    </div>
  );
}

export default Profile;
