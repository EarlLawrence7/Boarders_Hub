import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "./Components/Pages/Login/Login"; //File location of Login page
import Home from "./Components/Pages/Home/Home";
import Browse from "./Components/Pages/Boarders/Browse";
import SavedRooms from "./Components/Pages/Boarders/SavedRooms";
import History from "./Components/Pages/Boarders/History";
import Properties from "./Components/Pages/HomeOwners/Properties";
import AddListings from "./Components/Pages/HomeOwners/AddListings";
import Profile from "./Components/Pages/Profile/Profile";
import Signup from "./Components/Pages/Signup/Signup";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/saved-rooms" element={<SavedRooms />} />
        <Route path="/history" element={<History />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/addListings" element={<AddListings />} />


        {/* Optional/Manual Routing */}
        <Route path="/signin" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/add-listing" element={<AddListings />} />
        <Route path="/view-properties" element={<Properties />} />
        <Route path="/history" element={<History />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
