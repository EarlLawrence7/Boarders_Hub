import React, { useState, useEffect } from "react";
import "./Properties.css"; 
import { FaArrowRight } from 'react-icons/fa'; 
import { AiOutlineSearch } from "react-icons/ai"; 
import { auth, handleLogout, redirectToLoginIfLoggedOut, useUserProfile, fetchListings, handleDeleteListing } from '../Login/firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Fetch user details (fullName or nickname) based on tenantId
const fetchUserDetails = async (tenantId) => {
  const db = getFirestore();
  const userDocRef = doc(db, 'users', tenantId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    console.log("No such user!");
    return null;
  }
};

// Delete Confirmation Modal
function DeleteConfirmationModal({ onClose, onConfirm }) {
  return (
    <div className="Modal-overlay">
      <div className="Modal-content delete-confirmation">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this property listing?</p>
        <p>This action cannot be undone.</p>
        <div className="Modal-buttons-container1">
          <button className="Prop-Cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="Prop-Delete-button" onClick={onConfirm}>
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Modal({ room, onClose, onDelete }) {
  const [showAllImages, setShowAllImages] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('Modal-overlay')) {
      onClose();
    }
  };

  const handleEditListing = (roomId) => {
    navigate("/edit", { state: { roomId } });
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(room.id);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
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

        <div className="Modal-buttons-container1">
          <button className="Edit-button" onClick={() => handleEditListing(room.id)}>
            Edit listing
          </button>
          <button className="Prop-Delete-button" onClick={handleDeleteClick}>
            Delete Property
          </button>
        </div>

        {showDeleteConfirmation && (
          <DeleteConfirmationModal 
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </div>
    </div>
  );
}

function Properties() {
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rooms, setRooms] = useState([]); 
  const [userData, setUserData] = useState({
    profilePicture: "",
  });
  const [tenantDetails, setTenantDetails] = useState({}); // State to hold tenant details
  const roomsPerPage = 8;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); 

  const filteredRooms = rooms.filter((room) =>
    room.RoomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.price.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useUserProfile(setUserData, navigate);
  redirectToLoginIfLoggedOut(navigate);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomList = await fetchListings();
        const userEmail = auth.currentUser.email; 
        const userOwnedRooms = roomList.filter(room => room.owner.email === userEmail); 
        setRooms(userOwnedRooms);

        // Fetch tenant details for each room
        const roomsWithTenantDetails = await Promise.all(userOwnedRooms.map(async (room) => {
          const tenantData = await fetchUserDetails(room.tenantId);
          return { ...room, tenantName: tenantData ? tenantData.fullName : "Unknown" };
        }));

        setRooms(roomsWithTenantDetails);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleGoBack = () => {
    navigate(-1); 
  };

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

  const handleDelete = async (listingId) => {
    try {
      await handleDeleteListing(listingId);
      setRooms((prevRooms) => prevRooms.filter(room => room.id !== listingId));
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const handleViewRequests = (room) => {
    navigate("/view-requests", { state: { roomId: room.id } });
  };

  return (
    <div className="Properties-container">
      <div className="Top-container">
        <a href="/home">
          <img src="Boardershub.png" alt="Logo" className="Logo-image" />
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
      {currentRooms.length > 0 ? (
      <div className="Room-card-container1">
        {currentRooms.map((room) => (
          <div key={room.id} className="Room-card1">
            <div className="Room-card-image1" style={{ backgroundImage: `url(${room.images[0]})` }}></div>
            <h2 className="Room-title">{room.RoomType}</h2>
            <p className="Room-summary">{room.shortDescription}</p>
            <p className="Occupied-Room">Occupied by {room.tenantName}</p>
            <p className="Available-Room">Status: {room.status}</p> 
            <div className="Card-footer1">
              <button className="Pendings-button" onClick={() => handleViewRequests(room)}>
                View Requests
              </button>
              <button className="Pendings-button" onClick={() => handleOpenModal(room)}>
                See details
              </button>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <p className="SavedRoom-empty">
          <Link to="/add-listing" className="SavedRoom-empty">Start adding</Link>
          <span> your own properties.</span>
        </p>
      )}
      <div className="Pagination-container">
        <button className="Pagination-button" onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button className="Pagination-button" onClick={nextPage} disabled={currentPage * roomsPerPage >= rooms.length}>
          Next
        </button>
      </div>
      {expandedRoom && <Modal room={expandedRoom} onClose={handleCloseModal} onDelete={handleDelete} />}
    </div>
  );
}

export default Properties;
