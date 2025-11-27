import {Box, Button} from "@mui/material";
import {useDispatch} from "react-redux";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import {useNavigate} from "react-router-dom";
import {updateLevel} from "../../../../utils/level";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const projectFolder = {
  label: "Project setting",
  type: "USER_FOLDER",
  icon: "lock.svg",
  parent_id: adminId,
  id: "22",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const ProjectSettingSidebar = ({level = 1, menuStyle, menuItem}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activeStyle = {
    backgroundColor:
      projectFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      projectFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
    display:
      menuItem?.id === "0" ||
      (menuItem?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const labelStyle = {
    color:
      projectFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
  };

  const clickHandler = (e) => {
    navigate(`/main/${adminId}/project-setting`);
    dispatch(menuActions.setMenuItem(projectFolder));
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
            <IconGenerator icon={"building.svg"} size={18} />
            Project settings
          </div>
        </Button>
      </div>
    </Box>
  );
};

export default ProjectSettingSidebar;
