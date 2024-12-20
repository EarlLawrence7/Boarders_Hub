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
    messenger: "",
    instagram: "",
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
      await setDoc(
        userRef,
        {
          nickname: userData.nickname,
          phone: userData.phone,
          email: userData.email,
          birthday: userData.birthday,
          fullName: userData.fullName,
          messenger: userData.messenger,
          instagram: userData.instagram, // Include new fields
        },
        { merge: true } // Merge to prevent overwriting other fields
      );

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
      <div className="Profile-container1">
        <div className="Profile-info">
          <div className="Profile-profilediv">
            <p className="profile-profiletitle">PROFILE</p>
            <button
                    className="edit-profile-btn"
                    onClick={handleEditToggle}>
                    <span className="gray-hand-emoji">✍️</span>Edit Profile
                  </button>
          </div>
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
                  <strong>Username</strong>
                  <input
                    type="text"
                    name="nickname"
                    value={userData.nickname}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                  <strong>Fullname:</strong>
                  <input
                    type="text"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
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
                  <h1 className="birthday">{userData.birthday}</h1> 
                </>
              )}
            </div>
          </div>
          
          <div className="btn-container1">
            <button onClick={() => navigate(-1)} className="go-back-btn">Go Back</button>
            <button onClick={() => navigate("/Properties")} className="view-properties-btn">View Properties</button>
          </div>
        </div>
      </div>

      <div className="Profile-container2">
        <div className="container2">
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
                    <img src="messenger.png" alt="Messenger" className="messenger-icon" />
                    <input
                      type="text"
                      name="messenger"
                      value={userData.messenger}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  </p>
                  <p>
                    <img src="instagram.png" alt="Instagram" className="instagram-icon" />
                    <input
                      type="text"
                      name="instagram"
                      value={userData.instagram}
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
                    <img src="messenger.png" alt="Messenger" className="messenger-icon" />
                    <a href={userData.messenger} target="_blank" rel="noopener noreferrer" className="social-link">
                      {userData.messenger}
                    </a>
                  </p>
                  <p>
                    <img src="instagram.png" alt="Instagram" className="instagram-icon" />
                    <a href={userData.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                      {userData.instagram}
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
