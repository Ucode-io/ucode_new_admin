import { Close } from "@mui/icons-material";
import { Card, IconButton, Modal } from "@mui/material";
import React from "react";
import ObjectsFormPage from "../ObjectsFormPage";
import styles from "./styles.module.scss";

export default function CustomPopoverForTimeLine({ open, setOpen, tableSlug, selectedRow, dateInfo }) {
  const handleClose = () => setOpen(false);
  return (
    <Modal open={open} onClose={handleClose} className="child-position-center">
      <Card className={`${styles.card} PlatformModal`}>
        <div className={styles.header}>
          <div className={styles.cardTitle}>View settings</div>
          <IconButton className={styles.closeButton} onClick={handleClose}>
            <Close className={styles.closeIcon} />
          </IconButton>
        </div>

        <ObjectsFormPage selectedRow={selectedRow} tableSlugFromProps={tableSlug} handleClose={handleClose} modal={true} dateInfo={dateInfo} />
      </Card>
    </Modal>
  );
}
