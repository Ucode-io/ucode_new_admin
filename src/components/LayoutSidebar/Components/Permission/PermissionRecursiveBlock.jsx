import { Box, Button, Collapse, Icon, Tooltip } from "@mui/material";
import { useState } from "react";
import "../../style.scss";
import { useDispatch } from "react-redux";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import { updateLevel } from "../../../../utils/level";
import { useLocation } from "react-router-dom";

const PermissionRecursive = ({
  element,
  level = 1,
  menuStyle,
  onSelect = () => {},
  onRowClick = () => {},
  handleOpenNotify,
  setSelected,
  menuItem,
  selected,
}) => {
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const permissionlocation = location.pathname.includes("permission");
  const activeStyle = permissionlocation
    ? {
        backgroundColor:
          element?.id === selected?.id && permissionlocation
            ? menuStyle?.active_background || "#007AFF"
            : menuStyle?.background,
        color:
          element?.id === selected?.id
            ? menuStyle?.active_text
            : menuStyle?.text,
        paddingLeft: updateLevel(level),
        display:
          element.id === "0" ||
          (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
      }
    : {};

  const clickHandler = () => {
    dispatch(menuActions.setMenuItem(element));
    setSelected(element);
    onRowClick(element.id, element);
    setChildBlockVisible((prev) => !prev);
    if (!element.children) onSelect(element.id, element);
  };
  return (
    <Box>
      <div className="parent-block column-drag-handle" key={element.id}>
        <Button
          key={element.id}
          style={activeStyle}
          className="nav-element"
          onClick={clickHandler}
        >
          <div
            className="label"
            style={{
              color:
                element?.id === selected?.id && permissionlocation
                  ? menuStyle?.active_text
                  : menuStyle?.text,
            }}
          >
            <Icon as={element.icon} />
            {element?.name}
          </div>
          {element.buttons && (
            <Box className="icon_group">
              <Tooltip title={element?.button_text} placement="top">
                <Box className="extra_icon">{element.buttons}</Box>
              </Tooltip>
            </Box>
          )}
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {element?.children?.map((childElement) => (
          <PermissionRecursive
            key={childElement.id}
            level={level + 1}
            element={childElement}
            menuStyle={menuStyle}
            onSelect={onSelect}
            onRowClick={onRowClick}
            selected={selected}
            handleOpenNotify={handleOpenNotify}
            setSelected={setSelected}
            menuItem={menuItem}
          />
        ))}
      </Collapse>
    </Box>
  );
};

export default PermissionRecursive;
