import {
  Button,
  Card,
  CircularProgress,
  IconButton,
  Popover,
} from "@mui/material";
import React, { useId, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CreateIcon from "@mui/icons-material/Create";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import style from "./style.module.scss";

export default function MoreButtonViewType({
  onEditClick,
  onDeleteClick = () => {},
  activeEyeButton,
  buttonProps,
  loading,
  openModal = () => {},
  orientation = "vertical",
  className,
}) {
  const id = useId();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (loading)
    return (
      <IconButton color="primary">
        <CircularProgress size={17} {...buttonProps} />
      </IconButton>
    );
  return (
    <div onClick={(e) => e.stopPropagation()} className={className}>
      <IconButton color="primary" {...buttonProps} onClick={handleClick}>
        {orientation === "vertical" ? <MoreVertIcon /> : <MoreHorizIcon />}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
        }}
      >
        <Card elevation={12} className="ButtonsPopover">
          <div className={style.menuWrapper}>
            <Button
              onClick={() => {
                onEditClick();
                handleClose();
              }}
            >
              <CreateIcon />
              View settings
            </Button>
            {/* <Button>
              <StarOutlineIcon />
              Add to favorites
            </Button>
            <Button>
              <ContentCopyIcon />
              Duplicate as
            </Button> */}
          </div>
        </Card>
      </Popover>
    </div>
  );
}
