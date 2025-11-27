import { Box } from "@mui/material";
import styles from "../index.module.scss";
import { store } from "../../../store";

const FileMessage = ({ item }) => {
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
        <Box display={"flex"} alignItems={"center"} columnGap={"10px"}>
          <Box width={"70px"} height={"70px"}>
            <iframe
              src={!item.message.includes("org") ? item.message : ""}
              style={{
                cursor: "pointer",
                objectFit: "contain",
                borderRadius: "10px",
                width: "70px",
                height: "100%",
              }}
              title="Test"
            ></iframe>
          </Box>
          <div>
            <a
              className={styles.desc}
              href={item.message}
              style={{
                color: "blue",
              }}
              rel="noreferrer"
              target="_blank"
            >
              {item.message.substring(item.message.lastIndexOf("/") + 1)}
            </a>
            <p className={styles.time}>{item.created_at?.slice(11, 16)}</p>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default FileMessage;
