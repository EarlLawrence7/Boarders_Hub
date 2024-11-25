import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth"; // Firebase Auth import
import "./AddListings.css";
import { AiOutlineSearch } from "react-icons/ai"; // Import the icon
// Firebase setup
const auth = getAuth();

function AddListings() {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    location: "",
    price: "",
    details: "",
    owner: "",
    profilePicture: "",
  });
  const navigate = useNavigate();
  /////////////////////////////////////////////////////////////////////// this block is for login persistence
  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token, redirect to login page
      navigate("/");
    }
  }, [navigate]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Redirect to login page
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle any potential error during logout
    }
  };
  /////////////////////////////////////////////////////////////////////// this block is for login persistence
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to the backend)
    console.log("Form Data Submitted:", formData);
    alert("Listing created successfully!");
  };
  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };
  return (
    <div className="AddListings-container">
      <div className="Form-box">
        <h2>Create a Listing</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="shortDescription"
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <textarea
            name="details"
            placeholder="Details"
            value={formData.details}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="owner"
            placeholder="Owner"
            value={formData.owner}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="profilePicture"
            placeholder="Profile Picture URL"
            value={formData.profilePicture}
            onChange={handleChange}
          />
          <div className="button2-container">
            <button className="go-back-button" type="button" onClick={handleGoBack}>
              Go Back
            </button>
            <button className="create-button" type="submit">
              Create Listing
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
export default AddListings;
