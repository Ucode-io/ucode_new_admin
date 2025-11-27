import { Box, Menu } from "@mui/material";
import { RiPencilFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import MenuItemComponent from "../../../../MenuItem";
import { Delete } from "@mui/icons-material";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const ScenarioButtonMenu = ({
  selected,
  menu,
  openMenu,
  menuType,
  handleCloseNotify,
  deleteEndpointClickHandler,
  openScenarioFolderModal,
  onDeleteCategory,
}) => {
  const navigate = useNavigate();

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
                title="Add scenario"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/main/${adminId}/scenario/${selected.id}`);
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
                  onDeleteCategory(selected.id);
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
                openScenarioFolderModal({}, "CREATE");
                handleCloseNotify();
              }}
            />
          </Box>
        ) : (
          <Box className="menu">
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Delete scenario"
              onClick={(e) => {
                e.stopPropagation();
                deleteEndpointClickHandler(selected.id);
                handleCloseNotify();
              }}
            />
          </Box>
        )}
      </Menu>
    </>
  );
};

export default ScenarioButtonMenu;
