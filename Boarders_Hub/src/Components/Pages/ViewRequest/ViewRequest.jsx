import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, doc, getDoc, useUserProfile, redirectToLoginIfLoggedOut, handleLogout } from '../Login/firebaseConfig';
import "./ViewRequest.css";

function ViewRequest() {
  const location = useLocation();
  const roomId = location.state?.roomId; // Only passing roomId
  console.log("Room ID:", roomId);  // Debugging line
  const [room, setRoom] = useState(null); // Room details fetched from Firestore
  const [requests, setRequests] = useState([]); // Store the requests array
  const [loading, setLoading] = useState(true); // Loading state for requests
  const [userData, setUserData] = useState({ profilePicture: "default-profpic.png" });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [usersData, setUsersData] = useState({}); // Store user data (name, nickname)
  const navigate = useNavigate();

  useUserProfile(setUserData, navigate); // fetch user data of currently logged in user
  redirectToLoginIfLoggedOut(navigate); // check if a user is logged in

  // Fetch room details using roomId
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) {
        console.error("No roomId provided!");
        navigate("/Properties");
        return;
      }

      try {
        const roomRef = doc(db, "listings", roomId); // Assuming "listings" is the collection name
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          const roomData = { id: roomSnap.id, ...roomSnap.data() };
          setRoom(roomData);
          
          // Access the "requests" array inside the listing document
          const roomRequests = roomData.requests || []; // Default to an empty array if requests doesn't exist
          setRequests(roomRequests); // Set the requests to state
          
          // Fetch user data for each request
          const userIds = roomRequests.map(request => request.requestBy);
          fetchUsersData(userIds); // Fetch user names
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

  // Fetch user data for the given userIds
  const fetchUsersData = async (userIds) => {
    const users = {};
    for (const userId of userIds) {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          // Use fullName if available, otherwise fallback to nickname
          users[userId] = userData.fullName || userData.nickname;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    setUsersData(users); // Store the fetched user data
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleBackClick = () => {
    navigate("/Properties");
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

          {/* Show loading spinner if data is still being fetched */}
          {loading ? (
            <p>Loading requests...</p>
          ) : (
            <div>
              <h3>Total Requests: {requests.length}</h3>

              {/* Requests Table */}
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
                      <tr><td colSpan="3">No requests yet</td></tr>
                    ) : (
                      requests.map((request, index) => (
                        <tr key={index}>
                          <td>{usersData[request.requestBy]}</td>
                          <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                          <td>{request.requestStatus}</td>
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
    </div>
  );
}

export default ViewRequest;
