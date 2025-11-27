import AttachFileIcon from "@mui/icons-material/AttachFile";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Box,
  Button,
  Popover,
  Typography
} from "@mui/material";
import React, { useRef, useState } from "react";
import fileService from "../../services/fileService";

export default function NewFileUpload({
  value,
  onChange,
  className = "",
  disabled,
  tabIndex,
  field,
}) {
  const inputRef = useRef("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const imageClickHandler = (index) => {
    setPreviewVisible(true);
  };

  const inputChangeHandler = (e) => {
    setLoading(true);

    const file = e.target.files[0];

    const data = new FormData();
    data.append("file", file);

    fileService
      .folderUpload(data, {
        folder_name: field?.attributes?.path,
      })
      .then((res) => {
        onChange(import.meta.env.VITE_CDN_BASE_URL + res?.link);
      })
      .finally(() => setLoading(false));
  };

  const deleteImage = (id) => {
    onChange(null);
  };

  const closeButtonHandler = (e) => {
    e.stopPropagation();
    deleteImage();
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className={`Gallery ${className}`}>
      {value && (
        <>
          <Box className="uploadedFile">
            <Button
              aria-describedby={id}
              onClick={handleClick}
              sx={{
                padding: 0,
                minWidth: "25px",
                width: "25px",
                height: "25px",
              }}
            >
              <AttachFileIcon
                style={{
                  color: "#747474",
                  fontSize: "25px",
                }}
              />
            </Button>

            <Typography
              sx={{
                fontSize: "10px",
                color: "#747474",
              }}
            >
              {value?.split?.("_")?.[1] ?? ""}
            </Typography>
          </Box>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "10px",
              }}
            >
              <Button
                href={value}
                className=""
                download
                target="_blank"
                rel="noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "flex-start",
                }}
              >
                <OpenInFullIcon />
                Show file
              </Button>
              <Button
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "flex-start",
                }}
                disabled={disabled}
                onClick={(e) => closeButtonHandler(e)}
              >
                <DeleteIcon />
                Remove file
              </Button>
              <Button
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "flex-start",
                }}
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current.click();
                }}
              >
                <ChangeCircleIcon />
                Change file
              </Button>
            </Box>
            <input
              type="file"
              style={{
                display: "none",
              }}
              className="hidden"
              ref={inputRef}
              tabIndex={tabIndex}
              autoFocus={tabIndex === 1}
              onChange={inputChangeHandler}
              disabled={disabled}
            />
          </Popover>
        </>
      )}

      {!value && (
        // <div
        //   className="add-block block"
        //   onClick={() => inputRef.current.click()}
        //   style={
        //     disabled
        //       ? {
        //           background: "#c0c0c039",
        //         }
        //       : {
        //           background: "inherit",
        //           color: "inherit",
        //         }
        //   }
        // >
        //   <div className="add-icon">
        //     {!loading ? (
        //       <>
        //         {disabled ? (
        //           <Tooltip title="This field is disabled for this role!">
        //             <InputAdornment position="start">
        //               <Lock style={{ fontSize: "20px" }} />
        //             </InputAdornment>
        //           </Tooltip>
        //         ) : (
        //           <AddCircleOutlineIcon style={{ fontSize: "35px" }} />
        //         )}
        //         {/* <p>Max size: 4 MB</p> */}
        //       </>
        //     ) : (
        //       <CircularProgress />
        //     )}
        //   </div>

        //   <input type="file" className="hidden" ref={inputRef} tabIndex={tabIndex} autoFocus={tabIndex === 1} onChange={inputChangeHandler} disabled={disabled} />
        // </div>

        <Button
          onClick={() => inputRef.current.click()}
          sx={{
            padding: 0,
            minWidth: "25px",
            width: "25px",
            height: "25px",
            paddingLeft: '15px'
          }}
        >
          <input
            type="file"
            className="hidden"
            ref={inputRef}
            tabIndex={tabIndex}
            autoFocus={tabIndex === 1}
            onChange={inputChangeHandler}
            disabled={disabled}
          />
          <UploadFileIcon
            style={{
              color: "#747474",
              fontSize: "25px",
            }}
          />
        </Button>
      )}

    </div>
  );
}
