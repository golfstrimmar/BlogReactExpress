import React, { useState, useEffect } from "react";
import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/svg/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/actions/authActions";
import Burger from "../Burger/Burger";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isactive, setISactive] = useState(false);
 const [responsive, setResponsive] = useState<boolean>(false);
  const user = useSelector((state) => state.auth.user);
  const pages = [
    { name: "Home", path: "/" },
    { name: "Posts", path: "/posts" },
    { name: "LoginPage", path: "/login" },
    { name: "RegisterPage", path: "/register" },
  ];
  interface SocketData {
    post: Post;
    message: string;
    error?: string; // Опциональное поле для ошибок
  }
  return (
    <div className={`header  ${responsive ? "responciveHeader" : ""}  `}>
      <div className="container">
        <div className="header-wrapper">
          <Link className="logo" to={"/"}>
            <Logo />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Header;
