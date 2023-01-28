import React, { useEffect, useState } from "react";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import "./MessageItem.css";
import FirebaseServices from "../../services/Api";

const MessageItem = ({ data, user }) => {
  const [time, setTime] = useState(``);
  const [msgHover, setMsgHover] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (data.date > 0) {
      let d = new Date(data.date.seconds * 1000);
      let hours = d.getHours();
      let minutes = d.getMinutes();
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      setTime(`${hours}:${minutes}`);
    }
  }, [data]);

  const deleteMessage = async () => {
    await FirebaseServices.deleteMessage(data);
  };

  return (
    <>
      <div
        style={{
          justifyContent:
            user.uid === data.author.uid ? `flex-end` : `flex-start`,
        }}
        className="messageLine"
      >
        <div
          onMouseEnter={() => setMsgHover(true)}
          onMouseLeave={() => setMsgHover(false)}
          style={{
            flexDirection: user.uid === data.author.uid ? `row-reverse` : `row`,
          }}
          className="messageSide"
        >
          <div
            style={{
              right: openModal && user.uid === data.author.uid ? `140px` : null,

              display:
                openModal & (user.uid === data.author.uid) ? "block" : "none",
            }}
            className="modal"
          >
            <button
              onClick={() => deleteMessage()}
              style={{ cursor: "pointer" }}
            >
              Apagar mensagem
            </button>
          </div>
          <div className="messageAvatar">
            <img
              src={data.author.avatar}
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
              backgroundColor:
                user.uid === data.author.uid ? `#5B96F7` : `#fff`,
              boxShadow:
                user.uid === data.author.uid
                  ? "0 1px 1px #5B96F7"
                  : "0 1px 1px #ccc",
              position: "relative",
            }}
            className="messageItem"
          >
            <div className="messageText">
              {" "}
              <p
                style={{
                  color: user.uid === data.author.uid ? "#fff" : "#000",
                }}
              >
                {data.body}
              </p>
            </div>
            <div
              style={{
                color:
                  user.uid === data.author.uid ? "rgb(214, 213, 213)" : "#999",
              }}
              className="messageDate"
            >
              {time}
              {msgHover ? (
                openModal == true ? (
                  <KeyboardArrowUpIcon
                    cursor="pointer"
                    style={{
                      position: "absolute",
                      right: "4px",
                      top: "5px",
                      fontSize: "25px",
                      backgroundColor:
                        user.uid === data.author.uid ? `#5B96F7` : `#fff`,
                      borderRadius: "90px",
                    }}
                    onClick={() => setOpenModal(false)}
                  />
                ) : (
                  <KeyboardArrowDownIcon
                    cursor="pointer"
                    style={{
                      position: "absolute",
                      right: "4px",
                      top: "5px",
                      fontSize: "25px",
                      backgroundColor:
                        user.uid === data.author.uid ? `#5B96F7` : `#fff`,
                      borderRadius: "90px",
                    }}
                    onClick={() => setOpenModal(true)}
                  />
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MessageItem;
