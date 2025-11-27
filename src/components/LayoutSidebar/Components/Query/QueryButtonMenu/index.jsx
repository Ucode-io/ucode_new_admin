import { Box, Menu } from "@mui/material";
import { RiPencilFill } from "react-icons/ri";
import "./style.scss";
import { Delete } from "@mui/icons-material";
import MenuItemComponent from "../../../MenuItem";
import { FaPlus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const QueryButtonMenu = ({
  menu,
  openMenu,
  menuType,
  handleCloseNotify,
  deleteFolder,
  element,
  openFolderModal,
  handleNavigate,
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
                icon={<RiPencilFill size={13} />}
                title="Add folder"
                onClick={(e) => {
                  e.stopPropagation();
                  openFolderModal(element, "CREATE");
                  handleCloseNotify();
                }}
              />
            </Box>
            <Box className="menu">
              <MenuItemComponent
                icon={<FaPlus size={13} />}
                title="Add Query"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate(element);
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
                  openFolderModal(element, "EDIT");
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
        ) : null}
      </Menu>
    </>
  );
};

export default QueryButtonMenu;
