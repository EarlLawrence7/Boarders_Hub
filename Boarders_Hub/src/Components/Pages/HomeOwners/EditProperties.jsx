import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineClose } from 'react-icons/ai'; // Import the X icon
import { auth, db, doc, updateDoc, fetchListings, uploadListingImages } from '../Login/firebaseConfig'; // Import the fetchListings function
import "./EditProperties.css";

function EditProperties() {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId; // Get the roomId from the passed state

  const [formData, setFormData] = useState({
    RoomType: "",
    shortDescription: "",
    location: "",
    price: "",
    details: "",
    images: [] // Include images in form data
  });

  const [roomImages, setRoomImages] = useState([]);

  // Fetch the room data based on the roomId
  useEffect(() => {
    if (roomId) {
      const fetchRoomDetails = async () => {
        try {
          const roomList = await fetchListings(); // Fetch all rooms
          const room = roomList.find((r) => r.id === roomId); // Find the room by its id
          
          if (room) {
            setFormData({
              RoomType: room.RoomType,
              shortDescription: room.shortDescription,
              location: room.location,
              price: room.price,
              details: room.details,
              images: room.images || [], // Use empty array if no images
            });
            setRoomImages(room.images || []); // Ensure room images are set
          } else {
            console.error("Room not found.");
            navigate("/properties"); // Redirect if room not found
          }
        } catch (error) {
          console.error("Error fetching room details:", error);
          navigate("/properties"); // Redirect if error occurs
        }
      };

      fetchRoomDetails();
    } else {
      navigate("/properties"); // Redirect if no roomId is provided
    }
  }, [roomId, navigate]);

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

  // Handles form submission for updating the listing
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled and there are up to 5 images
    if (formData.RoomType && formData.shortDescription && formData.price) {
      try {
        let imageUrls = formData.images; // Start with existing images if any
        if (roomImages.length > 0) {
          // Upload new images and get their URLs if any new images were added
          imageUrls = await uploadListingImages(roomImages);
        }

        formData.images = imageUrls; // Add image URLs (either existing or newly uploaded)

        // Get the current user's ID (assuming you're using Firebase Auth)
        const user = auth.currentUser;
        if (user) {
          formData.ownerId = user.uid; // This might already exist but we add it just in case
        } else {
          // If no user is logged in, handle accordingly (e.g., show error or redirect)
          alert("User not logged in.");
          return;
        }

        // Set additional fields for the listing (status and tenantId are assumed to be managed by other parts of the app)
        formData.status = formData.status || "Available"; // Keep status if it's already set
        formData.requests = formData.requests || []; // Keep existing requests if any
        formData.tenantId = formData.tenantId || "None"; // Set tenantId if needed

        // Get reference to the Firestore listing document using roomId
        const roomRef = doc(db, "listings", roomId); // Get Firestore reference to the listing document

        // Update the listing in Firestore
        await updateDoc(roomRef, formData);

        alert("Listing updated successfully!");

        // Reset form after successful submission
        setFormData({
          RoomType: "",
          shortDescription: "",
          location: "",
          price: "",
          details: "",
          images: []
        });
        setRoomImages([]); // Clear the roomImages state

        // Navigate back to the home or listings page
        navigate("/home");
      } catch (error) {
        console.error("Error updating listing: ", error);
        alert("Failed to update listing. Please try again.");
      }
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
                <img src={image} alt={`Room ${index + 1}`} />
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
