import React from "react";
import "./Header.scss";
import 
const Header = () => {
  return (
    <div className="header">
      <div className="container">
        <div className="logo">
          <a href="#">
            <img src=".assets/img/logo.png" alt="logo" />
          </a>
        </div>
        <div className="header-menu  menu">
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Posts</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
