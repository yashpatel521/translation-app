import React from "react";
import "../styles/header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="top-div">
      <Link to="/" className="top-btn">
        Home
      </Link>
      <Link to="/compareAi" className="top-btn">
        Compare AI
      </Link>
      <Link to="/imgDetails" className="top-btn">
        Image Details
      </Link>
    </div>
  );
};

export default Header;
