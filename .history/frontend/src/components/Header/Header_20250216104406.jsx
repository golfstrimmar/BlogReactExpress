import React from "react";
import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/svg/logo.svg";
const Header = () => {
  const navigate = useNavigate();
  const pages = [
    { name: "Home", path: "/" },
    { name: "Posts", path: "/posts" },
  ];
  const filteredPages = pages;
  // const filteredPages = pages.filter((page) => {
  //   if (isAuthenticated) {
  //     return page.name !== "Login" && page.name !== "Registration";
  //   }
  //   return true;
  // });
  return (
    <div className="header">
      <div className="container">
        <div className="header__wrapper">
        <Link className="logo" to={"/"}>
          <Logo />
        </Link>
        <div className="header-menu  menu">
          <ul>
            {filteredPages.map((page) => (
              <li key={page.name}>
                <Link to={page.path}>{page.name}</Link>
              </li>
            ))}
          </ul>
        </div></div>
    </div>
  );
};

export default Header;
