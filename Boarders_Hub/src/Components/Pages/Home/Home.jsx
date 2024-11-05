import React, { useState } from "react";
import "./Home.css"; // Import the CSS file
import { AiOutlineSearch } from "react-icons/ai";
function Home() {
  const [activeTab, setActiveTab] = useState("Tab1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="home-container">
      {/* Search Box Container */}
      <div className="search-container">
        <div className="search-box">
          <input type="text" placeholder="Search..." className="search-input" />
          <button className="search-button">Search</button>
        </div>
      </div>
      <h1 className="home-header">Welcome to the Home Page!</h1>

      {/* Tab Selector */}
      <div className="tab-selector">
        <button
          className={`tab ${activeTab === "Tab1" ? "active" : ""}`}
          onClick={() => handleTabClick("Tab1")}
        >
          Tab 1
        </button>
        <button
          className={`tab ${activeTab === "Tab2" ? "active" : ""}`}
          onClick={() => handleTabClick("Tab2")}
        >
          Tab 2
        </button>
        <button
          className={`tab ${activeTab === "Tab3" ? "active" : ""}`}
          onClick={() => handleTabClick("Tab3")}
        >
          Tab 3
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "Tab1" && <p>Content for Tab 1</p>}
        {activeTab === "Tab2" && <p>Content for Tab 2</p>}
        {activeTab === "Tab3" && <p>Content for Tab 3</p>}
      </div>
    </div>
  );
}

export default Home;
