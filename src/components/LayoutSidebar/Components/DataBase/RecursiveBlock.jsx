import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Icon, Tooltip } from "@mui/material";
import { useState } from "react";
import "../../style.scss";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import { useDispatch } from "react-redux";
import { updateLevel } from "../../../../utils/level";

const DataBaseRecursive = ({
  element,
  level = 1,
  menuStyle,
  onRowClick = () => {},
  onSelect = () => {},
  selected,
  resourceId,
  menuItem,
}) => {
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);

  const activeStyle = {
    backgroundColor:
      menuItem?.id === element?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      menuItem?.id === element?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
    display:
      element?.id === "0" ||
      (element?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const clickHandler = () => {
    onRowClick(element.id, element);
    dispatch(menuActions.setMenuItem(element));
    setChildBlockVisible((prev) => !prev);
    if (!element.children) onSelect(element?.id, element);
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle" key={element?.id}>
        <Button
          key={element?.id}
          style={activeStyle}
          className="nav-element"
          onClick={clickHandler}
        >
          {childBlockVisible ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}
          <div
            className="label"
            style={{
              color:
                menuItem?.id === element?.id
                  ? menuStyle?.active_text
                  : menuStyle?.text,
              opacity: element?.isChild && 0.6,
            }}
          >
            <Icon as={element?.icon} />
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
          <DataBaseRecursive
            key={childElement.id}
            level={level + 1}
            element={childElement}
            menuStyle={menuStyle}
            onRowClick={onRowClick}
            onSelect={onSelect}
            selected={selected}
            resourceId={resourceId}
            menuItem={menuItem}
          />
        ))}
      </Collapse>
    </Box>
  );
};

export default DataBaseRecursive;
