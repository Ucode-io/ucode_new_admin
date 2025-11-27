import { Box, Menu } from "@mui/material";
import { RiPencilFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import MenuItemComponent from "../../../../MenuItem";
import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

const FunctionButtonMenu = ({
  selected,
  menu,
  openMenu,
  menuType,
  handleCloseNotify,
  openFolderModal,
  deleteFolder,
  element,
  openFunctionModal,
  deleteFunction,
}) => {
  return (
    <>
      <Menu
        anchorEl={menu}
        open={openMenu}
        onClose={handleCloseNotify}
        PaperProps={{
          elevation: 0,
          sx: {
            width: "15%",
            overflow: "visible",
            filter: "drop-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px !important",
            mt: 1.5,
            padding: "5px",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "& .MuiList-root": {
              padding: 0,
            },
          },
        }}
      >
        {menuType === "FOLDER" ? (
          <>
            <Box className="menu">
              <MenuItemComponent
                icon={<AddIcon size={13} />}
                title="Add function"
                onClick={(e) => {
                  e.stopPropagation();
                  openFunctionModal(element);
                  handleCloseNotify();
                }}
              />
            </Box>
            <Box className="menu">
              <MenuItemComponent
                icon={<RiPencilFill size={13} />}
                title="Edit folder"
                onClick={(e) => {
                  e.stopPropagation();
                  openFolderModal(element);
                  handleCloseNotify();
                }}
              />
            </Box>
            <Box className="menu">
              <MenuItemComponent
                icon={<Delete size={13} />}
                title="Delete folder"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(element?.id);
                  handleCloseNotify();
                }}
              />
            </Box>
          </>
        ) : menuType === "CREATE_FOLDER" ? (
          <Box className="menu">
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Add folder"
              onClick={(e) => {
                e.stopPropagation();
                openFolderModal();
                handleCloseNotify();
              }}
            />
          </Box>
        ) : (
          <Box className="menu">
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Edit function"
              onClick={(e) => {
                e.stopPropagation();
                openFunctionModal(null, element);
                handleCloseNotify();
              }}
            />
            <MenuItemComponent
              icon={<Delete size={13} />}
              title="Delete function"
              onClick={(e) => {
                e.stopPropagation();
                deleteFunction(element?.id);
                handleCloseNotify();
              }}
            />
          </Box>
        )}
      </Menu>
    </>
  );
};

export default FunctionButtonMenu;
