import React, { useState } from "react";

import { Popover } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Close } from "@mui/icons-material";

import styles from "./styles.module.scss";

export default function PivotTemplatesPopover({ onChange, isDefaultTemplate, onDeleteFn, data }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const onDelete = (e, value) => {
    onDeleteFn(value);
    e.stopPropagation();
  };

  return (
    <div className={styles.popup}>
      <div className={styles.title} onClick={handleClick}>
        <FormatListBulletedIcon htmlColor="#637381" />
        <span>Отчеты</span>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        {data?.length ? (
          <div className={styles.body}>
            {data.map((item) => (
              <div
                onClick={() => {
                  handleClose();
                  onChange(item.value);
                }}
                className={styles.item}
                key={item.value}
              >
                <span>{item.label}</span>
                {!isDefaultTemplate(item.value) && <Close onClick={(e) => onDelete(e, item.value)} />}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>Нет данных</div>
        )}
      </Popover>
    </div>
  );
}
