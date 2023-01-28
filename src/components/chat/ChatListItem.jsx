import React, { useEffect, useState } from "react";

import "./ChatListItem.css";

import moment from "moment";
import FirebaseServices from "../../services/Api";

const ChatListItem = ({
  onClick,
  active,
  data,
  user,
  clickOutChat,
  setClickOutChat,
  setActiveChat,
}) => {
  const [time, setTime] = useState(``);
  const [contact, setContact] = useState();
  const [modal, setModal] = useState(false);

  useEffect(() => {
    data.users.map((item) => {
      if (user.uid !== item.uid) {
        setContact(item);
      }
    });
    if (data.messages.length > 0) {
      if (data.messages[data.messages.length - 1].date > 0) {
        let d = new Date(data.messages[data.messages.length - 1].date * 1000);
        let hours = d.getHours();
        let minutes = d.getMinutes();
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        setTime(`${hours}:${minutes}`);
      }
    }
  }, [data]);

  useEffect(() => {
    if (clickOutChat == false) {
      setModal(false);
    }
  }, [clickOutChat]);

  const clearMessages = async () => {
    await FirebaseServices.clearMessages(data);
  };
  const deleteChat = async () => {
    await FirebaseServices.deleteChat(data);
    setActiveChat({});
  };
  return (
    <>
      {contact && (
        <div
          onClick={function () {
            onClick();
          }}
          className={`chatListItem ${
            localStorage.getItem("dark_mode") == "true" ? "dark" : ""
          } ${active && `active`}`}
          onContextMenu={(evt) => evt.preventDefault()}
          onAuxClick={function () {
            setModal(true);
            setClickOutChat(true);
          }}
        >
          <div
            style={{ display: modal == true ? "flex" : "none" }}
            className="modal--chatlist"
          >
            <button onClick={() => deleteChat()}>Deletar chat</button>
            <button onClick={() => clearMessages()}>Limpar conversas</button>
          </div>
          <img id="chatListItem--avatar" src={contact.avatar} />
          <div className="chatListItem--lines">
            <div className="chatListItem--line">
              <div className="chatListItem--name">{contact.name}</div>
              <div className="chatListItem--box">
                <div className="chatListItem--date">{time}</div>
                <div className="chatListItem--status">{"ONLINE"}</div>
              </div>
            </div>
            <div className="chatListItem--line">
              <div className="chatListITem--lastMsg">
                <p>
                  {data.messages.length > 0 &&
                    data.messages[data.messages.length - 1].body}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ChatListItem;
