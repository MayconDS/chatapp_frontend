import React, { useState, useEffect } from "react";

import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

import { BsChatDots, BsPeople } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineClear } from "react-icons/md";

import ChatListItem from "../../components/chat/ChatListItem";
import ChatIntro from "../../components/chat/ChatIntro";
import ChatWindow from "../../components/chat/ChatWindow";
import NewChat from "../../components/chat/NewChat";

import ChatServices from "../../services/chats/chat";

import socketIOClient from "socket.io-client";
import "./Home.css";
import Profile from "../../components/Profile/Profile";
import UserServices from "../../services/user/user";

import { DarkModeSwitch } from "react-toggle-dark-mode";

function Home() {
  const [activeChatIcon, setActiveChatIcon] = useState(false);
  const [activeContactIcon, setActiveContactIcon] = useState(false);
  const [activeLogoutIcon, setActiveLogoutIcon] = useState(false);
  const [activeProfileIcon, setActiveProfileIcon] = useState(false);

  const [isDarkMode, setDarkMode] = React.useState(false);

  const [chatlist, setChatlist] = useState([]);
  const [activeChat, setActiveChat] = useState({});
  const [userOnline, setUserOnline] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [closeChat, setCloseChat] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("chatapp_user"))
  );
  const [showNewChat, setShowNewChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const socket = socketIOClient("https://chatapp-op54.onrender.com", {
    auth: {
      key: user._id,
    },
  });

  const Resize = (e) => {
    if (e.currentTarget.innerWidth > 600) {
      setCloseChat(false);
    }
    setWindowWidth(e.currentTarget.innerWidth);
  };

  useEffect(() => {
    const getList = async () => {
      if (user !== null) {
        let chats = await ChatServices.onChatList();
        setChatlist(chats);
      }
    };

    getList();
    socket.on("new-lastmessage", (last) => {
      if (last) {
        console.log(last);
        getList();
      }
    });

    const reloadUser = async () => {
      let newUser = await UserServices.get();

      setUser(newUser);
    };
    socket.on("user_updated", async (condition) => {
      if (condition.condition == "reload_user") {
        getList();
        await reloadUser();
      }
    });
  }, [user]);

  const logOut = async () => {
    await UserServices.logout();
  };

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    localStorage.setItem("dark_mode", checked);
  };

  window.addEventListener("resize", Resize);

  return (
    <div
      onResize={(e) => Resize(e)}
      className={`home-window ${
        localStorage.getItem("dark_mode") == "true" ? "dark" : ""
      }`}
    >
      {user && (
        <>
          <div className={`navbar`}>
            <div className="navbar--top">
              <div className="navbar--avatar">
                <img
                  className={`header--avatar ${user.online && "online"}`}
                  src={user.picture}
                  onClick={function () {
                    setShowProfile(true);
                    setShowNewChat(false);
                  }}
                />
              </div>
              <div
                onClick={function () {
                  setActiveContactIcon(false);
                  setActiveChatIcon(true);
                  setShowNewChat(false);
                  setShowProfile(false);
                  setActiveSettingIcon(false);
                }}
                className={`navbar--chats icons  ${activeChatIcon && "active"}`}
              >
                <BsChatDots id="icon" />
              </div>
              <div
                onClick={function () {
                  setShowNewChat(true);
                  setShowProfile(false);
                  setActiveContactIcon(true);
                  setActiveChatIcon(false);
                }}
                className={`navbar--contacts icons ${
                  activeContactIcon && "active"
                }`}
              >
                <BsPeople id="icon" />
              </div>
              <div
                style={{
                  width: "70%",
                  height: "0.1px",
                  backgroundColor:
                    localStorage.getItem("dark_mode") == "true"
                      ? " #313539"
                      : "#B4B4B4",
                }}
                id="line"
              ></div>

              <div
                onClick={function () {
                  setActiveContactIcon(false);
                  setActiveChatIcon(false);
                  setActiveSettingIcon(true);
                }}
                className={`navbar--logout icons ${
                  activeLogoutIcon && "active"
                }`}
              >
                <LogoutIcon id="icon" onClick={() => logOut()} />
              </div>
            </div>
            <div className="navbar--bottom">
              <div className="navbar--theme icons">
                <DarkModeSwitch
                  style={{ width: "30px" }}
                  sunColor={"#f39c12"}
                  moonColor={"#f1c40f"}
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  size={120}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              position: windowWidth <= 650 ? "fixed" : "relative",
              left:
                windowWidth > 650
                  ? 0
                  : windowWidth <= 650 && activeChat.chatId !== undefined
                  ? -600
                  : 80,

              height: "100%",
            }}
            className="sidebar"
          >
            <NewChat
              windowWidth={windowWidth}
              socket={socket}
              user={user}
              chatlist={chatlist}
              setChatlist={setChatlist}
              show={showNewChat}
              setShow={setShowNewChat}
            />
            <Profile
              user={user}
              windowWidth={windowWidth}
              show={showProfile}
              setShow={setShowProfile}
            />
            <header>
              <h1>Chats</h1>
              <div className="header--buttons">
                <div className="header--btn">
                  <MdOutlineClear />
                  <span>Clear chats</span>
                </div>
              </div>
            </header>
            <div className="search">
              <div className="search--input">
                <SearchIcon />{" "}
                <input
                  type="search"
                  placeholder="Procurar ou começar uma nova conversa"
                />
              </div>
            </div>
            <div className="chatlist">
              <h1>Todas as conversas</h1>

              {chatlist.chats &&
                chatlist.chats.map((chat, key) => (
                  <ChatListItem
                    onClick={() => setActiveChat(chatlist.chats[key])}
                    data={chat}
                    key={key}
                    active={activeChat.chatId === chatlist.chats[key].chatId}
                  />
                ))}
            </div>
          </div>
          <div className="contentarea">
            {activeChat.chatId !== undefined && (
              <>
                <ChatWindow
                  setActiveChat={setActiveChat}
                  setCloseChat={setCloseChat}
                  windowWidth={windowWidth}
                  data={activeChat}
                  user={user}
                  socket={socket}
                />
              </>
            )}
            {activeChat.chatId === undefined && <ChatIntro />}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
