import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from 'react-icons/ai'; // Import the X icon
import { auth, redirectToLoginIfLoggedOut, uploadListingImages, addListingToFirestore } from "../Login/firebaseConfig";
import "./AddListings.css";

function AddListings({ onAddListing }) {
  const navigate = useNavigate();

  // To check if currently logged out: true -> redirect to login
  redirectToLoginIfLoggedOut(navigate);

  const [formData, setFormData] = useState({
    RoomType: "",
    shortDescription: "",
    location: "",
    price: "",
    details: "",
    images: [] // Include images in form data
  });

  const [roomImages, setRoomImages] = useState([]);

  // Limit file uploads to 5 images
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

  // Handles Submission of the listing
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure all fields are filled and there are up to 5 images
    if (formData.RoomType && formData.shortDescription && formData.price && roomImages.length > 0) {
      try {
        // Upload images to Cloudinary and get the URLs
        const imageUrls = await uploadListingImages(roomImages); // Upload images and get URLs
        formData.images = imageUrls; // Add image URLs to form data
  
        // Get the current user's ID (assuming you're using Firebase Auth)
        const user = auth.currentUser;
        if (user) {
          formData.ownerId = user.uid;
        } else {
          // If no user is logged in, handle accordingly (e.g., show error or redirect)
          alert("User not logged in.");
          return;
        }
  
        // Add status, requests fields, tenantId
        formData.status = "Available";
        formData.requests = []; // Empty array for now
        formData.tenantId = "None"; // no tenant yet
  
        // Save listing to Firestore
        await addListingToFirestore(formData);
  
        alert("Listing created successfully!");
        setFormData({
          RoomType: "",
          shortDescription: "",
          location: "",
          price: "",
          details: "",
          images: []
        });
        setRoomImages([]);
        navigate("/home");
      } catch (error) {
        console.error("Error adding listing: ", error);
        alert("Failed to create listing. Please try again.");
      }
    } else {
      alert("Please fill in all required fields and upload at least one image (up to 5 images).");
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
            value={formData.RoomType}
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
                <p>Add Photos (up to 5)</p>
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
