import { Box, Tooltip } from "@mui/material";
import "./style.scss";
import { AiFillDelete } from "react-icons/ai";

const DeleteIcon = ({ onClick, title, style }) => {
  return (
    <Tooltip title={title} placement="top">
      <Box className="icon_group">
        <Box className="extra_icon">
          <AiFillDelete size={13} onClick={onClick} style={style} />
        </Box>
      </Box>
    </Tooltip>
  );
};

export default DeleteIcon;
