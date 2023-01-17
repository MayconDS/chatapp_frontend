import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";

import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import "./ChatWindow.css";
import MessageItem from "./MessageItem";
import ChatServices from "../../services/chats/chat";
import Contact from "./Contact";

const ChatWindow = ({
  user,
  data,
  socket,
  windowWidth,
  setCloseChat,
  setActiveChat,
}) => {
  const body = useRef();

  socket.on("new-message", (msg) => {
    setList(msg);
  });

  const [activeContactInfo, setActiveContactInfo] = useState(false);

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);

  let recognition = null;
  let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition !== undefined) {
    recognition = new SpeechRecognition();
  }

  const handleMicClick = () => {
    if (recognition !== null) {
      recognition.onaudiostart = () => {
        setListening(true);
        console.log("começou");
      };

      recognition.onaudioend = () => {
        setListening(false);
        console.log("parou");
      };

      recognition.onresult = (e) => {
        setText(e.results[0][0].transcript);
        console.log(e);
      };
      recognition.onerror = (e) => {
        console.log(e);
      };
      recognition.start();
    }
  };
  const handleSendClick = () => {
    if (text !== "") {
      ChatServices.sendMessage(data.chatId, user._id, "text", text, users);
      setText("");
      setEmojiOpen(false);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setText(text + emojiObject.emoji);
  };

  const handleInputKeyUp = (e) => {
    if (e.keyCode == 13) {
      handleSendClick();
    }
  };

  const handleCloseChat = () => {
    setActiveChat({});
    setCloseChat(true);
  };

  useEffect(() => {
    if (body.current.scrollHeight > body.current.offsetHeight) {
      body.current.scrollTop =
        body.current.scrollHeight - body.current.offsetHeight;
    }
  }, [list]);

  useEffect(() => {
    const monitoringMessages = async () => {
      setList([]);

      let chatContent = await ChatServices.onChatContent(data.chatId);
      setUsers(chatContent.users);
      setList(chatContent.messages);
    };
    monitoringMessages();
  }, [data.chatId]);

  return (
    <div className="body">
      <div
        className={`chatWindow ${
          localStorage.getItem("dark_mode") == "true" ? "dark" : ""
        }`}
        style={{
          display:
            windowWidth <= 950 && activeContactInfo == true ? "none" : "flex",
        }}
      >
        <div className="chatWindow--header">
          <div className="chatWindow--headerinfo">
            <button
              onClick={handleCloseChat}
              style={{
                cursor: "pointer",
                marginLeft: "10px",
                marginRight: "10px",
                display: windowWidth <= 600 ? "flex" : "none",
                alignItems: "center",
                backgroundColor: "transparent",
                border: "none",
              }}
            >
              <KeyboardReturnIcon />
            </button>
            <img
              onClick={() => setActiveContactInfo(true)}
              className="chatWindow--avatar"
              src={data.with[0].picture}
              alt=""
            />
            <div
              onClick={() => setActiveContactInfo(true)}
              className="chatWindow--name"
            >
              {data.with[0].name}
            </div>
          </div>
          <div className="chatWindow--headerbuttons">
            <div className="chatWindow--btn">
              <SearchIcon />
            </div>
            <div className="chatWindow--btn">
              <AttachFileIcon />
            </div>
            <div className="chatWindow--btn">
              <MoreVertIcon />
            </div>
          </div>
        </div>
        <div ref={body} className="chatWindow--body">
          {list.map((item, key) => (
            <MessageItem key={key} user={user} data={item} />
          ))}
        </div>
        {emojiOpen && (
          <div className="chatWindow--emojiarea">
            <EmojiPicker
              skinTonesDisabled
              onEmojiClick={(e) => handleEmojiClick(e)}
            />
          </div>
        )}

        <div className="chatWindow--footer">
          <div className="chatWindow--pre">
            <div
              style={{ width: emojiOpen ? "40px" : "0px" }}
              className="chatWindow--btn"
              onClick={() => setEmojiOpen(false)}
            >
              <CloseIcon />
            </div>
            <div onClick={() => setEmojiOpen(true)} className="chatWindow--btn">
              <InsertEmoticonIcon
                style={{ color: emojiOpen ? "#5465a1" : "#7289da" }}
              />
            </div>
          </div>
          <div className="chatWindow--inputarea">
            <input
              className="chatWindow--input"
              placeholder="Digite uma mensagem"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyUp={handleInputKeyUp}
            />
          </div>
          <div className="chatWindow--pos">
            {text === "" ? (
              <div
                style={{ color: listening ? "#5465a1" : "#7289da" }}
                onClick={handleMicClick}
                className="chatWindow--btn"
              >
                <MicIcon />
              </div>
            ) : (
              <div onClick={handleSendClick} className="chatWindow--btn">
                <SendIcon />
              </div>
            )}
          </div>
        </div>
      </div>
      <Contact
        windowWidth={windowWidth}
        activeContactInfo={activeContactInfo}
        setActiveContactInfo={setActiveContactInfo}
        data={data.with[0]}
      />
    </div>
  );
};

export default ChatWindow;
