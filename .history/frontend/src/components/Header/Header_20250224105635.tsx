import React, { useState, useEffect } from "react";
import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/svg/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/actions/authActions";
import Burger from "../Burger/Burger";
// ===============================

// ===============================
interface User {
  _id?: string;
  userName?: string;
}
interface Page {
  name: string; // Название страницы
  // Можно добавить другие свойства страницы, если они есть
}
// -------------------
// -------------------
const Header: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user as User);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isactive, setISactive] = useState<boolean>(false);
  const [responsive, setResponsive] = useState<boolean>(false);
  const pages: Page[] = [
    { name: "Home", path: "/" },
    { name: "Posts", path: "/posts" },
    { name: "LoginPage", path: "/login" },
    { name: "RegisterPage", path: "/register" },
  ];
  // -------------------

  // -------------------
  const handlerburgerClick = () => {
    setISactive((prev) => !prev);
  };
  // -------------------
  const filteredPages = pages.filter((page: Page): boolean => {
    if (user) {
      return page.name !== "LoginPage" && page.name !== "RegisterPage";
    }
    return true;
  });
  // -------------------
  return (
    <div className={`header  ${responsive ? "responciveHeader" : ""}  `}>
      <div className="container">
        <Burger isactive={isactive} handlerburgerClick={handlerburgerClick} />
        <div className="header-wrapper">
          <Link className="logo" to={"/"}>
            <Logo />
          </Link>
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
                {/* <li>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </li> */}
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Header;
