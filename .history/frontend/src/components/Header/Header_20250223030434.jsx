import React, { useState, useEffect } from "react";
import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/svg/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/actions/authActions";
import Burger from "../Burger/Burger";
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isactive, setISactive] = useState(false);
  const [responsive, setResponsive] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const pages = [
    { name: "Home", path: "/" },
    { name: "Posts", path: "/posts" },
    { name: "LoginPage", path: "/login" },
    { name: "RegisterPage", path: "/register" },
  ];
  const filteredPages = pages.filter((page) => {
    if (user) {
      return page.name !== "LoginPage" && page.name !== "RegisterPage";
    }
    return true;
  });

  const handleLogout = () => {
    setISactive((prev) => !prev);
    dispatch(logoutUser());
    navigate("/posts");
  };
  window.addEventListener("scroll", function (event) {
    if (window.pageYOffset > 80) {
      setResponsive(true);
      // header.classList.add("responciveHeader");
    } else {
      setResponsive(false);
      // header.classList.remove("responciveHeader");
    }
  });
  window.addEventListener("click", function (event) {
    if (isactive && !event.target.closest(".header")) {
      setISactive(false);
     
    }
  });
  const handlerburgerClick = () => {
    setISactive((prev) => !prev);
  };
  return (
    <div className={`header  ${responsive ? "responciveHeader" : ""}  `}>
      <div className="container">
        <div className="header-wrapper">
          <Link className="logo" to={"/"}>
            <Logo />
          </Link>
          <Burger isactive={isactive} handlerburgerClick={handlerburgerClick} />
          <ul className={`header-menu  menu  ${isactive ? "_is-open" : ""}`}>
            {user && (
              <li className="user-name">
                <Link to={"/profile"}>
                  <span>Hallo, </span> <h3>{user.userName}</h3>
                </Link>
              </li>
            )}
            {filteredPages.map((page) => (
              <li key={page.name}>
                <Link
                  onClick={() => {
                    setISactive((prev) => !prev);
                  }}
                  to={page.path}
                >
                  {page.name}
                </Link>
              </li>
            ))}
            {user && (
              <>
                <li>
                  <Link
                    onClick={() => {
                      setISactive((prev) => !prev);
                    }}
                    to={"/create"}
                  >
                    Create Post
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
