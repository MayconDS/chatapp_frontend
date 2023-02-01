import React, { useState } from "react";

import "./Login.css";
import { Link, Navigate } from "react-router-dom";
import FirebaseServices, { Auth } from "../../services/Api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      await FirebaseServices.login({
        email,
        password,
      });
      setRedirectToHome(true);
    } catch (error) {}
  };

  if (redirectToHome) return <Navigate to="/" />;

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <header>
          <h1>ChatApp</h1>
        </header>
        <div className="login-form">
          <div className="email" id="field">
            <input
              type="email"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="password" id="field">
            <input
              type={showPassword == true ? "text" : "password"}
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword == true ? (
              <AiOutlineEye onClick={() => setShowPassword(false)} />
            ) : (
              <AiOutlineEyeInvisible onClick={() => setShowPassword(true)} />
            )}
          </div>

          <button>Entrar</button>
        </div>
        <footer>
          <span>
            Não tem uma conta? <Link to="/register">Cadestre-se</Link>
          </span>
        </footer>
      </form>
    </div>
  );
};

export default Login;
