import React from "react";
import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <div className="container">
        <div className="logo">
          <a href="#">
            <img src=".assets/img/logo.png" alt="logo" />
          </a>
        </div>
        <div className="header-menu  menu">
          {filteredPages.map((page) => (
            <MenuItem key={page.name} onClick={handleCloseNavMenu}>
              <Link
                to={page.path}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {page.name}
              </Link>
            </MenuItem>
          ))}
          <ul>
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
