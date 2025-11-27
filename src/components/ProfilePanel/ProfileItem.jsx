import { ListItemButton } from "@mui/material";
import styles from "./newprofile.module.scss";

const ProfileItem = ({ text, onClick, children, type = "item", ...props }) => {
  return (
    <ListItemButton className={styles.menuItem} onClick={onClick} {...props}>
      {children}
      {type === "item" && <p className={styles.itemText}>{text}</p>}
    </ListItemButton>
  );
};

export default ProfileItem;
