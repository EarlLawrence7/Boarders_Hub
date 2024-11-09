import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "./Components/Pages/Login/Login"; //File location of Login page
import Home from "./Components/Pages/Home/Home";
import Browse from "./Components/Pages/Boarders/Browse";
import SavedRooms from "./Components/Pages/Boarders/SavedRooms";
import History from "./Components/Pages/Boarders/History";
import OwnerListing from "./Components/Pages/HomeOwners/OwnerListing";
import Profile from "./Components/Pages/Profile/Profile";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/saved-rooms" element={<SavedRooms />} />
        <Route path="/history" element={<History />} />
        <Route path="/owner-listing" element={<OwnerListing />} />
        <Route path="/profile" element={<Profile />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
