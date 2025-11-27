import { Box, Menu } from "@mui/material";
import { RiPencilFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { Delete } from "@mui/icons-material";
import MenuItemComponent from "../../../MenuItem";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const DatabaseButtonMenu = ({
  selected,
  menu,
  openMenu,
  menuType,
  handleCloseNotify,
  onDeleteTableFolder,
  openFolderModal,
  openCreateDrawer,
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
        {menuType === "FOLDER" && (
          <>
            <Box className="menu">
              <MenuItemComponent
                icon={<RiPencilFill size={13} />}
                title="Add table"
                onClick={(e) => {
                  e.stopPropagation();
                  openCreateDrawer();
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
                  openFolderModal(selected, "EDIT");
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
                  onDeleteTableFolder(selected.id);
                  handleCloseNotify();
                }}
              />
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default DatabaseButtonMenu;
