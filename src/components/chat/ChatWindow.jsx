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
import Contact from "./Contact";
import FirebaseServices from "../../services/Api";

const ChatWindow = ({
  user,
  data,

  windowWidth,
  setCloseChat,
  setActiveChat,
  activeProfileIcon,
  activeContactIcon,
}) => {
  const body = useRef();
  const [modal, setModal] = useState(false);

  const [activeContactInfo, setActiveContactInfo] = useState(false);
  const [zIndex, setZindex] = useState(false);

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);
  const [contact, setContact] = useState();

  let recognition = null;
  let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition !== undefined) {
    recognition = new SpeechRecognition();
  }

  useEffect(() => {
    data.users.map((item) => {
      if (item.uid !== user.uid) {
        setContact(item);
      }
    });
  }, [data]);

  useEffect(() => {
    if (activeProfileIcon == false && activeContactIcon == false) {
      setZindex(false);
    } else {
      setZindex(true);
    }
  }, [activeContactIcon, activeProfileIcon]);

  const handleMicClick = () => {
    if (recognition !== null) {
      recognition.onaudiostart = () => {
        setListening(true);
      };

      recognition.onaudioend = () => {
        setListening(false);
      };

      recognition.onresult = (e) => {
        setText(e.results[0][0].transcript);
      };
      recognition.onerror = (e) => {};
      recognition.start();
    }
  };

  const handleSendClick = () => {
    if (text !== "") {
      FirebaseServices.sendMessage(data, user, "text", text, users);
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
    if (body.current) {
      if (body.current.scrollHeight > body.current.offsetHeight) {
        body.current.scrollTop =
          body.current.scrollHeight - body.current.offsetHeight;
      }
    }
  }, [list]);

  useEffect(() => {
    const monitoringMessages = async () => {
      setList([]);
      let unsub = FirebaseServices.onChatContent(
        data.chatId,
        setList,
        setUsers
      );
      return unsub;
    };
    monitoringMessages();
  }, [data.chatId]);

  const clearMessages = async () => {
    await FirebaseServices.clearMessages(data);
  };
  const deleteChat = async () => {
    await FirebaseServices.deleteChat(data);
    setActiveChat({});
  };

  return (
    <div className="body">
      {contact && (
        <>
          {" "}
          <div
            className={`chatWindow ${
              localStorage.getItem("dark_mode") == "true" ? "dark" : ""
            }`}
            style={{
              display:
                windowWidth <= 950 && activeContactInfo == true
                  ? "none"
                  : "flex",
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
                    display: windowWidth <= 650 ? "flex" : "none",
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
                  src={contact.avatar}
                  alt=""
                />
                <div
                  onClick={() => setActiveContactInfo(true)}
                  className="chatWindow--name"
                >
                  {contact.name}
                </div>
              </div>
              <div className="chatWindow--headerbuttons">
                <div className="chatWindow--btn">
                  <div
                    style={{ display: modal == true ? "flex" : "none" }}
                    className="modal--chatWindow"
                  >
                    <button onClick={() => deleteChat()}>Deletar chat</button>
                    <button onClick={() => clearMessages()}>
                      Limpar conversas
                    </button>
                  </div>
                  <MoreVertIcon onClick={() => setModal(true)} />
                </div>
              </div>
            </div>
            <div
              style={{
                zIndex: windowWidth <= 950 ? (zIndex == true ? -1 : 0) : 0,
              }}
              onClick={() => setModal(false)}
              ref={body}
              className="chatWindow--body"
            >
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
                <div
                  onClick={() => setEmojiOpen(true)}
                  className="chatWindow--btn"
                >
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
            data={contact}
          />{" "}
        </>
      )}
    </div>
  );
};

export default ChatWindow;
