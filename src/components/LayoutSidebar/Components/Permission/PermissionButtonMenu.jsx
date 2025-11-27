import { Box, Divider, Menu } from "@mui/material";
import { RiPencilFill } from "react-icons/ri";
import "./style.scss";
import { Delete } from "@mui/icons-material";
import MenuItemComponent from "../../MenuItem";

const PermissionButtonMenu = ({
  menu,
  openMenu,
  element,
  handleCloseNotify,
  deleteClientType,
  openUserFolderModal,
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
        <>
          <Box className="menu">
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Edit"
              onClick={(e) => {
                e.stopPropagation();
                openUserFolderModal(element, "UPDATE");
                handleCloseNotify();
              }}
            />
          </Box>
          <Divider />
          <Box className="menu">
            <MenuItemComponent
              icon={<Delete size={13} />}
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                deleteClientType(element?.guid);
                handleCloseNotify();
              }}
            />
          </Box>
        </>
      </Menu>
    </>
  );
};

export default PermissionButtonMenu;
