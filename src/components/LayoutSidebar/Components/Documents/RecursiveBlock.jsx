import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Icon, Tooltip } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import { useDispatch } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import { updateLevel } from "../../../../utils/level";

const DocumentsRecursive = ({
  element,
  level = 1,
  menuStyle,
  onSelect = () => {},
  onRowClick = () => {},
  selected,
  handleOpenNotify,
  setSelected,
  menuItem,
  setSelectedApp
}) => {
  const dispatch = useDispatch();
  const { tableSlug } = useParams();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const note = element?.what_is === "note" && element?.type !== "FOLDER";
  const noteFolder = element?.what_is === "note" && element?.type === "FOLDER";
  const templateFolder =
    element?.what_is === "template" && element?.type === "FOLDER";
  const template =
    element?.what_is === "template" && element?.type !== "FOLDER";

  const activeStyle = {
    borderRadius: '10px',
    backgroundColor:
      element?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      element?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    // paddingLeft: updateLevel(level),
    display:
      element.id === "0" ||
      (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const clickHandler = () => {
    setSelected(element);
    onRowClick(element.id, element);
    setChildBlockVisible((prev) => !prev);
    if (!element.children) onSelect(element.id, element);
  };
  return (
    <Box sx={{margin: '0 5px'}}>
      <div className="parent-block column-drag-handle" key={element.id}>
        <Button
          key={element.id}
          style={activeStyle}
          className={`nav-element ${
            element.isChild &&
            (tableSlug !== element.slug ? "active-with-child" : "active")
          }`}
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
          {template && (
            <Box className="icon_group">
              <Tooltip title={element?.button_text} placement="top">
                <Box className="extra_icon">
                  <BsThreeDots
                    size={13}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenNotify(e, "TEMPLATE", element);
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>
          )}
          {note && (
            <Box className="icon_group">
              <Tooltip title={element?.button_text} placement="top">
                <Box className="extra_icon">
                  <BsThreeDots
                    size={13}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenNotify(e, "NOTE", element);
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>
          )}
          {templateFolder && (
            <Box className="icon_group">
              <Tooltip title={element?.button_text} placement="top">
                <Box className="extra_icon">
                  <BsThreeDots
                    size={13}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenNotify(e, "TEMPLATE_FOLDER", element);
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>
          )}
          {noteFolder && (
            <Box className="icon_group">
              <Tooltip title={element?.button_text} placement="top">
                <Box className="extra_icon">
                  <BsThreeDots
                    size={13}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenNotify(e, "NOTE_FOLDER", element);
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>
          )}
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {element?.children?.map((childElement) => (
          <DocumentsRecursive
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

export default DocumentsRecursive;
