import {Box, Tooltip} from "@mui/material";
import {BsThreeDots} from "react-icons/bs";
import "./style.scss";

const MenuIcon = ({onClick, title, style, element}) => {
  const elementPermission =
    !element?.data?.permission?.delete === true &&
    !element?.data?.permission?.menu_settings === true &&
    !element?.data?.permission?.update === true &&
    !element?.data?.permission?.write === true;

  return (
    <Tooltip title={title} placement="top">
      <Box className="icon_group">
        <Box className="extra_icon">
          {!elementPermission && (
            <BsThreeDots size={13} onClick={onClick} style={style} />
          )}
        </Box>
      </Box>
    </Tooltip>
  );
};

export default MenuIcon;
