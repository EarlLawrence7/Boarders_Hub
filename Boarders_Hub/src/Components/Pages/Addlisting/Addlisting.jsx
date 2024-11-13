import React, { useState } from "react";
import "./AddListingForm.css";
import React, { useState, useEffect } from "react";


const AddListingForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    contact: "",
    photos: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length + formData.photos.length <= 5) {
      setFormData((prevData) => ({
        ...prevData,
        photos: [...prevData.photos, ...e.target.files]
      }));
    } else {
      alert("You can only upload a maximum of 5 photos.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your submit logic here
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Add Listing</h2>
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Room Title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="description"
            placeholder="Description (maximum 35 characters)"
            maxLength="35"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="contact"
            placeholder="Contact Information"
            value={formData.contact}
            onChange={handleChange}
          />
        </div>
        <div className="photo-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="photo-placeholder">
              {formData.photos[index] ? (
                <img
                  src={URL.createObjectURL(formData.photos[index])}
                  alt="Listing"
                />
              ) : (
                <div className="empty-placeholder"></div>
              )}
            </div>
          ))}
        </div>
        <div className="form-group">
          <label htmlFor="photo-upload" className="photo-upload-button">
            Insert Photo
          </label>
          <input
            type="file"
            id="photo-upload"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <small>Insert a maximum of 5 photos</small>
        </div>
        <button type="submit" className="confirm-button">
          Confirm
        </button>
      </form>
    </div>
  );
};

export default AddListingForm;
