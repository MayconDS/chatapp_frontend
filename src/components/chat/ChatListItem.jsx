import React, { useEffect, useState } from "react";

import "./ChatListItem.css";

import moment from "moment";

const ChatListItem = ({ onClick, active, data }) => {
  const [time, setTime] = useState(``);

  useEffect(() => {
    if (data.lastMessageDate) {
      setTime(moment(data.lastMessageDate).format("HH:mm"));
    }
  }, [data]);

  return (
    <div
      onClick={onClick}
      className={`chatListItem ${
        localStorage.getItem("dark_mode") == "true" ? "dark" : ""
      } ${active && `active`}`}
    >
      <img src={data.with[0].picture} id="chatListItem--avatar" />
      <div className="chatListItem--lines">
        <div className="chatListItem--line">
          <div className="chatListItem--name">{data.with[0].name}</div>
          <div className="chatListItem--box">
            <div className="chatListItem--date">{time}</div>
            <div className="chatListItem--status">{data.with[0].status}</div>
          </div>
        </div>
        <div className="chatListItem--line">
          <div className="chatListITem--lastMsg">
            <p>{data.lastMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatListItem;
