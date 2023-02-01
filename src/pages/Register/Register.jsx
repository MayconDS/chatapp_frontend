import React, { useEffect, useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import "./Register.css";
import { Link, Navigate } from "react-router-dom";
import FirebaseServices, { Auth } from "../../services/Api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (email == "" || name == "" || user == "" || password == "") {
      return alert("Preencha todos os campos");
    }

    try {
      await createUserWithEmailAndPassword(Auth, email, password)
        .then(async (response) => {
          await FirebaseServices.addUser({
            uid: response.user.uid,
            name: name,
            email: email,
            user: user,
          });
        })
        .catch((err) => {
          console.log(err.message);
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
          <div id="field" className="email">
            <input
              type="email"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div id="field" className="name">
            <input
              type="text"
              placeholder="Nome completo"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div id="field" className="user">
            <input
              type="text"
              placeholder="Nome de usuário"
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div id="field" className="password">
            <input
              type={showPassword == true ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={function (e) {
                setPassword(e.target.value);
              }}
            />
            {showPassword == true ? (
              <AiOutlineEye onClick={() => setShowPassword(false)} />
            ) : (
              <AiOutlineEyeInvisible onClick={() => setShowPassword(true)} />
            )}
          </div>
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
