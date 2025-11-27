import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  Typography,
} from "@mui/material";
import React, {useState} from "react";
import {updateLevel} from "../../../../utils/level";
import IconGenerator from "../../../IconPicker/IconGenerator";
import {useDispatch} from "react-redux";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import ClearIcon from "@mui/icons-material/Clear";
import FileUploadWithDraggable from "./FileUploadDraggable";
import erdService from "../../../../services/erdService";
import {showAlert} from "../../../../store/alert/alert.thunk";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const functionFolder = {
  label: "File upload",
  type: "USER_FOLDER",
  icon: "documents.svg",
  parent_id: adminId,
  id: "35",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

function FileUploadMenu({level = 1, menuStyle, menuItem}) {
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    data.delete("file");
  };

  const clickHandler = (val) => {
    dispatch(menuActions.setMenuItem(functionFolder));
    handleOpen();
  };

  const onUpload = () => {
    setLoader(true);
    erdService
      .upload(data, {})
      .then((res) => {
        dispatch(showAlert("Successfully uploaded", "success"));
        handleClose();
        setLoader(false);
      })
      .catch(() => {})
      .finally(() => setLoader(false));
  };

  const activeStyle = {
    backgroundColor:
      functionFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      functionFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
    borderRadius: "8px",
    display:
      menuItem?.id === "0" ||
      (menuItem?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const labelStyle = {
    paddingLeft: "15px",
    color:
      functionFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
  };
  return (
    <Box>
      <div className="parent-block column-drag-handle">
        <Button
          style={activeStyle}
          className="nav-element"
          onClick={(e) => {
            clickHandler(e);
          }}>
          <div className="label" style={labelStyle}>
            <IconGenerator icon={"upload.svg"} size={18} />
            Upload ERD
          </div>
        </Button>
      </div>

      <Dialog onClose={handleClose} open={openModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Add file</Typography>
            <ClearIcon
              color="primary"
              onClick={handleClose}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <Box padding={2}>
            {loader ? (
              <Box
                sx={{
                  width: "100%",
                  height: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <CircularProgress />
              </Box>
            ) : (
              <FileUploadWithDraggable
                data={data}
                loader={loader}
                setData={setData}
              />
            )}
          </Box>
          <Box
            sx={{
              padding: "0 15px 15px 15px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button onClick={onUpload} variant="contained">
              Upload
            </Button>
          </Box>
        </Card>
      </Dialog>
    </Box>
  );
}

export default FileUploadMenu;
