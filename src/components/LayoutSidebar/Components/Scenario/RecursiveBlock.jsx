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

const ScenarioRecursive = ({
  element,
  level = 1,
  menuStyle,
  onSelect = () => {},
  onRowClick = () => {},
  selected,
  handleOpenNotify,
}) => {
  const dispatch = useDispatch();
  const { tableSlug } = useParams();
  const [childBlockVisible, setChildBlockVisible] = useState(false);

  const activeStyle = {
    backgroundColor:
      selected?.id === element?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      selected?.id === element?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
    display:
      element.id === "0" ||
      (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const clickHandler = () => {
    onRowClick(element.id, element);
    dispatch(menuActions.setMenuItem(element));
    setChildBlockVisible((prev) => !prev);
    if (!element.children) onSelect(element.id, element);
  };

  return (
    <Box>
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
                selected?.id === element?.id
                  ? menuStyle?.active_text
                  : menuStyle?.text,
              opacity: element?.isChild && 0.6,
            }}
          >
            {/* <IconGenerator icon={element?.icon} size={18} /> */}
            <Icon as={element.icon} />
            {element?.name}
          </div>
          {element.type === "FOLDER" && (
            <Box className="icon_group">
              <Tooltip title="Scenario settings" placement="top">
                <Box className="extra_icon">
                  <BsThreeDots
                    size={13}
                    onClick={(e) => {
                      e?.stopPropagation();
                      handleOpenNotify(e, "FOLDER");
                    }}
                    style={{
                      color:
                        selected?.id === element?.id
                          ? menuStyle?.active_text
                          : menuStyle?.text || "",
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>
          )}
          {element.type === "DAG" && (
            <Box className="icon_group">
              <Tooltip title="Scenario settings" placement="top">
                <Box className="extra_icon">
                  <BsThreeDots
                    size={13}
                    onClick={(e) => {
                      e?.stopPropagation();
                      handleOpenNotify(e, "DAG");
                    }}
                    style={{
                      color:
                        selected?.id === element?.id
                          ? menuStyle?.active_text
                          : menuStyle?.text || "",
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
          <ScenarioRecursive
            key={childElement.id}
            level={level + 1}
            element={childElement}
            menuStyle={menuStyle}
            onSelect={onSelect}
            onRowClick={onRowClick}
            selected={selected}
            handleOpenNotify={handleOpenNotify}
          />
        ))}
      </Collapse>
    </Box>
  );
};

export default ScenarioRecursive;
