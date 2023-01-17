import React from "react";

import LockIcon from "@mui/icons-material/Lock";

import "./ChatIntro.css";

const ChatIntro = () => {
  return (
    <div className="chatIntro">
      <img src="https://cdn-icons-png.flaticon.com/512/174/174879.png" alt="" />
      <h1>Mantenha seu celular conectado</h1>
      <h2>
        Envie e receba mensagens sem preicsar manter seu celular conteado à
        internet.
        <br />
        Use o WhatsApp em até quatro aparelhos contectados e um celular ao mesmo
        tempo.
      </h2>
      <span>
        <LockIcon /> Protegido com criptografia de ponta a ponta
      </span>
    </div>
  );
};

export default ChatIntro;
