import AddCircleOutlineIcon from "@mui/icons-material/Upload";
import { useState } from "react";
import { useRef } from "react";
import ImageViewer from "react-simple-image-viewer";
import { CircularProgress, InputAdornment, Tooltip } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import "./style.scss";
import fileService from "../../services/fileService";
import { Lock } from "@mui/icons-material";

const VideoUpload = ({ value, onChange, className = "", disabled, tabIndex }) => {
  const inputRef = useRef(null);
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
      .upload(data)
      .then((res) => {
        onChange(import.meta.env.VITE_CDN_BASE_URL + "ucode/" + res.filename);
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

  return (
    <div className={`Gallery ${className}`}>
      {value && (
        <div className="block" onClick={() => imageClickHandler()}>
          <button className="close-btn" type="button" onClick={(e) => closeButtonHandler(e)}>
            <CancelIcon />
          </button>
          {/* <img src={value} className="img" alt="" /> */}
          <video src={value} className="img" />
        </div>
      )}

      {!value && (
        <div
          className="add-block block"
          onClick={() => inputRef.current.click()}
          style={
            disabled
              ? {
                  background: "#c0c0c039",
                }
              : {
                background: "inherit",
                color: "inherit",
                }
          }
        >
          <div className="add-icon">
            {!loading ? (
              <>
                {disabled ? (
                  <Tooltip title="This field is disabled for this role!">
                    <InputAdornment position="start">
                      <Lock style={{ fontSize: "20px" }} />
                    </InputAdornment>
                  </Tooltip>
                ) : (
                  <AddCircleOutlineIcon style={{ fontSize: "35px" }} />
                )}
                {/* <p>Max size: 4 MB</p> */}
              </>
            ) : (
              <CircularProgress />
            )}
          </div>

          <input type="file" className="hidden" ref={inputRef} tabIndex={tabIndex} autoFocus={tabIndex === 1} onChange={inputChangeHandler} disabled={disabled} />
        </div>
      )}

      {/* {previewVisible && (
        <ImageViewer
          src={[value]}
          currentIndex={0}
          disableScroll={true}
          closeOnClickOutside={true}
          onClose={() => setPreviewVisible(false)}
        />
      )} */}
    </div>
  );
};

export default VideoUpload;
