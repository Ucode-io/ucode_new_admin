import {Box, Button} from "@mui/material";
import {useDispatch} from "react-redux";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import {useNavigate, useParams} from "react-router-dom";
import {updateLevel} from "../../../../utils/level";
import MoveUpIcon from "@mui/icons-material/MoveUp";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const redirectButton = {
  label: "Custom endpoint",
  type: "USER_FOLDER",
  icon: "key.svg",
  parent_id: adminId,
  id: "0010",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const RedirectButton = ({level = 1, menuStyle, menuItem}) => {
  const {appId} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activeStyle = {
    backgroundColor:
      redirectButton?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      redirectButton?.id === menuItem?.id
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
      redirectButton?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
  };

  const clickHandler = () => {
    navigate(`/main/${appId}/redirects`);
    dispatch(menuActions.setMenuItem(redirectButton));
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
            <MoveUpIcon size={18} />
            {redirectButton?.label}
          </div>
        </Button>
      </div>
    </Box>
  );
};

export default RedirectButton;
