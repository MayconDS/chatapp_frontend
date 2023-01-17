import React, { useState, useEffect } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";

import { BsChatDots } from "react-icons/bs";
import { MdClear } from "react-icons/md";

import "./NewChat.css";
import ChatServices from "../../services/chats/chat";
import UserServices from "../../services/user/user";
const NewChat = ({
  show,
  windowWidth,
  setShow,
  user,
  chatlist,
  setChatlist,
  socket,
}) => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  const getList = async () => {
    if (user !== null) {
      let results = await ChatServices.getContactList();
      setList(results);
    }
  };

  useEffect(() => {
    getList();
  }, [user]);

  const addNewChat = async (targetUser) => {
    await ChatServices.addNewChat(user.user, targetUser.user);
    socket.on("new-chat", (chats) => {
      let oldChats = chatlist;
      oldChats.chats.push(chats[0]);
      setChatlist(oldChats);
    });
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (search == "") {
      alert("Invalid search");
    }
    let contacts = await UserServices.searchContact(search);
    setList(contacts);
  };

  return (
    <div
      style={{
        left: show ? "80px" : "-415px" || windowWidth <= 600 ? "-600px" : "0",
        maxWidth: windowWidth <= 600 ? "600px" : "415px",
        width: windowWidth <= 600 ? "85%" : "",
      }}
      className={`newChat ${
        localStorage.getItem("dark_mode") == "true" ? "dark" : ""
      }`}
    >
      <div className="newChat--head">
        <div onClick={handleClose} className="newChat--backbutton">
          <ArrowBackIcon />
        </div>
        <div className="newChat--headtitle">Nova conversa</div>
      </div>
      <div className="newChat--form">
        <form onSubmit={handleSubmit}>
          <div className="input--field">
            <SearchIcon />{" "}
            <input
              value={search}
              type="text"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <MdClear
              onClick={function () {
                setSearch("");
                getList();
              }}
            />
          </div>
        </form>
      </div>
      <div className="newChat--list">
        {list.map((item, key) => (
          <div
            onClick={() => addNewChat(item)}
            key={key}
            className="newChat--item"
          >
            <div className="newChat--contact">
              <img className="newChat--itemavatar" src={item.picture} alt="" />
              <div className="newChat--iteminfo">
                <div className="newChat--itemname">{item.name}</div>
                <div className="newChat--itemstatus">
                  {item.online && "Online"}
                </div>
              </div>
            </div>

            <div className="newChat--icon">
              <BsChatDots />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewChat;
