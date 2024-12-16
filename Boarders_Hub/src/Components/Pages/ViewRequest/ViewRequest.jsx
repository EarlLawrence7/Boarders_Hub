import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, collection, query, where, getDocs, doc, getDoc } from '../Login/firebaseConfig';
import "./ViewRequest.css";

function ViewRequest() {
  const location = useLocation();
  const roomId = location.state?.roomId; // Only passing roomId
  const [room, setRoom] = useState(null); // Room details fetched from Firestore
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ profilePicture: "default-profpic.png" });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

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
          setRoom({ id: roomSnap.id, ...roomSnap.data() });
        } else {
          console.error("Room not found!");
          navigate("/Properties");
        }
      } catch (error) {
        console.error("Error fetching room details: ", error);
      }
    };

    fetchRoomDetails();
  }, [roomId, navigate]);

  // Fetch requests based on roomId
  useEffect(() => {
    const fetchRequests = async () => {
      if (roomId) {
        try {
          const requestsRef = collection(db, "requests"); // Assuming 'requests' is the collection name
          const q = query(requestsRef, where("roomId", "==", roomId));
          const querySnapshot = await getDocs(q);

          const fetchedRequests = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setRequests(fetchedRequests);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching requests: ", error);
          setLoading(false);
        }
      }
    };

    fetchRequests();
  }, [roomId]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    console.log("Logout triggered");
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
              <button onClick={handleLogout} className="dropdown-item">
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
                      <th>Purpose</th>
                      <th>Offer (PHP)</th>
                      <th>Request Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan="4">No requests yet</td>
                      </tr>
                    ) : (
                      requests.map((request) => (
                        <tr key={request.id}>
                          <td>{request.customerName}</td>
                          <td>{request.purpose}</td>
                          <td>{request.offer}</td>
                          <td>{new Date(request.date).toLocaleDateString()}</td>
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
