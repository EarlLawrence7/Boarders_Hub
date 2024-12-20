import React, { useState, useEffect } from "react";
import "./Browse.css"; // Import the CSS file
import { FaArrowRight } from 'react-icons/fa'; // Import the arrow icon
import { AiOutlineSearch } from "react-icons/ai"; // Import the search icon
import { auth, doc, db, setDoc, arrayUnion, handleLogout, redirectToLoginIfLoggedOut, useUserProfile, fetchListings, fetchSavedRooms, addRentRequest } from '../Login/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { BsBookmarkFill } from "react-icons/bs";

function Modal({ room, onClose }) {
  const [showAllImages, setShowAllImages] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const user = auth.currentUser;
  const userId = user.uid;
  const navigate = useNavigate();


  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('Modal-overlay')) {
      onClose();
    }
  };

  // Make Rent request
  const handleRentNow = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to rent a room.");
        return;
      }

      // Call the updated addRentRequest function
      await addRentRequest(room.id, user.uid);

      alert("Your rent request has been submitted!");
      // Optionally close the modal
      onClose();
    } catch (error) {
      console.error("Error handling rent request:", error);

      // Show user-friendly error if it's a duplicate request
      if (error.message === "You have already requested to rent this room.") {
        alert(error.message);
      } else {
        alert("There was an error processing your rent request.");
      }
    }
  };

  const handleEditListing = (roomId) => {
    navigate("/edit", { state: { roomId } }); // Pass only roomId
  };

  const handleContactOwner = () => {
    setShowContactModal(true);
  };

  return (
    <div className="Modal-overlay" onClick={handleOverlayClick}>
      <div className="Modal-content">
        <button className="Close-button" onClick={onClose}>✖</button>
        <h2>{room.RoomType}</h2>
        <p><strong>Location:</strong> {room.location}</p>
        <p><strong>Price:</strong> {room.price}</p>
        <p><strong>Details:</strong> {room.details}</p>
        <p><strong>Owner:</strong> {room.owner.fullName}</p>
        {room.images && room.images.length > 0 && (
          <div className="Room-images">
            <img src={room.images[0]} alt="Room Image" />
            {showAllImages && room.images.length > 1 && (
              <div className="Room-images-scrollable">
                {room.images.slice(1).map((image, index) => (
                  <img key={index} src={image} alt={`Room Image ${index + 1}`} />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="Modal-buttons-container">
          {userId !== room.ownerId ? (
            <>
              <button className="Rent-button" onClick={handleRentNow}>Rent now</button>
              <button className="Contact-button" onClick={handleContactOwner}>Contact Owner</button>
            </>
          ) : (
            <>
              <p>You are the owner of this room.</p>
              <button className="Contact-button" onClick={() => handleEditListing(room.id)}>Edit listing</button>
              <button className="Rent-button" onClick={onClose}>Go back</button>
            </>
          )}
        </div>
      </div>
      {showContactModal && (
        <div className="Contact-modal-overlay">
          <div className="Contact-modal">
            <button
              className="Close-button"
              onClick={() => setShowContactModal(false)}
            >
              ✖
            </button>

            <h2>Contact the Owner below</h2>

            <div className="Contact-details">
              {/* Owner's Picture */}
              <div className=".Profile-picture-contactowner">
                <img
                  src={room.owner.profilePicture || "default-profpic.png"} // Use a default image if no profile picture exists
                  alt={`${room.owner.fullName}'s profile`}
                  className="Profile-picture-contactown"
                />
              </div>

              {/* Contact Information */}
              <div className="Contact-row">
                <strong>Name:</strong>
                <span>{room.owner.fullName}</span>
              </div>
              <div className="Contact-row">
                <strong>Email:</strong>
                <span>{room.owner.email}</span>
              </div>
              <div className="Contact-row">
                <strong>Phone:</strong>
                <span>{room.owner.phone}</span>
              </div>
              <div className="Contact-row">
                <img src="messenger.png" alt="Messenger" className="messenger-icon" />
                <span>{room.owner.messenger}</span>
              </div>
              <div className="Contact-row">
                <img src="instagram.png" alt="Instagram" className="instagram-icon" />
                <span>{room.owner.instagram}</span>
              </div>
            </div>

            <div className="Social-links">
              {/* Add social links or icons here */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
;
function Browse() {
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rooms, setRooms] = useState([]);  // State to hold rooms fetched from Firestore
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const roomsPerPage = 8;
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    profilePicture: "",
  });
  // Filter rooms based on search query
  const filteredRooms = rooms.filter((room) =>
    room.RoomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.details.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useUserProfile(setUserData, navigate);
  redirectToLoginIfLoggedOut(navigate);

  // Fetch room data from Firestore using fetchListings
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomList = await fetchListings(); // Use fetchListings to get room data

        // Filter out rooms that are not available
        const availableRooms = roomList.filter(room => room.status === "Available"); // Case-sensitive "A"

        setRooms(availableRooms); // Update state with only available rooms
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const nextPage = () => {
    if (currentPage * roomsPerPage < rooms.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOpenModal = (room) => {
    setExpandedRoom(room);
  };

  const handleCloseModal = () => {
    setExpandedRoom(null);
  };

  // Function to save a room to the user's savedRooms array
  const handleSave = async (roomId) => {
    try {
      const user = auth.currentUser; // Get the current authenticated user
      if (user) {
        // Fetch the user's saved rooms
        const savedRooms = await fetchSavedRooms(user.uid);

        // Check if the room is already saved
        if (savedRooms.some((room) => room.id === roomId)) {
          alert("This listing has already been saved.");
          return;
        }

        const userDocRef = doc(db, "users", user.uid); // Reference to the user's document in Firestore
        const roomRef = doc(db, "listings", roomId); // Reference to the listing document

        // Add the roomRef to the savedRooms array
        await setDoc(
          userDocRef,
          {
            savedRooms: arrayUnion(roomRef), // Append the room reference to savedRooms array
          },
          { merge: true } // Use merge to avoid overwriting other user data
        );

        console.log("Room saved to savedRooms array.");
        alert("Listing successfully added to your saved rooms.");
      } else {
        console.log("User is not authenticated.");
      }
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  return (
    <div className="Browse-container">
      <div className="Top-container">
        <a href="/home">
          <img
            src="Boardershub.png"
            alt="Logo"
            className="Logo-image"
          />
        </a>
        <div className="Search-wrapper">
          <AiOutlineSearch className="Search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="Search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="Nav-bar">
          <button className={`Nav-button ${window.location.pathname === '/home' ? 'active' : ''}`} onClick={() => window.location.href = '/home'}>
            Home
          </button>
          <button className={`Nav-button ${window.location.pathname === '/browse' ? 'active' : ''}`} onClick={() => window.location.href = '/browse'}>
            Browse
          </button>
          <button className={`Nav-button ${window.location.pathname === '/saved-rooms' ? 'active' : ''}`} onClick={() => window.location.href = '/saved-rooms'}>
            Saved Rooms
          </button>
          <button className={`Nav-button ${window.location.pathname === '/history' ? 'active' : ''}`} onClick={() => window.location.href = '/history'}>
            Boarding History
          </button>
        </div>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <img src={userData.profilePicture || "default-profpic.png"} alt="Profile Icon" className="Profile-icon-image" />
          <div className={`dropdown-menu ${dropdownVisible ? 'show' : ''}`}>
            <button onClick={() => navigate("/profile")} className="dropdown-item">View Profile</button>
            <button onClick={() => navigate("/AddListings")} className="dropdown-item">Add Listings</button>
            <button onClick={() => navigate("/Properties")} className="dropdown-item">View Properties</button>
            <button onClick={() => handleLogout(navigate)} className="dropdown-item">Logout</button>
          </div>
        </div>
      </div>
      <div className="Room-card-container">
        {currentRooms.map((room) => (
          <div key={room.id} className="Room-card" onClick={() => handleOpenModal(room)}>
            <div className="Room-card-image" style={{ backgroundImage: `url(${room.images[0]})` }}></div>
            <h2 className="Room-title">{room.RoomType}</h2>

            <div className="Card-divider"></div>
            <div className="Card-footer">
              {room.owner.profilePicture ? (
                <div className="Profile-picture-container">
                  <img
                    src={room.owner.profilePicture}
                    alt={`${room.owner.fullName}'s profile`}
                    className="Profile-picture"
                  />
                </div>
              ) : (
                <div className="Profile-placeholder">
                  {room.owner.fullName ? room.owner.fullName.split(' ').map(name => name.charAt(0).toUpperCase()).join('') : 'NA'}
                </div>
              )}
              
              <button className="Details-button" onClick={() => handleOpenModal(room)}>
                See Details
              </button>
              
              <div className="Save-icon" onClick={(e) => { e.stopPropagation(); handleSave(room.id);}}>
                <BsBookmarkFill />
                <span className="Tooltip-text">Save Room</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="Pagination-container">
        <button className="Pagination-button" onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button className="Pagination-button" onClick={nextPage} disabled={currentPage * roomsPerPage >= rooms.length}>
          Next
        </button>
      </div>
      {expandedRoom && <Modal room={expandedRoom} onClose={handleCloseModal} />}

    </div>
  );
}

export default Browse;
