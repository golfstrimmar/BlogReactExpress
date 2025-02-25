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
  const [formErrors, setFormErrors] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  // =========================

  // =========================
  
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
          <ButtonSuccessWave type="submit" onClick={handleLogin} text="Login" />
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
