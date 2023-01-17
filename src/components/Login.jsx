import React from "react";

import FirebaseServices from "../services/Api";

import "./Login.css";

const Login = ({ onReceive }) => {
  const handleGoogleLogin = async () => {
    let result = await FirebaseServices.googlePopup();
    if (result) {
      onReceive(result.user);
    } else {
      alert("Error");
    }
  };

  return (
    <div className="login">
      <button onClick={handleGoogleLogin}>Logar com Google</button>
    </div>
  );
};
export default Login;
