import {Box, Button, Tooltip} from "@mui/material";
import IconGenerator from "../../../IconPicker/IconGenerator";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {BsThreeDots} from "react-icons/bs";
import activeStyles from "../MenuUtils/activeStyles";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import {useDispatch, useSelector} from "react-redux";

const RecursiveBlock = ({
  element,
  level,
  pinIsEnabled,
  childBlockVisible,
  deleteResource,
  setSubMenuIsOpen,
  deleteResourceV2,
  handleOpenNotify,
  menuStyle,
}) => {
  const dispatch = useDispatch();
  const {tableSlug, appId} = useParams();
  const navigate = useNavigate();
  const menuItem = useSelector((state) => state.menu.menuItem);
  const activeStyle = activeStyles({menuItem, element, menuStyle, level});

  const clickHandler = (e) => {
    e.stopPropagation();
    navigate(`/main/${appId}/resources/${element?.id}/${element.type}`, {
      state: {
        type: element?.type,
      },
    });

    dispatch(menuActions.setMenuItem(element));
    if (!pinIsEnabled) {
      setSubMenuIsOpen(false);
    }
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle" key={element.id}>
        {element?.type === "REST" ? (
          <Button
            key={element.id}
            style={activeStyle}
            className={`nav-element ${
              element.isChild &&
              (tableSlug !== element.slug ? "active-with-child" : "active")
            }`}
            onClick={clickHandler}>
            <div className="label">
              <IconGenerator icon={element?.icon} size={18} />
              <Tooltip title={element?.title ?? element?.name} placement="top">
                <p>{element?.title ?? element?.name}</p>
              </Tooltip>
            </div>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                deleteResourceV2({
                  id: element?.id,
                });
              }}
              sx={{cursor: "pointer"}}>
              <DeleteIcon />
            </Box>
          </Button>
        ) : element?.type === "CLICK_HOUSE" ? (
          <Button
            key={element.id}
            style={activeStyle}
            className={`nav-element ${
              element.isChild &&
              (tableSlug !== element.slug ? "active-with-child" : "active")
            }`}
            onClick={clickHandler}>
            <div
              className="label"
              onClick={() =>
                navigate(
                  `/main/${appId}/resources/${element?.id}/${element.type}`
                )
              }>
              <IconGenerator icon={element?.icon} size={18} />

              <Tooltip title={element?.title ?? element?.name} placement="top">
                <p>{element?.title ?? element?.name}</p>
              </Tooltip>
            </div>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                deleteResource({
                  id: element?.id,
                });
              }}
              sx={{cursor: "pointer"}}>
              <DeleteIcon />
            </Box>
          </Button>
        ) : (
          <Button
            key={element.id}
            style={activeStyle}
            className={`nav-element ${
              element.isChild &&
              (tableSlug !== element.slug ? "active-with-child" : "active")
            }`}
            onClick={clickHandler}>
            <div
              className="label"
              onClick={() =>
                navigate(
                  `/main/${appId}/resources/${element?.id}/${element.type}`
                )
              }>
              <IconGenerator icon={element?.icon} size={18} />

              <Tooltip title={element?.title ?? element?.name} placement="top">
                <p>{element?.title ?? element?.name}</p>
              </Tooltip>
            </div>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                deleteResource({
                  id: element?.id,
                });
              }}
              sx={{cursor: "pointer"}}>
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
        )}
      </div>
    </Box>
  );
};

export default RecursiveBlock;
