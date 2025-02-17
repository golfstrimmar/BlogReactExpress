import React from "react";
import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const pages = [{ name: "Home", path: "/" }];
  const filteredPages = pages.filter((page) => {
    if (isAuthenticated) {
      return page.name !== "Login" && page.name !== "Registration";
    }
    return true;
  });
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
            {filteredPages.map((page) => (
              <li key={page.name}>
                <Link to={page.path}>{page.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
