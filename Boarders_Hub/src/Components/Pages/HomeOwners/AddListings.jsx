import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth"; // Firebase Auth import
import "./AddListings.css";
import { AiOutlineClose } from 'react-icons/ai'; // Import the X icon

// Firebase setup
const auth = getAuth();

function AddListings({ onAddListing }) {
  const [formData, setFormData] = useState({
    RoomType: "", // Ensure this matches the field name
    shortDescription: "",
    location: "",
    price: "",
    details: "",
    images: [] // Include images in form data
  });

  const [roomImages, setRoomImages] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false); // Define dropdown visibility state

  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token, redirect to login page
      navigate("/");
    }
  }, [navigate]);

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
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setRoomImages((prev) => [...prev, ...files].slice(0, 5)); // Limit to 5 images
  };

  const removeImage = (index) => {
    const newImages = roomImages.filter((_, i) => i !== index);
    setRoomImages(newImages);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate fields correctly with RoomType (not title)
    if (formData.RoomType && formData.shortDescription && formData.price) {
      onAddListing(formData); // Pass the listing data back to the parent
      setFormData({
        RoomType: "", // Reset the field names to match
        shortDescription: "",
        location: "",
        price: "",
        details: "",
        images: []
      }); // Clear form after submit
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="AddListings-container">
      <div className="Form-box">
        <h2>Create a Listing</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <input
            type="text"
            name="RoomType"
            placeholder="Room type"
            value={formData.RoomType} // Corrected to match RoomType in state
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
          {/* Image upload section */}
          <div className="image-upload-container">
            {roomImages.map((image, index) => (
              <div className="image-preview" key={index}>
                <img src={URL.createObjectURL(image)} alt={`Room ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="remove-button"
                >
                  <AiOutlineClose />
                </button>
              </div>
            ))}
            {roomImages.length < 5 && (
              <label className="image-upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  multiple
                  style={{ display: "none" }}
                />
                <span className="plus-sign">+</span>
                <p>Add Photos</p>
              </label>
            )}
          </div>
          {/* Buttons */}
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
