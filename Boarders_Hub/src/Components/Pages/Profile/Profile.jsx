import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadProfilePicture, handleLogout, useUserProfile } from "../Login/firebaseConfig"; // Import necessary hooks and functions
import { setDoc, doc } from "firebase/firestore";
import { db, auth } from "../Login/firebaseConfig";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track if in edit mode

  const [userData, setUserData] = useState({
    fullName: "",
    nickname: "",
    phone: "",
    email: "",
    birthday: "",
    profilePicture: "", // Storing profile picture URL
  });

  // Use the custom hook to fetch user data
  useUserProfile(setUserData, navigate); // This will automatically set user data when authenticated

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

  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);

      // Update Firestore with new userData
      await setDoc(userRef, {
        nickname: userData.nickname,
        phone: userData.phone,
        email: userData.email,
        birthday: userData.birthday,
        fullName: userData.fullName,
      }, { merge: true }); // Merge to prevent overwriting other fields

      console.log("User data saved:", userData);
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error saving changes:", error);
    }
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
                <h1 className="name">{userData.fullName}</h1>
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
        <button onClick={() => navigate(-1)} className="go-back-btn">Go Back</button>
      </div>
    </div>
  );
}

export default Profile;
