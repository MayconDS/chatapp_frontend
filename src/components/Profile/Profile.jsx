import React, { useState, useEffect } from "react";

import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import "./Profile.css";
import FirebaseServices from "../../services/Api";
const Profile = ({ show, setShow, windowWidth, user }) => {
  const [name, setName] = useState(user.name);

  const [bio, setBio] = useState(user.bio);

  const [activeEditName, setActiveEditName] = useState(false);
  const [activeEditBio, setActiveEditBio] = useState(false);
  const [image, setImage] = useState("");

  const handleUpload = () => {
    let file = document.getElementById("file");
    if (file.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(file.files[0]);

      reader.onload = (e) => {
        setImage(e.target.result);
      };
    }
  };

  const handleUpdateName = async () => {
    if (name == "") {
      return alert("Insira algo");
    }
    await FirebaseServices.updateName(user.uid, name);
  };
  const handleUpdateBio = async () => {
    if (bio == "") {
      return alert("Insira algo");
    }
    await FirebaseServices.updateBio(user.uid, bio);
  };
  const handleDeleteAccount = async () => {
    await FirebaseServices.deleteAccount(user.uid);
  };

  const uploadPicture = async () => {
    let file = document.getElementById("file");

    await FirebaseServices.addAvatar(user.uid, file.files[0]);
    setImage("");
  };

  return (
    <div
      style={{
        left: show ? "80px" : "-415px" || windowWidth <= 600 ? "-600px" : "0",
        maxWidth: windowWidth <= 600 ? "520px" : "415px",
        width: windowWidth <= 600 ? "85%" : "",
      }}
      className={`profile ${
        localStorage.getItem("dark_mode") == "true" ? "dark" : ""
      }`}
    >
      <div className="profile--head">
        <div className="profile--backbutton">
          <KeyboardArrowLeftIcon onClick={() => setShow(false)} />
        </div>
        <div className="profile--headtitle">Perfil</div>
      </div>
      <div className="profile--avatar">
        <label htmlFor="file">
          <div className="profile--avatar--display">
            <CameraAltIcon />
            <span>Troque sua foto</span>
          </div>
          <img src={image != "" ? image : user.avatar} alt="" />
        </label>
        <input
          onChange={handleUpload}
          accept="image/gif,image/jpeg,image/jpg,image/png"
          type="file"
          name="file"
          id="file"
        />
        {image != "" && (
          <div className="profile--avatar--buttons">
            <CheckIcon
              onClick={uploadPicture}
              style={{ color: "rgb(3, 255, 116)" }}
            />
            <ClearIcon onClick={() => setImage("")} style={{ color: "red" }} />
          </div>
        )}
      </div>

      <div className="profile--name">
        <div className="profile--name--label">
          <span>Seu nome</span>
        </div>
        <div className="profile--name--title">
          <input
            style={{
              borderBottom: activeEditName ? "2px solid #919eab" : "",
              borderBottomLeftRadius: activeEditName ? "4px" : "",
              borderBottomRightRadius: activeEditName ? "4px" : "",
            }}
            disabled={activeEditName ? false : true}
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
          />{" "}
          {activeEditName ? (
            <div style={{ display: "flex", gap: "8px" }}>
              {" "}
              <CheckIcon
                onClick={function () {
                  setActiveEditName(false);
                  handleUpdateName();
                }}
              />
              <ClearIcon
                onClick={function () {
                  setActiveEditName(false);
                  setName(user.name);
                }}
              />
            </div>
          ) : (
            <div>
              <EditIcon onClick={() => setActiveEditName(true)} />
            </div>
          )}
        </div>
      </div>
      <div className="profile--note">
        <p>
          Esse é o nome que ficara dispónivel para seus amigos, não é seu
          usuário
        </p>
      </div>
      <div className="profile--bio">
        <div className="profile--bio--label">
          <span>Sua biografia</span>
        </div>
        <div className="profile--bio--title">
          <input
            style={{
              borderBottom: activeEditBio ? "2px solid #919eab" : "",
              borderBottomLeftRadius: activeEditBio ? "4px" : "",
              borderBottomRightRadius: activeEditBio ? "4px" : "",
            }}
            disabled={activeEditBio ? false : true}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            type="text"
          />{" "}
          {activeEditBio ? (
            <div style={{ display: "flex", gap: "8px" }}>
              {" "}
              <CheckIcon
                onClick={function () {
                  setActiveEditBio(false);
                  handleUpdateBio();
                }}
              />
              <ClearIcon
                onClick={function () {
                  setActiveEditBio(false);
                  setBio(user.bio);
                }}
              />
            </div>
          ) : (
            <div>
              <EditIcon onClick={() => setActiveEditBio(true)} />
            </div>
          )}
        </div>
      </div>
      <div className="profile--delete">
        <div className="profile--title">
          <h1>Deletar conta</h1>
        </div>
        <div className="profile--caution">
          <p>
            Isso vai deletar sua conta permanentemente e seus dados, você não
            ira conseguir reativar esta conta
          </p>
        </div>
        <button onClick={() => handleDeleteAccount()}>DELETAR CONTA</button>
      </div>
    </div>
  );
};

export default Profile;
