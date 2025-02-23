import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonSuccessWave from "../../components/ButtonSuccessWave/ButtonSuccessWave";
import { useSelector } from "react-redux";
import "./RegisterPage.scss";
import { ReactComponent as Eye } from "../../assets/svg/eye.svg";
import ModalMessage from "../../components/ModalMessage/ModalMessage";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
const RegisterPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const socket = useSelector((state) => state.socket.socket);
  const [successMessage, setSuccessMessage] = useState("");
  const [openModalMessage, setOpenModalMessage] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("registrationSuccess", (data) => {
        console.log("===--- registrationSuccess ---====", data);
        setSuccessMessage(data.message);
        setOpenModalMessage(true);
        setTimeout(() => {
          setSuccessMessage("");
          setOpenModalMessage(false);
          navigate("/login");
        }, 2000);
      });
      socket.on("googleRegisterSuccess", (data) => {
        console.log("===--- googleRegisterSuccess ---====", data);
        console.log("===--- data.user ---====", data.user);
        console.log("===--- data.token ---====", data.token);
        setSuccessMessage(data.message);
        setOpenModalMessage(true);
        setTimeout(() => {
          setSuccessMessage("");
          setOpenModalMessage(false);
          navigate("/login");
        }, 2000);
      });

      socket.on("registrationError", (data) => {
        console.log("===--- registrationError ---====", data.error);
        setSuccessMessage(data.message);
        setOpenModalMessage(true);
        setTimeout(() => {
          setSuccessMessage("");
          setOpenModalMessage(false);
        }, 2000);
      });
    }
  }, [socket]);

  const validateForm = () => {
    let isValid = true;
    let errors = { username: "", email: "", password: "" };
    if (!username) {
      errors.username = "Username is required";
      isValid = false;
    }
    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is not valid";
      isValid = false;
    }
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

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("===--- register ---====", username, email, password);
    if (socket) {
      socket.emit("register", { username, email, password });
    }
  };

  // Видимость пароля
  const handlerVisiblePassword = () => {
    const passwordInput = document.getElementById("password");
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  };

  // Обработка ответа от Google
  const responseGoogle = (response) => {
    if (response.error) {
      console.log(
        "===--- Google registration failed. Please try again. ---===="
      );
      return;
    }
    const { credential } = response; // Получаем токен Google
    console.log("Google token received:", credential);
    // Отправляем токен на сервер через сокет
    if (socket) {
      socket.emit("googleRegister", { token: credential });
    }
  };
  return (
    <div className="registration">
      <div className="container">
        <ModalMessage message={successMessage} open={openModalMessage} />
        <h2>Registration</h2>
        <form>
          <div className="input-field">
            <input
              type="text"
              id="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="name">User name</label>
          </div>
          <div className="input-field">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">User Email</label>
          </div>
          <div className="input-password">
            <label htmlFor="password">Password</label>
            <div className="input-area">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Eye onClick={handlerVisiblePassword}></Eye>
            </div>
          </div>

          {formErrors && (
            <div className="formErrors">
              <div>{formErrors.username}</div>
              <div>{formErrors.email}</div>
              <div>{formErrors.password}</div>
            </div>
          )}

          <button className="googleLoginButton">
            <GoogleOAuthProvider clientId="847479195080-75v4gagj4jlltu9572lsfpime7jbpp8s.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={responseGoogle}
                onError={() => {
                  setOpenModalMessage(true);
                  setSuccessMessage("Failed to log in via Google.");
                }}
              />
            </GoogleOAuthProvider>
          </button>
          {error && <div className="error-message">{error}</div>}
          <ButtonSuccessWave
            type="submit"
            onClick={(e) => {
              handleRegister(e);
            }}
            text="Registration"
          />
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
