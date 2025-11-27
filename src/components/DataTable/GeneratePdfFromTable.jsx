import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {Box, Menu} from "@mui/material";
import React from "react";
import styles from "./GeneratePdfFromTable.module.scss";
import PdfMenuList from "./PdfMenuList";
import MicroFrontPdf from "./MIcroFrontPdf";

export default function GeneratePdfFromTable({row, view}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.wrapper}>
      <button
        color="info"
        onClick={(e) => handleClick(e)}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        maxWidth="32px">
        <PictureAsPdfIcon color="info" />
      </button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        <Box sx={{width: "110px"}}>
          <PdfMenuList handleClose={handleClose} row={row} />
          <MicroFrontPdf view={view} handleClose={handleClose} row={row} />
        </Box>
      </Menu>
    </div>
  );
}
