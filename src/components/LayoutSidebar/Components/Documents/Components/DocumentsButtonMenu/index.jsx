import { Box, Menu } from "@mui/material";
import { RiPencilFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import MenuItemComponent from "../../../../MenuItem";
import AddIcon from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";
import { BsFillTrashFill } from "react-icons/bs";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const DocumentButtonMenu = ({
  menu,
  openMenu,
  menuType,
  element,
  handleCloseNotify,
  deleteNoteFolder,
  deleteTemplateFolder,
  openNoteFolderModal,
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
        {menuType === "FOLDER" && (
          <Box className="menu">
            <MenuItemComponent
              icon={<AddIcon size={13} />}
              title="Add Note"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/main/${adminId}/docs/${element.id}/note/create`);
                handleCloseNotify();
              }}
            />
          </Box>
        )}
        {menuType === "TEMPLATE_FOLDER" && (
          <Box className="menu">
            <MenuItemComponent
              icon={<AddIcon size={13} />}
              title="Add Template"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/main/${adminId}/docs/template/${element.id}/create`);
                handleCloseNotify();
              }}
            />
          </Box>
        )}
        {menuType === "NOTE_FOLDER" && (
          <Box className="menu">
            <MenuItemComponent
              icon={<AddIcon size={13} />}
              title="Add Wiki"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/main/${adminId}/docs/note/${element.id}/create`);
                handleCloseNotify();
              }}
            />
            <MenuItemComponent
              icon={<CreateNewFolderIcon size={13} />}
              title="Add folder"
              onClick={(e) => {
                e.stopPropagation();
                openNoteFolderModal(element, "CREATE");
                handleCloseNotify();
              }}
            />
            <MenuItemComponent
              icon={<BsFillTrashFill size={13} />}
              title="Delete folder"
              onClick={(e) => {
                e.stopPropagation();
                deleteNoteFolder(element?.id);
                handleCloseNotify();
              }}
            />
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Edit folder"
              onClick={(e) => {
                e.stopPropagation();
                openNoteFolderModal(element, "EDIT");
                handleCloseNotify();
              }}
            />
          </Box>
        )}
        {menuType === "NOTE" && (
          <>
            <Box className="menu">
              <MenuItemComponent
                icon={<Delete size={13} />}
                title="Delete Note"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNoteFolder({ id: element.id });
                  handleCloseNotify();
                }}
              />
            </Box>
          </>
        )}
        {menuType === "TEMPLATE" && (
          <Box className="menu">
            <MenuItemComponent
              icon={<Delete size={13} />}
              title="Delete Template"
              onClick={(e) => {
                e.stopPropagation();
                deleteTemplateFolder({ id: element.id });
                handleCloseNotify();
              }}
            />
          </Box>
        )}
      </Menu>
    </>
  );
};

export default DocumentButtonMenu;
