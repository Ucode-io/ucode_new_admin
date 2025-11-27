import {Box, Divider, Menu} from "@mui/material";
import {RiPencilFill} from "react-icons/ri";
import "./style.scss";
import {BsFillTrashFill} from "react-icons/bs";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import TableChartIcon from "@mui/icons-material/TableChart";
import {useNavigate} from "react-router-dom";
import MenuItemComponent from "./MenuItem";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import {analyticItems} from "./SidebarRecursiveBlock/mock/folders";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import AddIcon from "@mui/icons-material/Add";

const ButtonsMenu = ({
  element,
  menu,
  openMenu,
  handleCloseNotify,
  openFolderCreateModal,
  deleteFolder,
  menuType,
  setFolderModalType,
  appId,
  setTableModal,
  setMicrofrontendModal,
  setLinkedTableModal,
}) => {
  const navigate = useNavigate();
  const permissionButton =
    element?.id === analyticItems.pivot_id ||
    element?.id === analyticItems.report_setting;

  return (
    <Menu
      anchorEl={menu}
      open={openMenu}
      onClose={handleCloseNotify}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px !important",
          padding: "5px",
          "& .MuiList-root": {
            padding: 0,
          },
        },
      }}
      key={element?.id}
      transitionDuration={"auto"}>
      {menuType === "FOLDER" && (
        <Box className="menu">
          {element?.data?.permission?.update || permissionButton ? (
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Edit folder"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseNotify();
                if (element?.type === "WIKI_FOLDER") {
                  openFolderCreateModal("WIKI_FOLDER_UPDATE", element);
                } else {
                  openFolderCreateModal("update", element);
                }
              }}
            />
          ) : null}

          {(element?.id !== "cd5f1ab0-432c-459d-824a-e64c139038ea" &&
            element?.data?.permission?.delete) ||
          permissionButton ? (
            <>
              <Divider
                style={{
                  marginBottom: "4px",
                  marginTop: "4px",
                }}
              />
              <MenuItemComponent
                icon={<BsFillTrashFill size={13} />}
                title="Delete folder"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(element);
                  handleCloseNotify();
                }}
              />
            </>
          ) : null}
          {element?.data?.permission?.menu_settings || permissionButton ? (
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Move folder"
              onClick={(e) => {
                e.stopPropagation();
                setFolderModalType("folder", element);
                handleCloseNotify();
              }}
            />
          ) : null}
        </Box>
      )}
      {menuType === "CREATE_TO_FOLDER" && (
        <Box className="menu">
          <MenuItemComponent
            icon={<TableChartIcon size={13} />}
            title="Create table"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/settings/constructor/apps/${appId}/objects/create`);
              handleCloseNotify();
            }}
          />
          <MenuItemComponent
            icon={<SyncAltIcon size={13} />}
            title="Add table"
            onClick={(e) => {
              e.stopPropagation();
              setTableModal(element);
              handleCloseNotify();
            }}
          />
          <MenuItemComponent
            icon={<DeveloperBoardIcon size={13} />}
            title="Add microfrontend"
            onClick={(e) => {
              e.stopPropagation();
              setMicrofrontendModal(element);
              handleCloseNotify();
            }}
          />
          <Divider
            style={{
              marginBottom: "4px",
              marginTop: "4px",
            }}
          />
          <MenuItemComponent
            icon={<CreateNewFolderIcon size={13} />}
            title="Add folder"
            onClick={(e) => {
              e.stopPropagation();
              openFolderCreateModal("create", element);
              handleCloseNotify();
            }}
          />
        </Box>
      )}

      {menuType === "TABLE" && (
        <Box className="menu">
          {element?.data?.permission?.menu_settings || permissionButton ? (
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Move table"
              onClick={(e) => {
                e.stopPropagation();
                setFolderModalType("folder", element);
                handleCloseNotify();
              }}
            />
          ) : null}
          {element.parent_id === "c57eedc3-a954-4262-a0af-376c65b5a282" && (
            <>
              <MenuItemComponent
                icon={<DriveFileMoveIcon size={13} />}
                title="Move table"
                onClick={(e) => {
                  e.stopPropagation();
                  setFolderModalType("folder", element);
                  handleCloseNotify();
                }}
              />
              <MenuItemComponent
                icon={<RiPencilFill size={13} />}
                title="Edit table"
                onClick={(e) => {
                  e.stopPropagation();
                  setTableModal(element);
                  handleCloseNotify();
                }}
              />
            </>
          )}

          {(element?.parent_id !== "c57eedc3-a954-4262-a0af-376c65b5a282" &&
            element?.data?.permission?.update) ||
          permissionButton ? (
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Edit table"
              onClick={(e) => {
                e.stopPropagation();
                setTableModal(element);
                handleCloseNotify();
              }}
            />
          ) : null}

          {(element?.parent_id !== "c57eedc3-a954-4262-a0af-376c65b5a282" &&
            element?.data?.permission?.delete) ||
          permissionButton ? (
            <>
              <Divider
                style={{
                  marginBottom: "4px",
                  marginTop: "4px",
                }}
              />
              <MenuItemComponent
                icon={<BsFillTrashFill size={13} />}
                title="Delete table"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(element);
                  handleCloseNotify();
                }}
              />
            </>
          ) : null}
        </Box>
      )}
      {menuType === "LINK" && (
        <Box className="menu">
          {element?.data?.permission?.menu_settings || permissionButton ? (
            <MenuItemComponent
              icon={<DriveFileMoveIcon size={13} />}
              title="Move table"
              onClick={(e) => {
                e.stopPropagation();
                setFolderModalType("folder", element);
                handleCloseNotify();
              }}
            />
          ) : null}

          {element?.data?.permission?.update || permissionButton ? (
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Edit table"
              onClick={(e) => {
                e.stopPropagation();
                setLinkedTableModal(element);
                handleCloseNotify();
              }}
            />
          ) : null}

          <Divider
            style={{
              marginBottom: "4px",
              marginTop: "4px",
            }}
          />
          {element?.data?.permission?.delete || permissionButton ? (
            <MenuItemComponent
              icon={<BsFillTrashFill size={13} />}
              title="Delete table"
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(element);
                handleCloseNotify();
              }}
            />
          ) : null}
        </Box>
      )}
      {menuType === "MICROFRONTEND" && (
        <Box className="menu">
          {element?.data?.permission?.menu_settings && (
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Move microfrontend"
              onClick={(e) => {
                e.stopPropagation();
                setFolderModalType("folder", element);
                handleCloseNotify();
              }}
            />
          )}
          {element?.data?.permission?.menu_settings || permissionButton ? (
            <>
              <MenuItemComponent
                icon={<RiPencilFill size={13} />}
                title="Edit microfrontend"
                onClick={(e) => {
                  e.stopPropagation();
                  setMicrofrontendModal(element);
                  handleCloseNotify();
                }}
              />
              <Divider
                style={{
                  marginBottom: "4px",
                  marginTop: "4px",
                }}
              />
            </>
          ) : null}

          {element?.data?.permission?.delete || permissionButton ? (
            <MenuItemComponent
              icon={<BsFillTrashFill size={13} />}
              title="Delete microfrontend"
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(element);
                handleCloseNotify();
              }}
            />
          ) : null}
        </Box>
      )}

      {menuType === "CREATE_TO_MINIO" && (
        <Box className="menu">
          <MenuItemComponent
            icon={<CreateNewFolderIcon size={13} />}
            title="Add folder"
            onClick={(e) => {
              e.stopPropagation();
              openFolderCreateModal("create", {
                id: element?.id,
                type: "MINIO_FOLDER",
              });
              handleCloseNotify();
            }}
          />
        </Box>
      )}
      {menuType === "ROOT" && (
        <Box className="menu">
          <MenuItemComponent
            icon={<TableChartIcon size={13} />}
            title="Create table"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/settings/constructor/apps/${appId}/objects/create`);
              handleCloseNotify();
            }}
          />
          <MenuItemComponent
            icon={<SyncAltIcon size={13} />}
            title="Add table"
            onClick={(e) => {
              e.stopPropagation();
              setTableModal(element);
              handleCloseNotify();
            }}
          />
          <MenuItemComponent
            icon={<DeveloperBoardIcon size={13} />}
            title="Add microfrontend"
            onClick={(e) => {
              e.stopPropagation();
              setMicrofrontendModal(element);
              handleCloseNotify();
            }}
          />
          <Divider
            style={{
              marginBottom: "4px",
              marginTop: "4px",
            }}
          />
          <MenuItemComponent
            icon={<CreateNewFolderIcon size={13} />}
            title="Add folder"
            onClick={(e) => {
              e.stopPropagation();
              openFolderCreateModal("create", element);
              handleCloseNotify();
            }}
          />
        </Box>
      )}
      {menuType === "MINIO_FOLDER" && (
        <Box className="menu">
          {element?.data?.permission?.delete || permissionButton ? (
            <MenuItemComponent
              icon={<BsFillTrashFill size={13} />}
              title="Delete folder"
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(element);
                handleCloseNotify();
              }}
            />
          ) : null}
        </Box>
      )}
      {menuType === "CREATE" && (
        <Box className="menu">
          <MenuItemComponent
            icon={<TableChartIcon size={13} />}
            title="Create table"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/settings/constructor/apps/${appId}/objects/create`, {
                state: {
                  create_table: true,
                },
              });
              handleCloseNotify();
            }}
          />
          <MenuItemComponent
            icon={<SyncAltIcon size={13} />}
            title="Add table"
            onClick={(e) => {
              e.stopPropagation();
              setTableModal({id: "c57eedc3-a954-4262-a0af-376c65b5a284"});
              handleCloseNotify();
            }}
          />
          <MenuItemComponent
            icon={<DeveloperBoardIcon size={13} />}
            title="Add microfrontend"
            onClick={(e) => {
              e.stopPropagation();
              setMicrofrontendModal({
                id: "c57eedc3-a954-4262-a0af-376c65b5a284",
              });
              handleCloseNotify();
            }}
          />
          <Divider
            style={{
              marginBottom: "4px",
              marginTop: "4px",
            }}
          />
          <MenuItemComponent
            icon={<CreateNewFolderIcon size={13} />}
            title="Add folder"
            onClick={(e) => {
              e.stopPropagation();
              openFolderCreateModal("create", {
                id: "c57eedc3-a954-4262-a0af-376c65b5a284",
                type: "FOLDER",
              });
              handleCloseNotify();
            }}
          />
        </Box>
      )}

      {menuType === "WIKI_FOLDER" && (
        <Box className="menu">
          <MenuItemComponent
            icon={<CreateNewFolderIcon size={13} />}
            title="Add folder"
            onClick={(e) => {
              e.stopPropagation();
              openFolderCreateModal("create", element);
              handleCloseNotify();
            }}
          />
          <MenuItemComponent
            icon={<AddIcon size={13} />}
            title="Add Wiki"
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                `/main/744d63e6-0ab7-4f16-a588-d9129cf959d1/docs/note/${element?.id}/create`
              );
              handleCloseNotify();
            }}
          />
        </Box>
      )}
      {menuType === "FAVOURITE" && (
        <Box className="menu">
          <MenuItemComponent
            icon={<TableChartIcon size={13} />}
            title="Create table"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/settings/constructor/apps/${appId}/objects/create`);
              handleCloseNotify();
            }}
          />
        </Box>
      )}
      {menuType === "WIKI" && (
        <>
          <Box className="menu">
            <MenuItemComponent
              icon={<BsFillTrashFill size={13} />}
              title="Delete Wiki"
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(element);
                handleCloseNotify();
              }}
            />
          </Box>
          <Box className="menu">
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Edit Wiki"
              onClick={(e) => {
                e.stopPropagation();
                openFolderCreateModal("WIKI_UPDATE", element);
                handleCloseNotify();
              }}
            />
          </Box>
        </>
      )}
    </Menu>
  );
};

export default ButtonsMenu;
