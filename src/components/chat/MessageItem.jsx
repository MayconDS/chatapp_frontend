import React, { useEffect, useState } from "react";

import moment from "moment";

import "./MessageItem.css";

const MessageItem = ({ data, user }) => {
  const [time, setTime] = useState(``);

  useEffect(() => {
    if (data.date) {
      setTime(moment(data.date).format("HH:mm"));
    }
  }, [data]);

  return (
    <div
      style={{
        justifyContent:
          user._id === data.author._id ? `flex-end` : `flex-start`,
      }}
      className="messageLine"
    >
      <div
        style={{
          flexDirection: user._id === data.author._id ? `row-reverse` : `row`,
        }}
        className="messageSide"
      >
        <div className="messageAvatar">
          <img
            src={data.author.picture}
            style={{
              height: "28px",
              width: "28px",
              borderRadius: "50%",
              marginTop: "3px",
            }}
          />
        </div>
        <div
          style={{
            backgroundColor: user._id === data.author._id ? `#5B96F7` : `#fff`,
            boxShadow:
              user._id === data.author._id
                ? "0 1px 1px #5B96F7"
                : "0 1px 1px #ccc",
          }}
          className="messageItem"
        >
          <div className="messageText">
            {" "}
            <p
              style={{ color: user._id === data.author._id ? "#fff" : "#000" }}
            >
              {data.body}
            </p>
          </div>
          <div
            style={{
              color:
                user._id === data.author._id ? "rgb(214, 213, 213)" : "#999",
            }}
            className="messageDate"
          >
            {time}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MessageItem;
