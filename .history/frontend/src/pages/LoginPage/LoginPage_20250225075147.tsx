import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Eye } from "../../assets/svg/eye.svg";
import ModalMessage from "../../components/ModalMessage/ModalMessage";
import ButtonSuccessWave from "../../components/ButtonSuccessWave/ButtonSuccessWave";
import { useSelector, useDispatch } from "react-redux";
import "./LoginPage.scss";
import { setUser } from "../../redux/actions/authActions";
import { GoogleLogin } from "@react-oauth/google";
// =========================

// =========================
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSelector((state: any) => state.socket.socket);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
};
export default LoginPage;
