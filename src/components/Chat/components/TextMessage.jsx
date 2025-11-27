import { Box } from "@mui/material";
import styles from "../index.module.scss";
import { store } from "../../../store";

const TextMessage = ({ item }) => {
  const authStore = store.getState().auth;
  return (
    <>
      <Box
        className={styles.info}
        style={{
          background:
            authStore.userId === item.user_id ||
            item?.platform_type === "to_telegram_bot" ||
            item?.sender_name === "Admin"
              ? "#F2F8F8"
              : "#E1EDFD",
        }}
      >
        <Box
          alignItems={"center"}
          display="flex"
          justifyContent="space-between"
        >
          <p className={styles.name}>{item.sender_name}</p>
        </Box>
        <p className={styles.desc}>{item.message || "Message is empty!"}</p>
        <p className={styles.time}>{item.created_at?.slice(11, 16)}</p>
      </Box>
    </>
  );
};

export default TextMessage;
