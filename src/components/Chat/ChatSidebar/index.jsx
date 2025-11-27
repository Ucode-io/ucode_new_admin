import styles from "../index.module.scss";
import UserCard from "../components/UserCard";
import { Box } from "@mui/material";
import SearchInput from "../../SearchInput";
import { useEffect } from "react";
import { chatSocket, connectChatSocket } from "../socket_init";

const ChatSidebar = ({ chats, setChats, setOnRequest, setSearchText }) => {
  const audio = new Audio("/sound/Notification.mp3");

  useEffect(() => {
    connectChatSocket();
  }, []);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.onmessage = (event) => {
        if (chats) {
          setChats((prev) =>
            prev.map((item) =>
              item.user_id === JSON.parse(event.data).user_id
                ? JSON.parse(event.data)
                : item
            )
          );
          audio.play();
        }
      };
    }
  }, [chatSocket]);

  const updateArrayFunc = () => {
    const updatedArray = chats?.map((item) => {
      return { ...item, unread_message_count: undefined };
    });
    setChats(updatedArray);
  };

  return (
    <Box className={styles.chatSidebar}>
      <Box w={"100%"} bgColor="#fff" className={styles.collapse}>
        <Box className={styles.header}>
          <SearchInput
            className={styles.input}
            placeholder="Поиск"
            iconColor="#000"
            onChange={(e) => {
              setSearchText(e);
            }}
          />
          <Box className={styles.setting}>
            {/* <BsPlusLg /> */}
            {/* <GoSettings /> */}
          </Box>
        </Box>
        <Box className={styles.chat}>
          {chats?.map((item, idx) => (
            <UserCard
              item={item}
              idx={idx}
              key={item.chat_id}
              setOnRequest={setOnRequest}
              updateArrayFunc={updateArrayFunc}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatSidebar;
