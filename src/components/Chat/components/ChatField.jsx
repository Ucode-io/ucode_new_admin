import styles from "../index.module.scss";
import { AiOutlineCheck, AiOutlinePaperClip } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { MdOutlineNotInterested } from "react-icons/md";
import { CiChat1 } from "react-icons/ci";
import { BiArrowBack, BiDotsHorizontalRounded } from "react-icons/bi";
import MessageCard from "./MessageCard";
import { useNavigate, useParams } from "react-router-dom";
import { connectSocket, webSocket } from "../socket_init";
import { useEffect, useRef, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import SearchInput from "../../SearchInput";
import { useChatGetByIdQuery } from "../../../services/chatService";
import fileService from "../../../services/fileService";
import { MessageType } from "../utils/MessageType";

const ChatField = ({ messages, setMessages, onRequest, setOnRequest }) => {
  const { chat_id, appId } = useParams();
  const inputRef = useRef();
  const [platformType, setPlatformType] = useState();
  const [sendMessage, setSendMessage] = useState("");
  const [avatar, setAvatar] = useState("");
  const divRef = useRef();
  const audio = new Audio("/sound/bubbleSound.mp3");
  const navigate = useNavigate();
  const cdnURL = import.meta.env.VITE_CDN_BASE_URL;

  const handleClick = () => {
    navigate(`/main/${appId}/chat`);
  };

  const uploadFile = (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    fileService
      .upload(data, {
        "from-chat": "to_telegram_bot",
      })
      .then((res) => {
        fileSend(res?.filename);
      });
  };

  const fileSend = (value) => {
    const url = `${cdnURL}telegram/${value}`;
    setSendMessage(url);
    // exportToJsonService.uploadToJson({
    //   file_name: value,
    //   // app_id: appId,
    // });
  };

  const { isLoading } = useChatGetByIdQuery({
    id: chat_id,
    queryParams: {
      enabled: Boolean(onRequest) || Boolean(chat_id),
      onSuccess: (res) => {
        setMessages(res.messages);
        setAvatar(res.user_profile_photo_url);
        setPlatformType(res.platform_type);
        setOnRequest(false);
        connectSocket(sendMessage, res.chat_id, res.platform_type, res.user_id);
      },
    },
  });
  useEffect(() => {
    // if (sendMessage || messages) {
    if (webSocket) {
      webSocket.onmessage = (event) => {
        // if (messages) {
        audio.play();
        setMessages([...messages, JSON.parse(event.data)]);
        // }
      };
    }
    // }
  }, [sendMessage, messages, webSocket]);

  useEffect(() => {
    divRef.current.scrollTop = divRef.current.scrollHeight;
  }, [divRef.current, messages]);

  const handleSendMessage = () => {
    const message = {
      message: sendMessage || "",
      platform_type:
        platformType === "from_telegram_bot" ? "to_telegram_bot" : "website",
      message_type: MessageType(sendMessage),
    };
    if (sendMessage) {
      webSocket.send(JSON.stringify(message));
    }
    setSendMessage("");
  };

  return (
    <Box className={styles.field}>
      <Box className={styles.header}>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: "10px",
          }}
        >
          {chat_id && <BiArrowBack cursor={"pointer"} onClick={handleClick} />}
          <SearchInput
            className={styles.input}
            placeholder="Поиск по переписке"
            iconColor="#000"
          />
        </Box>
        <Box className={styles.setting}>
          <AiOutlineCheck size={"18px"} />
          <FaUsers size={"20px"} />
          <MdOutlineNotInterested size={"18px"} />
          <CiChat1 size={"18px"} />
          <BiDotsHorizontalRounded size={"18px"} />
        </Box>
      </Box>
      <Box
        className={chat_id && messages ? styles.chat : styles.emptyChat}
        ref={divRef}
      >
        {chat_id ? (
          messages ? (
            messages?.map((item, idx) => (
              <MessageCard
                item={item}
                idx={idx}
                key={item.chat_id}
                avatar={avatar}
              />
            ))
          ) : (
            <Box className={styles.empty}>Здесь пока ничего нет...</Box>
          )
        ) : (
          <Box className={styles.empty}>Выберите, кому бы хотели написать</Box>
        )}
      </Box>
      {chat_id && (
        <Box className={styles.footer}>
          <AiOutlinePaperClip
            size={"28px"}
            onClick={() => inputRef.current.click()}
          />
          <input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={uploadFile}
            style={{
              display: "none",
            }}
          />
          <TextField
            placeholder="Add a comment"
            onChange={(e) => setSendMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            value={sendMessage}
            fullWidth
          />
          <Button onClick={() => handleSendMessage()}>SEND</Button>
        </Box>
      )}
    </Box>
  );
};

export default ChatField;
