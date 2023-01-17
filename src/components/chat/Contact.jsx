import React from "react";

import { MdOutlineClear } from "react-icons/md";

import "./Contact.css";

const Contact = ({
  data,
  activeContactInfo,
  setActiveContactInfo,
  windowWidth,
}) => {
  return (
    <div
      style={{
        marginRight: activeContactInfo && "0px",
        maxWidth: windowWidth <= 950 && activeContactInfo ? "600px" : "300px",
        width: "100%",
      }}
      className={`contact ${
        localStorage.getItem("dark_mode") == "true" && "dark"
      }`}
    >
      <div className="contact--head">
        <div className="contact--exit">
          <MdOutlineClear onClick={() => setActiveContactInfo(false)} />{" "}
          <h1>Contact info</h1>
        </div>
      </div>
      <div className="contact--container">
        <div className="contact--info">
          <img src={data.picture} alt="" />
          <div className="contact--details">
            <div className="contact--name">{data.name}</div>
            <div className="contact--user">{data.user}</div>
          </div>
        </div>
        <div className="contact--about">
          <h1>Sobre</h1>
          <p>{data.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
