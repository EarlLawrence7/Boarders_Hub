import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from 'react-icons/ai'; // Import the X icon
import "./EditProperties.css";

function EditProperties() {
  const navigate = useNavigate();

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

  // Handles form submission (no backend logic in this case)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure all fields are filled and there are up to 5 images
    if (formData.RoomType && formData.shortDescription && formData.price && roomImages.length > 0) {
      // Form data is valid, proceed with the next steps (e.g., navigation)
      alert("Property updated successfully!");
      setFormData({
        RoomType: "",
        shortDescription: "",
        location: "",
        price: "",
        details: "",
        images: []
      });
      setRoomImages([]);
      navigate("/home"); // Navigate back to home or wherever necessary
    } else {
      alert("Please fill in all required fields and upload at least one image (up to 5 images).");
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="edit-properties-container">
      <div className="edit-properties-form-box">
        <h2>Edit Property</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <input
            type="text"
            name="RoomType"
            placeholder="Room type"
            value={formData.RoomType}
            onChange={handleChange}
            required
            className="edit-properties-input"
          />
          <input
            type="text"
            name="shortDescription"
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            className="edit-properties-input"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="edit-properties-input"
          />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="edit-properties-input"
          />
          <textarea
            name="details"
            placeholder="Details"
            value={formData.details}
            onChange={handleChange}
            required
            className="edit-properties-textarea"
          />
          {/* Image upload section */}
          <div className="edit-properties-image-upload-container">
            {roomImages.map((image, index) => (
              <div className="edit-properties-image-preview" key={index}>
                <img src={URL.createObjectURL(image)} alt={`Room ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="edit-properties-remove-button"
                >
                  <AiOutlineClose />
                </button>
              </div>
            ))}
            {roomImages.length < 5 && (
              <label className="edit-properties-image-upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  multiple
                  style={{ display: "none" }}
                  className="edit-properties-file-input"
                />
                <span className="edit-properties-plus-sign">+</span>
                <p className="edit-properties-upload-text">Add Photos (up to 5)</p>
              </label>
            )}
          </div>
          {/* Buttons */}
          <div className="edit-properties-button-container">
            <button className="edit-properties-go-back-button" type="button" onClick={handleGoBack}>
              Go Back
            </button>
            <button className="edit-properties-update-button" type="submit">
              Update Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProperties;
