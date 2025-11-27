import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Icon, Tooltip } from "@mui/material";
import { useState } from "react";
import "../../style.scss";
import { useDispatch } from "react-redux";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import { updateLevel } from "../../../../utils/level";

const ApiRecursive = ({
  element,
  level = 1,
  menuStyle,
  onSelect = () => {},
  onRowClick = () => {},
  selected,
  handleOpenNotify,
  setSelected,
  menuItem,
}) => {
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const dispatch = useDispatch();

  const activeStyle = {
    backgroundColor:
      element?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      element?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
    borderRadius: "8px",
    display:
      element.id === "0" ||
      (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

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
          {childBlockVisible ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}
          <div
            className="label"
            style={{
              color:
                element?.id === menuItem?.id
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
          <ApiRecursive
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

export default ApiRecursive;
