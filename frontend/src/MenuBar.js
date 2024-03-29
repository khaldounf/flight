// MenuBar.js
import React from 'react';
import './MenuBar.css'; // Import your CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


const MenuBar = () => {
  return (
    <div className="menu-bar">
      <div className="logo">
        <img src="flight_logo.png" alt="Logo" />
      </div>
      <div className="menu-links">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact us</a>
        <a href="/login"><FontAwesomeIcon icon={faUser} />Login</a>       
      </div>
    </div>
  );
};

export default MenuBar;
