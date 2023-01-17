import React, { useState } from "react";

import "./Register.css";
import { Link, Navigate } from "react-router-dom";
import UserServices from "../../services/user/user";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (email == "" || name == "" || user == "" || password == "") {
      return alert("Preencha todos os campos");
    }

    try {
      const User = await UserServices.register({
        user: user,
        name: name,
        email: email,
        password: password,
      });

      setRedirectToLogin(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  if (redirectToLogin) return <Navigate to="/login" />;

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <header>
          <h1>ChatApp</h1>
          <p>
            Cadastre-se para conversar
            <br />
            com seus amigos
          </p>
        </header>
        <div className="register-form">
          <input
            type="text"
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nome completo"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nome de usuário"
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            type="text"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
          />
          <p>Seus dados estão seguros.</p>
          <button>Cadastre-se</button>
        </div>
        <footer>
          <span>
            Tem uma conta? <Link to="/login">Conecte-se</Link>
          </span>
        </footer>
      </form>
    </div>
  );
};

export default Register;
