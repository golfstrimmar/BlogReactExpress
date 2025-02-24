import React, { useState, useEffect } from "react";
import "./SetPassword.scss";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Eye } from "../../assets/svg/eye.svg";
import ButtonSuccessWave from "../../components/ButtonSuccessWave/ButtonSuccessWave";
import ModalMessage from "../../components/ModalMessage/ModalMessage";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// =====================
interface SocketData {
  // comment: Comment;
  // post: Post;
  // message: string;
  error?: string; // Опциональное поле для ошибок
}

const SetPassword = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const socket = useSelector((state: any) => state.socket.socket);
  const [password, setPassword] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ password: string }>({
    password: "",
  });

  // ---------------
  const handleSetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validateForm = () => {
      let isValid = true;
      let errors = { password: "" };
      if (!password) {
        errors.password = "Password is required";
        isValid = false;
      } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters";
        isValid = false;
      }
      setFormErrors(errors);
      return isValid;
    };
    if (!validateForm()) {
      return;
    }
    socket.emit(
      "setPassword",
      { email, password },
      (response: { success: boolean; message: string }) => {
        if (response.success) {
          setSuccessMessage(response.message);
          setOpenModalMessage(true);
          setTimeout(() => {
            setSuccessMessage("");
            setOpenModalMessage(false);
            navigate("/login");
          }, 2000);
        } else {
          setOpenModalMessage(true);
          setSuccessMessage(response.message);
          setTimeout(() => {
            setSuccessMessage("");
            setOpenModalMessage(false);
          }, 2000);
        }
      }
    );
  };
  // ---------------
  const handlerVisiblePassword = (): void => {
    const passwordInput = document.getElementById(
      "passwordLogin"
    ) as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
    }
  };

  // ---------------
  return (
    <div className="setpassword registration">
      <ModalMessage message={successMessage} open={openModalMessage} />
      <p className="setpassword-text">
        You only need to add the password for your account once. <br />
        After that, you will be able to log in to the site by all means.
      </p>
      <form>
        <div className="input-password">
          <label htmlFor="password">Password</label>
          <div className="input-area">
            <input
              type="password"
              id="passwordLogin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Eye onClick={() => handlerVisiblePassword()} />
          </div>
        </div>
        {formErrors && (
          <div className="formErrors">
            <div>{formErrors.password}</div>
          </div>
        )}
        <ButtonSuccessWave
          onClick={
            handleSetPassword(e);
          }}
          text="Set password"
        />
      </form>
    </div>
  );
};

export default SetPassword;
