import React from "react";

import "./ChatIntro.css";

const ChatIntro = () => {
  return (
    <div
      className={`chatIntro ${
        localStorage.getItem("dark_mode") == "true" ? "dark" : ""
      }`}
    >
      <img
        src="https://8826380.fs1.hubspotusercontent-na1.net/hubfs/8826380/HiveWatch_September2022/Images/services-3.png"
        alt=""
      />
      <h1>Bate-Papo em tempo real</h1>
      <h2>
        Envie e receba mensagens sem precisar adicionar alguem,
        <br />
        Use o ChatApp em seu celular e computador
      </h2>
    </div>
  );
};

export default ChatIntro;
