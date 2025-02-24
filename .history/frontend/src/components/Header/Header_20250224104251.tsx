import React, { useState, useEffect } from "react";
import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/svg/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions/authActions";
import Burger from "../components/Burger/Burger";

const Header: React.FC = () => {
  const [responsive, setResponsive] = useState<boolean>(false);
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
