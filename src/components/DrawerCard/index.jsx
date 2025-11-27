import { Close } from "@mui/icons-material";
import { Drawer, IconButton } from "@mui/material";
import PrimaryButton from "../Buttons/PrimaryButton";
import styles from "./style.module.scss";

const DrawerCard = ({
  children,
  onClose = () => {},
  title = "",
  open,
  onSaveButtonClick = () => {},
  loader,
  anchor = "right",
  bodyStyle,
  sx,
  PaperProps,
  className,
  footer = true,
  titleStyle,
}) => {
  return (
    <Drawer
      sx={sx}
      open={open}
      anchor={anchor}
      className={className}
      classes={{ paperAnchorRight: styles.verticalDrawer }}
      onClose={onClose}
      PaperProps={PaperProps}
    >
      <div className={styles.header}>
        <h2 className={styles.title} style={titleStyle}>
          {title}
        </h2>

        <IconButton className={styles.closeButton} onClick={onClose}>
          <Close className={styles.closeIcon} />
        </IconButton>
      </div>
      <div className={styles.body} style={bodyStyle}>
        {children}
      </div>

      <dir className={styles.footer}>
        <PrimaryButton
          size="large"
          className={styles.button}
          onClick={onSaveButtonClick}
          loader={loader}
        >
          Save
        </PrimaryButton>
      </dir>
    </Drawer>
  );
};

export default DrawerCard;
