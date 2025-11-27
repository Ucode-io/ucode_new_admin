import { Modal } from "@mui/material";
import { useState } from "react";
import styles from "../index.module.scss";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  height: "70%",
  display: "flex",
  alignItems: "center",
  objectFit: "contain",
  outline: "none !important",
  p: 4,
};
const ImageMessage = ({ item }) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <img
        src={item.message}
        alt="test"
        style={{
          borderRadius: "20px",
        }}
        onClick={() => setOpen(true)}
      />
      <Modal open={open} onClose={handleClose}>
        <img
          src={item.message}
          alt="test"
          style={style}
          className={styles.img}
        />
      </Modal>
    </>
  );
};

export default ImageMessage;
