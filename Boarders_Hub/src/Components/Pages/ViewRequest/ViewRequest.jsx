import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ViewRequest.css";

function ViewRequest() {
  const location = useLocation();
  const room = location.state?.room; // Room selected by the admin
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ profilePicture: "default-profpic.png" });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate(); // For navigation

  // Fetching requests from Firebase based on the selected room
  useEffect(() => {
    if (room) {
      const fetchRequests = async () => {
        try {
          const requestsRef = collection(db, "requests"); // Assuming 'requests' is the collection name
          const q = query(requestsRef, where("roomId", "==", room.id)); // Filter by roomId
          const querySnapshot = await getDocs(q);

          const fetchedRequests = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setRequests(fetchedRequests);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching requests: ", error);
          setLoading(false);
        }
      };

      fetchRequests();
    }
  }, [room]);

  const goToAboutUs = () => {
    window.location.href = "/about-us";
  };

  const toggleContactModal = () => {
    // Toggle the visibility of the contact modal
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log("Logout triggered");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Back button handler to navigate to the properties page
  const handleBackClick = () => {
    navigate("/Properties");
  };

  if (!room) {
    return <p>No room selected</p>;
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
                      <th>Customer Name</th>
                      <th>Purpose</th>
                      <th>Request Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan="3">No requests yet</td>
                      </tr>
                    ) : (
                      requests.map((request) => (
                        <tr key={request.id}>
                          <td>{request.customerName}</td>
                          <td>{request.purpose}</td>
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
