import {Box, Button, Modal, Typography} from "@mui/material";
import React, {useState} from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {MdContentCopy, MdDoneAll} from "react-icons/md";
import {showAlert} from "../../../../store/alert/alert.thunk";
import {useDispatch} from "react-redux";
import RectangleIconButton from "../../../Buttons/RectangleIconButton";
import ReactJson from "react-json-view";
import styles from "./styles.module.scss";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "max-content",
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 0,
  outline: "none",
  borderRadius: "10px",
  maxHeight: "70vh",
  maxWidth: "80vw",
  overflow: "scroll",
  height: "80vh",
};

export default function JsonModalVersion({history}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [copyToJson, setCopyToJson] = useState(false);
  const [copyToJsonCurrent, setCopyToJsonCurrent] = useState(false);
  const dispatch = useDispatch();

  const copyToClipboard = (text) => {
    dispatch(showAlert("Copied to clipboard", "success"));
    navigator.clipboard.writeText(text);
    setTimeout(() => {
      setCopyToJson(false);
      setCopyToJsonCurrent(false);
    }, 500);
  };

  function parseJSONSafely(jsonString) {
    const sanitizedString = jsonString.replace(/^[^{[]*/, "");
    try {
      return JSON.parse(sanitizedString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }

  function isValidJSON(jsonString) {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Show JSON
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              borderBottom: "1px solid #e0e0e0",
              padding: "8px",
              position: "sticky",
              top: "0",
              backgroundColor: "#fff",
              zIndex: 9999,
            }}>
            <Button
              variant="outlined"
              sx={{
                width: "40px",
                height: "40px",
                padding: "0px",
                minWidth: "40px",
              }}
              onClick={handleClose}>
              <CloseRoundedIcon />
            </Button>
          </Box>

          <Box
            sx={{
              padding: "16px",
            }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  history?.current && history?.previus ? "1fr 1fr" : "1fr",
                gap: "16px",
              }}>
              <Typography variant="h5">
                {history?.previus && "Previus"}
              </Typography>
              <Typography variant="h5">
                {history?.current && "Current"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  history?.current && history?.previus ? "1fr 1fr" : "1fr",
                gap: "16px",
              }}>
              {history?.current && history?.previus && (
                <>
                  <Box
                    sx={{
                      backgroundColor: "#000",
                      borderRadius: "10px",
                      padding: "16px",
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      position: "relative",
                    }}>
                    <RectangleIconButton
                      onClick={() => {
                        copyToClipboard(
                          JSON.stringify(history?.current, null, 2)
                        );
                        setCopyToJsonCurrent(true);
                      }}
                      className={styles.copy}>
                      {copyToJsonCurrent ? <MdDoneAll /> : <MdContentCopy />}
                    </RectangleIconButton>
                    <ReactJson
                      src={
                        isValidJSON(history?.current)
                          ? parseJSONSafely(history?.current)
                          : {}
                      }
                      theme="codeschool"
                      style={{
                        padding: "10px",
                        borderRadius: "10px",
                        overflow: "auto",
                        height: "300px",
                        width: "350px",
                      }}
                      enableClipboard={false}
                      displayDataTypes={false}
                      displayObjectSize={false}
                    />
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: "#000",
                      borderRadius: "10px",
                      padding: "16px",
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      position: "relative",
                    }}>
                    <RectangleIconButton
                      onClick={() => {
                        copyToClipboard(
                          JSON.stringify(history?.previus, null, 2)
                        );
                        setCopyToJson(true);
                      }}
                      className={styles.copy}>
                      {copyToJson ? <MdDoneAll /> : <MdContentCopy />}
                    </RectangleIconButton>
                    <ReactJson
                      src={
                        isValidJSON(history?.previus)
                          ? parseJSONSafely(history?.previus)
                          : {}
                      }
                      theme="codeschool"
                      style={{
                        padding: "10px",
                        borderRadius: "10px",
                        overflow: "auto",
                        height: "300px",
                        width: "350px",
                      }}
                      enableClipboard={false}
                      displayDataTypes={false}
                      displayObjectSize={false}
                    />
                  </Box>
                </>
              )}
              {history?.current && !history?.previus && (
                <Box
                  sx={{
                    backgroundColor: "#000",
                    borderRadius: "10px",
                    padding: "16px",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                    position: "relative",
                  }}>
                  <RectangleIconButton
                    onClick={() => {
                      copyToClipboard(
                        JSON.stringify(history?.current, null, 2)
                      );
                      setCopyToJson(true);
                    }}
                    className={styles.copy}>
                    {copyToJson ? <MdDoneAll /> : <MdContentCopy />}
                  </RectangleIconButton>
                  <ReactJson
                    src={
                      isValidJSON(history?.current)
                        ? parseJSONSafely(history.current)
                        : {}
                    }
                    theme="codeschool"
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      overflow: "auto",
                      height: "300px",
                      width: "350px",
                    }}
                    enableClipboard={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                  />
                </Box>
              )}
              {!history?.current && history?.previus && (
                <Box
                  sx={{
                    backgroundColor: "#000",
                    borderRadius: "10px",
                    padding: "8px",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                  }}>
                  <ReactJson
                    src={
                      isValidJSON(history?.previus)
                        ? parseJSONSafely(history?.previus)
                        : {}
                    }
                    theme="codeschool"
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      overflow: "auto",
                      height: "300px",
                      width: "350px",
                    }}
                    enableClipboard={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                  />
                </Box>
              )}
              {!history.previus && !history?.current && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      history?.current && history?.previus ? "1fr 1fr" : "1fr",
                    gap: "16px",
                    alignItems: "end",
                    flexDirection: "row",
                  }}>
                  <Box
                    sx={{
                      backgroundColor: "#000",
                      borderRadius: "10px",
                      padding: "16px",
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      position: "relative",
                    }}>
                    <ReactJson
                      src={{}}
                      theme="codeschool"
                      style={{
                        padding: "10px",
                        borderRadius: "10px",
                        overflow: "auto",
                        height: "300px",
                        width: "350px",
                      }}
                      enableClipboard={false}
                      displayDataTypes={false}
                      displayObjectSize={false}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
