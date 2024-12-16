import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, doc, getDoc, useUserProfile, redirectToLoginIfLoggedOut, handleLogout, handleApproveRequest } from "../Login/firebaseConfig";
import "./ViewRequest.css";

function ViewRequest() {
  const location = useLocation();
  const roomId = location.state?.roomId;
  const [room, setRoom] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ profilePicture: "default-profpic.png" });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [usersData, setUsersData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  useUserProfile(setUserData, navigate);
  redirectToLoginIfLoggedOut(navigate);

  // Handle Approve Request
  const handleApprove = async () => {
    try {
      const listingId = room.id;
      const userId = selectedRequest.requestBy;
      const requestId = selectedRequest.requestDate;  // Assuming requestDate is the identifier
      
      console.log("Approving request with:", { listingId, userId, requestId });
  
      await handleApproveRequest(listingId, userId, requestId);
  
      closeModal();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };
  
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) {
        console.error("No roomId provided!");
        navigate("/Properties");
        return;
      }

      try {
        const roomRef = doc(db, "listings", roomId);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          const roomData = { id: roomSnap.id, ...roomSnap.data() };
          setRoom(roomData);

          const roomRequests = roomData.requests || [];
          setRequests(roomRequests);

          const userIds = roomRequests.map((request) => request.requestBy);
          fetchUsersData(userIds);
          setLoading(false);
        } else {
          console.error("Room not found!");
          navigate("/Properties");
        }
      } catch (error) {
        console.error("Error fetching room details: ", error);
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId, navigate]);

  const fetchUsersData = async (userIds) => {
    const users = {};
    for (const userId of userIds) {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          users[userId] = userData.fullName || userData.nickname;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    setUsersData(users);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleBackClick = () => {
    navigate("/Properties");
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  // Function to close modal when overlay is clicked
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('Contact-modal-overlay')) {
      closeModal();  // Correct function name here
    }
  };

  if (!room) {
    return <p>Loading room details...</p>;
  }

  return (
    <div className="view-request-page-container">
      <div className="Home-container">
        <div className="Top-container">
          <a href="/home">
            <img src="Boardershub.png" alt="Logo" className="Logo-image" />
          </a>
          <div className="Nav-bar">
            <button className="Nav-button" onClick={handleBackClick}>
              &#8592; Back to Properties
            </button>
          </div>
          <div className="Profile-icon-wrapper" onClick={toggleDropdown}>
            <img
              src={userData.profilePicture || "default-profpic.png"}
              alt="Profile Icon"
              className="Profile-icon-image"
            />
            <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
              <button onClick={() => navigate("/profile")} className="dropdown-item">
                View Profile
              </button>
              <button onClick={() => navigate("/AddListings")} className="dropdown-item">
                Add Listings
              </button>
              <button onClick={() => navigate("/view-tenants")} className="dropdown-item">
                View Tenants
              </button>
              <button onClick={() => navigate("/Properties")} className="dropdown-item">
                View Properties
              </button>
              <button onClick={() => handleLogout(navigate)} className="dropdown-item">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="view-request-container">
          <h1 className="viewborder">View Requests for {room.name}</h1>

          {loading ? (
            <p>Loading requests...</p>
          ) : (
            <div>
              <h3>Total Requests: {requests.length}</h3>
              <div className="view-request-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Request Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan="3">No requests yet</td>
                      </tr>
                    ) : (
                      requests.map((request, index) => (
                        <tr key={index}>
                          <td>{usersData[request.requestBy]}</td>
                          <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="clickable-status"
                              onClick={() => openModal(request)}
                              disabled={request.requestStatus !== "Pending"}  // Disable if not "Pending"
                            >
                              {request.requestStatus}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedRequest && (
        <div className="Contact-modal-overlay" onClick={handleOverlayClick}>
          <div className="Contact-modal">
            <h4><strong>Approve Rent Request by {usersData[selectedRequest.requestBy]}?</strong></h4>
            <div>
              {/* Modal Content */}
              <button className="yes-button" onClick={handleApprove}>YES</button>
              <button className="no-button" onClick={closeModal}>NO</button>
            </div>
            <button className="close-button" onClick={closeModal}>x</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewRequest;
