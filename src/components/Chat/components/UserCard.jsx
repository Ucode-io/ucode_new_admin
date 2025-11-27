import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../index.module.scss";

const UserCard = ({ item, idx, setOnRequest, updateArrayFunc }) => {
  const navigate = useNavigate();
  const { appId } = useParams();
  return (
    <Box
      className={styles.card}
      key={item.chat_id}
      onClick={() => {
        navigate(`/main/${appId}/chat/${item.chat_id}`);
        setOnRequest(true);
        updateArrayFunc();
      }}
    >
      <img
        alt="avatarka"
        src={item.user_profile_photo_url || "/img/AvatarPhoto.png"}
        className={styles.avatar}
      />
      <Box className={styles.info}>
        <Box
          alignItems={"center"}
          display="flex"
          justifyContent="space-between"
        >
          <p className={styles.name}>{item?.sender_name}</p>
          <p className={styles.time}>{item?.created_at.slice(0, 10)}</p>
        </Box>
        <p className={styles.message}>
          <p>{item?.message.message || item?.message}</p>
          {Boolean(item?.unread_message_count + 1) && (
            <span className={styles.status}>
              {(item?.unread_message_count + 1)?.toString()}
            </span>
          )}
        </p>
      </Box>
    </Box>
  );
};

export default UserCard;
