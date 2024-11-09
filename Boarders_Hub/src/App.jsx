import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Components/Pages/Login/Login";
import Home from "./Components/Pages/Home/Home";
import Browse from "./Components/Pages/Browse/Browse";
import Profile from "./Components/Pages/Profile/Profile"; // Import Profile component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;