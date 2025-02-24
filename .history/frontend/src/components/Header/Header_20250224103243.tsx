import React, { useState, useEffect } from "react";
import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/svg/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions/authActions";
import Burger from "../components/Burger/Burger";

const Header: React.FC = () => {
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  return (
    <div className={`header  ${responsive ? "responciveHeader" : ""}  `}></div>
  );
};
