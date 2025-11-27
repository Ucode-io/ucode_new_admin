import { Box, Button, Icon } from "@mui/material";
import IconGenerator from "../../../IconPicker/IconGenerator";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateLevel } from "../../../../utils/level";

const RecursiveBlock = ({
  element,
  selected,
  menuStyle,
  level,
  clickHandler,
  childBlockVisible,
}) => {
  const { tableSlug } = useParams();
  const navigate = useNavigate();

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
          <div
            className="label"
            style={{
              color:
                selected?.id === element?.id
                  ? menuStyle?.active_text
                  : menuStyle?.text,
              opacity: element?.isChild && 0.6,
            }}
            // onClick={() => navigate(`/main/resources/${element?.id}`)}
          >
            <IconGenerator icon={element?.icon} size={18} />
            <Icon as={element?.icon} size={18} />

            {element?.title}
          </div>
          <Box onClick={(e) => e.stopPropagation()} sx={{ cursor: "pointer" }}>
            <DeleteIcon />
          </Box>
          {element.type === "FOLDER" && (
            <Box className="icon_group">
              <Tooltip title="Resource settings" placement="top">
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
              <Tooltip title="Resource settings" placement="top">
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
          {element.type === "FOLDER" &&
            (childBlockVisible ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            ))}
        </Button>
      </div>
    </Box>
  );
};

export default RecursiveBlock;
