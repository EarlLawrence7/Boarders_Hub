import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { auth, db, collection, getDocs, updateDoc, doc, useUserProfile, redirectToLoginIfLoggedOut } from '../Login/firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import "./History.css";

function History() {
  const [rentalHistory, setRentalHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const [userData, setUserData] = useState({
      profilePicture: "",
  });
  useUserProfile(setUserData, navigate);
  redirectToLoginIfLoggedOut(navigate);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setRentalHistory([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRentalHistory = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const userUid = currentUser.uid;
        const listingsSnapshot = await getDocs(collection(db, "listings"));
        const allListings = [];

        listingsSnapshot.forEach((doc) => {
          const data = doc.data();
          const userRequest = data.requests.find(
            (request) => request.requestBy === userUid
          );

          if (userRequest) {
            allListings.push({
              id: doc.id, // Include the document ID for updates
              title: data.RoomType,
              location: data.location,
              status: userRequest.requestStatus,
            });
          }
        });

        setRentalHistory(allListings.reverse());
      } catch (error) {
        console.error("Error fetching rental history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalHistory();
  }, [currentUser]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredHistory = rentalHistory.filter((entry) =>
    entry.title && entry.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCancel = async (entry) => {
    if (!currentUser) return;

    try {
      const listingRef = doc(db, "listings", entry.id);
      const listingSnapshot = await getDocs(collection(db, "listings"));

      let updatedRequests = [];
      let tenantId = "none";
      let status = "Available";

      listingSnapshot.forEach((doc) => {
        if (doc.id === entry.id) {
          const data = doc.data();
          updatedRequests = data.requests.filter(
            (request) => request.requestBy !== currentUser.uid
          );

          if (entry.status === "Approved") {
            tenantId = "none";
            status = "Available";
          } else {
            tenantId = data.tenantId; // Keep current tenantID
            status = data.status; // Keep current status
          }
        }
      });

      await updateDoc(listingRef, {
        requests: updatedRequests,
        tenantId: tenantId,
        status: status,
      });

      setRentalHistory((prevHistory) =>
        prevHistory.filter((item) => item.id !== entry.id)
      );

      alert("Rent request successfully cancelled.");
    } catch (error) {
      console.error("Error cancelling rent:", error);
      alert("Failed to cancel rent. Please try again.");
    }
  };

  return (
    <div className="History-container">
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
            onChange={handleSearchChange}
          />
        </div>
        <div className="Nav-bar">
          <button
            className={`Nav-button ${window.location.pathname === "/home" ? "active" : ""}`}
            onClick={() => window.location.href = "/home"}
          >
            Home
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/browse" ? "active" : ""}`}
            onClick={() => window.location.href = "/browse"}
          >
            Browse
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/saved-rooms" ? "active" : ""}`}
            onClick={() => window.location.href = "/saved-rooms"}
          >
            Saved Rooms
          </button>
          <button
            className={`Nav-button ${window.location.pathname === "/history" ? "active" : ""}`}
            onClick={() => window.location.href = "/history"}
          >
            Boarding History
          </button>
        </div>
        <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
          <img src={userData.profilePicture || "default-profpic.png"} alt="Profile Icon" className="Profile-icon-image" />
          <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
            <button onClick={() => navigate("/profile")} className="dropdown-item">View Profile</button>
            <button onClick={() => navigate("/add-listing")} className="dropdown-item">Add Listings</button>
            <button onClick={() => navigate("/view-tenants")} className="dropdown-item">View Tenants</button>
            <button onClick={() => navigate("/view-properties")} className="dropdown-item">View Properties</button>
            <button onClick={() => navigate("/logout")} className="dropdown-item">Logout</button>
          </div>
        </div>
      </div>

      <h1 className="History-title">Boarding History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : filteredHistory.length === 0 ? (
        <p className="History-empty">No matching rental history found.</p>
      ) : (
        <div className="History-box">
          {currentItems.map((entry, index) => (
            <div key={index} className="History-item">
              <h2 className="History-item-title">{entry.title}</h2>
              <p><strong>Location:</strong> {entry.location}</p>
              <p><strong>Status:</strong> {entry.status}</p>
              <button
                className="Cancel-button"
                onClick={() => handleCancel(entry)}
                disabled={entry.status === "Cancelled"}
              >
                {entry.status === "Cancelled" ? "Cancelled" : "Cancel Rent"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="History-pagination">
        <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default History;
