import "./Home.css";
import React, { useState, useEffect, useMemo } from "react";

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

import Profile from "../../components/Profile/Profile";

import { DarkModeSwitch } from "react-toggle-dark-mode";
import FirebaseServices from "../../services/Api";

function Home() {
  const [activeChatIcon, setActiveChatIcon] = useState(false);
  const [activeContactIcon, setActiveContactIcon] = useState(false);
  const [activeLogoutIcon, setActiveLogoutIcon] = useState(false);
  const [activeProfileIcon, setActiveProfileIcon] = useState(false);
  const [clickOutChat, setClickOutChat] = useState(null);

  const [isDarkMode, setDarkMode] = React.useState(false);
  const [namesAndUsersOfChats, setNamesAndUsersOfChats] = useState();
  const [search, setSearch] = useState("");
  const [chatlist, setChatlist] = useState([]);
  const [chatlistBackup, setChatlistBackup] = useState([]);
  const [activeChat, setActiveChat] = useState({});
  const [userOnline, setUserOnline] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [closeChat, setCloseChat] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("chatapp_user"))
  );
  const [showNewChat, setShowNewChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const getChatList = () => {
    if (user !== null) {
      let unsub = FirebaseServices.onChatList(
        user.uid,
        setChatlist,
        setChatlistBackup
      );
      return unsub;
    }
  };

  const Resize = (e) => {
    if (e.currentTarget.innerWidth > 600) {
      setCloseChat(false);
    }
    setWindowWidth(e.currentTarget.innerWidth);
  };

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    localStorage.setItem("dark_mode", checked);
  };

  useEffect(() => {
    const getUser = () => {
      FirebaseServices.getUser(user.uid, setUser);
    };
    getUser();
  }, []);

  useEffect(() => {
    const monitoringUser = async () => {
      let unsub = FirebaseServices.monitoringUser(user.uid, setUser);
      return unsub;
    };
    monitoringUser();
  }, []);

  useEffect(() => {
    getChatList();
  }, [user]);
  useEffect(() => {
    const filterChat = () => {
      if (chatlistBackup) {
        let list = [];
        let namesAndUsers = [];
        chatlistBackup.map((item) => {
          item.users.map((item2) => {
            if (item2.user !== user.user) {
              namesAndUsers.push(item2.name, item2.user);
            }
          });
        });
        const lowerSearch = search.toLowerCase();

        let chatsFilter = namesAndUsers.filter((text) => {
          return text.toLowerCase().includes(lowerSearch);
        });
        chatsFilter.forEach((chat) => {
          chatlistBackup.map((item) => {
            item.users.map((item2) => {
              if (
                item2.user.toLowerCase() == chat.toLowerCase() ||
                item2.name.toLowerCase() == chat.toLowerCase()
              ) {
                list.push(item);
              } else {
                list = [];
              }
            });
          });
        });

        setChatlist(list);
      }
    };
    filterChat();
  }, [search]);
  useEffect(() => {
    if (showNewChat == false && showProfile == false) {
      setActiveChatIcon(true);
      setActiveContactIcon(false);
    }
  }, [showNewChat, showProfile]);

  window.addEventListener("resize", Resize);

  const logOut = () => {
    localStorage.removeItem("chatapp_user");
    localStorage.removeItem("chatapp_token");
    window.location.reload();
  };

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
                  src={user.avatar}
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
            </header>
            <div className="search">
              <div className="search--input">
                <SearchIcon />{" "}
                <input
                  type="search"
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Procurar ou começar uma nova conversa"
                />
              </div>
            </div>
            <div onClick={() => setClickOutChat(false)} className="chatlist">
              <h1>Todas as conversas</h1>

              {chatlist &&
                chatlist.map((chat, key) => (
                  <ChatListItem
                    setActiveChat={setActiveChat}
                    setClickOutChat={setClickOutChat}
                    clickOutChat={clickOutChat}
                    user={user}
                    onClick={() => setActiveChat(chatlist[key])}
                    data={chat}
                    key={key}
                    active={activeChat.chatId === chatlist[key].chatId}
                  />
                ))}
            </div>
          </div>
          <div className="contentarea">
            {activeChat.chatId !== undefined && (
              <>
                <ChatWindow
                  activeContactIcon={showProfile}
                  activeProfileIcon={showNewChat}
                  setActiveChat={setActiveChat}
                  setCloseChat={setCloseChat}
                  windowWidth={windowWidth}
                  data={activeChat}
                  user={user}
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
