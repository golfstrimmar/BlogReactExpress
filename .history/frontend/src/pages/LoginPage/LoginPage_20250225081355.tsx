import React, { useState, useEffect, useRef } from "react";
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
interface User {
  _id?: string;
  userName?: string;
}
interface SocketData {
  user: User;
  message: string;
  token: string;
  error: string;
  currentemail?: string;
  passwordrequired?: string;
}
interface GoogleLoginResponse {
  credential: string | undefined;
}
interface GoogleLoginError {
  error: string;
  details?: string; // Дополнительная информация, если есть
}
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSelector((state: any) => state.socket.socket);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  // =========================

  // =========================
  useEffect(() => {
    if (socket) {
      socket.on("loginSuccess", (data: SocketData) => {
        console.log("Login successful: ", data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        console.log("===--- user ---====", data.user);
        console.log("===--- token ---====", data.token);
        dispatch(setUser({ user: data.user, token: data.token }));
        setSuccessMessage(data.message);
        setOpenModalMessage(true);

        setTimeout(() => {
          setSuccessMessage("");
          setOpenModalMessage(false);
          navigate("/profile");
        }, 2000);
      });

      socket.on("loginError", (data: SocketData) => {
        console.log("===---currentemail email ---====", data.currentemail);
        console.log(
          "====loginError from server=====",
          data.message,
          data.error
        );
        setSuccessMessage(data.message);
        setOpenModalMessage(true);
        setTimeout(() => {
          setSuccessMessage("");
          setOpenModalMessage(false);
          if (data.passwordrequired) {
            navigate(`/setpassword/${data.currentemail}`);
          }
          setEmail("");
        }, 2000);
      });

      socket.on("googleLoginSuccess", (data: SocketData) => {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        dispatch(setUser({ user: data.user, token: data.token }));
        setSuccessMessage("Google login successful");
        setOpenModalMessage(true);
        setTimeout(() => {
          setSuccessMessage("");
          setOpenModalMessage(false);
          navigate("/profile");
        }, 2000);
      });

      socket.on("googleloginError", (data: SocketData) => {
        console.error(data.message, data.error);
        const combinedMessage = `${data.message} - ${data.error}`;
        setSuccessMessage(combinedMessage);
        setOpenModalMessage(true);
        setTimeout(() => {
          setSuccessMessage("");
          setOpenModalMessage(false);
        }, 2000);
      });
    }
  }, [socket, dispatch, navigate]);
  // ===============================
  // ===============================
  // ===============================
  const validateForm = () => {
    let isValid = true;
    let errors = { email: "", password: "" };

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
  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (socket) {
      socket.emit("login", { email, password });
    }
  };
  // ===============================
  // ===============================
  // ===============================
  const handleGoogleLoginSuccess = (response: GoogleLoginResponse): void => {
    const { credential } = response; // Получаем token от Google
    console.log("Успех:", response);
    // Проверим, что токен существует
    if (!credential) {
      console.error("Google login failed: No credential provided");
      setSuccessMessage("Google login failed");
      setOpenModalMessage(true);
      setTimeout(() => {
        setSuccessMessage("");
        setOpenModalMessage(false);
      }, 5000);
      return;
    }

    // Отправка токена на сервер через сокет
    if (socket) {
      socket.emit("googleLogin", { token: credential });
    }
  };
  const handleGoogleLoginFailure = (error: GoogleLoginError): void => {
    console.error("=======Google login failed======", error);
    setSuccessMessage("Google login failed");
    setOpenModalMessage(true);
    setTimeout(() => {
      setSuccessMessage("");
      setOpenModalMessage(false);
    }, 2000);
  };
  // ===============================
  // ===============================
  // ===============================
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const handlerVisiblePassword = () => {
    if (passwordInputRef.current) {
      // Переключаем тип поля ввода (password <-> text)
      passwordInputRef.current.type =
        passwordInputRef.current.type === "password" ? "text" : "password";
    }
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  };
  // =========================
  return (
    <div className="registration">
      <ModalMessage message={successMessage} open={openModalMessage} />
      <div className="container">
        <h2>Login</h2>
        <form>
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
              <div>{formErrors.email}</div>
              <div>{formErrors.password}</div>
            </div>
          )}

          {/* Google Login */}
          <button className="googleLoginButton">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            />
          </button>

          {/* Regular login */}
          <ButtonSuccessWave onClick={handleLogin} text="Login" />
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
