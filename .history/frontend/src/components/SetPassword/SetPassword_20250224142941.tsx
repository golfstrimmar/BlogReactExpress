import React, { useState, useEffect } from "react";
import "./SetPassword.scss";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Eye } from "../../assets/svg/eye.svg";
import ButtonSuccessWave from "../../components/ButtonSuccessWave/ButtonSuccessWave";
import ModalMessage from "../../components/ModalMessage/ModalMessage";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// =====================
const SetPassword = () => {
   const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  const socket = useSelector((state) => state.socket.socket);
  const [formErrors, setFormErrors] = useState({
    password: "",
  });
  const { email } = useParams();
  // ---------------
return (
  <div className="setpassword registration">
    <ModalMessage message={successMessage} open={openModalMessage} />
    <p className="setpassword-text">
      You only need to add the password for your account once. <br />
      After that, you will be able to log in to the site by all means.
    </p>
  </div>
);
};

export default SetPassword;
