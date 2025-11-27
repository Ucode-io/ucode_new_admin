import { Box, Button, Tooltip, Typography } from "@mui/material";
import style from "./style.module.scss";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CheckIcon from "@mui/icons-material/Check";
const MinioSinglePageHeader = ({
  menuItem,
  file,
  onSubmit,
  deleteFileElements,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Box className={style.header}>
        <Box className={style.leftside}>
          <div className={style.foldericon} onClick={() => navigate(-1)}>
            <KeyboardBackspaceIcon />
          </div>
          <Typography variant="h3">{file?.title}</Typography>
        </Box>
        <Box className={style.rightside}>
          <Tooltip title="Delete">
            <div
              className={style.deleteicon}
              onClick={() => deleteFileElements(file?.id)}
            >
              <DeleteOutlineIcon />
            </div>
          </Tooltip>
          <Tooltip title="Update">
            <Button
              className={style.submiticon}
              onClick={() => {
                onSubmit();
              }}
            >
              <CheckIcon />
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
};

export default MinioSinglePageHeader;
