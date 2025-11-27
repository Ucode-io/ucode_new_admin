import {Box, Button} from "@mui/material";
import {useDispatch} from "react-redux";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import "../../style.scss";
import {useNavigate, useParams} from "react-router-dom";
import InventoryIcon from "@mui/icons-material/Inventory";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const activityFeedData = {
  label: "Activity logs",
  type: "USER_FOLDER",
  icon: "key.svg",
  parent_id: adminId,
  id: "123430",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const ActivityFeedButton = ({
  level = 1,
  menuStyle,
  menuItem,
  setSubMenuIsOpen,
  pinIsEnabled,
}) => {
  const {appId} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activeStyle = {
    backgroundColor:
      activityFeedData?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      activityFeedData?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    // paddingLeft: updateLevel(level),
    borderRadius: "8px",
    display:
      menuItem?.id === "0" ||
      (menuItem?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const labelStyle = {
    paddingLeft: "25px",
    color:
      activityFeedData?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
  };

  const clickHandler = () => {
    navigate(`/main/${appId}/activity`);
    dispatch(menuActions.setMenuItem(activityFeedData));
    if (!pinIsEnabled) {
      setSubMenuIsOpen(false);
    }
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
            <InventoryIcon size={18} />
            {activityFeedData?.label}
          </div>
        </Button>
      </div>
    </Box>
  );
};

export default ActivityFeedButton;
